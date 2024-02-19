import { configAppView } from "zmp-sdk";

export const matchStatusBarColor = (visible: boolean) => {
  if (visible) {
    configAppView({
      statusBarType: "transparent",
      headerTextColor: "white",
    });
  } else {
    configAppView({
      statusBarType: "transparent",
      headerTextColor: "black",
    });
  }
};
