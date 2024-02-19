import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Text } from "zmp-ui";

import IconGiftBox from "assets/images/giftbox.png";
import { OrderRequest } from "models/orders";
import {
  SubscriptionCustomerDetail,
  SubscriptionDetailType,
} from "models/subscription";
import { RootState } from "redux/store";
import { displayDate } from "utils/date";
import { formatCurrencyVND } from "utils/number";
import { TouchOpacity } from "zalo-ui";

interface SubscriptionGiftItemProps {
  gift: SubscriptionCustomerDetail;
  onOpenGiftSheet?: () => void;
  onSelectGift?: () => void;
  onOpenModalUseGift?: () => void;
}

const SubscriptionGiftItem = ({
  gift,
  onOpenGiftSheet,
  onOpenModalUseGift,
}: SubscriptionGiftItemProps) => {
  const {
    id,
    expiredDate,
    giftDescription,
    giftQuantity,
    giftTotalUsed,
    canUseGift,
    subscriptionDetailDTO,
  } = gift;

  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );

  const nameGift = useMemo(() => {
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
          giftDescription || subscriptionDetailDTO?.productName
        }`;
      case SubscriptionDetailType.GIFT_MONEY:
        return `Quà ${subscriptionDetailDTO.description}`;
      default:
        return "Quà tặng";
    }
  }, [subscriptionDetailDTO]);

  const exitsGiftSelected = useMemo(() => {
    return order.subscriptionGifts?.find((item) => item.giftId === id);
  }, [order.subscriptionGifts]);

  return (
    <Box>
      <Box className="relative bg-background border-b-[0.5px] border-gray/[.15]" onClick={() => onOpenModalUseGift?.()}>
        {exitsGiftSelected && (
          <div className="absolute right-2 top-2 rounded-xl px-2 py-1 bg-red-500">
            <Text className="text-white font-bold text-[13px]">{`Đã chọn (${exitsGiftSelected.quantity})`}</Text>
          </div>
        )}
        <Box
          className={`flex items-center py-4 pl-4 shadow-md ${
            exitsGiftSelected && "bg-slate-200"
          } ${!canUseGift && "opacity-40"}`}
        >
          <div className="w-[30px]">
            <img src={IconGiftBox} alt="icon gift box" />
          </div>
          <div className="ml-3 flex flex-col justify-between w-full">
            <p className="font-bold line-clamp-2 mr-[85px]">{nameGift}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-light mt-1">
                  Hạn sử dụng {displayDate(new Date(expiredDate || ""))}
                </p>
                <p className="text-xs font-light mt-1">
                  {subscriptionDetailDTO?.nhanhVnProductCategoryId
                    ? `Hạn mức: ${formatCurrencyVND(
                        giftTotalUsed || 0
                      )}/${formatCurrencyVND(giftQuantity || 0)}`
                    : `Số lượng đã được sử dụng: ${giftTotalUsed}/${giftQuantity}`}
                </p>
              </div>
              <Box className="flex mr-2">
                <TouchOpacity
                  className="text-white text-xs py-2 px-2 bg-primary rounded-lg"
                  onClick={() => onOpenModalUseGift?.()}
                >
                  Sử dụng
                </TouchOpacity>
                <TouchOpacity
                  className="text-white text-xs py-2 px-2 bg-primary rounded-lg ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenGiftSheet?.();
                  }}
                >
                  Điều kiện
                </TouchOpacity>
              </Box>
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default SubscriptionGiftItem;
