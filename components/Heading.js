import { Heading } from "@chakra-ui/react";

export default function Title({ props, children }) {
    return (
        <Heading size="md" {...props}>
            {children}
        </Heading>
    );
}
