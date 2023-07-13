import axios from "axios";

export default async function handler(req, res) {
    const { method, query, body } = req;
    console.log(method);
    if (method == "POST") {
        let { data: response } = await axios.get(
            `https://manage.g.alchemy.com/api/gasManager/policy/${process.env.GAS_POLICY_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ALCHEMY_BEARER_TOKEN}`,
                },
            }
        );
        let { rules } = response.data.policy;

        let newSenderAllowlist = rules.senderAllowlist
            ? [...rules.senderAllowlist, body.smartAccountAddress]
            : [body.smartAccountAddress];

        let newRules = {
            ...rules,
            senderAllowlist: newSenderAllowlist,
        };

        try {
            let response = await axios({
                method: "put",
                url: `https://manage.g.alchemy.com/api/gasManager/policy/${process.env.GAS_POLICY_ID}`,
                data: {
                    rules: newRules,
                },
                headers: {
                    Authorization: `Bearer ${process.env.ALCHEMY_BEARER_TOKEN}`,
                },
            });

            return res.status(200).json({ success: response.data });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    return res.status(405).json({ error: "Method not supported!" });
}
