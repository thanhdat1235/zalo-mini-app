import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text } from "zmp-ui";

import IconInfo from "assets/svg/info.svg";
import { Subscription, SubscriptionDTO } from "models/subscription";
import { useLocation } from "react-router-dom";
import {
  setSubscription,
  setTempSubscription,
} from "redux/slices/subscription-slice";
import { AppDispatch, RootState } from "redux/store";
import { TouchOpacity } from "zalo-ui";

interface SubscriptionItemProps {
  onContinue: () => void;
  onShowInfo: () => void;
  disable?: boolean;
  subscription: SubscriptionDTO;
}

const SubscriptionItem = ({
  onContinue,
  onShowInfo,
  disable = false,
  subscription,
}: SubscriptionItemProps) => {
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();

  const currentSubscription = useSelector<RootState, Subscription>(
    (state) => state.subscriptionStore?.currentSubscription,
  );

  useEffect(() => {
    dispatch(setSubscription(location.state));
    if (!location.state) dispatch(setTempSubscription());
  }, []);

  return (
    <TouchOpacity
      key={subscription.id}
      className={`bg-[#FFFDFA] box-border rounded-2xl flex flex-col items-center relative border text-[#5A5266] border-gray/[.15] min-h-[155px] p-2 ${
        disable && "opacity-30 pointer-events-none"
      } ${
        subscription.id === currentSubscription?.id && "border-primary border-2"
      }
`}
      onClick={() => dispatch(setSubscription(subscription))}
    >
      <Box
        className="absolute top-0 right-0 p-[10px]"
        onClick={() => onShowInfo()}
      >
        <img src={IconInfo} className="h-4 w-4" />
      </Box>
      <Text className="mt-5 text-xl text-center flex items-center justify-center uppercase">
        {subscription.name}
      </Text>
    </TouchOpacity>
  );
};

export default SubscriptionItem;
