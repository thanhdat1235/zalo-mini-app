import React from "react";
import { TouchOpacity } from "zalo-ui";
import { Button } from "zmp-ui";

import { CalculateRes } from "models/orders";
import { formatCurrencyVND } from "utils/number";

interface CartPreviewProps {
  calculatePrice?: CalculateRes;
  isDisable?: boolean;
  onSubmit?: () => void;
}

export const CartPreview = ({
  calculatePrice,
  isDisable,
  onSubmit,
}: CartPreviewProps) => {
  return (
    <div className="flex items-center mx-4 my-2 pb-2">
      <div className="mr-2 flex-1">
        <p className="text-right font-normal text-sm">
          Tổng thanh toán:{" "}
          <span className="text-red-color font-bold">
            {formatCurrencyVND(calculatePrice?.totalPayment || 0)}
          </span>
        </p>
        <p className="text-right font-normal text-[10px]">
          Tiết kiệm:{" "}
          <span className="text-red-color">
            {formatCurrencyVND(calculatePrice?.totalMoneyDiscount || 0)}
          </span>
        </p>
        <p className="text-right font-normal text-[10px]">
          Phí giao hàng:{" "}
          <span className="text-red-color">
            {formatCurrencyVND(calculatePrice?.totalShipFee || 0)}
          </span>
        </p>
      </div>
      <TouchOpacity onClick={onSubmit} disabled={isDisable}>
        <Button size="medium" className="font-bold !text-white">
          Đặt hàng
        </Button>
      </TouchOpacity>
    </div>
  );
};
