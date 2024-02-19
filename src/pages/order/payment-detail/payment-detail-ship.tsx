import React from "react";
import { Box, Text } from "zmp-ui";

const PaymentDetailShip = () => {
  return (
    <Box className="p-4 pb-0">
      <Text className="text-base">Giao hàng</Text>
      <Box>
        <Box className="my-1">
          <Text className="text-sm">
            Đơn hàng sẽ được giao tới bạn trong vòng:
          </Text>
        </Box>
        <Box className="my-1">
          <Text className="text-sm">- 01 ngày nếu bạn ở TP.HCM</Text>
        </Box>
        <Box className="my-1">
          <Text className="text-sm">
            - 03 - 05 ngày nếu bạn ở các tỉnh khác
          </Text>
        </Box>
        <Box className="my-1">
          <Text className="text-sm">Bạn lưu ý thời gian nhận hàng nha!</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentDetailShip;
