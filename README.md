# Project Setup

This is a template for building a [Shopify app](https://shopify.dev/apps/getting-started) using Node and React. It contains the basics for building a Shopify app.

## Tech Stack

This template combines a number of third party open-source tools:

- [Express](https://expressjs.com/) builds the backend.
- [Vite](https://vitejs.dev/) builds the [React](https://reactjs.org/) frontend.
- [React Router](https://reactrouter.com/) is used for routing. We wrap this with file-based routing.
- [React Query](https://react-query.tanstack.com/) queries the Admin API.

The following Shopify tools complement these third-party tools to ease app development:

- [Shopify API library](https://github.com/Shopify/shopify-node-api) adds OAuth to the Express backend. This lets users install the app and grant scope permissions.
- [App Bridge React](https://shopify.dev/apps/tools/app-bridge/getting-started/using-react) adds authentication to API requests in the frontend and renders components outside of the App’s iFrame.
- [Polaris React](https://polaris.shopify.com/) is a powerful design system and component library that helps developers build high quality, consistent experiences for Shopify merchants.
- [Custom hooks](https://github.com/Shopify/shopify-frontend-template-react/tree/main/hooks) make authenticated requests to the Admin API.
- [File-based routing](https://github.com/Shopify/shopify-frontend-template-react/blob/main/Routes.jsx) makes creating new pages easier.

## Getting started

### Requirements

1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
2. You must [create a Shopify partner account](https://partners.shopify.com/signup) if you don’t have one.
3. You must [create a development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) if you don’t have one.
4. You must [signup for ngrok account](https://dashboard.ngrok.com/signup) if you don't have it.
5. You must [download and install postgres](https://www.postgresql.org/download/) if you don't have it.

### Step 1 - Clone Repository

Clone this repository or download zip file and open it in your code editor.

### Step 2 - Setup Local Development

[The Shopify CLI](https://shopify.dev/apps/tools/cli) connects to an app in your Partners dashboard. It provides environment variables, runs commands in parallel, and updates application URLs for easier development.

You can develop locally using your preferred package manager. Run one of the following commands from the root of your app.

Using yarn:

```shell
yarn dev
```

Using npm:

```shell
npm run dev
```

Using pnpm:

```shell
pnpm run dev
```

After running the above command choose to create a new app and connect it with your development store.

### Step 3 - Ngrok Authentication

Navigate to your ngrok account and copy your authentication token, provide it in the terminal. After configuring ngrok your tunnel will be created successfully and you will get your App URL.


### Step 4 - App URL

Open the URL generated in your console. Once you grant permission to the app, you can start development.

## Some things to watch out for
### Using `express.json` middleware

If you use the `express.json()` middleware in your app **and** if you use `Shopify.Webhooks.Registry.process()` to process webhooks API calls from Shopify (which we recommend), the webhook processing must occur **_before_** calling `app.use(express.json())`. See the [API documentation](https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers) for more details.

## Known issues

### 1. Hot module replacement and Firefox

When running the app with the CLI in development mode on Firefox, you might see your app constantly reloading when you access it.
That happened in previous versions of the CLI, because of the way HMR websocket requests work.

We fixed this issue with v3.4.0 of the CLI, so after updating it, you can make the following changes to your app's `web/frontend/vite.config.js` file:

1. Change the definition `hmrConfig` object to be:

   ```js
   const host = process.env.HOST
     ? process.env.HOST.replace(/https?:\/\//, "")
     : "localhost";

   let hmrConfig;
   if (host === "localhost") {
     hmrConfig = {
       protocol: "ws",
       host: "localhost",
       port: 64999,
       clientPort: 64999,
     };
   } else {
     hmrConfig = {
       protocol: "wss",
       host: host,
       port: process.env.FRONTEND_PORT,
       clientPort: 443,
     };
   }
   ```

2. Change the `server.host` setting in the configs to `"localhost"`:

   ```js
   server: {
     host: "localhost",
     ...
   }
   ```
### 2. I can't get past the ngrok "Visit site" page

When you’re previewing your app or extension, you might see an ngrok interstitial page with a warning:

```text
You are about to visit <id>.ngrok.io: Visit Site
```

If you click the `Visit Site` button, but continue to see this page, then you should run dev using an alternate tunnel URL that you run using tunneling software.
We've validated that [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/run-tunnel/trycloudflare/) works with this template.

To do that, you can [install the `cloudflared` CLI tool](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/), and run:

```shell
# Note that you can also use a different port
cloudflared tunnel --url http://localhost:3000
```

In a different terminal window, navigate to your app's root and call:

```shell
# Using yarn
yarn dev --tunnel-url https://tunnel-url:3000
# or using npm
npm run dev --tunnel-url https://tunnel-url:3000
# or using pnpm
pnpm dev --tunnel-url https://tunnel-url:3000
```

### 3. I am getting invalid Hook Call error

Make sure you have installed react and react-dom version 17.0.2 in all of the sub directories of root folder. Uninstall previously installed react and react-dom versions and run following commands.

```shell
# using npm
npm uninstall react react-dom
```
```shell
# using npm
npm install react@17.2.0 react-dom@17.2.0
```

### 4. I am getting db_path error

- Make sure you have installed postgres and created a database.
- Navigate to web folder inside root folder and open index.js
- Change the following line of code

```shell
const DB_PATH = 'postgres://postgres:yourpostgrespasswordhere@localhost:5432/yourdatabasename';
```
## Developer resources

- [Introduction to Shopify apps](https://shopify.dev/apps/getting-started)
- [App authentication](https://shopify.dev/apps/auth)
- [Shopify CLI](https://shopify.dev/apps/tools/cli)
- [Shopify API Library documentation](https://github.com/Shopify/shopify-api-node/tree/main/docs)
