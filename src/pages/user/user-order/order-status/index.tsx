import React, { useEffect, useRef } from "react";
import { InfiniteData } from "react-query";
import { Box, Text, useNavigate, useSnackbar } from "zmp-ui";

import codeOrder from "assets/svg/code-order.svg";
import orderDate from "assets/svg/order-date.svg";
import orderProduct from "assets/svg/order-product.svg";
import orderTotal from "assets/svg/total-order.svg";
import LoaderBottom from "components/loader-bottom";
import { BoxSkeleton } from "components/skeletons";
import { PATH_NAME } from "constants/router";
import {
  Order,
  OrderStatus as OrderStatusType,
  ReorderStatus,
} from "models/orders";
import { orderService } from "services/order-service";
import { ListResponse } from "types/api";
import { addDays, displayDate } from "utils/date";
import { formatCurrencyVND } from "utils/number";
import { TouchOpacity } from "zalo-ui";

interface OrderProps {
  data: InfiniteData<ListResponse<Order>> | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
}

const OrderStatus = ({ data, isLoading, isFetchingNextPage }: OrderProps) => {
  const navigate = useNavigate();

  const { openSnackbar, closeSnackbar } = useSnackbar();
  const timmerId = useRef();

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    [],
  );

  const handleReorderOrder = async (
    productQuantity: number,
    id: string,
    productIds: (number | undefined)[],
  ) => {
    if (id) {
      const reorderStatus = await orderService.reorderOrderByNhanhVnId(id);
      const pageSize =
        10 * (Number.parseInt((productQuantity / 10).toString()) + 1);

      if (reorderStatus === ReorderStatus.SUCCESS) {
        navigate(
          `${PATH_NAME.CART}?pageSize=${pageSize}&productIds=${productIds?.join(
            ",",
          )}`,
        );
      } else {
        openSnackbar({
          text: "Mua lại đơn hàng thất bại",
          type: "error",
          icon: true,
          duration: 2000,
        });
      }
    }
  };

  const getStatusOrder = (status: OrderStatusType) => {
    switch (status) {
      case OrderStatusType.NEW:
      case OrderStatusType.WAITING_CONFIRM:
        return {
          status: "Chờ xác nhận",
          color: "#FFC107", // Màu vàng
        };
      case OrderStatusType.WAITING_PICKUP:
        return {
          status: "Chờ lấy hàng",
          color: "#2196F3", // Màu xanh dương
        };
      case OrderStatusType.SHIPPING:
        return {
          status: "Đang giao",
          color: "#FF9800", // Màu cam
        };
      case OrderStatusType.SUCCESS:
        return {
          status: "Hoàn thành",
          color: "#4CAF50", // Màu xanh lá cây
        };
      case OrderStatusType.CANCELED:
        return {
          status: "Đã huỷ",
          color: "#F44336", // Màu đỏ
        };
      case OrderStatusType.RETURNED:
        return {
          status: "Trả hàng",
          color: "#F44336", // Màu đỏ
        };
      default:
        return {
          status: "",
          color: "",
        };
    }
  };

  return (
    <Box className="px-4 bg-background pb-2">
      <Box className="grid grid-cols-1 gap-y-2 overflow-auto">
        {isLoading ? (
          <>
            <OrderStatusSkeleton />
            <OrderStatusSkeleton />
            <OrderStatusSkeleton />
          </>
        ) : data &&
          Number.isInteger(data.pages?.[0]?.totalElements) &&
          data.pages[0].totalElements > 0 ? (
          <>
            {data.pages.map((orders) => {
              return orders?.content?.map((order) => {
                const orderStatus = getStatusOrder(
                  order?.status || OrderStatusType.SUCCESS,
                );

                return (
                  <Box
                    key={order.id}
                    className={`h-auto rounded-[16px] pt-[16px] pr-[12px] pb-[7px] pl-[13px] border-[1px] border-[#D5D5D5] border-solid`}
                  >
                    <Box className="flex items-center justify-between mb-2">
                      <Text className="text-[14px] text-[#858688] leading-[18px] flex items-center">
                        <img className="mr-[6px]" src={codeOrder} alt="" />
                        Mã đơn hàng:&nbsp;
                        <strong className="text-text-second-color text-[13px]">{`#${order.id}`}</strong>
                      </Text>
                      <Box
                        className={`px-3 py-1 text-xs rounded-2xl border`}
                        style={{
                          color: orderStatus.color,
                          borderColor: orderStatus.color,
                        }}
                      >
                        {orderStatus.status}
                      </Box>
                    </Box>
                    <Text className="text-[14px] text-[#858688] leading-[18px] flex items-center mb-[8px]">
                      <img className="mr-[6px]" src={orderDate} alt="" />
                      Ngày giao hàng:&nbsp;
                      <strong className="text-text-second-color text-[13px]">
                        {displayDate(
                          addDays(new Date(order.createdDate || ""), 3),
                        )}{" "}
                        -{" "}
                        {displayDate(
                          addDays(new Date(order.createdDate || ""), 5),
                        )}
                      </strong>
                    </Text>
                    <Text className="text-[14px] text-[#858688] leading-[18px] flex items-start mb-[8px]">
                      <img className="mr-[6px]" src={orderProduct} alt="" />
                      Sản phẩm:&nbsp;
                      <Box className="flex flex-[3]">
                        {order?.productDTOs?.length === 1
                          ? order?.productDTOs?.[0]?.name || ""
                          : order.productDTOs?.length
                          ? `${order.productDTOs?.[0]?.name || ""} và ${
                              order.productDTOs.length - 1
                            } sản phẩm khác.`
                          : ""}
                      </Box>
                    </Text>
                    <Text className="text-[14px] text-[#858688] leading-[18px] flex items-center mb-[8px]">
                      <img src={orderTotal} className="mr-[6px]" alt="" />
                      Tổng trị giá:&nbsp;
                      <strong className="text-text-second-color text-[13px]">
                        {order.totalMoney
                          ? formatCurrencyVND(order.totalMoney)
                          : ""}
                      </strong>
                    </Text>
                    <Box
                      className={`grid grid-cols-1 gap-2 mt-[12px] ${
                        order.status === OrderStatusType.SUCCESS &&
                        "grid-cols-2"
                      }`}
                    >
                      <TouchOpacity
                        onClick={() =>
                          navigate(`${PATH_NAME.ORDER}/${order.id}`)
                        }
                        className="border border-primary flex justify-center items-center text-center border-solid text-[#2D2D2D] font-medium rounded-md py-[7px]"
                      >
                        <Box>Xem chi tiết</Box>
                      </TouchOpacity>
                      {order.status === OrderStatusType.SUCCESS && (
                        <TouchOpacity
                          onClick={() =>
                            handleReorderOrder(
                              order.quantity || 0,
                              order?.nhanhVnId || "",
                              order?.productDTOs?.map((item) => item.id) || [],
                            )
                          }
                        >
                          <Box className="rounded-md z-0 py-2 px-6 bg-primary text-white text-center flex justify-center items-center">
                            Mua lại
                          </Box>
                        </TouchOpacity>
                      )}
                    </Box>
                  </Box>
                );
              });
            })}
          </>
        ) : (
          <Text className="text-center text-[15px] text-gray font-medium mt-[40px]">
            Hiện tại không có đơn hàng nào
          </Text>
        )}
      </Box>
      {isFetchingNextPage && <LoaderBottom />}
    </Box>
  );
};

const OrderStatusSkeleton = () => {
  return (
    <Box className="border border-background-primary rounded-lg bg-background p-4">
      <BoxSkeleton className="h-[20px]" />
      <BoxSkeleton className="h-[20px] mt-1" />
      <BoxSkeleton className="h-[20px] mt-1" />
      <BoxSkeleton className="h-[20px] mt-1" />
      <Box className="grid grid-cols-2 gap-2 mt-2">
        <BoxSkeleton className="h-[35px]" />
        <BoxSkeleton className="h-[35px]" />
      </Box>
    </Box>
  );
};

export default OrderStatus;
