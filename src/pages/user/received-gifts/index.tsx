import GiftBoxImage from "assets/images/giftbox.png";
import HeaderSecond from "components/header/header-second";
import {
  SubscriptionCustomerDetail,
  SubscriptionDetailType,
} from "models/subscription";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { subscriptionService } from "services/subscription-service";
import { QueryKey } from "types/api";
import { formatCurrencyVND } from "utils/number";
import { TouchOpacity } from "zalo-ui";
import { Box, Page, Text } from "zmp-ui";
import GiftSheet from "../components/gift-sheet";

const ReceivedGifts = () => {
  const { data } = useQuery(QueryKey.RECEIVED_GIFTS, async () => {
    return await subscriptionService.getMyGifts();
  });

  const [visibleGiftSheet, setVisibleGiftSheet] = useState<boolean>(false);
  const [giftSelected, setGiftSelected] =
    useState<SubscriptionCustomerDetail>();
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const getDisableGift = (gift: SubscriptionCustomerDetail) => {
    switch (gift.subscriptionDetailDTO?.type) {
      case SubscriptionDetailType.PRODUCT:
      case SubscriptionDetailType.VOUCHER:
      case SubscriptionDetailType.INTRODUCE_GIFT_MONEY:
      case SubscriptionDetailType.GIFT_MONEY:
        return gift.giftQuantity === gift.giftTotalUsed;
      default:
        return false;
    }
  };

  const getNameGift = (gift: SubscriptionCustomerDetail) => {
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
        return `Quà ${subscriptionDetailDTO.description || ""}`;
      case SubscriptionDetailType.LINK:
        return `Quà tặng ${subscriptionDetailDTO.description || ""}`;
      default:
        return "Quà tặng";
    }
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background-primary">
      <HeaderSecond title="Quà tặng đã nhận" showBackIcon={true} />
      <Box className="px-2 py-4">
        {data && data?.length > 0 ? (
          data?.map((gift) => {
            const disable = getDisableGift(gift);
            return (
              <Box
                key={gift.id}
                className={`relative flex flex-row my-1.5 py-4 px-2 bg-background rounded-lg ${
                  disable && "opacity-50"
                }`}
              >
                <img src={GiftBoxImage} className="h-[60px] w-[60px]" />
                <Box>
                  <Box className="mx-2">
                    <Text className="font-normal mr-[90px]">
                      {getNameGift(gift)}
                    </Text>
                  </Box>
                  <TouchOpacity
                    className="absolute py-2 px-2 bg-primary right-1 bottom-1 rounded-lg"
                    onClick={() => {
                      setVisibleGiftSheet(true);
                      setDisableButton(disable);
                      setGiftSelected(gift);
                    }}
                  >
                    <Text className="font-normal text-white">Xem ngay</Text>
                  </TouchOpacity>
                </Box>
              </Box>
            );
          })
        ) : (
          <span className="text-center flex justify-center items-center text-[15px] text-gray font-medium mt-[40px]">
            Hiện tại không có quà tặng nào
          </span>
        )}
      </Box>
      <GiftSheet
        gift={giftSelected}
        disableButton={disableButton}
        visible={visibleGiftSheet}
        onClose={() => setVisibleGiftSheet(false)}
      />
    </Page>
  );
};

export default ReceivedGifts;
