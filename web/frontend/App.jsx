import { unstable_HistoryRouter as BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import React from "react";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import history from "./hooks/history";
//
export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <PolarisProvider>
      <BrowserRouter history={history}>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "New Campaign",
                  destination: "/newcampaign",
                },
                {
                  label: "Home",
                  destination: "/",
                },
                {
                  label: "Campaigns",
                  destination: "/campaigns",
                },
                {
                  label: "Referrals",
                  destination: "/referrals",
                },
                {
                  label: "Settings",
                  destination: "/settings",
                },

                {
                  label: "Support",
                  destination: "/support",
                },
                {
                  label: "Feedback",
                  destination: "/feedback",
                },
              ]}
            />
            <Routes pages={pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
