import React from "react";
import { Box, Text } from "zmp-ui";

import IconArrowDown from "assets/svg/arrow-down.svg";
import IconInfo from "assets/svg/info.svg";
import { TouchOpacity } from "zalo-ui";

interface SheetTitleProps {
  title: string;
  onClose?(): void;
}

const SheetTitle = ({ title, onClose }: SheetTitleProps) => {
  return (
    <Box className="flex items-center sticky top-0 left-0 right-0 bg-transparent px-4 py-2">
      <Box className="flex-1 flex items-center">
        <img src={IconInfo} alt="icon info" className="w-5 h-5" />
        <Text className="ml-4 text-black text-lg font-bold">{title}</Text>
      </Box>
      <TouchOpacity onClick={onClose}>
        <img src={IconArrowDown} alt="icon arrow down" />
      </TouchOpacity>
    </Box>
  );
};

export default SheetTitle;
