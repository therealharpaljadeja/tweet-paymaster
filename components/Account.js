import { HStack, Link, Tag, Text, VStack } from "@chakra-ui/react";
import {
    SimpleSmartContractAccount,
    SmartAccountProvider,
} from "@alchemy/aa-core";
import { sepolia } from "viem/chains";
import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
    "0x9406Cc6185a346906296840746125a0E44976454";

const DEPLOYMENT_STATE = {
    "0x0": undefined,
    "0x1": "Not Deployed",
    "0x2": "Deployed",
};

export default function Account(props) {
    let { smartAccountAddress, setSmartAccountAddress } = props;
    const { data: walletClient } = useWalletClient();
    const [customClient, setCustomClient] = useState(null);
    const [deploymentState, setDeploymentState] = useState(
        DEPLOYMENT_STATE["0x0"]
    );

    useEffect(() => {
        if (walletClient) {
            console.log(walletClient);
            setCustomClient(
                walletClient.extend((client) => {
                    return {
                        getAddress: async function () {
                            let addresses = await client.getAddresses();
                            return addresses[0];
                        },
                    };
                })
            );
        }
    }, [walletClient]);

    useEffect(() => {
        if (customClient) {
            (async () => {
                let provider = new SmartAccountProvider(
                    process.env.NEXT_PUBLIC_RPC_URL,
                    ENTRYPOINT_ADDRESS,
                    sepolia
                ).connect((rpcClient) => {
                    return new SimpleSmartContractAccount({
                        entryPointAddress: ENTRYPOINT_ADDRESS,
                        chain: sepolia,
                        factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
                        rpcClient,
                        owner: customClient,
                    });
                });

                let address = await provider.account.getAddress();
                let deploymentStatus =
                    await provider.account.getDeploymentState();

                setDeploymentState(DEPLOYMENT_STATE[deploymentStatus]);
                setSmartAccountAddress(address);
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
