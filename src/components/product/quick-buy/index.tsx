import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Sheet, Text, useSnackbar } from "zmp-ui";

import NoImage from "assets/images/no-image.png";
import { ga4 } from "components/app";
import { globalLoading } from "components/global-loading";
import { QuantityPicker } from "components/product/quantity-picker";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { CalculateRes } from "models/orders";
import { Product } from "models/product";
import { setOrderByQuickBuy } from "redux/slices/order-slice";
import { AppDispatch } from "redux/store";
import { cartService } from "services/cart-service";
import { orderService } from "services/order-service";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";

export type SelectType = "cart" | "buy";

interface SelectQuantityProductProps {
  isVisible: boolean;
  onClose: () => void;
  product?: Product | null;
  type?: SelectType;
  quantity?: number;
  // onAddToCart?(quantity: number): void;
  onChangeQuantity?(quantity: number): void;
  onRefetchCart?: () => void;
  showAttribute?: boolean;
}

const SelectQuantityProduct = ({
  isVisible,
  onClose,
  product,
  type = "buy",
  onChangeQuantity,
  onRefetchCart,
  showAttribute = false,
}: SelectQuantityProductProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [productDetail, setProductDetail] = useState<Product>();
  const [orderCalculate, setOrderCalculate] = useState<CalculateRes>();

  useEffect(() => {
    if (
      product?.attributes &&
      Array.isArray(product.attributes) &&
      product.attributes.length > 0
    ) {
      setProductDetail(product.attributes[0]);
    } else if (product && Object.keys(product).length > 0) {
      setProductDetail(product);
    }
  }, [product]);

  useEffect(() => {
    isVisible && handleGetCalculate();
  }, [isVisible, productDetail?.id, productDetail?.nhanhVnId, quantity]);

  const handleGetCalculate = async () => {
    if (productDetail?.nhanhVnId) {
      const calculateResponse = await orderService.getCalculateOrder({
        cartIds: null,
        nhanhVnProductId: productDetail?.nhanhVnId || null,
        quantity: quantity || null,
        voucherIds: null,
      });

      setOrderCalculate(calculateResponse);
    }
  };

  const handleAddProductToCart = async (quantity: number) => {
    if (productDetail?.nhanhVnId) {
      await cartService.addCartItem(
        productDetail.nhanhVnId as string,
        quantity
      );
      openSnackbar({
        icon: true,
        text: "Đã thêm sản phẩm vào giỏ hàng.",
        type: "success",
        duration: 1500,
      });
      onRefetchCart?.();

      ga4.trackEvent(EVENT_ACTION.PRODUCT.ADD_TO_CART, {
        search_term: { id: productDetail.nhanhVnId },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      globalLoading.show();
      if (type === "buy") {
        dispatch(
          setOrderByQuickBuy({
            id: productDetail?.id,
            nhanhVnProductId: productDetail?.nhanhVnId,
            quantity: quantity,
            price: productDetail?.price,
          })
        );
        navigate(PATH_NAME.ORDER_FORM);
      } else {
        // onAddToCart && onAddToCart(quantity);
        handleAddProductToCart(quantity);
      }
      setQuantity(1);
    } catch (err) {
      openSnackbar({
        icon: true,
        type: "error",
        text: "Có lỗi xảy ra vui lòng thử lại.",
        duration: 1500,
      });
      console.log(err);
    } finally {
      onClose();
      globalLoading.hide();
    }
  };

  const handleChangeProductAttribute = (
    productAttribute?: Product | undefined | null
  ) => {
    if (productAttribute && Object.keys(productAttribute).length > 0) {
      setProductDetail(productAttribute);
    }
  };

  return createPortal(
    <Sheet
      visible={isVisible}
      onClose={() => onClose()}
      autoHeight
      mask
      maskClosable
      handler
      swipeToClose
    >
      <Box className="m-4">
        <Box className="flex items-center">
          <Box className="w-[30%] mr-4">
            <img
              src={
                productDetail?.image ||
                productDetail?.images?.[0] ||
                product?.addyImageUrl ||
                NoImage
              }
              alt="product img"
              className="w-full object-cover"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = NoImage;
              }}
            />
          </Box>
          <Box className="w-full">
            <Text className="text-[16px] line-clamp-3">
              {productDetail?.name}
            </Text>
            <Box className="flex items-start mt-2">
              <Text className="mr-2 font-bold text-primary-color">
                {formatCurrencyVND(productDetail?.price || 0)}
              </Text>
              {(productDetail?.oldPrice && productDetail.oldPrice > 0) ||
              (productDetail?.salePriceBackup &&
                productDetail.salePriceBackup > 0) ? (
                <Text className="line-through text-xs text-gray">
                  {formatCurrencyVND(
                    getOldPriceProduct(
                      productDetail.oldPrice,
                      productDetail.salePriceBackup
                    )
                  )}
                </Text>
              ) : (
                <></>
              )}
            </Box>
            <Box className="mt-2">
              <Text className="text-xs font-normal">{`Phí giao hàng: ${formatCurrencyVND(
                orderCalculate?.totalShipFee || 0
              )}`}</Text>
            </Box>
          </Box>
        </Box>
        <Box>
          {showAttribute &&
            product &&
            Array.isArray(product?.attributes) &&
            product?.attributes?.length > 0 && (
              <Box className="py-2 mt-[2px] bg-background">
                <p>Chọn {product?.attributeTypeName}:</p>
                <Box className="flex flex-wrap">
                  {product?.attributes.map((productAttribute) => (
                    <Box
                      onClick={() =>
                        handleChangeProductAttribute(productAttribute)
                      }
                      className={`mt-2 mr-2 border ${
                        productAttribute?.id === productDetail?.id
                          ? "border-gray/30"
                          : "bg-gray/10 border-gray/10"
                      } py-1 px-2 relative`}
                    >
                      {productAttribute?.id === productDetail?.id && (
                        <div
                          style={{
                            border: "5px solid",
                            borderColor:
                              "var(--zmp-primary-color) transparent transparent var(--zmp-primary-color)",
                          }}
                          className="absolute top-0 left-0"
                        ></div>
                      )}
                      {productAttribute?.attributeTypeName}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          {orderCalculate?.gifts && orderCalculate.gifts.length > 0 ? (
            <Box className="mt-2">
              <Text className="font-normal">Quà tặng: </Text>
              {orderCalculate?.gifts?.map((gift, index) => (
                <Box className="flex flex-row mt-1" key={index}>
                  <img
                    src={gift.image}
                    className="w-[50px] h-[50px] border-[0.1px] border-gray-second rounded-sm"
                  />
                  <Text className="font-normal ml-2">
                    <span className="text-[12px] text-red-500 border-[0.5px] p-[2px] border-red-500 rounded-md">
                      Quà tặng
                    </span>{" "}
                    {`${gift.name}`}
                  </Text>
                </Box>
              ))}
            </Box>
          ) : null}
        </Box>
        <Box className="mt-5">
          <Box className="flex items-center justify-between">
            Chọn số lượng sản phẩm:{" "}
            <QuantityPicker
              value={quantity}
              onChange={(value) => {
                setQuantity(value);
                onChangeQuantity?.(value);
              }}
              size="medium"
            />
          </Box>
          <Box className="mt-4">
            <Button className="w-full" size="medium" onClick={handleSubmit}>
              {type === "buy" ? "Mua ngay" : "Thêm vào giỏ hàng"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Sheet>,
    document.body
  );
};

export default SelectQuantityProduct;
