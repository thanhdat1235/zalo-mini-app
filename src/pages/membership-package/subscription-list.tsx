import React, { useState } from "react";
import { Box, Text } from "zmp-ui";

import { PaymentStatus, Subscription } from "models/subscription";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { ListResponse, QueryKey } from "types/api";

import { useQuery } from "react-query";
import { subscriptionService } from "services/subscription-service";
import { TouchOpacity } from "zalo-ui";
import MembershipPackageInfo from "./components/sheets/subscription-info";
import SubscriptionItem from "./components/subscription-item";

interface SubscriptionListProps {
  data?: ListResponse<Subscription>;
  isLoading?: boolean;
  onContinue: () => void;
  onSubmit: () => void;
}

const SubscriptionList = ({
  data,
  isLoading,
  onSubmit,
  onContinue,
}: SubscriptionListProps) => {
  const { data: mySubscriptions } = useQuery(
    [QueryKey.MY_SUBSCRIPTION],
    async () => await subscriptionService.getMySubscriptions()
  );

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const subScriptionSelected = useSelector<RootState, Subscription>(
    (state) => state.subscriptionStore?.currentSubscription
  );

  const handleContinue = () => {
    onContinue?.();
    setShowDetail(false);
  }

  return (
    <Box>
      <Text className="text-center mt-6 text-black font-bold text-lg">
        Combo sản phẩm ưu đãi
      </Text>
      <Box className="mt-4 grid grid-cols-2 gap-3 flex-wrap mb-[80px]">
        {data?.content?.map((subscription) => {
          const disable =
            mySubscriptions?.findIndex(
              (sub) =>
                subscription?.id === sub.subscriptionDTO?.id &&
                sub.paymentStatus === PaymentStatus.PENDING
            ) !== -1;
          return (
            <SubscriptionItem
              key={subscription.id}
              disable={disable}
              subscription={subscription}
              onContinue={handleContinue}
              onShowInfo={() => {
                setShowDetail(true);
              }}
            />
          );
        })}
      </Box>
      {data && data?.totalElements > 0 && (
        <Box className="fixed bottom-0 w-[90%] left-[50%] translate-x-[-50%] px-4 p-2 bg-primary rounded-3xl mb-1">
          <TouchOpacity
            disabled={
              mySubscriptions?.findIndex(
                (sub) =>
                  subScriptionSelected?.id === sub.subscriptionDTO?.id &&
                  sub.paymentStatus === PaymentStatus.PENDING
              ) !== -1
            }
            className="w-full text-[#ffffff] text-center rounded-2xl text-lg font-bold  py-1"
            onClick={() => {
              onSubmit?.();
            }}
          >
            Mua ngay
          </TouchOpacity>
        </Box>
      )}
      {showDetail && (
        <MembershipPackageInfo
          data={subScriptionSelected}
          onContinue={handleContinue}
          onClose={() => setShowDetail(false)}
        />
      )}
    </Box>
  );
};

export default SubscriptionList;
