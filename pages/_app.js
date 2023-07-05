import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Toaster } from "react-hot-toast";

const { chains, publicClient } = configureChains(
    [sepolia],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);
const { connectors } = getDefaultWallets({
    appName: "Tweet Paymaster",
    projectId: "044601f65212332475a09bc14ceb3c34",
    chains,
});
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

function MyApp({ Component, pageProps }) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <ChakraProvider>
                    <SessionProvider session={pageProps.session}>
                        <Component {...pageProps} />
                        <Toaster />
                    </SessionProvider>
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;
