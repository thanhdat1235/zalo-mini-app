import React from "react";
import { Box, Icon, Text, useNavigate } from "zmp-ui";

import { ga4 } from "components/app";
import { SubscriptionItem } from "components/subscriptions-item";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { SalePackage } from "models/sale-package";
import { useQuery } from "react-query";
import { subscriptionService } from "services/subscription-service";
import { QueryKey } from "types/api";
import { TouchOpacity } from "zalo-ui";

interface MammyClubProps {
  bannerUrl?: string;
  bannerFileName?: string;
  contents: SalePackage[];
  data: SalePackage;
}

const MembershipPackage = (props: MammyClubProps) => {
  const navigate = useNavigate();

  const { bannerUrl, bannerFileName, contents } = props;

  const handleNavigate = () => {
    navigate(PATH_NAME.SUBSCRIPTION);

    ga4.trackEvent(EVENT_ACTION.SUBSCRIPTION.CLICK, {
      search_term: {},
    });
  };

  return (
    <Box className="bg-background mt-1 pb-1">
      <Box className="flex flex-col items-center">
        <img
          src={bannerUrl}
          alt={bannerFileName}
          className="w-full"
          onClick={handleNavigate}
        />
        {contents?.length > 0 && (
          <Box className="p-1.5 flex items-center self-end justify-end rounded-lg mt-2">
            <TouchOpacity
              className="p-1.5 flex items-center bg-background-primary rounded-lg"
              onClick={handleNavigate}
            >
              <Text className="font-medium text-[12px]">Xem thêm</Text>
              <Icon icon="zi-chevron-right" className="font-bold" />
            </TouchOpacity>
          </Box>
        )}
      </Box>
      <Box
        className={` grid ${
          contents?.length > 2
            ? "px-2 grid-cols-3 gap-2"
            : "px-4 grid-cols-2 gap-6"
        } bg-background my-4`}
      >
        {contents?.length > 0 &&
          contents.map((item, index) => {
            return <SubscriptionItem key={index} {...item} />;
          })}
      </Box>
    </Box>
  );
};

export default MembershipPackage;
