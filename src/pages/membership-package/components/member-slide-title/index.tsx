import React, { FC } from "react";
import { Box, Text } from "zmp-ui";

interface SildeTitleProps {
  isFirst: boolean;
  preTitle: string;
  subTitle: string;
}

const SlideTitle: FC<{
  isFirst;
  preTitle;
  subTitle;
}> = ({ isFirst, preTitle, subTitle }: SildeTitleProps) => {
  return (
    <Box className="flex flex-col items-center">
      {preTitle && (
        <Text
          className={`font-bold text-black text-[24px] text-center leading-8 ${
            isFirst && "text-[32px]"
          }`}
        >
          {preTitle}
        </Text>
      )}
      <Text className="text-primary font-bold text-5xl my-1">MămmyClub</Text>
      {subTitle && (
        <Text
          className={`font-bold text-black text-[24px] leading-8 ${
            isFirst && "text-[32px]"
          }`}
        >
          {subTitle}
        </Text>
      )}
    </Box>
  );
};

export default SlideTitle;
