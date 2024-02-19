import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { openMediaPicker } from "zmp-sdk/apis";
import { Box, Page, Text } from "zmp-ui";
import useSnackbar, { SnackbarOptions } from "zmp-ui/useSnackbar";

import PencilIcon from "assets/images/tabler_edit.png";
import CameraIcon from "assets/svg/camera.svg";
import EyeIcon from "assets/svg/eye.svg";
import UserIcon from "assets/images/user-icon.png";
import HeaderSecond from "components/header/header-second";
import { PATH_NAME } from "constants/router";
import { UploadMediaType } from "models/file-upload";
import { Customer } from "models/user";
import { AppDispatch, RootState } from "redux/store";
import { UPLOAD_URL } from "services/url";
import { DATE_FORMAT_DDMMYYYY, formatDate } from "utils/date";
import { setUserInfo } from "redux/slices/user-slice";
import Preview from "components/gallery/preview";
import { TouchOpacity } from "zalo-ui";
import { globalLoading } from "components/global-loading";

const UserDetailPage = () => {
  const timmerId = useRef();
  const dispatch = useDispatch<AppDispatch>();
  const { openSnackbar, closeSnackbar } = useSnackbar();
  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user,
  );
  const [visibleOption, setVisibleOption] = useState<boolean>(false);
  const [isShowPreview, setIsShowPreview] = useState<boolean>(false);

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    [],
  );
  const handleChooseImage = async () => {
    const serverUrl = `${UPLOAD_URL}?id=${user?.id}&type=${UploadMediaType.CUSTOMER}`;

    try {
      globalLoading.show();

      const { data } = await openMediaPicker({
        type: "photo",
        serverUploadUrl: serverUrl,
      });
      const result = JSON.parse(data);
      console.log(
        "🚀 ~ file: index.tsx:51 ~ handleChooseImage ~ result:",
        result,
      );

      if (!result?.error) {
        const urlImgResponse = result?.urls?.[0];
        showSnackbar({
          type: "success",
          text: "Tải hình ảnh lên thành công",
        });
        dispatch(
          setUserInfo({
            ...user,
            avatar: urlImgResponse,
          }),
        );
      } else {
        showSnackbar({
          type: "error",
          text: "Tải hình ảnh lên thất bại",
        });
      }
    } catch (error) {
      showSnackbar({
        type: "error",
        text: "Tải hình ảnh lên thất bại",
      });
      console.log(error);
    } finally {
      globalLoading.hide();
      setVisibleOption(false);
    }
  };

  const showSnackbar = (options: SnackbarOptions) => {
    openSnackbar({
      icon: true,
      duration: 2000,
      ...options,
    });
  };

  const address = useMemo(() => {
    return [user?.address, user?.ward, user?.district, user?.city]
      .filter((value) => Boolean(value))
      .join(", ");
  }, [user]);

  return (
    <Page
      className="relative flex-1 flex flex-col bg-background-primary"
      onClick={() => setVisibleOption(false)}
    >
      <HeaderSecond title="Thông tin của bạn" showBackIcon={true} />
      <Box className="overflow-auto bg-background flex-1 px-4">
        <TouchOpacity
          className=" w-[100px] h-[100px] relative left-1/2 -translate-x-1/2 top-4 border-[10px] border-solid border-background rounded-full shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            setVisibleOption(!visibleOption);
          }}
        >
          <img
            src={user.avatar}
            alt="avatar"
            className="w-[100%] h-[100%] mx-auto rounded-full"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = UserIcon;
            }}
          />
          <Box className="absolute -bottom-3 -right-2 bg-white p-[3px] rounded-full">
            <img src={PencilIcon} className="w-5" />
          </Box>
          <div
            className={`absolute top-[90%] right-2 w-[50vw] transition-all ${
              visibleOption && "!top-[112%]"
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {visibleOption && (
              <div className="bg-white rounded-lg border border-gray/[.1] shadow-xl p-1">
                <TouchOpacity
                  className="flex items-center py-1 px-2"
                  onClick={() => {
                    setVisibleOption(false);
                    setIsShowPreview(true);
                  }}
                >
                  <img src={EyeIcon} className="w-5" />
                  <p className="text-sm ml-2">Xem ảnh đại diện</p>
                </TouchOpacity>
                <TouchOpacity
                  className="flex items-center py-1 px-2 border-t border-gray/[.15]"
                  onClick={handleChooseImage}
                >
                  <img src={CameraIcon} className="w-5" />
                  <p className="text-sm ml-2">Cập nhật ảnh đại diện</p>
                </TouchOpacity>
              </div>
            )}
          </div>
        </TouchOpacity>
        <Box className=" mt-[32px]">
          <Box className="flex">
            <Box className="flex-1 mt-[16px] px-[16px] py-[8px] border-solid border-[#EDEDED] border-[1px] rounded-[16px] flex  items-center flex-col">
              <Box className="flex justify-between items-start w-[100%]">
                <Text className="text-grey-third-color text-[14px] font-[600] leading-[21px] py-[10px]">
                  Họ và tên
                </Text>
                <Text className="text-text-black text-[14px] font-[600] leading-[21px] text-right py-[10px]">
                  {user.fullName || ""}
                </Text>
              </Box>
              <Box className="flex justify-between items-start w-[100%]">
                <Text className="text-grey-third-color text-[14px] font-[600] leading-[21px] py-[10px]">
                  Ngày sinh
                </Text>
                <Text className="text-text-black text-[14px] font-[600] leading-[21px] text-right py-[10px]">
                  {user.birthday
                    ? formatDate(new Date(user.birthday), DATE_FORMAT_DDMMYYYY)
                    : ""}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box className="mt-[12px] w-full">
            <Text className="text-grey-third-color text-[16px] font-[700] leading-[24px] ">
              Thông tin liên hệ
            </Text>
            <Box className=" mt-[16px] px-[16px] py-[8px] border-solid border-[#EDEDED] border-[1px] rounded-[16px] flex flex-col  items-center ">
              <Box className="flex justify-between items-start w-[100%] ">
                <Text className="text-grey-third-color text-[14px] font-[600] leading-[21px] py-[10px]">
                  Số điện thoại
                </Text>
                <Text className="text-text-black text-[14px] font-[600] leading-[21px] text-right py-[10px]">
                  {user.phoneNumber || ""}
                </Text>
              </Box>
              <Box className="flex justify-between items-center w-full">
                <Text className="text-grey-third-color text-[14px] font-[600] flex-[1] leading-[21px] py-[10px]">
                  Địa chỉ
                </Text>
                <Text className="text-text-black text-[14px] font-[600] flex justify-end text-end flex-[2] break-all leading-[21px] py-[10px] ">
                  {address}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box className="mt-[12px]">
            <Text className="text-grey-third-color text-[16px] font-[700] leading-[24px] ">
              Thông tin của bé
            </Text>
            <Box className=" mt-[16px] px-[16px] py-[8px] border-solid border-[#EDEDED] border-[1px] rounded-[16px] flex flex-col  items-center ">
              <Box className="flex justify-between items-start w-[100%]">
                <Text className="text-grey-third-color text-[14px] font-[600] leading-[21px] py-[10px]">
                  Họ và tên bé
                </Text>
                <Text className="text-text-black text-[14px] font-[600] leading-[21px] text-right py-[10px]">
                  {user.childName || ""}
                </Text>
              </Box>
              <Box className="flex justify-between items-start w-[100%]">
                <Text className="text-grey-third-color text-[14px] font-[600] leading-[21px] py-[10px]">
                  Giới tính
                </Text>
                <Text className="text-text-black text-[14px] font-[600] leading-[21px] text-right py-[10px]">
                  {user.childGender ? "Bé trai" : "Bé gái"}
                </Text>
              </Box>
              <Box className="flex justify-between items-start w-[100%]">
                <Text className="text-grey-third-color text-[14px] font-[600] leading-[21px] py-[10px]">
                  Ngày sinh
                </Text>
                <Text className="text-text-black text-[14px] font-[600] leading-[21px] text-right py-[10px]">
                  {user.childBirthday
                    ? formatDate(
                        new Date(user.childBirthday),
                        DATE_FORMAT_DDMMYYYY,
                      )
                    : ""}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <TouchOpacity>
          <Link
            to={`${PATH_NAME.USER}/update/${user.id}`}
            className="h-[56px] w-[100%] mt-[40px] mb-[70px] flex justify-center items-center py-[8px] px-[8px] rounded-[16px] bg-[#F9FAFB] text-[text-black] text-[16px] font-[700]"
          >
            Chỉnh sửa
          </Link>
        </TouchOpacity>
      </Box>
      <Preview
        isShowPreview={isShowPreview}
        imageList={[
          {
            url: user?.avatar || UserIcon,
            alt: "image",
          },
        ]}
        action={(state: boolean) => {
          setIsShowPreview(state);
        }}
      />
    </Page>
  );
};

export default UserDetailPage;
