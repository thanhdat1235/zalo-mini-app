import React, { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Icon, Page } from "zmp-ui";

import HeaderSecond from "components/header/header-second";
import { SubscriptionGiftSkeleton } from "components/skeletons";
import UseGiftModal from "components/use-gift-modal";
import { OrderRequest } from "models/orders";
import { SubscriptionCustomerDetail } from "models/subscription";
import GiftSheet from "pages/user/components/gift-sheet";
import { useNavigate } from "react-router-dom";
import { RootState } from "redux/store";
import { subscriptionService } from "services/subscription-service";
import { QueryKey } from "types/api";
import { TouchOpacity } from "zalo-ui";
import SubscriptionGiftItem from "./subscription-gift-item";

const SubscriptionGiftPage = () => {
  const navigate = useNavigate();

  const totalAmount = useSelector<RootState, number>(
    (state) => state.orderStore.totalAmount
  );
  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );

  const [giftSelected, setGiftSelected] =
    useState<SubscriptionCustomerDetail>();
  const [visibleGiftSheet, setVisibleGiftSheet] = useState<boolean>(false);
  const [visibleUseGiftModal, setVisibleUseGiftModal] =
    useState<boolean>(false);

  const {
    data: subscriptionGiftCanUseRes,
    isLoading: isLoadingSubscriptionGiftCanUse,
  } = useQuery(
    [QueryKey.SUBSCRIPTION_GIFT],
    async () =>
      await subscriptionService.getGiftCanUse({
        totalAmount: totalAmount,
        cartIds: order.cartIds || [],
        nhanhVnProductId: order.nhanhVnProductId || "",
        quantity: order.quantity || 1,
      })
  );

  return (
    <Page className="flex flex-col">
      <HeaderSecond title="Quà tặng gói thành viên" showBackIcon={true} />
      <div className="flex flex-col h-full overflow-auto scrollbar-hide">
        {isLoadingSubscriptionGiftCanUse ? (
          [...new Array(6)].map((_, index) => (
            <SubscriptionGiftSkeleton key={index} />
          ))
        ) : subscriptionGiftCanUseRes &&
          subscriptionGiftCanUseRes?.length > 0 ? (
          subscriptionGiftCanUseRes?.map((gift) => (
            <SubscriptionGiftItem
              key={gift.id}
              gift={gift}
              onOpenModalUseGift={() => {
                setGiftSelected(gift);
                setVisibleUseGiftModal(true);
              }}
              onOpenGiftSheet={() => {
                setGiftSelected(gift);
                setVisibleGiftSheet(true);
              }}
            />
          ))
        ) : (
          <div className="flex-1 flex justify-center items-center pb-24 mt-4">
            <p className="text-gray">Không có dữ liệu quà tặng</p>
          </div>
        )}
      </div>
      <div className="px-2 py-2 bg-background">
        <TouchOpacity
          className="w-full rounded-lg bg-primary py-3 font-medium text-base flex flex-row items-center justify-center"
          onClick={() => navigate(-1)}
        >
          <Icon icon="zi-arrow-left" className="text-[#fff] font-bold mr-2" />
          <p className="text-[#fff] font-bold">Trở về trang thanh toán</p>
        </TouchOpacity>
      </div>
      <UseGiftModal
        gift={giftSelected || {}}
        visible={visibleUseGiftModal}
        onClose={() => setVisibleUseGiftModal(false)}
      />
      <GiftSheet
        gift={giftSelected}
        visible={visibleGiftSheet}
        onClose={() => setVisibleGiftSheet(false)}
        submit={false}
      />
    </Page>
  );
};

export default SubscriptionGiftPage;
