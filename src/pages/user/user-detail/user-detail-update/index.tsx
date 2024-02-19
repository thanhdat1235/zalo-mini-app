import zaloImg from "assets/images/zalo.jpg";
import { globalLoading } from "components/global-loading";
import HeaderSecond from "components/header/header-second";
import SheetComponent from "components/sheet/sheet-component";
import { LocationType } from "models/location";
import { Customer, CustomerRequest } from "models/user";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  getPhoneNumberZaloProfileThunk,
  setUserInfo,
} from "redux/slices/user-slice";
import { AppDispatch, RootState } from "redux/store";
import { locationService } from "services/location-service";
import { userService } from "services/user-service";
import { zaloService } from "services/zalo-service";
import { QueryKey } from "types/api";
import {
  DATE_FORMAT_DDMMYYYY,
  DATE_FORMAT_YYYYMMDD,
  formatDate,
} from "utils/date";
import { regexPhoneNumber } from "utils/regex";
import { TouchOpacity } from "zalo-ui";
import {
  Box,
  DatePicker,
  Input,
  Page,
  Radio,
  Select,
  Text,
  useSnackbar,
} from "zmp-ui";
const { Option } = Select;
interface Local {
  cityIdLocation?: number;
  districtIdLocation?: number;
  wardIdLocation?: number;
}

const genders = [
  {
    label: "Bé trai",
    name: "medium",
    value: true,
  },
  {
    label: "Bé gái",
    name: "medium",
    value: false,
  },
];

const UserDetailUpdate = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user,
  );
  const [birthDayChild, setBirthDayChild] = useState<string | Date>("");
  const [birthDay, setBirthDay] = useState<string | Date>("");
  const { openSnackbar, closeSnackbar } = useSnackbar();
  const timmerId = useRef();

  useEffect(() => {
    closeSnackbar();
    clearInterval(timmerId.current);
  }, []);

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

  const { data: dataCity } = useQuery({
    queryKey: [QueryKey.LOCATION_CITY],
    queryFn: async () => {
      const params = {
        type: LocationType.CITY,
        parentId: 0,
      };
      return await locationService.getShippingLocation(params);
    },
    // enabled: Boolean(sheetData.city.id),
  });

  const { data: dataDistrict } = useQuery({
    queryKey: [QueryKey.LOCATION_DISTRICT, sheetData.city.id],
    queryFn: async () => {
      const params = {
        type: LocationType.DISTRICT,
        parentId: sheetData.city.id,
      };
      return await locationService.getShippingLocation(params);
    },
    enabled: Boolean(sheetData.city.id),
  });

  const { data: dataWard } = useQuery({
    queryKey: [QueryKey.LOCATION_WARD, sheetData.district.id],
    queryFn: async () => {
      const params = {
        type: LocationType.WARD,
        parentId: sheetData.district.id,
      };
      return await locationService.getShippingLocation(params);
    },
    enabled: Boolean(sheetData.district.id),
  });

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
    reset,
  } = useForm<CustomerRequest>({
    defaultValues: {
      fullName: "",
      roadBuilding: "",
      address: "",
      birthday: "",
      phoneNumber: "",
      childName: "",
      childBirthday: "",
      childGender: undefined,
    },
  });

  useEffect(() => {
    reset(user);
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
  }, [user]);

  const onSubmit = async (data: CustomerRequest) => {
    try {
      globalLoading.show();
      let dataUpdate = {
        ...data,
        id: user.id,
      };
      if (data.birthday) {
        dataUpdate.birthday = formatDate(
          new Date(data.birthday),
          DATE_FORMAT_YYYYMMDD,
        );
      }
      if (data.childBirthday) {
        dataUpdate.childBirthday = formatDate(
          new Date(data.childBirthday),
          DATE_FORMAT_YYYYMMDD,
        );
      }

      const city = dataCity?.data.find((city) => city.id === sheetData.city.id);

      const district = dataDistrict?.data.find(
        (district) => district.id === sheetData.district.id,
      );

      const ward = dataWard?.data.find((ward) => ward.id === sheetData.ward.id);

      dataUpdate = {
        ...dataUpdate,
        city: city?.name || "",
        cityId: city?.id || 0,
        district: district?.name || "",
        districtId: district?.id || 0,
        ward: ward?.name || "",
        wardId: ward?.id || 0,
      };

      const response = await userService.updateUser(dataUpdate);
      dispatch(setUserInfo(response));
      openSnackbar({
        text: "Cập nhật thành công",
        type: "success",
        duration: 3000,
        position: "bottom",
        zIndex: 999,
      });
    } catch (error) {
      openSnackbar({
        text: "Cập nhật thất bại",
        type: "error",
        duration: 3000,
        position: "bottom",
        zIndex: 999,
      });
    } finally {
      globalLoading.hide();
    }
  };

  const date = new Date();

  const handleGetPhoneZaloProfile = async () => {
    try {
      globalLoading.show();
      const token = await zaloService.getUserPhoneNumber();
      dispatch(getPhoneNumberZaloProfileThunk(token));
      openSnackbar({
        icon: true,
        type: "success",
        text: "Cập nhật số điện thoại từ Zalo thành công",
        duration: 3000,
      });
    } catch (err) {
      console.log(
        "🚀 ~ file: index.tsx:188 ~ handleGetPhoneZaloProfile ~ err:",
        err,
      );
      openSnackbar({
        icon: true,
        type: "error",
        text: "Cập nhật số điện thoại từ Zalo thất bại",
        duration: 3000,
      });
    } finally {
      globalLoading.hide();
    }
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background-primary">
      <HeaderSecond title="Thông tin của bạn" showBackIcon={true} />
      <Box className="mt-[2px] pt-[31px] h-[100%] bg-background px-[30px] overflow-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="flex justify-start flex-col items-center w-[100%] mb-[24px]">
            <label
              htmlFor={`${user.id}`}
              className="text-[#6B7280] text-[16px] font-[700] leading-[24px] w-[100%]"
            >
              Tên của bạn*
            </label>
            <input
              placeholder="Nguyen Van A"
              type="text"
              {...register("fullName", {
                required: true,
                minLength: 3,
              })}
              id={`${user.id}`}
              className={`mt-[12px] w-[100%] capitalize border-[1px] border-solid border-transparent outline-none focus:focus:border-[1px] focus:border-solid ${
                errors.fullName
                  ? "focus:border-red-color"
                  : "focus:border-green-color"
              }  px-[16px] py-[16px] rounded-[16px] font-[600] leading-[24px] text-[16px] bg-[#F9FAFB] text-text-black`}
            />
            {errors.fullName && (
              <small className="text-red-color flex self-start">
                {errors.fullName.type === "required"
                  ? "Họ tên không được rỗng"
                  : errors.fullName.type === "minLength"
                  ? "Họ tên phải lớn hơn 3 ký tự"
                  : ""}
              </small>
            )}
          </Box>

          <Box className="flex justify-start flex-col items-center w-[100%] mb-[24px]">
            <label
              htmlFor={`${user.id}`}
              className="text-[#6B7280] text-[16px] font-[700] leading-[24px] mb-[12px] w-[100%]"
            >
              Ngày sinh
            </label>
            <Controller
              control={control}
              name="birthday"
              render={({ field: { value } }) => (
                <DatePicker
                  placeholder={
                    value
                      ? formatDate(new Date(value), DATE_FORMAT_DDMMYYYY)
                      : ""
                  }
                  action={{
                    text: "Xác nhận",
                    close: true,
                    onClick: () => {
                      setValue("birthday", birthDay);
                    },
                  }}
                  endDate={date}
                  endYear={date.getFullYear()}
                  dateFormat="dd/mm/yyyy"
                  inputClass="bg-[#F9FAFB] !border-none py-1"
                  mask
                  maskClosable
                  onChange={(selector) => setBirthDay(selector)}
                />
              )}
            />
          </Box>

          <Box className="flex justify-start flex-col items-center w-[100%] mb-[24px]">
            <label className="text-[#6B7280] text-[16px] font-[700] leading-[24px] w-[100%]">
              Số điện thoại
            </label>
            <Box className="relative w-full">
              <input
                placeholder="09xxxxxxxx"
                type="text"
                {...register("phoneNumber", {
                  pattern: regexPhoneNumber,
                })}
                className={`mt-[12px] w-[100%] border-[1px] border-solid border-transparent outline-none focus:focus:border-[1px] focus:border-solid ${
                  errors.phoneNumber
                    ? "focus:border-red-color"
                    : "focus:border-green-color"
                }  px-[16px] py-[16px] rounded-[16px] font-[600] leading-[24px] text-[16px]  bg-[#F9FAFB] text-text-black`}
              />
              <img
                src={zaloImg}
                className="w-[50px] h-auto absolute top-[15px] right-[5px] "
                alt="Zalo"
                onClick={handleGetPhoneZaloProfile}
              />
            </Box>
            {errors.phoneNumber && (
              <small className="text-red-color flex self-start">
                {errors.phoneNumber.type === "pattern"
                  ? "Số điện thoại không hợp lệ"
                  : ""}
              </small>
            )}
          </Box>

          <Box className="mt-2">
            <Text className="text-gray font-bold leading-[24px] w-[100%]">
              Địa chỉ
            </Text>
            <SheetComponent
              label={sheetData.city.name}
              title="Chọn tỉnh, thành phố"
              optionAddress={dataCity?.data}
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
              bgColor="bg-[#F9FAFB]"
            />
            <SheetComponent
              disabled={sheetData.city.id <= 0}
              label={sheetData.district.name}
              title="Chọn quận, huyện"
              optionAddress={dataDistrict?.data}
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
              bgColor="bg-[#F9FAFB]"
            />
            <SheetComponent
              disabled={sheetData.district.id <= 0}
              label={sheetData.ward.name}
              title="Chọn phường, xã"
              optionAddress={dataWard?.data}
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
              bgColor="bg-[#F9FAFB]"
            />
          </Box>

          <Box className="flex justify-start flex-col items-center w-[100%] mb-[24px]">
            <Controller
              name="address"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  placeholder="Đường, tòa nhà"
                  type="text"
                  {...register("address")}
                  className={`mt-[12px] placeholder:font-normal w-[100%] border-[1px] border-solid border-transparent outline-none focus:focus:border-[1px] focus:border-solid px-[16px] py-[16px] rounded-md font-normal leading-[24px] text-[16px] bg-[#F9FAFB] text-black`}
                  value={value}
                  onChange={(e) => setValue("address", e.target.value)}
                />
              )}
            />
          </Box>

          <Box className="flex justify-start flex-col items-center w-[100%] mb-[24px]">
            <label
              htmlFor={`${user.id}`}
              className="text-[#6B7280] text-[16px] font-[700] leading-[24px] w-[100%]"
            >
              Tên của bé
            </label>
            <input
              placeholder="Nguyen Van A"
              type="text"
              {...register("childName")}
              className="mt-[12px] capitalize w-[100%] border-[1px] border-solid border-transparent outline-none focus:focus:border-[1px] focus:border-solid focus:border-green-color  px-[16px] py-[16px] rounded-md font-[600] leading-[24px] text-[16px]  bg-[#F9FAFB] text-text-black"
              onChange={(e) => setValue("childName", e.target.value)}
            />
            {errors.childName && (
              <small className="text-red-color flex self-start"></small>
            )}
          </Box>

          <Box className="mb-[24px]">
            <Text className="text-[#6B7280] text-[16px] font-[700] leading-[24px] w-[100%]">
              Giới tính của bé
            </Text>
            <Controller
              control={control}
              name="childGender"
              render={() => (
                <Box className="mt-[12px]">
                  {genders.map((gender) => {
                    return (
                      <Radio
                        key={gender.value ? "Bé trai" : "Bé gái"}
                        name={gender.name}
                        size="medium"
                        className="text-[16px] first:mr-6"
                        label={gender.label}
                        value={getValues("childGender") ? "Bé trai" : "Bé gái"}
                        onChange={(e) => setValue("childGender", gender.value)}
                        checked={getValues("childGender") === gender.value}
                      />
                    );
                  })}
                </Box>
              )}
            />
          </Box>

          <Box className="flex justify-start flex-col items-center w-[100%] mb-[24px]">
            <label
              htmlFor={`${user.id}`}
              className="text-[#6B7280] text-[16px] font-[700] leading-[24px] mb-[12px] w-[100%]"
            >
              Ngày sinh của bé
            </label>
            <Controller
              control={control}
              name="childBirthday"
              render={({ field: { value } }) => (
                <DatePicker
                  placeholder={
                    value
                      ? formatDate(new Date(value), DATE_FORMAT_DDMMYYYY)
                      : ""
                  }
                  endDate={date}
                  endYear={date.getFullYear()}
                  dateFormat="dd/mm/yyyy"
                  mask
                  maskClosable
                  inputClass="bg-[#F9FAFB] !border-none py-1"
                  action={{
                    text: "Xác nhận",
                    close: true,
                    onClick: () => {
                      setValue("childBirthday", birthDayChild);
                    },
                  }}
                  onChange={(selector) => setBirthDayChild(selector)}
                />
              )}
            />
          </Box>

          <TouchOpacity>
            <button
              type="submit"
              className="h-[56px] w-[100%] text-[16px] font-[700] py-[8px] px-[8px] mt-[24px] mb-[70px] rounded-[16px] bg-green-color text-background"
            >
              Lưu
            </button>
          </TouchOpacity>
        </form>
      </Box>
    </Page>
  );
};

export default UserDetailUpdate;
