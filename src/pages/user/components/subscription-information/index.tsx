import React from "react";
import { Box, Text } from "zmp-ui";

interface SubscriptionInformationProps {
  label: string;
  value: string;
}

const SubscriptionInformation = ({
  label,
  value,
}: SubscriptionInformationProps) => {
  return (
    <Box className="flex justify-between items-start w-[100%] py-[10px]">
      <Text className="text-[#6B7280] text-[14px] font-[600] leading-3">
        {label || ""}
      </Text>
      <Text className="text-text-black text-[14px] font-[600] leading-4 text-right flex-1 ml-3">
        {value || ""}
      </Text>
    </Box>
  );
};

export default SubscriptionInformation;