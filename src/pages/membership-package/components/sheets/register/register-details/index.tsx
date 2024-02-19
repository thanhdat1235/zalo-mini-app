import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Sheet, Text, useSnackbar } from "zmp-ui";

import { globalLoading } from "components/global-loading";
import InputForm from "components/input-form";
import SheetComponent from "components/sheet/sheet-component";
import ToggleButton from "components/toggle-button";
import { LocationType } from "models/location";
import {
  PaymentType,
  Subscription,
  SubscriptionBuyRequest,
} from "models/subscription";
import { Customer, CustomerRequest } from "models/user";
import { setSubscriptionBuyResponse } from "redux/slices/subscription-slice";
import { setUserInfo } from "redux/slices/user-slice";
import { AppDispatch, RootState } from "redux/store";
import { locationService } from "services/location-service";
import { subscriptionService } from "services/subscription-service";
import { userService } from "services/user-service";
import { QueryKey } from "types/api";
import { regexPhoneNumber } from "utils/regex";
import SheetTitle from "../../sheet-title";

import IconInfo from "assets/svg/info.svg";
import GiftSubScription from "pages/membership-package/components/gift-subscription";
import { TouchOpacity } from "zalo-ui";

interface SubscriptionRegisterDetailsProps {
  onContinue: () => void;
  onClose: () => void;
}

export const SubscriptionRegisterDetails = ({
  onContinue,
  onClose,
}: SubscriptionRegisterDetailsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const subscription = useSelector<RootState, Subscription>(
    (state) => state.subscriptionStore.currentSubscription
  );

  const [isShow, setIsShow] = useState<boolean>(true);
  const [visibleShowGift, setVisibleShowGift] = useState<boolean>(false);
  const { openSnackbar, closeSnackbar } = useSnackbar();
  const timmerId = useRef();

  const [sheetData, setSheetData] = useState({
    city: {
      id: 0,
      name: "",
    },
    district: {
      id: 0,
      name: "",
    },
    ward: {
      id: 0,
      name: "",
    },
  });

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionBuyRequest>({
    defaultValues: {},
  });

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );

  const { data: subscriptionDetail } = useQuery(
    [QueryKey.SUBSCRIPTION_BY_ID],
    async () => await subscriptionService.getSubscriptionById(subscription.id!),
    {
      enabled: Boolean(subscription.id),
    }
  );

  const { data: cityData, isLoading: isLoadingCity } = useQuery(
    [QueryKey.LOCATION_CITY],
    async () => {
      const params = {
        type: LocationType.CITY,
        parentId: 0,
      };

      return (await locationService.getShippingLocation(params)).data;
    }
  );

  const { data: districtData, isLoading: isLoadingDistrict } = useQuery(
    [QueryKey.LOCATION_DISTRICT, sheetData.city.id],
    async () => {
      const params = {
        type: LocationType.DISTRICT,
        parentId: sheetData.city.id,
      };

      return (await locationService.getShippingLocation(params)).data;
    }
    // { enabled: Boolean(sheetData.city.id) }
  );

  const { data: wardData, isLoading: isLoadingWard } = useQuery(
    [QueryKey.LOCATION_DISTRICT, sheetData.district.id],
    async () => {
      const params = {
        type: LocationType.WARD,
        parentId: sheetData.district.id,
      };

      return (await locationService.getShippingLocation(params)).data;
    },
    { enabled: Boolean(sheetData.district.id) }
  );

  useEffect(() => {
    if (isLoadingCity || isLoadingDistrict || isLoadingWard) {
      globalLoading.show();
    } else {
      globalLoading.hide();
    }
  }, [isLoadingCity, isLoadingDistrict, isLoadingWard]);

  useEffect(() => {
    if (user) {
      reset({
        customerFullName: user?.fullName,
        customerOrderPhoneNumber: user?.phoneNumber,
        address: user?.address,
      });
      setSheetData({
        city: {
          id: user?.cityId!,
          name: user?.city!,
        },
        district: {
          id: user?.districtId!,
          name: user?.district!,
        },
        ward: {
          id: user?.wardId!,
          name: user?.ward!,
        },
      });
    }
  }, [user]);

  const showSnackbar = (msg: string) => {
    openSnackbar({
      text: msg,
      type: "warning",
      icon: true,
      duration: 2000,
    });
  };

  const buySubscription = async (buyInfo: SubscriptionBuyRequest) => {
    try {
      const subscriptionId = subscription?.id;

      if (subscriptionId) {
        const response = await subscriptionService.buySubscription(
          subscriptionId,
          buyInfo
        );
        console.log(
          "🚀 ~ file: subscription-slice.ts:48 ~ response:",
          response
        );
        dispatch(setSubscriptionBuyResponse(response));
      }
    } catch (error) {
      console.log("Error when buy subscription", error);
    }
  };

  const onSubmit = async (data: SubscriptionBuyRequest) => {
    try {
      globalLoading.show();
      if (sheetData.city.id <= 0) {
        showSnackbar("Vui lòng chọn tỉnh, thành phố");
        return;
      }
      if (sheetData.district.id <= 0) {
        showSnackbar("Vui lòng chọn quận, huyện");
        return;
      }
      if (sheetData.ward.id <= 0) {
        showSnackbar("Vui lòng chọn phường, xã");
        return;
      }

      const city = cityData?.find(
        (item) => item.id === sheetData.city.id
      )?.name;
      const district = districtData?.find(
        (item) => item.id === sheetData.district.id
      )?.name;
      const ward = wardData?.find(
        (item) => item.id === sheetData.ward.id
      )?.name;
      const customer: CustomerRequest = {
        ...user,
        phoneNumber: data.customerOrderPhoneNumber,
        fullName: data.customerFullName,
        city,
        cityId: sheetData.city.id,
        district,
        districtId: sheetData.district.id,
        ward,
        wardId: sheetData.ward.id,
        address: data.address,
      };
      delete customer.avatar;

      const formData = {
        ...data,
        customerDTO: customer,
        paymentType: PaymentType.BANK,
      };
      const userRes = await userService.updateUser(customer);
      await buySubscription(formData);
      dispatch(setUserInfo(userRes));
      onContinue();
    } catch (error) {
      showSnackbar("Có lỗi khi mua gói, vui lòng liên hệ admin để được hỗ trợ");
      console.log("error", error);
    } finally {
      globalLoading.hide();
    }
  };

  const handleConfirmReceiveGift = () => {
    setValue("receiveGiftAfterAprove", true, { shouldDirty: true });
  };

  const isShowSendAfterPaid = useMemo(() => {
    return subscriptionDetail?.subscriptionDetailDTOs?.some(
      (item) => item.sendAfterPaid === true
    );
  }, [subscriptionDetail]);

  const handleOnclose = () => {
    setIsShow(false);
    onClose?.();
  };

  return (
    <Sheet
      visible={isShow}
      handler
      swipeToClose
      maskClosable
      height={1000}
      onClose={handleOnclose}
    >
      <Box className="mx-4 mb-5">
        <SheetTitle title="Chi tiết đăng ký" onClose={handleOnclose} />
        <Controller
          control={control}
          name="customerFullName"
          rules={{ required: "Vui lòng nhập thông tin" }}
          render={({ field: { onChange, value, ref } }) => (
            <>
              <InputForm
                title="Tên của bạn*"
                value={value}
                placeholder="Nguyễn Văn A"
                autoFocus
                onChange={onChange}
                ref={ref}
                onClose={() => onChange("")}
              />
              {errors.customerFullName && (
                <small className="text-red-color">
                  {errors.customerFullName.message}
                </small>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="customerOrderPhoneNumber"
          rules={{
            required: "Vui lòng nhập thông tin",
            pattern: {
              value: regexPhoneNumber,
              message: "Số điện thoại không hợp lệ",
            },
          }}
          render={({ field: { onChange, value, ref } }) => (
            <>
              <InputForm
                title="Số điện thoại*"
                value={value}
                type="number"
                placeholder="0xxxxxxxxx"
                onChange={onChange}
                ref={ref}
                onClose={() => onChange("")}
              />
              {errors.customerOrderPhoneNumber && (
                <small className="text-red-color">
                  {errors.customerOrderPhoneNumber.message}
                </small>
              )}
            </>
          )}
        />
        <Box className="mt-3 bg-[#F0F3F6] p-3 pt-2 rounded-xl">
          <Text className="text-md block text-[13px] font-semibold text-text-black ml-1">
            Địa chỉ nhận hàng*
          </Text>
          <SheetComponent
            label={sheetData.city.name || "Chọn tỉnh, thành phố"}
            title="Chọn tỉnh, thành phố"
            optionAddress={cityData}
            height={815}
            action={(val) => {
              setSheetData({
                city: {
                  id: val.id,
                  name: val.name,
                },
                district: {
                  id: 0,
                  name: "Chọn quận huyện",
                },
                ward: {
                  id: 0,
                  name: "Chọn phường xã",
                },
              });
            }}
            currentID={sheetData.city.id}
            bgColor="bg-white"
          />
          <SheetComponent
            label={sheetData.district.name || "Chọn quận, huyện"}
            title="Chọn quận, huyện"
            optionAddress={districtData}
            action={(val) => {
              setSheetData({
                ...sheetData,
                district: {
                  id: val.id,
                  name: val.name,
                },
                ward: {
                  id: 0,
                  name: "Chọn phường xã",
                },
              });
            }}
            currentID={sheetData.district.id}
            bgColor="bg-white"
          />
          <SheetComponent
            disabled={sheetData.district.name === "Chọn quận huyện" && true}
            label={sheetData.ward.name || "Chọn phường, xã"}
            title="Chọn phường, xã"
            optionAddress={wardData}
            height={400}
            action={(val) => {
              setSheetData({
                ...sheetData,
                ward: {
                  id: val.id,
                  name: val.name,
                },
              });
            }}
            currentID={sheetData.ward.id}
            bgColor="bg-white"
          />
          <Controller
            control={control}
            name="address"
            rules={{ required: "Vui lòng nhập thông tin" }}
            render={({ field: { onChange, value, ref } }) => (
              <>
                <Box className="bg-background mt-3 rounded-lg py-4 px-2">
                  <input
                    placeholder="Số nhà, đường cụ thể..."
                    autoFocus
                    onChange={onChange}
                    ref={ref}
                    value={value}
                    className="text-xs w-full outline-none"
                    spellCheck={false}
                  />
                </Box>
                {errors.address && (
                  <small className="text-red-color">
                    {errors.address.message}
                  </small>
                )}
              </>
            )}
          />
          {isShowSendAfterPaid && (
            <Controller
              control={control}
              name="receiveGiftAfterAprove"
              render={({ field: { onChange, value } }) => (
                <>
                  <Box className="flex items-center bg-background relative mt-3 rounded-lg py-4 px-2">
                    <ToggleButton
                      value={value || false}
                      label="Nhận quà tặng của gói sau khi đăng ký"
                      setValue={onChange}
                    />
                    <TouchOpacity
                      className="absolute top-[10px] right-0 p-[10px]"
                      onClick={() => setVisibleShowGift(true)}
                    >
                      <img src={IconInfo} className="h-4 w-4" />
                    </TouchOpacity>
                  </Box>
                </>
              )}
            />
          )}
        </Box>
        <GiftSubScription
          visible={visibleShowGift}
          subscription={subscriptionDetail}
          onClose={() => setVisibleShowGift(false)}
          onConfirm={handleConfirmReceiveGift}
        />
        <Box className="mt-3">
          <Button
            className="w-full rounded-xl"
            onClick={handleSubmit(onSubmit)}
          >
            Tiếp tục
          </Button>
        </Box>
      </Box>
    </Sheet>
  );
};
