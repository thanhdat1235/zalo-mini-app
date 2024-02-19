import { BoxSkeleton } from "components/skeletons";
import { BankApp } from "models/bank-account";
import React from "react";
import { TouchOpacity } from "zalo-ui";
import { Box, Text } from "zmp-ui";

const BankAppItem = (props: BankApp) => {
  const { appLogo, appName, bankName, deeplink } = props;

  const navigateToDeepLink = () => {
    try {
      window.location.href = deeplink;
    } catch (error) {
      // Handle error if needed
      console.error("Error navigating to deep link:", error);
    }
  };

  return (
    <TouchOpacity
      onClick={navigateToDeepLink}
      className="flex items-center bg-background-primary border-t border-background px-4 py-2"
    >
      <Box className="w-[60px] flex justify-center my-2 mr-3 rounded-full overflow-hidden">
        <img
          src={appLogo}
          className="w-full block object-cover bg-white"
          alt="app-logo"
        />
      </Box>
      <Box className="flex-1">
        <Text className="font-bold">{appName}</Text>
        <Text className="line-clamp-2 mt-1">{bankName}</Text>
      </Box>
    </TouchOpacity>
  );
};

export const BankAppItemSkeleton = () => {
  return <BoxSkeleton className="h-[70px]" />;
};

export default BankAppItem;
