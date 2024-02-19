import CancelIcon from "assets/svg/cancel.svg";
import CheckedSolidIcon from "assets/svg/checked-border.svg";
import LoadingIcon from "assets/svg/loading.svg";
import HeaderSecond from "components/header/header-second";
import { PaymentStatus, SubscriptionDTO } from "models/subscription";
import GiftSubScription from "pages/membership-package/components/gift-subscription";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { subscriptionService } from "services/subscription-service";
import { QueryKey } from "types/api";
import { DATE_FORMAT_DDMMYYYY, formatDate } from "utils/date";
import { PageScrollView, TouchOpacity } from "zalo-ui";
import { Box, Button, Text } from "zmp-ui";
import SubscriptionInformation from "../components/subscription-information";
import SubscriptionRegisterGift from "../components/subscription-register-gift";

const SubscriptionDetail = () => {
  const purchasedSubscription = useSelector<RootState, SubscriptionDTO>(
    (state) => state.subscriptionStore.purchasedSubscription
  );

  const [visibleGiftSheet, setVisibleGiftSheet] = useState<boolean>(false);
  const [visibleShowGift, setVisibleShowGift] = useState<boolean>(false);
  const [isShowBtnReceiveGift, setIsShowBtnReceiveGift] =
    useState<boolean>(false);

  const { data: subscriptionDetail } = useQuery(
    [QueryKey.SUBSCRIPTION_BY_ID],
    async () =>
      await subscriptionService.getSubscriptionById(
        purchasedSubscription.subscriptionDTO?.id!
      ),
    {
      enabled: Boolean(purchasedSubscription.subscriptionDTO?.id),
    }
  );

  useEffect(() => {
    if (
      !purchasedSubscription.receiveGiftAfterAprove &&
      purchasedSubscription.paymentStatus !== PaymentStatus.CANCEL &&
      purchasedSubscription.paymentStatus !== PaymentStatus.PENDING 
    ) {
      setIsShowBtnReceiveGift(
        subscriptionDetail?.subscriptionDetailDTOs?.some(
          (item) => item.sendAfterPaid === true
        ) || false
      );
    }
  }, [subscriptionDetail, purchasedSubscription]);

  const getSubscriptionStatus = (subscription: SubscriptionDTO) => {
    if (subscription.subscriptionDTO?.paid) {
      return (
        <div className="font-bold text-sm flex items-center leading-3 text-primary">
          Đã duyệt
          <img
            src={CheckedSolidIcon}
            className="ml-1 w-5 h-5"
            alt="paid icon"
          />
        </div>
      );
    } else if (subscription.paymentStatus === PaymentStatus.CANCEL) {
      return (
        <div className="font-bold text-sm flex items-center leading-3 text-red-color">
          Đã hủy
          <img src={CancelIcon} className="ml-1 w-5 h-5" alt="paid icon" />
        </div>
      );
    } else {
      return (
        <div className="font-bold text-sm flex items-center leading-3 text-[#EE9322]">
          Đang chờ xét duyệt
          <img src={LoadingIcon} className="ml-1 w-5 h-5" alt="paid icon" />
        </div>
      );
    }
  };

  return (
    <PageScrollView
      renderHeader={
        <HeaderSecond title={"Chi tiết gói thành viên"} showBackIcon />
      }
    >
      <Box className=" mt-[16px] px-[16px] py-[8px] border-solid border-[#EDEDED] border-[1px] rounded-[16px] flex  items-center flex-col">
        <SubscriptionInformation
          label="Gói thành viên"
          value={purchasedSubscription?.name || ""}
        />
        <SubscriptionInformation
          label="Ngày đăng ký"
          value={
            purchasedSubscription?.createdDate
              ? formatDate(
                  purchasedSubscription.createdDate,
                  DATE_FORMAT_DDMMYYYY
                )
              : ""
          }
        />
        <SubscriptionInformation
          label="Ngày hết hạn"
          value={
            purchasedSubscription?.expiredDate
              ? formatDate(
                  purchasedSubscription.expiredDate,
                  DATE_FORMAT_DDMMYYYY
                )
              : ""
          }
        />
        <Box className="flex justify-between flex-col items-center w-[100%] py-[3.5px]">
          {purchasedSubscription && (
            <Box className="flex justify-between items-center flex-row w-[100%]">
              <Text className="text-[#6B7280] text-[14px] font-[600] leading-3 py-[10px]">
                Trạng thái
              </Text>
              {getSubscriptionStatus(purchasedSubscription)}
            </Box>
          )}
        </Box>
        <Box className="flex justify-between flex-col items-center w-[100%] py-[3.5px]">
          <Box className="flex justify-between items-center flex-row w-[100%]">
            <Text className="text-[#6B7280] text-[14px] font-[600] leading-3 py-[10px]">
              Quà tặng sau khi mua gói
            </Text>
            <TouchOpacity
              className="text-[#6B7280] text-[12px] font-[600] leading-3 text-right py-[10px]"
              onClick={() => {
                setVisibleShowGift(true);
              }}
            >
              Chi tiết
            </TouchOpacity>
          </Box>
        </Box>
        {isShowBtnReceiveGift && (
          <Button
            className="w-full rounded-xl p-4 mt-6"
            onClick={() => setVisibleGiftSheet(true)}
          >
            Nhận quà tặng của bạn
          </Button>
        )}
      </Box>
      <GiftSubScription
        visible={visibleShowGift}
        subscription={subscriptionDetail}
        isShowBtnConfirm={isShowBtnReceiveGift}
        onClose={() => setVisibleShowGift(false)}
        onConfirm={() => setVisibleGiftSheet(true)}
      />
      <SubscriptionRegisterGift
        visible={visibleGiftSheet}
        onClose={() => setVisibleGiftSheet(false)}
        onSuccess={() => setIsShowBtnReceiveGift(false)}
        subscriptionId={purchasedSubscription?.id}
      />
    </PageScrollView>
  );
};

export default SubscriptionDetail;
