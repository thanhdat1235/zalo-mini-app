import { globalLoading } from "components/global-loading";
import React from "react";
import { TouchOpacity } from "zalo-ui";
import { openMediaPicker } from "zmp-sdk";
import { Box, Icon, Text, useSnackbar } from "zmp-ui";
import { SnackbarOptions } from "zmp-ui/useSnackbar";

interface InvoiceTransferUploaderProps {
  id?: number;
  fileUrl?: string;
  file?: React.ImgHTMLAttributes<HTMLImageElement>["src"];
  serverUrl?: string;
  onChange?: (value: string) => void;
}

const InvoiceTransferUploader = (props: InvoiceTransferUploaderProps) => {
  const { fileUrl, file, serverUrl, onChange, id } = props;

  console.log("serverUrl", serverUrl);

  const { openSnackbar } = useSnackbar();

  const handleChooseImage = async () => {
    if (serverUrl) {
      try {
        globalLoading.show();
        const { data } = await openMediaPicker({
          type: "photo",
          serverUploadUrl: serverUrl,
        });
        const result = JSON.parse(data);

        if (!result?.error) {
          const imageLink = result?.urls?.[0];
          const imageName = result?.imageName;

          onChange?.(imageLink);

          // await orderService.uploadBill({
          //   id: id || 0,
          //   imageName,
          //   imageLink,
          // });

          showSnackbar({
            type: "success",
            text: "Tải hình ảnh lên thành công",
          });
        } else {
          showSnackbar({
            type: "error",
            text: "Tải hình ảnh lên thất bại",
          });
        }
      } catch (error) {
        console.log("Error");

        showSnackbar({
          type: "error",
          text: "Tải hình ảnh lên thất bại",
        });
      } finally {
        globalLoading.hide();
      }
    }
  };

  const showSnackbar = (options: SnackbarOptions) => {
    openSnackbar({
      icon: true,
      duration: 3000,
      ...options,
    });
  };

  return (
    <Box className="rounded-xl border border-gray/[.5] border-dotted">
      {fileUrl ? (
        <Box className="min-h-[100px] px-2 py-4">
          <TouchOpacity
            className="flex items-center border border-gray/[.2] rounded-xl px-4 py-2"
            onClick={handleChooseImage}
          >
            <Box className="flex items-center flex-1 relative">
              <Box className="flex-1 flex justify-center">
                <img
                  src={fileUrl}
                  className="max-h-[400px] object-cover"
                  // onError={(e: any) => {
                  //   e.target.onerror = null;
                  //   e.target.src = file;
                  // }}
                />
              </Box>
              <TouchOpacity
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.("");
                }}
                className="absolute top-2 right-2 z-10 bg-background rounded-full"
              >
                <Icon icon="zi-close" size={24} className="text-[#3349E8]" />
              </TouchOpacity>
            </Box>
          </TouchOpacity>
          <Box className="mt-2">
            <Text className="text-black text-[10px]">
              Tải lên hóa đơn chuyển khoản
            </Text>
          </Box>
        </Box>
      ) : (
        <TouchOpacity
          className="min-h-[60px] flex items-center justify-center"
          onClick={handleChooseImage}
        >
          <Text className="font-normal">Tải lên hóa đơn chuyển khoản</Text>
        </TouchOpacity>
      )}
    </Box>
  );
};

export default InvoiceTransferUploader;
