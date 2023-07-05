import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            version: "2.0",
            userinfo: {
                params: {
                    "user.fields": "pinned_tweet_id,profile_image_url",
                    "tweet.fields": "text,id",
                    expansions: "pinned_tweet_id",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, profile }) {
            if (profile) {
                token.username = profile.data.username;
                token.tweets = profile.includes.tweets[0];
            }
            return token;
        },
        async session({ session, token }) {
            if (token.username) {
                session.username = token.username;
                session.tweets = token.tweets;
            }
            return session;
        },
    },
    debug: true,
    logger: {
        error(code, metadata) {
            console.error(code, metadata);
        },
    },
});
