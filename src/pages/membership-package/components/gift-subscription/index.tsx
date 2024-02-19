import GiftBoxImage from "assets/images/giftbox.png";
import { SubscriptionDTO } from "models/subscription";
import React from "react";
import { Box, Button, Sheet, Text } from "zmp-ui";

import SheetTitle from "../sheets/sheet-title";

interface GiftSubScriptionProps {
  visible: boolean;
  isShowBtnConfirm?: boolean;
  subscription?: SubscriptionDTO;
  onClose: () => void;
  onConfirm: () => void;
}

const GiftSubScription = (props: GiftSubScriptionProps) => {
  const {
    subscription,
    visible,
    isShowBtnConfirm = true,
    onClose,
    onConfirm,
  } = props;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      swipeToClose
      maskClosable
      autoHeight
    >
      <Box className="mx-4">
        <SheetTitle
          title={"Danh sách quà tặng"}
          onClose={() => {
            onClose?.();
          }}
        />
        <Box className="my-2 mx-4">
          {subscription?.subscriptionDetailDTOs?.map((sub, index) => (
            <Box className="flex items-center my-4" key={index}>
              <img
                src={GiftBoxImage}
                alt="icon check"
                className="h-[30px] w-[30px]"
              />
              <Text className="ml-4 text-[16px]">
                {sub.productName || sub.description}
              </Text>
            </Box>
          ))}
        </Box>
        {isShowBtnConfirm && (
          <Button
            className="h-[50px] w-full text-xl mt-3 rounded-xl mb-5"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            Xác nhận nhận quà
          </Button>
        )}
      </Box>
    </Sheet>
  );
};

export default GiftSubScription;
