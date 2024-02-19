import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Icon, Page, useSnackbar } from "zmp-ui";

import IconPencil from "assets/svg/pencil.svg";
import PaymentMethodBottomSheet, {
  PaymentMethodBottomSheetRefs,
} from "components/bottom-sheet/payment-method-bottom-sheet";
import { globalLoading } from "components/global-loading";
import { globalModal } from "components/global-modal";
import HeaderSecond from "components/header/header-second";
import { PATH_NAME } from "constants/router";
import {
  OrderPaymentMethod as OrderPaymentMethodModel,
  OrderRequest,
} from "models/orders";
import { Product } from "models/product";
import { setCartItemSelected } from "redux/slices/cart-slice";
import { resetOrder, setOrder, setTotalAmount } from "redux/slices/order-slice";
import {
  setVoucherByCodeSelected,
  setVoucherSystemSelected,
} from "redux/slices/voucher-slice";
import { AppDispatch, RootState } from "redux/store";
import { orderService } from "services/order-service";
import { productService } from "services/product-service";
import { subscriptionService } from "services/subscription-service";
import { QueryKey } from "types/api";
import { TouchOpacity } from "zalo-ui";
import OrderPaymentDetail from "../components/order-payment-detail";
import OrderPaymentMethod from "../components/order-payment-method";
import OrderProduct from "../components/order-product";
import OrderUserInfo from "../components/order-user-info";
import { Step } from "../order-form";
import PaymentDetailPromotion from "./payment-detail-promotion";
import PaymentDetailShip from "./payment-detail-ship";
import SubscriptionGiftApply from "./subscription-gift";
import { OrderPaymentMethod as OrderPaymentMethodStatus } from "models/orders";
import Gifts from "../components/gifts";
import { getUserInfoSystem } from "redux/slices/user-slice";

const PaymentDetail = () => {
  const navigate = useNavigate();

  const [productQuickBuy, setProductQuickBuy] = useState<Product>();

  const { openSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();

  const paymentMethodRef = useRef<PaymentMethodBottomSheetRefs>(null);

  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );

  const { data: orderCalculate } = useQuery(
    [QueryKey.CALCULATE, order],
    async () => {
      try {
        globalLoading.show();
        const calculateResponse = await orderService.getCalculateOrder({
          cartIds: order.cartIds || null,
          nhanhVnProductId: order.nhanhVnProductId || null,
          quantity: order.quantity || null,
          voucherIds: order.voucherIds || null,
          coin: order.coin || null,
          customerVoucherCode: order.customerVoucherCode || null,
          subscriptionGifts: order.subscriptionGifts || null,
        });

        if (calculateResponse?.totalAmount)
          dispatch(setTotalAmount(calculateResponse.totalAmount));

        return calculateResponse;
      } catch (error) {
        throw error;
      } finally {
        globalLoading.hide();
      }
    },
    {
      enabled: Boolean(
        order.quantity ||
          order.nhanhVnProductId ||
          order.voucherIds ||
          order.cartIds ||
          order.coin ||
          order.voucherIds ||
          order.customerVoucherCode
      ),
    }
  );

  const { data: mySubscriptionRes } = useQuery(
    [QueryKey.MY_SUBSCRIPTION],
    async () => await subscriptionService.getMySubscriptions()
  );

  useEffect(() => {
    handleGetSelectQuantityProduct();
  }, [order?.nhanhVnProductId]);

  useEffect(() => {
    handleChangePrice();
  }, [order?.id]);

  const handleChangePrice = async () => {
    const isChangePrice = await changeProductPriceChange();
    if (isChangePrice) {
      globalModal.show({
        title: "Giá sản phẩm đã thay đổi",
        description:
          "Chương trình flash sale hoặc chương trình giảm giá đã kết thúc",
        isShowBtnAccept: true,
      });
    }
  };

  const changeProductPriceChange = async () => {
    const dataRequest = getInfoProductPriceChange();
    if (Object.keys(dataRequest).length > 0) {
      try {
        const isChangePrice = await productService.productPriceChanged(
          dataRequest
        );
        return isChangePrice;
      } catch (error) {
        console.log(error);
        return false;
      }
    }

    return false;
  };

  const getInfoProductPriceChange = () => {
    let dataRequest = {};
    if (order.nhanhVnProductId && order.price) {
      dataRequest = {
        [`${order.nhanhVnProductId}`]: order.price,
      };
    } else if (Array.isArray(order.carts) && order.carts.length > 0) {
      order.carts.forEach((cart) => {
        dataRequest = {
          ...dataRequest,
          [`${cart.product.nhanhVnId}`]: cart.product.price,
        };
      });
    }

    return dataRequest;
  };

  const handleGetSelectQuantityProduct = async () => {
    try {
      globalLoading.show();
      if (order?.id) {
        const productQuickBuy = await productService.getProductById(order.id);

        productQuickBuy && setProductQuickBuy(productQuickBuy);
      }
    } catch (err) {
    } finally {
      globalLoading.hide();
    }
  };

  const handleSubmitSelectPayment = (type: OrderPaymentMethodModel) => {
    dispatch(
      setOrder({
        paymentMethod: type,
      })
    );
  };

  const handleCreateOrder = async () => {
    try {
      globalLoading.show();
      const response = await orderService.createOrder({
        cartIds: order.cartIds || null,
        nhanhVnProductId: order.nhanhVnProductId || null,
        quantity: order.quantity || null,
        paymentMethod: order.paymentMethod,
        customerDTO: order.customerDTO,
        voucherIds: order.voucherIds || null,
        subscriptionGifts: order.subscriptionGifts || null,
        coin: order.coin || null,
        customerVoucherCode: order.customerVoucherCode || "",
      });
      openSnackbar({
        icon: true,
        text: "Đặt hàng thành công",
        type: "success",
      });
      dispatch(resetOrder({}));
      dispatch(setCartItemSelected([]));
      dispatch(setVoucherByCodeSelected({}));
      dispatch(setVoucherSystemSelected({}));
      if (order.paymentMethod === OrderPaymentMethodStatus.COD) {
        navigate(PATH_NAME.PAYMENT_THANKS);
      } else {
        navigate(`${PATH_NAME.PAYMENT_RESULT}/${response.id}`, {
          replace: true,
        });
      }
    } catch (error) {
      console.log(error);
      openSnackbar({
        icon: true,
        text: "Có lỗi xảy ra khi đặt hàng, vui lòng kiểm tra lại",
        type: "error",
      });
    } finally {
      globalLoading.hide();
      dispatch(getUserInfoSystem());
    }
  };

  const handleOrder = async () => {
    try {
      globalLoading.show();
      const isChangePrice = await changeProductPriceChange();
      if (!isChangePrice) {
        handleCreateOrder();
      } else {
        globalModal.show({
          title: "Giá sản phẩm đã thay đổi",
          description:
            "Chương trình flash sale hoặc chương trình giảm giá đã kết thúc",
          isShowBtnAccept: true,
          isShowBtnCancel: true,
          onAccept: handleCreateOrder,
        });
      }
    } catch (error) {
      console.log(error);
      globalLoading.hide();
      openSnackbar({
        icon: true,
        text: "Có lỗi xảy ra khi đặt hàng, vui lòng kiểm tra lại",
        type: "error",
      });
    }
  };

  const address = useMemo(() => {
    return [
      order.customerDTO?.address,
      order?.customerDTO?.ward,
      order?.customerDTO?.district,
      order?.customerDTO?.city,
    ]
      .filter((value) => Boolean(value))
      .join(", ");
  }, [order]);

  return (
    <Page className="flex-1 flex flex-col bg-background-primary">
      <HeaderSecond title="Thanh toán" showBackIcon={true} />
      <Box className="overflow-auto">
        <Step information paymentMethod finish />
        <Box className="m-4 rounded-2xl bg-background relative">
          <Box className="absolute top-2 right-4">
            <TouchOpacity
              className="bg-[#9BD929] p-2 rounded-full bg-opacity-10"
              onClick={() => navigate(-2)}
            >
              <img src={IconPencil} alt="icon pencil" />
            </TouchOpacity>
          </Box>
          <OrderUserInfo order={{ ...order }} address={address} />
          <OrderProduct
            carts={order.carts || []}
            products={
              productQuickBuy
                ? [
                    {
                      ...productQuickBuy,
                      orderQuantity: order?.quantity || 1,
                      existInDatabase: true,
                    },
                  ]
                : []
            }
          />
          <PaymentDetailShip />
          <PaymentDetailPromotion />
          <Box className="border-b border-gray/[.2]"></Box>
          {mySubscriptionRes && Object.keys(mySubscriptionRes).length > 0 && (
            <SubscriptionGiftApply />
          )}
          <Box className="border-b border-gray/[.2]"></Box>
          <Gifts gifts={orderCalculate?.gifts} />
          <Box className="border-b border-gray/[.2]"></Box>
          <OrderPaymentMethod
            isEdit
            paymentMethod={order.paymentMethod}
            onChange={() => paymentMethodRef.current?.onOpen()}
          />
          <OrderPaymentDetail {...orderCalculate} isShowUseCoin={true} />
        </Box>
        <PaymentMethodBottomSheet
          ref={paymentMethodRef}
          onSubmit={handleSubmitSelectPayment}
        />
        <Box className="p-4">
          <Button className=" w-full relative rounded-xl" onClick={handleOrder}>
            Xác nhận
            <Icon
              icon="zi-arrow-right"
              className="absolute top-1/2 right-[10%] translate-y-[-50%]"
            />
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default PaymentDetail;
