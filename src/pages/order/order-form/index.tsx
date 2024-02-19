import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SnackbarOptions } from "zmp-ui/useSnackbar";
import { Box, Button, Page, Radio, Text, useSnackbar } from "zmp-ui";

import { QueryKey } from "types/api";
import HeaderSecond from "components/header/header-second";
import InputForm from "components/input-form";
import InputTextArea from "components/input-text-area";
import SheetComponent from "components/sheet/sheet-component";
import { PATH_NAME } from "constants/router";
import { LocationType } from "models/location";
import { OrderRequest } from "models/orders";
import { Customer, CustomerRequest } from "models/user";
import { setOrder } from "redux/slices/order-slice";
import { AppDispatch, RootState } from "redux/store";
import { locationService } from "services/location-service";
import { regexPhoneNumber } from "utils/regex";
import Step from "../components/Steps";
import { globalLoading } from "components/global-loading";
import { userService } from "services/user-service";
import { setUserInfo } from "redux/slices/user-slice";

const orderDefault: OrderRequest = {
  customerDTO: {
    fullName: "",
    phoneNumber: "",
    childGender: false,
    affiliateCode: "",
    city: "",
    cityId: 0,
    district: "",
    districtId: 0,
    ward: "",
    wardId: 0,
    address: "",
  },
  note: "",
  affiliateCode: "",
};

const genderOption = [
  {
    value: true,
    label: "Bé trai",
  },
  {
    value: false,
    label: "Bé gái",
  },
];

const OrderForm = () => {
  const navigate = useNavigate();

  const { openSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );

  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<OrderRequest>({
    defaultValues: { ...orderDefault },
  });

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
    if (!order.customerDTO) {
      reset({
        ...orderDefault,
        customerDTO: {
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          childGender: user.childGender || false,
          childName: user.childName,
          city: user.city,
          cityId: user.cityId,
          district: user.district,
          districtId: user.districtId,
          ward: user.ward,
          wardId: user.wardId,
          address: user.address,
        },
        affiliateCode: order.affiliateCode,
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
    } else if (Object.keys(order).length > 0) {
      reset({ ...order });
      setSheetData({
        city: {
          id: order.customerDTO?.cityId!,
          name: order.customerDTO?.city!,
        },
        district: {
          id: order.customerDTO?.districtId!,
          name: order.customerDTO?.district!,
        },
        ward: {
          id: order.customerDTO?.wardId!,
          name: order.customerDTO?.ward!,
        },
      });
    }
  }, [order, user]);

  const onSubmit = async (data: OrderRequest) => {
    const city = cityData?.find((item) => item.id === sheetData.city.id)?.name;
    if (!city) {
      showSnackbar({ text: "Vui lòng chọn tỉnh, thành phố" });
      return;
    }
    const district = districtData?.find(
      (item) => item.id === sheetData.district.id
    )?.name;
    if (!district) {
      showSnackbar({ text: "Vui lòng chọn quận huyện" });
      return;
    }
    const ward = wardData?.find((item) => item.id === sheetData.ward.id)?.name;
    if (!ward) {
      showSnackbar({ text: "Vui lòng nhập số nhà tên đường" });
      return;
    }

    const formData: OrderRequest = {
      ...data,
      customerDTO: {
        ...data.customerDTO,
        city,
        cityId: sheetData.city.id,
        district,
        districtId: sheetData.district.id,
        ward,
        wardId: sheetData.ward.id,
      },
    };

    if (data.affiliateCode) {
      try {
        globalLoading.show();
        await userService.useAffiliateCode(data.affiliateCode);
      } catch (err) {
        console.log(err);
        showSnackbar({
          text: "Mã giới thiệu không tồn tại. Vui lòng kiểm tra lại",
        });
        return;
      } finally {
        globalLoading.hide();
      }
    }

    const userData: CustomerRequest = {
      id: user.id,
      city,
      cityId: sheetData.city.id,
      district,
      districtId: sheetData.district.id,
      ward,
      wardId: sheetData.ward.id,
      address: data.customerDTO?.address,
    };

    const userResponse = await userService.updateUser(userData);

    dispatch(setUserInfo(userResponse));

    dispatch(setOrder(formData));
    navigate(PATH_NAME.PAYMENT_SELECT);
  };

  const showSnackbar = (props: SnackbarOptions) => {
    openSnackbar({
      icon: true,
      type: "warning",
      text: props.text,
      duration: 1000,
    });
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background">
      <HeaderSecond title="Đặt hàng" showBackIcon />
      <Box id="home-page" className="overflow-auto flex-1">
        <Step information />
        <Box className="m-4 ">
          <Controller
            control={control}
            name="customerDTO.fullName"
            rules={{
              required: "Vui lòng nhập thông tin",
            }}
            render={({ field: { onChange, value, ref } }) => (
              <>
                <InputForm
                  title="Người nhận hàng*"
                  value={value}
                  placeholder="Nguyễn Văn A"
                  autoFocus
                  onChange={onChange}
                  ref={ref}
                  onClose={() => onChange("")}
                />
                {errors.customerDTO?.fullName && (
                  <small className="text-red-color">
                    {errors.customerDTO.fullName.message}
                  </small>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="customerDTO.phoneNumber"
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
                  allowZalo={true}
                />
                {errors.customerDTO?.phoneNumber && (
                  <small className="text-red-color">
                    {errors.customerDTO.phoneNumber.message}
                  </small>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="customerDTO.childName"
            rules={{
              required: "Vui lòng nhập thông tin",
            }}
            render={({ field: { onChange, value, ref } }) => (
              <>
                <InputForm
                  ref={ref}
                  title="Tên bé*"
                  placeholder="Nguyễn Văn A"
                  value={value}
                  onChange={onChange}
                  onClose={() => onChange("")}
                />
                {errors.customerDTO?.childName && (
                  <small className="text-red-color">
                    {errors.customerDTO.childName.message}
                  </small>
                )}
              </>
            )}
          />
          <Box className="ml-3">
            <Text className="text-md block text-[13px] font-semibold text-text-black">
              Giới tính
            </Text>
            <Box className="mt-1">
              <Controller
                control={control}
                name="customerDTO.childGender"
                render={({ field: { onChange, value } }) => (
                  <Radio.Group
                    size="small"
                    options={genderOption.map((item) => ({
                      value: `${item.value}`,
                      label: item.label,
                    }))}
                    value={`${value}`}
                    onChange={(selectedOption: string) => {
                      onChange(selectedOption as unknown as boolean);
                    }}
                  />
                )}
              />
            </Box>
          </Box>
          <Box className="mt-2">
            <Text className="text-md block text-[13px] font-semibold text-text-black ml-1">
              Địa chỉ*
            </Text>
            <SheetComponent
              label={sheetData.city.name}
              title="Chọn tỉnh, thành phố"
              optionAddress={cityData}
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
            />
            <SheetComponent
              disabled={sheetData.city.id <= 0}
              label={sheetData.district.name}
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
            />
            <SheetComponent
              disabled={sheetData.district.id <= 0}
              label={sheetData.ward.name}
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
            />
          </Box>
          <Controller
            control={control}
            name="customerDTO.address"
            rules={{
              required: "Vui lòng nhập thông tin",
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <InputForm
                  placeholder="Số nhà số đường cụ thể"
                  value={value}
                  onChange={onChange}
                  onClose={() => onChange("")}
                />
                {errors.customerDTO?.address && (
                  <small className="text-red-color">
                    {errors.customerDTO.address.message}
                  </small>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="affiliateCode"
            render={({ field: { onChange, value } }) => (
              <InputForm
                title="Mã giới thiệu (nếu có)"
                placeholder="6-12 ký tự"
                value={value}
                onChange={onChange}
                onClose={() => onChange("")}
              />
            )}
          />
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <InputTextArea
                title="Ghi chú đơn hàng (tuỳ chọn)"
                placeholder="Nhập ghi chú..."
                value={value}
                onChange={onChange}
                onClose={() => onChange("")}
              />
            )}
          />
        </Box>
        <Box className="bg-background px-4  pb-[20px] pt-2">
          <Button
            className="w-full rounded-2xl h-[60px] text-lg"
            size="large"
            onClick={handleSubmit(onSubmit)}
          >
            Tiếp tục...
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default OrderForm;

export { Step };
