import React, { useState } from "react";
import { Box, Button, Icon, Sheet, Text, useNavigate } from "zmp-ui";

import SheetTitle from "../../sheet-title";
import Avatar from "assets/images/logo.png";
import IconCrown from "assets/svg/crown.svg";
import { PATH_NAME } from "constants/router";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { Customer } from "models/user";

interface SubscriptionPaymentStatusProps {
  paymentStatus: boolean;
}

export const SubscriptionPaymentStatus = ({
  paymentStatus,
}: SubscriptionPaymentStatusProps) => {
  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user,
  );

  const [isShow, setIsShow] = useState<boolean>(true);

  const navigate = useNavigate();

  return (
    <Sheet visible={isShow} mask autoHeight handler>
      {paymentStatus ? (
        <Box className={`px-4 pb-5 bg-transparent bg-thumbnail`}>
          <SheetTitle
            title="Thanh toán thành công"
            onClose={() => setIsShow(false)}
          />
          <Box className="min-h-[400px] flex flex-col items-center">
            <Box className="mt-[60px] mb-[20px] w-full flex justify-center relative">
              <Box className="relative">
                <Box className=" bg-background p-3 rounded-full">
                  <img
                    src={user?.avatar || Avatar}
                    alt="avatar"
                    className="object-cover h-[100px] w-[100px] rounded-full"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = Avatar;
                    }}
                  />
                  <Box className="absolute bottom-0 right-0 bg-background p-2 rounded-full">
                    <img src={IconCrown} alt="icon crown h-[22px] w-[22px]" />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Text className="text-black text-[32px] text-center font-bold leading-10">
              Chào mừng bạn <br />
              {user?.fullName}
            </Text>
            <Text className="text-[16px] text-black font-bold mt-4">
              đã tham gia MămmyClub
            </Text>
            <Text className="text-[13px] text-center text-black italic mt-4 px-5">
              Thông tin đơn hàng combo sản phẩm sẽ được Admin cập nhật tới bạn
              sớm nhất
            </Text>
          </Box>
          <Box
            className="mt-8"
            onClick={() => {
              navigate(PATH_NAME.HOME);
            }}
          >
            <Button className="w-full rounded-xl p-4">Đồng ý</Button>
          </Box>
        </Box>
      ) : (
        <Box className="mx-4 mb-5">
          <SheetTitle
            title="Thanh toán thất bại"
            onClose={() => setIsShow(false)}
          />
          <Box className="flex flex-col items-center">
            <img src={Avatar} alt="logo" className="w-[60%] object-cover" />
            <Text className="text-[36px] text-black font-bold text-center">
              Thanh toán thất bại
            </Text>
            <Text className="text-black text-center pt-4 pb-10 text-[15px]">
              Xin lỗi, thanh toán của bạn không thể được xử lý ngay bây giờ. Vui
              lòng thử lại hoặc thay đổi phương thức thanh toán của bạn.
            </Text>
          </Box>
          <Box>
            <Button className="!bg-background text-primary !border-primary border w-full rounded-xl text-lg border-solid ">
              Thay đổi phương thức thanh toán
            </Button>
          </Box>
        </Box>
      )}
    </Sheet>
  );
};
