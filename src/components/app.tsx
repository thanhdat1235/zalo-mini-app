import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { App, SnackbarProvider, ZMPRouter } from "zmp-ui";

import { ConfigProvider } from "components/config-provider";
import { Layout } from "components/layout";
import ModelConfirmExit from "components/model-confirm-exit";
import ModelFollowOA from "components/model-follow-oa";
import config from "config";
import AdaptiveAnalytics from "lib/ga4";
import store from "redux/store";
import { getConfig } from "utils/config";

export const ga4 = new AdaptiveAnalytics(
  config.MEASUREMENT_ID,
  config.MEASUREMENT_PROTOCOL
);

export const queryClient = new QueryClient();

const MyApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      <Provider store={store}>
        <ConfigProvider
          cssVariables={{
            "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
            "--zmp-background-color": "#f4f5f6",
          }}
        >
          <App>
            <SnackbarProvider>
              <ZMPRouter>
                <Layout />
              </ZMPRouter>
            </SnackbarProvider>
            <ModelConfirmExit />
            <ModelFollowOA />
          </App>
        </ConfigProvider>
      </Provider>
    </QueryClientProvider>
  );
};
export default MyApp;
