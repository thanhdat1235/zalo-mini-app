import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { saveImageToGallery } from "zmp-sdk";
import { Box, Button, Icon, Page, Text, useSnackbar } from "zmp-ui";
import { SnackbarOptions } from "zmp-ui/useSnackbar";

import Logo from "assets/images/logo.png";
import IconCopy from "assets/svg/copy.svg";
import IconFile from "assets/svg/file.svg";
import BankSelect from "components/bank-select";
import HeaderSecond from "components/header/header-second";
import { BoxSkeleton } from "components/skeletons";
import { PATH_NAME } from "constants/router";
import { BankAccount } from "models/bank-account";
import { OrderPaymentMethod } from "models/orders";
import { bankAccountService } from "services/bank-account-service";
import { orderService } from "services/order-service";
import { UPLOAD_URL } from "services/url";
import { QueryKey } from "types/api";
import { DATE_FORMAT_DDMMYYYYTHHMMSS_DISPLAY, formatDate } from "utils/date";
import { formatCurrencyVND } from "utils/number";
import { generateSePayQRCode } from "utils/qr-code";
import { copyTextToClipboard } from "utils/system";
import { UploadMediaType } from "utils/upload";
import { TouchOpacity } from "zalo-ui";
import InvoiceTransferUploader from "../components/invoice-transfer-uploader";

const PaymentResult = () => {
  const navigate = useNavigate();

  const { openSnackbar } = useSnackbar();

  const { id } = useParams();

  const [fileUrl, setFileUrl] = useState<string>("");
  const [imgBankQrCode, setImgBankQrCode] = useState<string>();
  const [bankAccount, setBankAccount] = useState<BankAccount>();
  const [visibleBankSelect, setVisibleBankSelect] = useState<boolean>(false);

  const { isLoading: isLoadingOrderDetail, data: orderDetail } = useQuery({
    queryKey: [QueryKey.ORDER, id],
    queryFn: async () => {
      return await orderService.getOrderById(id as unknown as number);
    },
  });

  const { data: bankAccounts, isLoading: isLoadingBankAccount } = useQuery(
    [QueryKey.BANK_ACCOUNT],
    async () => {
      return await bankAccountService.getBankAccounts();
    }
  );

  useEffect(() => {
    if (orderDetail && bankAccounts) {
      let bank: BankAccount = {};
      if (Array.isArray(bankAccounts) && bankAccounts.length > 0) {
        bank = bankAccounts[0];
        setBankAccount(bank);
      }

      if (bank) {
        if (
          bank?.bankName &&
          bank?.bankAccountNumber &&
          orderDetail?.totalPayment &&
          orderDetail?.bankingDescription
        ) {
          setImgBankQrCode(
            encodeURI(
              generateSePayQRCode({
                bankName: bank.bankName,
                bankAccountNumber: bank.bankAccountNumber,
                totalPayment: orderDetail.totalPayment,
                bankingDescription: orderDetail.bankingDescription,
              })
            )
          );
        }
      }
    }
  }, [bankAccounts, orderDetail]);

  const handleCopy = (value: string) => {
    copyTextToClipboard(value);
    showSnackbar({
      type: "success",
      text: "Đã copy",
    });
  };

  const handleDownloadImage = () => {
    saveImageToGallery({
      imageUrl: imgBankQrCode,
      success: () => {
        showSnackbar({
          text: "Đã lưu qrcode vào thư viện của bạn",
          type: "success",
        });
      },
      fail: (error) => {
        console.log(error);
        showSnackbar({
          type: "error",
          text: "Có lỗi khi lưu qrcode vào thư viện của bạn",
        });
      },
    });
  };

  const showSnackbar = (options: SnackbarOptions) => {
    openSnackbar({
      icon: true,
      duration: 2000,
      ...options,
    });
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background-primary">
      <HeaderSecond
        title="Thanh toán"
        showBackIcon={true}
        onBack={() => navigate(PATH_NAME.HOME)}
      />
      <Box className="overflow-auto flex-1">
        <Box className="flex justify-center">
          <img
            src={Logo}
            alt="logo"
            className="w-[150px] h-[150px] object-cover"
          />
        </Box>
        <Box className="mb-4">
          <Text className="text-xl font-medium text-center">
            Chờ thanh toán
          </Text>
        </Box>
        <Box className="bg-background pt-5 pb-10 px-4 rounded-3xl shadow-xl mx-2">
          {orderDetail?.paymentMethod === OrderPaymentMethod.GATEWAY ? (
            <Box>
              <Box className="my-4">
                <Text className="text-center">
                  Bạn vui lòng chuyển khoản qua ngân hàng theo thông tin sau:
                </Text>
              </Box>
              <Box className="my-4 flex items-center justify-between">
                <Text className="mr-2">Tên:</Text>
                <Text className="text-black font-bold text-right">
                  {bankAccount?.bankAccountName || ""}
                </Text>
              </Box>
              <Box className="my-4 flex items-center justify-between">
                <Text className="mr-2">Tên ngân hàng:</Text>
                <Text className="text-black font-bold text-right">
                  {bankAccount?.bankName || ""}
                </Text>
              </Box>
              <Box className="flex items-center justify-between">
                <Text className="mr-2">Số tài khoản:</Text>
                <Box className="flex items-center">
                  <Text className="text-black font-bold mr-2">
                    {bankAccount?.bankAccountNumber || ""}
                  </Text>
                  <img
                    src={IconCopy}
                    alt="icon copy"
                    onClick={() =>
                      handleCopy(`${bankAccount?.bankAccountNumber}`)
                    }
                  />
                </Box>
              </Box>
              <Box className="my-4 flex justify-between items-center">
                <Text>Nội dung chuyển khoản:</Text>
                <Box className="flex items-center">
                  <Text className="text-black font-bold mr-2">{`${orderDetail?.bankingDescription}`}</Text>
                  <img
                    src={IconCopy}
                    alt="icon copy"
                    onClick={() => handleCopy(`MAMMY${orderDetail?.id}`)}
                  />
                </Box>
              </Box>
              <Box className="my-4 flex justify-between items-center">
                <Text>Tổng giá trị</Text>
                <Text className="text-primary-color font-semibold text-[24px]">
                  {formatCurrencyVND(orderDetail?.totalPayment || 0)}
                </Text>
              </Box>

              {orderDetail?.totalPayment ? (
                <Box className="pt-4">
                  <Box className="w-full flex items-center flex-col mb-1">
                    {isLoadingBankAccount || isLoadingOrderDetail ? (
                      <BoxSkeleton className="w-[150px] h-[150px]" />
                    ) : (
                      <Box className="flex flex-col items-center">
                        <Box className="w-1/2">
                          <img
                            className="flex-1 object-cover"
                            src={imgBankQrCode}
                            alt="bank img"
                          />
                        </Box>
                        <Box className="flex items-start justify-center mt-1">
                          <TouchOpacity
                            className="flex items-center mr-3"
                            onClick={handleDownloadImage}
                          >
                            <Icon icon="zi-download" size={20} />
                            <Text className="text-[11px] text-center ml-1">
                              Tải về
                            </Text>
                          </TouchOpacity>
                          <TouchOpacity
                            className="flex items-start"
                            onClick={() => setVisibleBankSelect(true)}
                          >
                            <Icon icon="zi-share-external-2" size={20} />
                            <Text className="text-[11px] text-center ml-1">
                              Mở app ngân hàng
                            </Text>
                          </TouchOpacity>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <Box className="my-4">
                    <Text className="text-black italic text-sm font-normal text-center">
                      Bạn vui lòng chụp hình ảnh thông tin chuyển khoản thành
                      công
                    </Text>
                  </Box>
                  <InvoiceTransferUploader
                    id={orderDetail?.id}
                    fileUrl={fileUrl}
                    file={IconFile}
                    serverUrl={`${UPLOAD_URL}?id=${id}&type=${UploadMediaType.ORDER}`}
                    onChange={(value) => setFileUrl(value)}
                  />
                </Box>
              ) : null}

              <Box className="mt-12">
                <Button
                  className=" w-full relative rounded-xl"
                  onClick={() => navigate(PATH_NAME.PAYMENT_THANKS)}
                >
                  Tiếp tục
                  <Icon
                    icon="zi-arrow-right"
                    className="absolute top-1/2 right-[10%] translate-y-[-50%]"
                  />
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {/* 
              <Box className="mt-12">
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
              </Box> */}
            </>
          )}
        </Box>
      </Box>
      <BankSelect
        visible={visibleBankSelect}
        onClose={() => setVisibleBankSelect(false)}
      />
    </Page>
  );
};

export default PaymentResult;
