import React, { useState } from "react";
import { Box, Button, Sheet, Text } from "zmp-ui";

import IconCheck from "assets/svg/check.svg";
import { SubscriptionDTO } from "models/subscription";
import { useQuery } from "react-query";
import { subscriptionService } from "services/subscription-service";
import { QueryKey } from "types/api";
import ListItem from "../../list-item";
import SheetTitle from "../sheet-title";

interface SubscriptionInfoProps {
  onContinue: () => void;
  onClose: () => void;
  disable?: boolean;
  data: SubscriptionDTO;
}

const SubscriptionInfo = ({
  onContinue,
  onClose,
  disable = false,
  data,
}: SubscriptionInfoProps) => {
  const [isShow, setIsShow] = useState<boolean>(true);

  const { data: subscription } = useQuery(
    [QueryKey.SUBSCRIPTION_BY_ID],
    async () => await subscriptionService.getSubscriptionById(data.id!),
    {
      enabled: Boolean(data.id),
    }
  );

  return (
    <Sheet
      visible={isShow}
      onClose={() => {
        setIsShow(false);
        onClose();
      }}
      swipeToClose
      maskClosable
      autoHeight
    >
      <Box className="mx-4">
        <SheetTitle
          title={`${data.name}`}
          onClose={() => {
            setIsShow(false);
            onClose();
          }}
        />
        <Box className="my-2 mx-4">
          <Box>
            <Text className="text-lg">{data.tagLine}</Text>
          </Box>
          <ListItem
            icon={IconCheck}
            value={`Thời hạn dùng ${data.month} tháng`}
          />
          {data?.price && data.price > 0 ? (
            <ListItem
              icon={IconCheck}
              value={`Có quà tặng cho đơn hàng từ ${data.price / 1000}k`}
            />
          ) : null}
          {data?.freeShip ? (
            <ListItem
              icon={IconCheck}
              value={`Free ship cho tất cả các đơn hàng`}
            />
          ) : null}
          {data?.subscriptionDetailDTOs?.length &&
          data.subscriptionDetailDTOs.length > 0 ? (
            <ListItem
              icon={IconCheck}
              value={`Được tặng ${data.subscriptionDetailDTOs?.length} sản phẩm quà tặng:`}
            />
          ) : null}
          {subscription?.subscriptionDetailDTOs?.map((sub) =>
            sub.description ? (
              <ListItem
                key={sub.id}
                icon={IconCheck}
                value={`${sub.description}`}
              />
            ) : null
          )}
        </Box>
        <Button
          className="h-[50px] w-full text-xl mt-3 rounded-xl mb-5"
          disabled={disable}
          onClick={() => {
            setIsShow(false);
            onContinue();
          }}
        >
          Mua ngay
        </Button>
      </Box>
    </Sheet>
  );
};

export default SubscriptionInfo;
