import { VStack } from "@chakra-ui/react";

export default function Container({ props, children }) {
    return (
        <VStack
            // _hover={{ backgroundColor: "" }}
            border="1px solid rgb(207, 217, 222)"
            padding={"20px"}
            borderRadius={"12px"}
            width={"350px"}
            maxWidth={"400px"}
            // height={"500px"}
            alignItems={"flex-start"}
            spacing={"5"}
            _hover={{
                backgroundColor: "rgb(0,0,0,.01)",
            }}
            {...props}
        >
            {children}
        </VStack>
    );
}
