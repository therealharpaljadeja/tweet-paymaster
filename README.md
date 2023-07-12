# Tweet Paymaster

A paymaster that sponsors 5 transactions if you tweet about it, built using Alchemy Gas Manager

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Features](#features)
-   [Contributing](#contributing)
-   [Contact](#contact)
-   [Troubleshooting](#troubleshooting)

## Installation

Clone the repository

```bash
git clone https://github.com/therealharpaljadeja/tweet-paymaster.git
```

Install Dependencies

```bash
yarn install
```

Create a `.env` file for environment variables

Get `TWITTER_CLIENT_ID` and `TWITTER_CLIENT_SECRET` from [Twitter Developer Dashboard](https://developer.twitter.com/en/docs/apps/overview)

Get `ALCHEMY_BEARER_TOKEN` from [Alchemy Dashboard](https://docs.alchemy.com/docs/how-to-create-access-keys)

Get `GAS_POLICY_ID` from [Alchemy Gas Manager Dashboard](https://docs.alchemy.com/reference/gas-manager-admin-api-quickstart)

GET `NEXT_PUBLIC_RPC_URL` from Alchemy

Start the app

```bash
yarn run dev
```

## Usage

Once the app has started, first thing to do is to make the user tweet something and pin the tweet (pinning is required because Twitter free API only lets you access pinned tweets)

The process of tweeting and pinning MUST be done before `Login With Twitter` step in the app, pinned tweet is fetched during the auth process

Second step is to connect the wallet where the associated `Smart Account` will be offered 5 free transactions

Third step is to `Login with Twitter` and `Verify`, once done 5 free transactions/UserOperations will be allowed and you can test it

## Features

1. Change Tweet Content

    You can change the content of the tweet by change the following code in file `index.js`

    ```javascript
    <Link
        href={`https://twitter.com/intent/tweet?text=Got%20free%20UserOperations%0A%0A%40harpaljadeja11%20is%20the%20best!`}
        target="_blank"
    >
        <Button borderRadius={"20"} colorScheme="twitter">
            Tweet
        </Button>
    </Link>
    ```

    Change the `href` attribute, specifically the text param with `URLEncoded` version of the text you want to be tweeted by the user

2. More Free UserOperations

    If you want to offer more free UserOperations then make that change in your Alchemy Gas Policy

## Contributing

Open for contributions!

## Contact

Harpalsinh Jadeja - [Email](jadejaharpal14@gmail.com) - [Twitter](https://twitter.com/harpaljadeja11) - [Telegram](https://t.me/harpaljadeja)

## Troubleshooting

Create Issue
