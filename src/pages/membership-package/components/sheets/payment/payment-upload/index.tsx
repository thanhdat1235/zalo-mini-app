import React, { useEffect, useRef, useState } from "react";
import { openMediaPicker } from "zmp-sdk/apis";
import { Box, Button, Icon, Sheet, Text, useSnackbar } from "zmp-ui";
import { SnackbarOptions } from "zmp-ui/useSnackbar";

import IconFile from "assets/svg/file.svg";
import { UploadMediaType } from "models/file-upload";
import { Subscription } from "models/subscription";
import InvoiceTransferUploader from "pages/order/components/invoice-transfer-uploader";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { UPLOAD_URL } from "services/url";
import { TouchOpacity } from "zalo-ui";
import SheetTitle from "../../sheet-title";

interface SubscriptionPaymentUploadProps {
  onContinue: () => void;
}

export const SubscriptionPaymentUpload = ({
  onContinue,
}: SubscriptionPaymentUploadProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const [fileUrl, setFileUrl] = useState<string>("");
  const { openSnackbar, closeSnackbar } = useSnackbar();
  const timmerId = useRef();
  const subscriptionBuyResponse = useSelector<RootState, Subscription>(
    (state) => state.subscriptionStore.subscriptionBuyResponse
  );

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );

  const handleChooseImage = async () => {
    const serverUrl = `${UPLOAD_URL}?id=${subscriptionBuyResponse?.id}&type=${UploadMediaType.SUBSCRIPTION}`;

    openMediaPicker({
      type: "photo",
      serverUploadUrl: serverUrl,
      success: (res) => {
        const { data } = res;
        const result = JSON.parse(data);

        if (!result?.error) {
          showSnackbar({
            type: "success",
            text: "Tải hình ảnh lên thành công",
          });
          setFileUrl(result?.urls?.[0]);
        } else {
          showSnackbar({
            type: "error",
            text: "Tải hình ảnh lên thất bại",
          });
        }
      },
      fail: (error) => {
        showSnackbar({
          type: "error",
          text: "Tải hình ảnh lên thất bại",
        });
      },
    });
  };

  const showSnackbar = (options: SnackbarOptions) => {
    openSnackbar({
      icon: true,
      duration: 3000,
      ...options,
    });
  };

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
        <SheetTitle
          title="Thông tin chuyển khoản"
          onClose={() => setIsShow(false)}
        />
        <Box>
          <Box className="my-6">
            <Text className="text-center font-bold text-black text-sm">
              Bạn vui lòng chuyển thông tin chuyển khoản
            </Text>
          </Box>
          <Box className="rounded-xl border border-gray/[.5] border-dotted">
            {fileUrl ? (
              <Box className="min-h-[100px] px-2 py-4">
                <Box className="flex items-center border border-gray/[.2] rounded-xl px-4 py-2">
                  <Box className="flex items-center flex-1 relative">
                    <Box className="flex-1 flex justify-center">
                      <img
                        src={fileUrl}
                        className="max-h-[400px] object-cover"
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = IconFile;
                        }}
                      />
                    </Box>
                    <TouchOpacity
                      onClick={() => setFileUrl("")}
                      className="absolute top-2 right-2 z-10 bg-background rounded-full"
                    >
                      <Icon
                        icon="zi-close"
                        size={24}
                        className="text-[#3349E8]"
                      />
                    </TouchOpacity>
                  </Box>
                </Box>
                <Box className="mt-2">
                  <Text className="text-black text-[10px]">
                    Tải lên hóa đơn chuyển khoản
                  </Text>
                </Box>
              </Box>
            ) : (
              // <Box
              //   className="min-h-[100px] flex items-center justify-center"
              //   onClick={handleChooseImage}
              // >
              //   <Text className="font-bold text-lg">
              //     Tải lên hóa đơn chuyển khoản
              //   </Text>
              // </Box>
              <InvoiceTransferUploader
                id={subscriptionBuyResponse?.id}
                fileUrl={fileUrl}
                file={IconFile}
                serverUrl={`${UPLOAD_URL}?id=${subscriptionBuyResponse?.id}&type=${UploadMediaType.SUBSCRIPTION}`}
                onChange={(value) => setFileUrl(value)}
              />
            )}
          </Box>
        </Box>
        <Box className="mt-8">
          <Button className="w-full rounded-xl p-4" onClick={onContinue}>
            Tiếp tục...
          </Button>
        </Box>
      </Box>
    </Sheet>
  );
};
