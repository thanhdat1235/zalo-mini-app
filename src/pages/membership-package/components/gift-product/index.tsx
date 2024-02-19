import IconCheck from "assets/svg/check.svg";
import { SubscriptionDetail } from "models/subscription";
import React from "react";
import ListItem from "../list-item";

interface GiftProductProps {
  subscriptionDetail: SubscriptionDetail;
}

const GiftProduct = ({ subscriptionDetail }: GiftProductProps) => {
  return (
    <ListItem icon={IconCheck} value={`Free ship cho tất cả các đơn hàng`} />
  );
};

export default GiftProduct;
