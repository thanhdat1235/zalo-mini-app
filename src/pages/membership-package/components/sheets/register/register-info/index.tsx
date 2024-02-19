import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Sheet, Text } from "zmp-ui";

import Logo from "assets/images/logo.png";
import { SubscriptionDTO } from "models/subscription";
import { RootState } from "redux/store";
import SheetTitle from "../../sheet-title";

interface SubscriptionRegisterInfoProps {
  onContinue: () => void;
  onClose: () => void;
}

const SubscriptionRegisterInfo = ({
  onContinue,
  onClose,
}: SubscriptionRegisterInfoProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const currentSubscription = useSelector<RootState, SubscriptionDTO>(
    (state) => state.subscriptionStore.currentSubscription
  );

  const handleOnclose = () => {
    setIsShow(false);
    onClose?.();
  };

  return (
    <Sheet
      visible={isShow}
      mask
      autoHeight
      handler
      swipeToClose
      maskClosable
      onClose={handleOnclose}
    >
      <Box className="mx-4 mb-6">
        <SheetTitle
          title="Chi tiết đăng ký"
          onClose={handleOnclose}
        />
        <Box className="border border-gray/[.2] rounded-2xl p-4 my-4">
          <Box className="flex items-center">
            <Box className="border-gray/[.2] border-[3px] rounded-2xl w-25 py-1">
              <img src={Logo} alt="logo" className="w-full object-cover" />
            </Box>
            <Box className="ml-3">
              <Text className="text-black text-2xl font-bold">
                {currentSubscription?.name || ""}
              </Text>
              <Text className="text-primary font-bold text-xl">MămmyClub</Text>
              <Text className="font-bold text-black text-[12px]">
                Thời gian: {currentSubscription?.month || "0"} tháng
              </Text>
            </Box>
          </Box>
          <Box className="flex-1 border-dashed border-y-2 border-gray/[.2] my-3 py-3">
            <Text className="text-black text-lg font-bold">Thanh toán:</Text>
            <Box className="flex flex-col items-center mt-4">
              <Text className="text-[36px] font-bold text-primary-color mb-3">
                {new Intl.NumberFormat("vi-VN").format(
                  Number(currentSubscription?.price || 0)
                )}
                đ
              </Text>
              {/* <Text className="text-sm font-medium">
                Thời gian bắt đầu gói kể từ hôm nay
              </Text> */}
            </Box>
          </Box>
          {/* <Box>
            <Text className="font-medium text-sm">{`Quá trình nâng cấp sẽ bắt đầu ngay bây giờ. Bạn có thể  hủy đăng ký gói bất kì lúc nào trong Tài khoản > Gói thành viên của bạn. Gói thành viên sẽ tự động bị hủy khi hến hạn của gói nếu bạn không gia hạn.`}</Text>
          </Box> */}
        </Box>
        <Box>
          <Button className="w-full rounded-xl text-lg" onClick={onContinue}>
            Tiếp tục
          </Button>
        </Box>
      </Box>
    </Sheet>
  );
};

export default SubscriptionRegisterInfo;
