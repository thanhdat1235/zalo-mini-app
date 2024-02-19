import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Icon, Text } from "zmp-ui";

import IconGiftBox from "assets/images/giftbox.png";
import { PATH_NAME } from "constants/router";
import { OrderRequest } from "models/orders";
import { RootState } from "redux/store";
import { TouchOpacity } from "zalo-ui";

const SubscriptionGiftApply = () => {
  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );

  const navigate = useNavigate();
  return (
    <Box className="p-4 pb-0">
      <Text className="text-base">Quà tặng gói thành viên</Text>
      <Box className="flex items-center py-4 justify-between">
        <Box className="w-[12%]">
          <img
            src={IconGiftBox}
            className="w-full object-cover"
            alt="icon ticket"
          />
        </Box>
        {order.subscriptionGifts && order.subscriptionGifts.length > 0 && (
          <TouchOpacity
            className="flex flex-row items-center gap-2"
            onClick={() => navigate(PATH_NAME.SUBSCRIPTION_GIFTS)}
          >
            <Box className="border border-primary border-dashed px-2 py-[2px] max-w-[120px] bg-[#9bd929] bg-opacity-5">
              <Text className="line-clamp-1 text-[8px] text-primary">
                Xem quà tặng bạn đã chọn
              </Text>
            </Box>
            <Icon icon="zi-chevron-right" className="w-2" size={16} />
          </TouchOpacity>
        )}
        {!order.subscriptionGifts ||
        (order.subscriptionGifts && order.subscriptionGifts.length <= 0) ? (
          <Button
            className="!bg-background text-primary border border-primary border-solid text-xs w-[100px]"
            size="small"
            onClick={() => navigate(PATH_NAME.SUBSCRIPTION_GIFTS)}
          >
            Sử dụng ngay
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export default SubscriptionGiftApply;
