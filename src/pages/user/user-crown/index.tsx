import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Box, Page, Text } from "zmp-ui";

import UserAvatar from "assets/images/logo.png";
import userCrown from "assets/images/user-crown.png";
import CancelIcon from "assets/svg/cancel.svg";
import CheckedSolidIcon from "assets/svg/checked-border.svg";
import LoadingIcon from "assets/svg/loading.svg";
import BecomeMammyMemberIcon from "assets/svg/mammy-member.svg";
import HeaderSecond from "components/header/header-second";
import { BoxSkeleton, MySubscriptionSkeleton } from "components/skeletons";
import { SubscriptionItem } from "components/subscriptions-item";
import { PATH_NAME } from "constants/router";
import {
  PaymentStatus,
  Subscription,
  SubscriptionDTO,
} from "models/subscription";
import { Customer } from "models/user";
import SubscriptionInformation from "pages/user/components/subscription-information";
import { setPurchasedSubscription } from "redux/slices/subscription-slice";
import { RootState } from "redux/store";
import { subscriptionService } from "services/subscription-service";
import { QueryKey, SearchParams } from "types/api";
import { DATE_FORMAT_DDMMYYYY, formatDate } from "utils/date";

const UserCrown = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );

  const { data: subscriptionsRes, isLoading: isLoadingSubscription } = useQuery(
    [QueryKey.MAMMY_CLUB],
    async ({ pageParam = 0 }) => {
      const params: SearchParams = {
        pageSize: 100,
        pageIndex: pageParam,
      };

      return await subscriptionService.getSubscription(params);
    }
  );

  const { data: mySubscriptions, isLoading: isLoadingMySubscription } =
    useQuery(
      [QueryKey.MY_SUBSCRIPTION],
      async () => await subscriptionService.getMySubscriptions()
    );

  const mySubscriptionsOrder = useMemo(() => {
    if (Array.isArray(mySubscriptions) && mySubscriptions.length > 0) {
      return mySubscriptions.sort(
        (a, b) =>
          Number(a?.subscriptionDTO?.paid) - Number(b?.subscriptionDTO?.paid)
      );
    }

    return null;
  }, [mySubscriptions]);


  const getSubscriptionStatus = (subscription: Subscription) => {
    if (subscription?.subscriptionDTO?.paid) {
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

  const handleNavigateSubscriptionDetail = (subscription: SubscriptionDTO) => {
    dispatch(setPurchasedSubscription(subscription));
    navigate(`${PATH_NAME.SUBSCRIPTION_DETAIL}`);
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background-primary">
      <HeaderSecond title="Gói thành viên" showBackIcon={true} />
      <Box className="bg-background my-auto px-4 max-h-[100%] h-[100%] overflow-auto">
        <Box className="">
          <Box className="">
            {isLoadingMySubscription ? (
              <MySubscriptionSkeleton />
            ) : mySubscriptionsOrder !== null ? (
              <>
                <Box className="flex justify-center my-5">
                  <Box className="relative w-[100px] h-[100px] m-auto">
                    <img
                      src={user?.avatar || UserAvatar}
                      alt="icon avatar"
                      className="object-cover w-[100%] h-[100%] rounded-full"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = UserAvatar;
                      }}
                    />
                    <img
                      src={userCrown}
                      alt=""
                      className="absolute w-[35px] h-[35px] bg-background-primary rounded-full top-[90%] left-full -translate-x-full -translate-y-1/2"
                    />
                  </Box>
                </Box>
                <Text className="text-[#6B7280] text-[16px] font-[700] leading-[24px] ">
                  Thông tin các gói của bạn
                </Text>
                <Box>
                  {mySubscriptionsOrder.map((mySubscription) => (
                    <Box
                      key={mySubscription.id}
                      className={`mt-[16px] px-[16px] py-[8px] border-solid border-[#EDEDED] border-[1px] rounded-[16px] flex  items-center flex-col relative`}
                      onClick={() =>
                        mySubscription &&
                        handleNavigateSubscriptionDetail(mySubscription)
                      }
                    >
                      <SubscriptionInformation
                        label="Gói thành viên"
                        value={mySubscription?.subscriptionDTO?.name || ""}
                      />
                      <SubscriptionInformation
                        label="Ngày đăng ký"
                        value={
                          mySubscription?.createdDate
                            ? formatDate(
                                mySubscription.createdDate,
                                DATE_FORMAT_DDMMYYYY
                              )
                            : ""
                        }
                      />
                      {mySubscription?.subscriptionDTO?.expiredDate && (
                        <SubscriptionInformation
                          label="Ngày hết hạn"
                          value={formatDate(
                            mySubscription?.subscriptionDTO?.expiredDate,
                            DATE_FORMAT_DDMMYYYY
                          )}
                        />
                      )}
                      {mySubscription.subscriptionDTO?.paid && (
                        <Box className="flex justify-between flex-col items-center w-[100%] py-[3.5px]">
                          <Box className="flex justify-between items-center flex-row w-[100%]">
                            <Text className="text-[#6B7280] text-[14px] font-[600] leading-3 py-[10px]">
                              Quà tặng đã nhận
                            </Text>
                            <button
                              className="text-[#6B7280] text-[12px] font-[600] leading-3 text-right py-[10px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                mySubscription.subscriptionDTO?.id &&
                                  navigate(
                                    `${PATH_NAME.RECEIVED_GIFTS}?subscriptionId=${mySubscription.subscriptionDTO.id}`
                                  );
                              }}
                            >
                              Chi tiết
                            </button>
                          </Box>
                        </Box>
                      )}
                      <Box className="flex justify-between items-center flex-row w-[100%]">
                        <Text className="text-[#6B7280] text-[14px] font-[600] leading-3 py-[10px]">
                          Trạng thái
                        </Text>
                        {getSubscriptionStatus(mySubscription)}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Box className="p-4 mt-5">
                <img src={BecomeMammyMemberIcon} />
                <Box className="flex justify-center flex-col items-center mt-4">
                  <p className="text-text-black text-[30px] font-bold leading-[100%]">
                    Gói thành viên
                  </p>
                  <p className="text-primary text-[50px] font-bold leading-[100%]">
                    MămmyClub
                  </p>
                  <p className="text-center text-sm mt-6">
                    MămmyClub là chương trình dành cho các khách hàng đã mua sắm
                    ở Mămmy Zalo Mini App. Mang đến trải nghiệm mua sắm Online
                    an tâm và tiện lợi hơn cho gia đình Việt Nam. MămmyClub được
                    coi như một sự tri ân của Mămmy Việt Nam với mọi người đã và
                    đang mua sắm tại Mămmy.
                  </p>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        {isLoadingSubscription ? (
          <Box className="mt-6">
            <Box>
              <Text className="font-bold font-lg">
                Các combo sản phẩm ưu đãi hấp dẫn
              </Text>
            </Box>
            <Box className="mt-2 grid grid-cols-3 gap-2">
              {[...new Array(3)].map((_, index) => (
                <BoxSkeleton className="h-[120px] rounded-lg" key={index} />
              ))}
            </Box>
          </Box>
        ) : (
          <Box className="mt-6">
            <Box>
              <Text className="font-bold font-lg">
                {Array.isArray(mySubscriptions) && mySubscriptions.length > 0
                  ? "Các gói combo sản phẩm ưu đãi hấp dẫn khác"
                  : "Các gói combo sản phẩm ưu đãi gợi ý cho bạn"}
              </Text>
            </Box>
            <Box className="mt-2 grid grid-cols-3 gap-2">
              {subscriptionsRes?.content?.map((subscriptionItem) => (
                <SubscriptionItem
                  key={subscriptionItem.id}
                  {...subscriptionItem}
                />
              ))}
            </Box>
          </Box>
        )}
        <Text className="text-[15px] text-[#A6A7A8] leading-[20px] text-center mt-[40px] mb-[72px]">
          Bạn hãy nhớ gia hạn gói thành viên liên tục để được nhận được rất
          nhiều quyền lợi ưu đãi như quà tặng khi mua sản phẩm, ưu đãi cho các
          sản phẩm mới nha!
        </Text>
      </Box>
    </Page>
  );
};
export default UserCrown;
