import IconCheckBorder from "assets/svg/checked-border.svg";
import DollarIcon from "assets/svg/dollar.svg";
import PaymentBank from "assets/svg/payment-bank.svg";
import HeaderSecond from "components/header/header-second";
import { PATH_NAME } from "constants/router";
import { OrderPaymentMethod } from "models/orders";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOrder } from "redux/slices/order-slice";
import { AppDispatch } from "redux/store";
import { Box, Button, Page, Text } from "zmp-ui";
import Step from "../components/Steps";
import { TouchOpacity } from "zalo-ui";

interface ButtonPaymentSelectProps {
  name: string;
  icon: string;
  active?: boolean;
  onClick?(): void;
}

const ButtonPaymentSelect = ({
  name,
  icon,
  active,
  onClick,
}: ButtonPaymentSelectProps) => {
  return (
    <Box className="mx-6 my-3 ">
      <TouchOpacity
        className={`flex relative items-center bg-background-box-second py-5 rounded-xl w-full ${
          active && "!bg-[#9BD929] !bg-opacity-20"
        }`}
        onClick={onClick}
      >
        <img src={icon} className="ml-4" />
        <Text className="text-text-black text-center font-semibold w-full">
          {name}
        </Text>
        {active && (
          <Box className="absolute top-1/2 right-2 translate-y-[-50%]">
            <img src={IconCheckBorder} alt="icon checked border" />
          </Box>
        )}
      </TouchOpacity>
    </Box>
  );
};

export interface PaymentMethod {
  name: string;
  icon: string;
  type: OrderPaymentMethod;
}

const paymentMethod: PaymentMethod[] = [
  {
    name: "Chuyển khoản ngân hàng",
    icon: PaymentBank,
    type: OrderPaymentMethod.GATEWAY,
  },
  {
    name: "Thanh toán khi nhận hàng",
    icon: DollarIcon,
    type: OrderPaymentMethod.COD,
  },
];

const PaymentSelect = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>(
    paymentMethod?.[0],
  );

  const onSubmit = () => {
    dispatch(
      setOrder({
        paymentMethod: currentMethod.type,
      }),
    );
    navigate(PATH_NAME.PAYMENT_DETAIL);
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background">
      <HeaderSecond title="Thanh toán" showBackIcon />
      <Box id="home-page" className="overflow-auto flex-1">
        <Step information paymentMethod />
        <Box>
          {paymentMethod.map((item, index) => (
            <ButtonPaymentSelect
              key={index}
              icon={item.icon}
              name={item.name}
              active={item.type === currentMethod.type}
              onClick={() => setCurrentMethod(item)}
            />
          ))}
          <Box className="bg-background px-6 pb-[20px] pt-2 mt-6">
            <Button
              className="w-full rounded-2xl h-[60px] text-lg"
              size="large"
              onClick={onSubmit}
            >
              Tiếp tục...
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default PaymentSelect;
