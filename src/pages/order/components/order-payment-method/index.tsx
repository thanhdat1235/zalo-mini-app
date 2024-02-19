import React, { useMemo } from "react";
import { Box, Text } from "zmp-ui";

import IconBank from "assets/svg/payment-bank.svg";
import DollarIcon from "assets/svg/dollar.svg";
import IconPencil from "assets/svg/pencil.svg";
import { OrderPaymentMethod as OrderPaymentMethodModel } from "models/orders";
import { TouchOpacity } from "zalo-ui";

interface OrderPaymentMethodProps {
  isEdit?: boolean;
  paymentMethod?: OrderPaymentMethodModel;
  onChange?: () => void;
}

const OrderPaymentMethod = ({
  isEdit,
  paymentMethod,
  onChange,
}: OrderPaymentMethodProps) => {
  const getIconAndText = useMemo(() => {
    switch (paymentMethod) {
      case OrderPaymentMethodModel.GATEWAY:
        return {
          name: "Chuyển khoản ngân hàng",
          icon: IconBank,
        };
      case OrderPaymentMethodModel.COD:
        return {
          name: "Thanh toán khi nhận hàng",
          icon: DollarIcon,
        };

      default:
        return {
          name: "",
          icon: "",
        };
    }
  }, [paymentMethod]);

  return (
    <Box className="p-4 pb-0">
      <Text className="text-base">Phương thức thanh toán</Text>
      <Box className="flex justify-between items-center py-4">
        <Box className="flex w-4/5 items-center">
          <img src={getIconAndText.icon} alt="icon bank" className="w-[15%]" />
          <Text className="ml-3 text-sm">{getIconAndText.name}</Text>
        </Box>
        {isEdit && (
          <TouchOpacity
            className="bg-[#9BD929] p-2 rounded-full bg-opacity-10"
            onClick={onChange}
          >
            <img src={IconPencil} alt="icon pencil" />
          </TouchOpacity>
        )}
      </Box>
    </Box>
  );
};

export default OrderPaymentMethod;
