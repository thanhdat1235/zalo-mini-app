import React, { useState } from "react";
import { Box, Icon, Text } from "zmp-ui";

import IconCoin from "assets/svg/coin.svg";
import CoinModal from "components/coin-modal";
import ToggleButton from "components/toggle-button";
import { CalculateRes, OrderRequest } from "models/orders";
import { Customer } from "models/user";
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "redux/slices/order-slice";
import { AppDispatch, RootState } from "redux/store";
import { formatCurrencyVND } from "utils/number";
import { TouchOpacity } from "zalo-ui";

interface OrderPaymentDetailProps extends CalculateRes {
  isShowUseCoin?: boolean;
}

const OrderPaymentDetail = (props: OrderPaymentDetailProps) => {
  const {
    shipDiscount = 0,
    shipFee = 0,
    totalAmount = 0,
    totalPayment = 0,
    totalShipFee = 0,
    totalMoneyDiscount = 0,
    totalMammyCoinReceive = 0,
    coinDiscount = 0,
    isShowUseCoin = false,
  } = props;

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );
  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );

  const [isShowShipDiscount, setIsShowShipDiscount] = useState(false);
  const [visibleCoinModel, setVisibleCoinModel] = useState<boolean>(false);

  const handleUseCoin = (useCoin: boolean) => {
    if (user.coin) {
      dispatch(
        setOrder({
          coin: useCoin ? user.coin : null,
        })
      );
    }
  };

  return (
    <Box className="text-base p-4 border-t border-gray/[.2] mt-3">
      <Text className="text-base">Thanh toán</Text>
      <Box>
        {isShowUseCoin && (
          <Box className="flex flex-row justify-between mt-2">
            <Box className="flex flex-row items-center">
              <span className="text-[13px] mr-1">
                {user?.coin && user.coin > 0
                  ? "Sử dụng điểm"
                  : "Bạn chưa có điểm thưởng"}
              </span>
              <TouchOpacity onClick={() => setVisibleCoinModel(true)}>
                <Icon
                  icon="zi-warning-circle"
                  className="text-primary w-[10px]"
                  size={15}
                />
              </TouchOpacity>
            </Box>
            <Box className="flex flex-row items-center">
              {user.coin ? (
                <Text className="text-[10px] font-normal mr-2 text-right">{`${
                  user.coin
                } điểm = ${formatCurrencyVND(user.coin * 1000)}`}</Text>
              ) : null}
              <ToggleButton
                value={order.coin ? true : false}
                setValue={(value) => handleUseCoin(value)}
              />
            </Box>
          </Box>
        )}

        <Box className="flex items-center justify-between my-3 mr-2">
          <Text className="text-[13px]">{`Tiền hàng (tạm tính)`}</Text>
          <Text className="text-[13px]">{`${formatCurrencyVND(
            totalAmount
          )}`}</Text>
        </Box>
        <Box>
          <TouchOpacity
            className="flex items-center justify-between my-3 mr-2"
            onClick={() => setIsShowShipDiscount(!isShowShipDiscount)}
          >
            <Text className="text-[13px]">Phí giao hàng</Text>
            <Box className="relative">
              <Text className="text-[13px]">{`${formatCurrencyVND(
                totalShipFee
              )}`}</Text>
              {shipDiscount > 0 && (
                <Box className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 pl-4">
                  <Icon
                    icon={`${
                      isShowShipDiscount ? "zi-chevron-up" : "zi-chevron-down"
                    }`}
                    size={12}
                  />
                </Box>
              )}
            </Box>
          </TouchOpacity>
          {isShowShipDiscount && shipDiscount > 0 && (
            <>
              <Box className="flex justify-between mr-2">
                <Text className="text-[11px] pl-3">Phí giao hàng</Text>
                <Text className="text-[11px] text-gray">
                  {formatCurrencyVND(shipFee || 0)}
                </Text>
              </Box>
              <Box className="flex justify-between mr-2">
                <Text className="text-[11px] pl-3">Giảm giá phí giao hàng</Text>
                <Text className="text-[11px] text-primary-color">
                  - {formatCurrencyVND(shipDiscount || 0)}
                </Text>
              </Box>
            </>
          )}
        </Box>
        <Box className="flex items-center justify-between my-3 mr-2">
          <Text className="text-[13px]">Giảm giá</Text>
          <Text className="text-[13px]">{`${formatCurrencyVND(
            totalMoneyDiscount
          )}`}</Text>
        </Box>
        <Box className="flex items-center justify-between my-3 mr-2">
          <Text className="text-[13px]">Giảm giá từ điểm thưởng</Text>
          <Text className="text-[13px]">{`${formatCurrencyVND(
            coinDiscount
          )}`}</Text>
        </Box>
        {totalMammyCoinReceive > 0 && (
          <Box className="flex items-center justify-between my-3 mr-2">
            <Text className="text-[13px]">Thưởng Mămmy Xu</Text>
            <Text className="text-[13px] flex items-center">
              {totalMammyCoinReceive}
              <img
                src={IconCoin}
                alt="icon coin"
                className="h-3 w-3 text-primary ml-1"
              />
            </Text>
          </Box>
        )}
        <Box className="flex items-center justify-between my-3 mr-2">
          <Text className="font-bold">Tổng cộng</Text>
          <Text className="text-base font-bold">{`${formatCurrencyVND(
            totalPayment
          )}`}</Text>
        </Box>
      </Box>
      <CoinModal
        visible={visibleCoinModel}
        onClose={() => setVisibleCoinModel(false)}
        onConfirm={() => {
          handleUseCoin(true);
          setVisibleCoinModel(false);
        }}
      />
    </Box>
  );
};

export default OrderPaymentDetail;
