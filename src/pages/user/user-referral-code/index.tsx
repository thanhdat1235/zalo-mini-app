import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { saveImageToGallery } from "zmp-sdk/apis";
import { Box, Page, Text, useSnackbar } from "zmp-ui";
import { TouchOpacity } from "zalo-ui";

import userRefferalDowLo from "assets/images/user-frame-dowlo.png";
import userRefferalImg from "assets/images/user-refferal-img.png";
import userCopy from "assets/images/user-tabler_copy.png";
import HeaderSecond from "components/header/header-second";
import { BoxSkeleton } from "components/skeletons";
import { NAVIGATE_TYPE } from "constants";
import { Customer } from "models/user";
import { RootState } from "redux/store";
import { zaloService } from "services/zalo-service";
import { ShareCurrentPage } from "types/zmp-sdk";
import { copyTextToClipboard } from "utils/system";
import appConfig from "../../../../app-config.json";

const UserReferralCode = () => {
  const userInfo = useSelector<RootState, Customer>(
    (state) => state.userStore?.user,
  );
  const { openSnackbar } = useSnackbar();
  const [linkShareAffiliate, setLinkShareAffiliate] = useState<
    string | undefined
  >("");

  useEffect(() => {
    getData();
  }, [userInfo?.affiliateCode]);

  const getData = async () => {
    const appRes = await zaloService.getAppInfo();
    setLinkShareAffiliate(
      `${appRes?.appUrl}?type=${NAVIGATE_TYPE.AFFILIATE}&affiliateCode=${userInfo.affiliateCode}`,
    );
  };

  const handleDownloadImage = () => {
    const canvas = document.querySelector("#qr-code") as HTMLCanvasElement;
    if (!canvas) throw new Error("<canvas> not found in the DOM");

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-code-${userInfo.affiliateCode}.png`;
    document.body.appendChild(downloadLink);

    saveImageToGallery({
      imageBase64Data: pngUrl,
      success: () => {
        openSnackbar({
          icon: true,
          text: "Đã lưu qrcode vào thư viện của bạn",
          type: "success",
        });
      },
      fail: (error) => {
        console.log(error);
        openSnackbar({
          icon: true,
          type: "error",
          text: "Có lỗi khi lưu qrcode vào thư viện của bạn",
        });
      },
    }).then(() => {
      document.body.removeChild(downloadLink);
    });
  };

  const handleCopyLink = async () => {
    try {
      if (userInfo.affiliateCode) {
        copyTextToClipboard(userInfo.affiliateCode.toString());
        openSnackbar({
          icon: true,
          text: "Đã sao chép mã giới thiệu của bạn",
          type: "success",
        });
      } else {
        openSnackbar({
          icon: true,
          type: "error",
          text: "Có lỗi xảy ra khi sao chép mã giới thiệu",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleShareCurrentPage = async () => {
    const data: ShareCurrentPage = {
      title: `${appConfig.app.title} Mini App`,
      description: `${appConfig.app.title} - Chia sẻ mã giới thiệu đón ngàn ưu đãi - ${userInfo.fullName} - ${userInfo.affiliateCode}`,
      thumbnail:
        "https://img.freepik.com/free-vector/profitable-partnership-business-partners-cowork_335657-3010.jpg?w=1380&t=st=1692785287~exp=1692785887~hmac=23c6b51a041a2db59668bfed136d45eaa8fe5ee9f5527f922c833b2a4a778f86",
      path: `?type=${NAVIGATE_TYPE.AFFILIATE}&affiliateCode=${userInfo.affiliateCode}`,
    };

    await zaloService.shareCurrentPage(data);
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background-primary">
      <HeaderSecond title="Mã giới thiệu" showBackIcon={true} />
      <Box className=" bg-background w-full h-[100%] pt-[10px] pb-[160px] overflow-auto flex-1 ">
        <Box className="w-[201px] h-[203px] relative left-[50%] translate-x-[-50%]">
          <img src={userRefferalImg} alt="" className="w-[100%] h-[100%]" />
        </Box>
        <Box className="mx-8 mt-[24px]">
          <Text className="text-[24px] text-text-black font-[700] text-center">
            Mã giới thiệu của bạn
          </Text>
          <Text className="my-[8px] leading-[24px] text-[16px] text-[#6B7280] flex items-center justify-center text-center">
            Hãy chia sẽ cho người bạn thân yêu để được hưởng nhiều ưu đãi hấp
            dẫn nhá!
          </Text>
          {Object.keys(userInfo).length > 0 ? (
            <Box className="flex justify-center items-center flex-col">
              <QRCodeCanvas
                id="qr-code"
                level="H"
                size={200}
                value={linkShareAffiliate ?? ""}
                className="p-4"
              />
              <TouchOpacity className="flex justify-center items-center">
                <img
                  src={userRefferalDowLo}
                  alt=""
                  className="w-[24px] h-[24px] mr-[6px]"
                />
                <Text
                  className="text-[#292D32] text-[16px] leading-[24px] text-center"
                  onClick={handleDownloadImage}
                >
                  Tải xuống QR Code
                </Text>
              </TouchOpacity>
            </Box>
          ) : (
            <BoxSkeleton className="w-[150px] h-[150px] m-auto" />
          )}
          {Object.keys(userInfo).length > 0 ? (
            <Box className="bg-[#F9FAFB] px-[16px] py-[16px] flex justify-between items-center rounded-[16px] mt-[18px] mb-[24px]">
              <TouchOpacity>
                <img
                  src={userCopy}
                  alt=""
                  className="px-[3px] py-[3px]"
                  onClick={handleCopyLink}
                />
              </TouchOpacity>
              <Text className="text-[#9CA3AF] px-[3px] py-[3px] font-[500] text-[14px]">
                {userInfo.affiliateCode}
              </Text>
              <TouchOpacity>
                <Text
                  className="text-[#000] px-[3px] py-[3px]"
                  onClick={handleShareCurrentPage}
                >
                  Chia sẻ
                </Text>
              </TouchOpacity>
            </Box>
          ) : (
            <BoxSkeleton className="h-[40px] mt-4" />
          )}
        </Box>
        {/* <Box className="mx-8 mt-[24px] pt-[8px] pb-[32px] px-[16px] border-[#EDEDED] border-[1px] border-solid rounded-[16px]">
          <Text className="text-[14px] font-[600] text-text-black">
            Giới thiệu ngay, quà hot về liền tay
          </Text>
          <Text className="text-[#6B7280] text-[12px] font-[600] leading-[18px] mt-[2px] mb-[15px]">
            Những gói quà có giá trị ngẫu nhiên để thanh toán dịch vụ đa dạng
          </Text>
          <List>
            <Box className="flex">
              <img
                className="w-[36px] h-[42px] rotate-90 mr-[10px]"
                src={userTicketDiscount}
                alt=""
              />
              <Box className="flex flex-col ml-[4px]">
                <Text className="text-[14px] font-[600] text-[text-black]">
                  Quà chào sân tặng bạn mới
                </Text>
                <Text className="text-[#363636CC] text-[12px] font-[600]">
                  🎁 Giảm ngay 100k cho người được giới thiệu
                </Text>
              </Box>
            </Box>
            <Box className="flex pt-[17px]">
              <img
                className="w-[36px] h-[42px] rotate-90 mr-[10px]"
                src={userTicketDiscount}
                alt=""
              />
              <Box className="flex flex-col ml-[4px]">
                <Text className="text-[14px] font-[600] text-[text-black]">
                  Quà tri ân tặng bạn tốt
                </Text>
                <Text className="text-[#363636CC] text-[12px] font-[600]">
                  🎁 Giảm ngay 200k cho người giới thiệu
                </Text>
              </Box>
            </Box>
          </List>
        </Box> */}
      </Box>
    </Page>
  );
};

export default UserReferralCode;
