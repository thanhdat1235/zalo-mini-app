import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { PageScrollView, TouchOpacity } from "zalo-ui";
import { Box, Icon, Text, useSnackbar } from "zmp-ui";
import { SnackbarOptions } from "zmp-ui/snackbar-provider";

import Preview from "components/gallery/preview";
import { globalLoading } from "components/global-loading";
import HeaderSecond from "components/header/header-second";
import ModelConfirm from "components/model-confirm";
import { OrderDetailSkeleton } from "components/skeletons";
import { NAVIGATE_TYPE } from "constants";
import { PATH_NAME } from "constants/router";
import useURLParams from "hooks/useURLParams";
import { UploadMediaType } from "models/file-upload";
import {
  OrderStatus,
  OrderPaymentMethod as PaymentMethod,
} from "models/orders";
import { orderService } from "services/order-service";
import { UPLOAD_URL } from "services/url";
import { QueryKey } from "types/api";
import { DATE_FORMAT_DDMMYYYYTHHMMSS_DISPLAY, formatDate } from "utils/date";
import InvoiceTransferUploader from "../components/invoice-transfer-uploader";
import OrderPaymentDetail from "../components/order-payment-detail";
import OrderPaymentMethod from "../components/order-payment-method";
import OrderProduct from "../components/order-product";
import OrderUserInfo from "../components/order-user-info";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { type } = useURLParams();
  const { openSnackbar, closeSnackbar } = useSnackbar();
  const [visiblePaymentImage, setVisiblePaymentImage] =
    useState<boolean>(false);
  const timmerId = useRef();
  const [isShowModelCancelOrder, setIsShowModelCancelOrder] =
    useState<boolean>(false);

  useEffect(
    () => () => {
      closeSnackbar();
      clearInterval(timmerId.current);
    },
    []
  );

  const {
    isLoading,
    error,
    data: orderDetail,
    refetch: refetchOrder,
  } = useQuery({
    queryKey: [QueryKey.ORDER, id],
    queryFn: async () => {
      return await orderService.getOrderById(Number(id));
    },
  });

  const getStatusOrder = useMemo(() => {
    switch (orderDetail?.status) {
      case OrderStatus.NEW:
      case OrderStatus.WAITING_CONFIRM:
        return {
          status: "Chờ xác nhận",
          color: "#FFC107", // Màu vàng
        };
      case OrderStatus.WAITING_PICKUP:
        return {
          status: "Chờ lấy hàng",
          color: "#2196F3", // Màu xanh dương
        };
      case OrderStatus.SHIPPING:
        return {
          status: "Đang giao",
          color: "#FF9800", // Màu cam
        };
      case OrderStatus.SUCCESS:
        return {
          status: "Hoàn thành",
          color: "#4CAF50", // Màu xanh lá cây
        };
      case OrderStatus.CANCELED:
        return {
          status: "Đã huỷ",
          color: "#F44336", // Màu đỏ
        };
      case OrderStatus.RETURNED:
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
  }, [orderDetail]);

  const handleReorderOrder = async (
    productQuantity: number,
    id: string,
    productIds: (number | undefined)[]
  ) => {
    if (id) {
      try {
        globalLoading.show();
        await orderService.reorderOrderByNhanhVnId(id);
        const pageSize =
          10 * (Number.parseInt((productQuantity / 10).toString()) + 1);

        navigate(
          `${PATH_NAME.CART}?pageSize=${pageSize}&productIds=${productIds?.join(
            ","
          )}`
        );
      } catch (err) {
        openSnackbar({
          text: "Mua lại đơn hàng thất bại",
          type: "error",
          icon: true,
          duration: 2000,
        });
      } finally {
        globalLoading.hide();
      }
    }
  };

  const handleCancelOrder = async () => {
    if (orderDetail?.id) {
      try {
        globalLoading.show();
        await orderService.cancelOrder(orderDetail.id);
        refetchOrder();
        openSnackbar({
          text: "Hủy đơn hàng thành công",
          type: "success",
          icon: true,
          duration: 2000,
        });
      } catch (err) {
        openSnackbar({
          text: "Hủy đơn hàng thất bại",
          type: "error",
          icon: true,
          duration: 2000,
        });
      } finally {
        globalLoading.hide();
        setIsShowModelCancelOrder(false);
      }
    }
  };

  const handleBack = () => {
    if (type && type === NAVIGATE_TYPE.ZNS) {
      navigate(`${PATH_NAME.HOME}`, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const showSnackbar = (options: SnackbarOptions) => {
    openSnackbar({
      icon: true,
      duration: 2000,
      ...options,
    });
  };

  const address = useMemo(() => {
    return [
      orderDetail?.recipientAddress,
      orderDetail?.recipientWard,
      orderDetail?.recipientDistrict,
      orderDetail?.recipientCity,
    ]
      .filter((value) => Boolean(value))
      .join(", ");
  }, [orderDetail]);

  return (
    <PageScrollView
      renderHeader={
        <HeaderSecond
          title="Chi tiết đơn hàng"
          showBackIcon={true}
          onBack={handleBack}
        />
      }
    >
      {isLoading ? (
        <OrderDetailSkeleton />
      ) : (
        <Box className=" overflow-auto scrollbar-hide">
          <Box className="rounded-xl bg-background m-4">
            <Box className="border-b-2 border-dashed border-gray/[.2] pb-4 flex items-center justify-between p-4">
              <Box>
                <Box className="flex">
                  <Text className="text-gray mr-2 text-[13px]">
                    Mã đơn hàng:
                  </Text>
                  <Text className="font-bold text-[13px]">
                    #{orderDetail?.id}
                  </Text>
                </Box>
                <Box className="flex">
                  <Text className="text-gray mr-2 text-[13px]">Ngày đặt:</Text>
                  <Text className="font-bold text-[13px]">
                    {orderDetail?.createdDate &&
                      formatDate(
                        orderDetail.createdDate,
                        DATE_FORMAT_DDMMYYYYTHHMMSS_DISPLAY
                      )}
                  </Text>
                </Box>
              </Box>
              <Text
                className={`px-3 py-1 text-[13px] rounded-2xl border border-solid bg-opacity-10`}
                style={{
                  color: getStatusOrder.color,
                  borderColor: getStatusOrder.color,
                }}
              >
                {getStatusOrder.status}
              </Text>
            </Box>
            <OrderUserInfo order={{ ...orderDetail }} address={address} />
            <OrderProduct products={orderDetail?.productDTOs || []} />
            <OrderPaymentMethod
              isEdit={false}
              paymentMethod={orderDetail?.paymentMethod}
            />
            <OrderPaymentDetail {...orderDetail} />
            {orderDetail?.totalPayment
              ? orderDetail?.status &&
                (orderDetail.status === OrderStatus.WAITING_CONFIRM ||
                  orderDetail.status === OrderStatus.NEW) &&
                orderDetail.paymentMethod === PaymentMethod.GATEWAY && (
                  <Box className="m-4 -mt-2">
                    <InvoiceTransferUploader
                      id={orderDetail?.id}
                      serverUrl={`${UPLOAD_URL}?id=${id}&type=${UploadMediaType.ORDER}`}
                    />
                  </Box>
                )
              : null}
            <Box
              className={`py-5 mx-4 flex justify-between gap-2 -mt-6 ${
                orderDetail?.paymentImage && "grid-cols-2"
              }`}
            >
              {orderDetail?.paymentImage && (
                <TouchOpacity
                  className="w-full rounded-xl py-3 border border-gray text-gray text-center text-sm"
                  onClick={() => setVisiblePaymentImage(true)}
                >
                  Xem lại hóa đơn <Icon icon="zi-photo" />
                </TouchOpacity>
              )}
              {orderDetail?.status &&
                (orderDetail.status === OrderStatus.WAITING_CONFIRM ||
                  orderDetail.status === OrderStatus.NEW) && (
                  <TouchOpacity
                    className="w-full rounded-xl py-3 px-1 border border-primary-color text-primary-color text-center"
                    onClick={() => setIsShowModelCancelOrder(true)}
                  >
                    Hủy đơn hàng
                  </TouchOpacity>
                )}
              {orderDetail?.status === OrderStatus.SUCCESS && (
                <TouchOpacity
                  className="w-full rounded-xl py-3 px-1 bg-primary text-white text-center"
                  onClick={() =>
                    handleReorderOrder(
                      orderDetail?.quantity || 0,
                      orderDetail?.nhanhVnId || "",
                      orderDetail?.productDTOs?.map((item) => item.id) || []
                    )
                  }
                >
                  Mua lại đơn hàng
                </TouchOpacity>
              )}
            </Box>
            <ModelConfirm
              isVisible={isShowModelCancelOrder}
              title="Hủy đơn hàng"
              desc="Bạn có chắc muốn hủy đơn hàng này"
              onExit={() => setIsShowModelCancelOrder(false)}
              onConfirm={handleCancelOrder}
            />
            {orderDetail?.paymentImage && (
              <Preview
                isShowPreview={visiblePaymentImage}
                imageList={[
                  { url: orderDetail.paymentImage, alt: "payment image" },
                ]}
                action={(state: boolean) => setVisiblePaymentImage(state)}
              />
            )}
          </Box>
        </Box>
      )}
    </PageScrollView>
  );
};

export default OrderDetailPage;
