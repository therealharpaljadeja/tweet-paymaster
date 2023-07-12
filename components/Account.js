import { HStack, Link, Tag, Text, VStack } from "@chakra-ui/react";
import { SimpleSmartContractAccount } from "@alchemy/aa-core";
import { sepolia } from "viem/chains";
import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import { toHex } from "viem";
import { AlchemyProvider } from "@alchemy/aa-alchemy";

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
    "0x9406Cc6185a346906296840746125a0E44976454";

const DEPLOYMENT_STATE = {
    "0x0": undefined,
    "0x1": "Not Deployed",
    "0x2": "Deployed",
};

export default function Account(props) {
    let { smartAccountAddress, setSmartAccountAddress, setProvider } = props;
    const { data: walletClient } = useWalletClient();
    const [customClient, setCustomClient] = useState(null);
    const [deploymentState, setDeploymentState] = useState(
        DEPLOYMENT_STATE["0x0"]
    );

    useEffect(() => {
        if (walletClient) {
            setCustomClient(
                walletClient.extend((client) => {
                    return {
                        getAddress: async function () {
                            let addresses = await client.getAddresses();
                            return addresses[0];
                        },
                        signMessage: async function (message) {
                            return client.signMessage({
                                message: { raw: toHex(message) },
                            });
                        },
                    };
                })
            );
        }
    }, [walletClient]);

    useEffect(() => {
        if (customClient) {
            (async () => {
                let provider = new AlchemyProvider({
                    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
                    chain: sepolia,
                    entryPointAddress: ENTRYPOINT_ADDRESS,
                }).connect((rpcClient) => {
                    return new SimpleSmartContractAccount({
                        entryPointAddress: ENTRYPOINT_ADDRESS,
                        chain: sepolia,
                        factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
                        rpcClient,
                        owner: customClient,
                    });
                });

                provider = provider.withAlchemyGasManager({
                    provider: provider.rpcClient,
                    policyId: process.env.NEXT_PUBLIC_GAS_POLICY_ID,
                    entryPoint: ENTRYPOINT_ADDRESS,
                });

                console.log(provider.account);
                let address = await provider.getAddress();
                let deploymentStatus =
                    await provider.account.getDeploymentState();

                setDeploymentState(DEPLOYMENT_STATE[deploymentStatus]);
                setSmartAccountAddress(address);
                setProvider(provider);
            })();
        }
    }, [customClient]);

    return (
        <VStack
            alignItems={"flex-start"}
            border={"1px solid rgb(207, 217, 222)"}
            padding={"3"}
            borderRadius={"12px"}
            width={"full"}
        >
            <Text>
                <strong>Smart Account Details</strong>
            </Text>
            <Text>Address:</Text>
            <HStack>
                {smartAccountAddress == "Loading..." ? (
                    <Tag>Loading...</Tag>
                ) : (
                    <Link
                        href={`https://sepolia.etherscan.io/address/${smartAccountAddress}`}
                        target="_blank"
                    >
                        <Tag
                            textDecoration={"underline"}
                        >{`${smartAccountAddress.substr(
                            0,
                            6
                        )}...${smartAccountAddress.substr(-5)}`}</Tag>
                    </Link>
                )}
            </HStack>
            <Text>Deployed?:</Text>
            <Tag>{deploymentState}</Tag>
        </VStack>
    );
}
