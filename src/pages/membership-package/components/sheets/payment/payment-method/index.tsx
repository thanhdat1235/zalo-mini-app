import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Sheet, Text, useSnackbar } from "zmp-ui";

import IconCheckBorder from "assets/svg/checked-border.svg";
import PaymentBank from "assets/svg/payment-bank.svg";
import { OrderPaymentMethod } from "models/orders";
import { PaymentMethod } from "pages/order/payment-select";
import SheetTitle from "../../sheet-title";

const paymentMethod: PaymentMethod[] = [
  {
    name: "Chuyển khoản ngân hàng",
    icon: PaymentBank,
    type: OrderPaymentMethod.GATEWAY,
  },
];

interface MembershipPaymentMethodProps {
  onContinue: () => void;
}

export const MembershipPaymentMethod = ({
  onContinue,
}: MembershipPaymentMethodProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>(
    paymentMethod?.[0],
  );

  const { openSnackbar, closeSnackbar } = useSnackbar();
  const timmerId = useRef();

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    [],
  );

  return (
    <Sheet
      visible={isShow}
      mask
      autoHeight
      handler
      swipeToClose
      snapPoints={[0.01]}
    >
      <Box className="mx-4 mb-5">
        <SheetTitle title="Thanh toán với" onClose={() => setIsShow(false)} />
        <Box>
          {paymentMethod.map((item) => {
            const active = item.type === currentMethod.type;

            return (
              <Box
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
              </Box>
            );
          })}
        </Box>
        <Box className="mt-8">
          <Button
            className="w-full rounded-xl p-4"
            onClick={() => {
              if (currentMethod.type === OrderPaymentMethod.GATEWAY) {
                onContinue();
              } else {
                openSnackbar({
                  icon: true,
                  text: "Phương thức thanh toán này chưa được hỗ trợ",
                  action: {
                    text: "đóng",
                    close: true,
                  },
                  duration: 3000,
                });
              }
            }}
          >
            Tiếp tục...
          </Button>
        </Box>
      </Box>
    </Sheet>
  );
};
