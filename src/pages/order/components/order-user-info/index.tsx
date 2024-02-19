import React from "react";
import { Box, Text } from "zmp-ui";

import { OrderRequest } from "models/orders";

interface OrderUserInfoProps {
  order: OrderRequest;
  address: string;
}

const OrderUserInfo = (props: OrderUserInfoProps) => {
  const { order, address } = props;

  return (
    <Box className="p-4 pb-0">
      <Box>
        <Text className="text-base">Thông tin khách hàng</Text>
      </Box>
      <Box className="flex items-start my-4">
        <Text className="mr-2 w-max text-sm">Tên bé:</Text>
        <Text className="flex-1 text-right text-sm">
          {order.customerDTO?.childName || ""}
        </Text>
      </Box>
      <Box className="flex items-start my-4">
        <Text className="mr-2 w-max text-sm">Người nhận hàng:</Text>
        <Text className="flex-1 text-right text-sm">
          {order.customerDTO?.fullName || ""}
        </Text>
      </Box>
      <Box className="flex items-start my-4">
        <Text className="mr-2 w-max text-sm">Số điện thoại:</Text>
        <Text className="flex-1 text-right text-sm">
          {order.customerDTO?.phoneNumber || ""}
        </Text>
      </Box>
      <Box className="flex items-start my-4">
        <Text className="mr-2 w-max text-sm">Địa chỉ:</Text>
        <Text className="flex-1 text-right break-all text-sm">
          {address || ""}
        </Text>
      </Box>
      <Box className="flex items-start my-4">
        <Text className="mr-2 w-max break-all text-sm">Ghi chú đơn hàng:</Text>
        <Text className="flex-1 text-right text-sm">{order.note || ""}</Text>
      </Box>
    </Box>
  );
};

export default OrderUserInfo;
