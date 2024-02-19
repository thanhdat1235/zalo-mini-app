import React from "react";
import { Box, Text } from "zmp-ui";

import { ga4 } from "components/app";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { SubscriptionDTO } from "models/subscription";
import { useNavigate } from "react-router-dom";

interface SubscriptionItemProps extends SubscriptionDTO {
}

export const SubscriptionItem = (props: SubscriptionItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(PATH_NAME.SUBSCRIPTION, {
      state: props,
    });

    ga4.trackEvent(EVENT_ACTION.SUBSCRIPTION.CLICK, {
      search_term: { id: props?.id },
    });
  };

  return (
    <Box
      className={`bg-background-box flex flex-col rounded-lg items-center shadow-md px-2 mb-1 pt-3`}
      onClick={handleClick}
    >
      <Box className="flex items-center justify-center w-full">
        <Text className="text-text-black uppercase font-semibold text-center">
          {props.name || ""}
        </Text>
      </Box>
      {/* <Box className="flex flex-col text-center relative w-full">
        <Text className="text-text-second-color text-[10px] font-normal">{`Thời gian ${props.month} tháng`}</Text>
      </Box> */}
      <Box className="my-2 w-full">
        <Text className="text-[10px] flex-1 font-normal leading-3 text-justify">
          {props.tagLine}
        </Text>
      </Box>
      {/* {props?.subscriptionDetailDTOs &&
        props.subscriptionDetailDTOs.length > 0 && (
          <Box className="my-2 w-full">
            <Box className="flex items-center my-[6px]">
              <img
                src={IconCheck}
                alt="icon check"
                className="w-[6px] h-[6px]"
              />
              <Text className="text-[8px] flex-1 ml-2 font-semibold leading-3">
                Thời hạn {props.month} tháng
              </Text>
            </Box>
          </Box>
        )} */}
    </Box>
  );
};
