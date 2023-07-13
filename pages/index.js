import {
    Avatar,
    Button,
    HStack,
    Heading,
    Link,
    Tag,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import Container from "../components/Container";
import Title from "../components/Heading";
import { FiTwitter } from "react-icons/fi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Verify from "../components/Verify";
import Account from "../components/Account";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { encodeFunctionData } from "viem";
import { abi } from "../abi";
import { toast } from "react-hot-toast";

const NFT_CONTRACT_ADDRESS = "0xB2ae3D6EAD4047aD6Db1b2FfaD07608A359df867";

export default function Home() {
    const [hasMounted, setHasMounted] = useState(false);
    const { data: session, status } = useSession();
    const { isConnected } = useAccount();
    const [smartAccountAddress, setSmartAccountAddress] =
        useState("Loading...");
    const [provider, setProvider] = useState(undefined);
    useEffect(() => {
        // This will only be called once the component is mounted inside the browser
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    async function mintNFT() {
        if (provider) {
            toast.promise(
                provider.sendUserOperation({
                    target: NFT_CONTRACT_ADDRESS,
                    data: encodeFunctionData({
                        abi,
                        functionName: "mint",
                        args: [smartAccountAddress],
                    }),
                }),
                {
                    loading: () => "Please wait!",
                    success: () => "NFT Minted!",
                    error: (err) => err,
                }
            );
        }
    }

    return (
        <VStack
            width={"full"}
            height={"100vh"}
            justifyContent={"center"}
            spacing={"10"}
        >
            <VStack>
                <Heading color={"#00acee"}>Tweet Paymaster</Heading>
                <Heading color={"#00acee"} size="sm">
                    Tweet to get 5 free UserOperations
                </Heading>
            </VStack>
            <HStack spacing={"5"} alignItems={"stretch"}>
                <Container>
                    <Title>Step 1: Tweet & Pin</Title>
                    <Text noOfLines={3} fontSize={"md"}>
                        <strong>Tweet</strong> by the clicking the below button
                        and also <strong>pin the tweet</strong> in order to{" "}
                        <strong>verify</strong> it
                    </Text>
                    <Link
                        href={`https://twitter.com/intent/tweet?text=Got%20free%20UserOperations%0A%0A%40harpaljadeja11%20is%20the%20best!`}
                        target="_blank"
                    >
                        <Button borderRadius={"20"} colorScheme="twitter">
                            Tweet
                        </Button>
                    </Link>
                </Container>
                <Container>
                    <Title>Step 2: Connect Wallet</Title>
                    <Text noOfLines={4} fontSize={"md"}>
                        Connect wallet using the address you want the free
                        UserOperations on
                    </Text>
                    <Text>
                        <strong>Remember:</strong> UserOperations are alloted to
                        the Smart Contract Account underlying the connected
                        wallet
                    </Text>
                    <ConnectButton />
                    {isConnected && (
                        <Account
                            smartAccountAddress={smartAccountAddress}
                            setSmartAccountAddress={setSmartAccountAddress}
                            setProvider={setProvider}
                        />
                    )}
                </Container>
                <Container>
                    <Title>Step 3: Verify Tweet</Title>
                    <Text noOfLines={3} fontSize={"md"}>
                        Login with Twitter so we can verify the tweet
                    </Text>
                    {status == "unauthenticated" ? (
                        <Button
                            colorScheme="twitter"
                            borderRadius={"20"}
                            onClick={() => signIn("twitter")}
                            leftIcon={<FiTwitter />}
                        >
                            Login With Twitter
                        </Button>
                    ) : (
                        <VStack alignItems={"flex-start"}>
                            <Link
                                href={`https://twitter.com/${session?.username}`}
                                target="_blank"
                            >
                                <Tag
                                    px={"2.5"}
                                    background={"white"}
                                    textColor={"#00acee"}
                                    border={"1px solid rgb(207, 217, 222)"}
                                    py={"2"}
                                    borderRadius={"20"}
                                >
                                    <HStack>
                                        <Avatar
                                            width="20px"
                                            height={"20px"}
                                            src={session?.user?.image}
                                        />
                                        <Text>{`@${session?.username.toLowerCase()}`}</Text>
                                    </HStack>
                                </Tag>
                            </Link>
                            <HStack>
                                <HStack>
                                    <Verify
                                        smartAccountAddress={
                                            smartAccountAddress
                                        }
                                    />
                                </HStack>
                                <Button
                                    borderRadius={"20"}
                                    colorScheme="red"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </Button>
                            </HStack>
                        </VStack>
                    )}
                </Container>
                <Container>
                    <Title>Step 4: Try!</Title>
                    <Text>Try your free UserOperations</Text>
                    <Text>Mint an NFT for free (no gas)</Text>
                    <Button
                        onClick={mintNFT}
                        borderRadius={"20"}
                        colorScheme="twitter"
                    >
                        Mint NFT
                    </Button>
                </Container>
            </HStack>
            <VStack gap={"2"}>
                <Text>
                    Made by{" "}
                    <Link
                        href="https://twitter.com/harpaljadeja11"
                        target="_blank"
                    >
                        <Text
                            fontWeight={"bold"}
                            textDecoration={"underline"}
                            display={"inline"}
                        >
                            harpaljadeja11
                        </Text>
                    </Link>
                </Text>
                <Text>
                    Built using{" "}
                    <Link
                        href="https://www.alchemy.com/account-abstraction"
                        target="_blank"
                    >
                        <Text
                            fontWeight={"bold"}
                            textDecoration={"underline"}
                            display={"inline"}
                        >
                            Alchemy
                        </Text>
                    </Link>
                </Text>
                <Text>
                    Check the{" "}
                    <Link
                        href="https://github.com/therealharpaljadeja/tweet-paymaster"
                        target="_blank"
                    >
                        <Text
                            fontWeight={"bold"}
                            textDecoration={"underline"}
                            display={"inline"}
                        >
                            Code
                        </Text>
                    </Link>
                </Text>
            </VStack>
        </VStack>
    );
}
