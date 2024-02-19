import HeaderSecond from "components/header/header-second";
import { PATH_NAME } from "constants/router";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Icon, Page, Text } from "zmp-ui";
import Logo from "assets/images/logo.png";

const PaymentThanks = () => {
  const navigate = useNavigate();
  return (
    <Page className="relative flex-1 flex flex-col bg-background-primary">
      <HeaderSecond
        showBackIcon
        title="Thanh toán"
        onBack={() => navigate(PATH_NAME.HOME)}
      />

      <Box className="overflow-auto flex-1 ">
        <Box className="flex justify-center">
          <img
            src={Logo}
            alt="logo"
            className="w-[200px] h-[200px] object-cover"
          />
        </Box>
        <Box className="pt-5 pb-10 px-4 rounded-3xl">
          <Text className="text-[35px] text-center font-bold text-text-black leading-[40px]">
            Đặt hàng thành công
          </Text>
          <Box>
            <Text className="text-[18px] block mx-6 text-center font-medium text-text-black mt-6">
              Mămmy trân trọng cảm ơn quý khách hàng đã tin tưởng và lựa chọn
              sản phẩm của chúng tôi. Mămmy xin gửi tới quý khách lời cảm ơn
              chân thành nhất! Rất mong bạn sẽ tiếp tục ủng hộ chúng tôi trong
              thời gian tới.
            </Text>
          </Box>
        </Box>
        <Box className="mx-16">
          <Button
            className=" w-full relative rounded-xl"
            onClick={() => navigate(PATH_NAME.HOME)}
          >
            Tiếp tục mua sắm
            <Icon
              icon="zi-arrow-right"
              className="absolute top-1/2 right-[10%] translate-y-[-50%]"
            />
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default PaymentThanks;
