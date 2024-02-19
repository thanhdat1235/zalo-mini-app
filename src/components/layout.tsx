import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router";
import { getSystemInfo } from "zmp-sdk";
import { Box } from "zmp-ui";

import { Routes } from "react-router-dom";
import { login } from "redux/slices/user-slice";
import { AppDispatch } from "redux/store";
import { routes } from "routers";
import { BottomNavigation } from "./bottom-navigation";
import GlobalLoading, { globalLoadingRef } from "./global-loading";
import { ScrollRestoration } from "./scroll-restoration";
import GlobalModal, { globalModalRef } from "./global-modal";

if (getSystemInfo().platform === "android") {
  const androidSafeTop = Math.round(
    (window as any).ZaloJavaScriptInterface?.getStatusBarHeight() /
      window.devicePixelRatio,
  );
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`,
  );
}

export const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(login());
  }, []);

  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <GlobalLoading ref={globalLoadingRef} />
      <GlobalModal ref={globalModalRef} />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          {routes.map((item, index) => (
            <Route key={index} path={item.path} element={<item.component />} />
          ))}
        </Routes>
      </Box>
      <BottomNavigation />
    </Box>
  );
};
