import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function Verify(props) {
    const { data: session } = useSession();
    let { smartAccountAddress } = props;

    function verify() {
        if (session) {
            let { tweets } = session;
            if (smartAccountAddress != "Loading...") {
                if (
                    tweets.text ==
                    "Got free UserOperations\n\n@harpaljadeja11 is the best!"
                ) {
                    // Add address to allowlist
                    toast.promise(
                        fetch("/api/replace", {
                            method: "post",
                            body: JSON.stringify({
                                smartAccountAddress,
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }),
                        {
                            loading: "Please wait...",
                            success: "5 free UserOperations!",
                            error: (err) => console.log(err),
                        }
                    );
                } else {
                    toast.error("Something went wrong!");
                }
            } else {
                toast.error("Wallet not connected!");
            }
        }
    }

    return (
        <Button borderRadius={"20"} colorScheme="twitter" onClick={verify}>
            Verify
        </Button>
    );
}
