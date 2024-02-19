import React, { useImperativeHandle, useState } from "react";
import { Box, Button, Sheet, Text } from "zmp-ui";

import IconCheckBorder from "assets/svg/checked-border.svg";
import DollarIcon from "assets/svg/dollar.svg";
import BankIcon from "assets/svg/payment-bank.svg";
import SheetTitle from "components/bottom-sheet/sheet-title";
import { OrderPaymentMethod } from "models/orders";
import { PaymentMethod } from "pages/order/payment-select";
import { TouchOpacity } from "zalo-ui";

const paymentMethod: PaymentMethod[] = [
  {
    name: "Chuyển khoản ngân hàng",
    icon: BankIcon,
    type: OrderPaymentMethod.GATEWAY,
  },
  {
    name: "Thanh toán khi nhận hàng",
    icon: DollarIcon,
    type: OrderPaymentMethod.COD,
  },
];

export interface PaymentMethodBottomSheetRefs {
  onClose: () => void;
  onOpen: () => void;
}

interface PaymentMethodBottomSheetProps {
  onSubmit: (type: OrderPaymentMethod) => void;
  isPaymentCOD?: boolean;
}

const PaymentMethodBottomSheet = React.forwardRef<
  PaymentMethodBottomSheetRefs,
  PaymentMethodBottomSheetProps
>(({ onSubmit, isPaymentCOD = true }, ref) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>(
    paymentMethod?.[0]
  );

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  const onOpen = () => {
    setIsShow(true);
  };

  const onClose = () => {
    setIsShow(false);
  };

  const renderPaymentMethodItem = (item: PaymentMethod, active: boolean) => (
    <TouchOpacity
      className={`rounded-xl my-4 p-4 flex items-center relative bg-background-primary ${
        active && "!bg-[#9BD929] !bg-opacity-20"
      } `}
      key={item.name}
      onClick={() => setCurrentMethod(item)}
    >
      <img src={item.icon} alt={item.name} />
      <Text className="ml-4 text-black font-medium">{item.name}</Text>
      {active && (
        <Box className="absolute top-1/2 right-2 translate-y-[-50%]">
          <img src={IconCheckBorder} alt="icon checked border" />
        </Box>
      )}
    </TouchOpacity>
  );

  return (
    <Sheet
      visible={isShow}
      onClose={() => setIsShow(false)}
      mask
      autoHeight
      handler
      swipeToClose
      maskClosable
      snapPoints={[0.01]}
    >
      <SheetTitle title="Thanh toán với" onClose={() => setIsShow(false)} />
      <Box className="mx-4 mb-5">
        <Box>
          {paymentMethod.map((item) => {
            const active = item.type === currentMethod.type;
            return item.type === OrderPaymentMethod.COD && !isPaymentCOD
              ? null
              : renderPaymentMethodItem(item, active);
          })}
        </Box>
        <Box className="mt-8">
          <Button
            className="w-full rounded-xl p-4"
            onClick={() => {
              setIsShow(false);
              onSubmit(currentMethod.type);
            }}
          >
            Tiếp tục...
          </Button>
        </Box>
      </Box>
    </Sheet>
  );
});

export default PaymentMethodBottomSheet;
