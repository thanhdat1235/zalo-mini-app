import GiftBoxImage from "assets/images/giftbox.png";
import SheetTitle from "components/bottom-sheet/sheet-title";
import { PATH_NAME } from "constants/router";
import {
  SubscriptionCustomerDetail,
  SubscriptionDetailType,
} from "models/subscription";
import { Customer } from "models/user";
import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "redux/store";
import { zaloService } from "services/zalo-service";
import { displayDate } from "utils/date";
import { formatCurrencyVND } from "utils/number";
import { Box, Button, Sheet, Text } from "zmp-ui";

interface GiftSheetProps {
  gift?: SubscriptionCustomerDetail;
  visible: boolean;
  disableButton?: boolean;
  onClose: () => void;
  submit?: boolean;
}

const getNameButton = (type: SubscriptionDetailType) => {
  switch (type) {
    case SubscriptionDetailType.LINK:
      return "Xem ngay";
    case SubscriptionDetailType.GIFT_MONEY:
    case SubscriptionDetailType.PRODUCT:
      return "Đặt hàng ngay để nhận quà";
    case SubscriptionDetailType.INTRODUCE_GIFT_MONEY:
      return "Giới thiệu ngay";
    case SubscriptionDetailType.VOUCHER:
      return "Mua sắm ngay";
    default:
      return "Xem ngay";
  }
};

const GiftSheet = ({
  gift,
  visible,
  onClose,
  disableButton = false,
  submit = true,
}: GiftSheetProps) => {
  const navigate = useNavigate();

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );

  const handleSubmit = () => {
    switch (gift?.subscriptionDetailDTO?.type!) {
      case SubscriptionDetailType.LINK:
        gift?.subscriptionDetailDTO?.link &&
          zaloService.openUrlInWebview(gift.subscriptionDetailDTO.link);
        break;
      case SubscriptionDetailType.PRODUCT:
      case SubscriptionDetailType.VOUCHER:
        navigate(PATH_NAME.HOME);
        break;
      case SubscriptionDetailType.VOUCHER:
        navigate(PATH_NAME.HOME);
        break;
      case SubscriptionDetailType.INTRODUCE_GIFT_MONEY:
        navigate(`${PATH_NAME.REFERRAL_CODE}/${user.id}`);
        break;
      case SubscriptionDetailType.GIFT_MONEY:
        navigate(
          `${PATH_NAME.PRODUCT}?categoryId=${gift?.subscriptionDetailDTO?.nhanhVnProductCategoryId}`
        );
        break;
      default:
        break;
    }
  };

  const nameGift = useMemo(() => {
    const subscriptionDetailDTO = gift?.subscriptionDetailDTO;

    switch (subscriptionDetailDTO?.type) {
      case SubscriptionDetailType.VOUCHER:
        return `Mã ưu đãi ${
          subscriptionDetailDTO.giftMoney
            ? formatCurrencyVND(subscriptionDetailDTO.giftMoney)
            : ""
        }`;
      case SubscriptionDetailType.INTRODUCE_GIFT_MONEY:
        return `Quà tặng giới thiệu ${
          subscriptionDetailDTO.giftMoney
            ? formatCurrencyVND(subscriptionDetailDTO.giftMoney)
            : ""
        }`;
      case SubscriptionDetailType.PRODUCT:
        return `Quà tặng ${
          gift?.giftDescription || subscriptionDetailDTO?.productName
        }`;
      case SubscriptionDetailType.GIFT_MONEY:
        return `Quà ${subscriptionDetailDTO.description}`;
      default:
        return "Quà tặng";
    }
  }, [gift?.subscriptionDetailDTO]);

  return createPortal(
    <Sheet
      visible={visible}
      mask
      autoHeight
      handler
      swipeToClose
      maskClosable
      onClose={onClose}
      className="z-[9999]"
    >
      <Box className="mb-5">
        <SheetTitle title="Thông tin quà tặng" onClose={onClose} />
        <Box className="flex mt-2 mx-4">
          <img src={GiftBoxImage} className="h-[50px] w-[50px]" />
          <Box className="mx-4">
            <Text className="font-bold text-lg">{nameGift}</Text>
            {gift?.subscriptionDetailDTO?.quantity ? (
              <Text>Số lượng: {gift.subscriptionDetailDTO.quantity}</Text>
            ) : (
              <></>
            )}
            {gift?.subscriptionDetailDTO?.quantity ? (
              <Text>Đã sử dụng: {gift.giftTotalUsed}</Text>
            ) : (
              <></>
            )}
            {gift?.expiredDate ? (
              <Text>
                Hạn sử dụng: {displayDate(new Date(gift.expiredDate || ""))}
              </Text>
            ) : (
              <></>
            )}
            {gift?.subscriptionDetailDTO?.giftMoney ? (
              <Box className="mt-2">
                <Text className="font-semibold">Ưu đãi:</Text>
                <Text className="text-sm">
                  + Giảm giá đơn hàng:{" "}
                  {formatCurrencyVND(gift.subscriptionDetailDTO?.giftMoney)}
                </Text>
              </Box>
            ) : null}
            {gift?.subscriptionDetailDTO?.limit ||
            gift?.subscriptionDetailDTO?.minimumOrderPrice ? (
              <Text className="font-semibold">Điều kiện:</Text>
            ) : null}
            {gift?.subscriptionDetailDTO?.limit ? (
              <Text className="text-sm">
                + Giới hạn mỗi lần nhận: {gift.subscriptionDetailDTO.limit} sản
                phẩm
              </Text>
            ) : null}
            {gift?.subscriptionDetailDTO?.minimumOrderPrice ? (
              <Text className="text-sm">
                + Giá trị đơn hàng tối thiểu:{" "}
                {formatCurrencyVND(
                  gift.subscriptionDetailDTO.minimumOrderPrice
                )}
              </Text>
            ) : null}
          </Box>
        </Box>
        {submit && (
          <Box className="mt-8 mx-4">
            <Button
              className="w-full rounded-xl p-4"
              disabled={disableButton}
              onClick={handleSubmit}
            >
              {gift?.subscriptionDetailDTO?.type
                ? getNameButton(gift.subscriptionDetailDTO.type)
                : ""}
            </Button>
          </Box>
        )}
      </Box>
    </Sheet>,
    document.body
  );
};

export default GiftSheet;
