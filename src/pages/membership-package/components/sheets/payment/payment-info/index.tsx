import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { saveImageToGallery } from "zmp-sdk";
import { Box, Button, Sheet, Text, useSnackbar } from "zmp-ui";

import IconDownload from "assets/images/user-frame-dowlo.png";
import IconCopy from "assets/svg/copy.svg";
import { BankAccount } from "models/bank-account";
import { Subscription, SubscriptionBuyResponse } from "models/subscription";
import { RootState } from "redux/store";
import { bankAccountService } from "services/bank-account-service";
import { QueryKey } from "types/api";
import { formatCurrencyVND } from "utils/number";
import SheetTitle from "../../sheet-title";

interface SubscriptionPaymentInfoProps {
  onContinue: () => void;
}

export const SubscriptionPaymentInfo = ({
  onContinue,
}: SubscriptionPaymentInfoProps) => {
  const timmerId = useRef();
  const currentSubscription = useSelector<RootState, Subscription>(
    (state) => state.subscriptionStore.currentSubscription
  );
  const subscriptionBuyResponse = useSelector<
    RootState,
    SubscriptionBuyResponse
  >((state) => state.subscriptionStore.subscriptionBuyResponse);

  const [isShow, setIsShow] = useState<boolean>(true);
  const [defaultBankAccount, setDefaultBankAccount] = useState<BankAccount>();
  const [imgBankQrCode, setImgBankQrCode] = useState<string>();
  const { openSnackbar, closeSnackbar } = useSnackbar();

  const { data: bankAccounts } = useQuery([QueryKey.BANK_ACCOUNT], async () =>
    bankAccountService.getBankAccounts()
  );

  useEffect(() => {
    if (currentSubscription && defaultBankAccount) {
      setImgBankQrCode(
        `https://img.vietqr.io/image/${defaultBankAccount?.bankId}-${defaultBankAccount?.bankAccountNumber}-qr_only.png?amount=${currentSubscription.price}&addInfo=${subscriptionBuyResponse.bankingDescription}&accountName=${defaultBankAccount?.bankAccountName}`
      );
    }
  }, [currentSubscription, defaultBankAccount]);

  useEffect(() => {
    if (bankAccounts?.[0]) setDefaultBankAccount(bankAccounts[0]);
  }, [bankAccounts]);

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );

  const handleDownloadImage = () => {
    saveImageToGallery({
      imageBase64Data: imgBankQrCode,
      success: () => {
        openSnackbar({
          icon: true,
          text: "Đã lưu qrcode vào thư viện của bạn",
          type: "success",
          duration: 2000,
        });
      },
      fail: (error) => {
        openSnackbar({
          icon: true,
          type: "error",
          text: "Có lỗi khi lưu qrcode vào thư viện của bạn",
          duration: 2000,
        });
      },
    });
  };

  return (
    <Sheet visible={isShow} swipeToClose maskClosable autoHeight>
      <Box className="mx-4 mb-5 ">
        <SheetTitle
          title="Thông tin thanh toán"
          onClose={() => setIsShow(false)}
        />
        <Box>
          <Box>
            <Box className="my-4">
              <Text className="font-bold text-lg">
                Bạn vui lòng chuyển khoản ngân hàng
              </Text>
            </Box>
            <Box className="w-full flex items-center flex-col -mb-1">
              <img
                className="w-2/5 object-cover"
                src={imgBankQrCode}
                alt="bank img"
              />
              <Box className="flex">
                <Box
                  className="flex items-end p-2"
                  onClick={handleDownloadImage}
                >
                  <Text className="mr-1 text-xs">Tải xuống</Text>
                  <img
                    src={IconDownload}
                    alt="icon download"
                    className="w-5 h-5"
                  />
                </Box>
              </Box>
            </Box>
            <Box className="my-4 flex">
              <Text className="mr-2">Tên:</Text>
              <Text className="text-black font-bold">
                {defaultBankAccount?.bankAccountName}
              </Text>
            </Box>
            <Box className="my-4 flex">
              <Text className="mr-2">Tên ngân hàng:</Text>
              <Text className="text-black font-bold">
                {defaultBankAccount?.bankName}
              </Text>
            </Box>

            <Box className="flex items-center justify-between">
              <Box className="flex items-center">
                <Text className="mr-2">Số tài khoản:</Text>
                <Text className="text-black font-bold">
                  {defaultBankAccount?.bankAccountNumber}
                </Text>
              </Box>
              <Box
                onClick={() => {
                  openSnackbar({
                    icon: true,
                    text: "Copy số tài khoản thành công",
                    type: "success",
                    duration: 2000,
                  });
                }}
              >
                <img src={IconCopy} alt="icon copy" />
              </Box>
            </Box>
            <Box className="my-4 flex">
              <Text className="mr-2">Tổng thanh toán:</Text>
              <Text className="text-primary font-bold text-[17px]">
                {formatCurrencyVND(currentSubscription?.price || 0)}
              </Text>
            </Box>
            <Box className="my-4">
              <Text>Nội dung chuyển khoản:</Text>
              <Box className="flex items-center justify-between my-4">
                <Text className="text-black font-bold">
                  {subscriptionBuyResponse.bankingDescription || ""}
                </Text>
                <Box
                  onClick={() => {
                    openSnackbar({
                      icon: true,
                      text: "Copy nội dung chuyển khoản thành công",
                      type: "success",
                      duration: 2000,
                    });
                  }}
                >
                  <img src={IconCopy} alt="icon copy" />
                </Box>
              </Box>
            </Box>
            <Box className="my-4">
              <Text className="text-black italic text-sm font-medium text-center">
                Bạn vui lòng chụp hình ảnh thông tin chuyển khoản thành công
              </Text>
            </Box>
          </Box>
        </Box>
        <Box className="mt-4 bg-background">
          <Button className="w-full rounded-xl p-4" onClick={onContinue}>
            Tiếp tục...
          </Button>
        </Box>
      </Box>
    </Sheet>
  );
};
