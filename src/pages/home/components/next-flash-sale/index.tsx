import React from "react";
import { DATE_FORMAT_DDMMYYYYTHHMMSS_DISPLAY, formatDate } from "utils/date";
import { Box, Text } from "zmp-ui";

interface NextFlashSaleProps {
  nextSaleDate?: string;
  nextSaleBannerUrl?: string;
}

const NextFlashSale = (props: NextFlashSaleProps) => {
  const { nextSaleBannerUrl, nextSaleDate } = props;

  return (
    <div className="mb-2">
      {nextSaleBannerUrl && (
        <img src={nextSaleBannerUrl} className="object-cover" loading="lazy" />
      )}
      {nextSaleDate && (
        <Box className="flex flex-row relative items-center my-2 px-2">
          <Text className="text-primary-color font-bold">{`Flash sale kế tiếp sẽ diễn ra vào: ${formatDate(
            new Date(nextSaleDate),
            DATE_FORMAT_DDMMYYYYTHHMMSS_DISPLAY
          )}`}</Text>
        </Box>
      )}
    </div>
  );
};

export default NextFlashSale;
