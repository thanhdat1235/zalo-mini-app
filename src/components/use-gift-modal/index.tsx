import { OrderRequest } from "models/orders";
import { Product } from "models/product";
import {
  SubscriptionCustomerDetail,
  SubscriptionDetailType,
  SubscriptionGiftUseRequest,
} from "models/subscription";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDeleteSubscriptionById,
  setSubscriptionGifts,
  setSubscriptionProductGifts,
} from "redux/slices/order-slice";
import { AppDispatch, RootState } from "redux/store";
import { categoryService } from "services/category-service";
import { formatCurrencyVND } from "utils/number";
import { Modal, TouchOpacity } from "zalo-ui";
import { Box, Button, Icon, Text } from "zmp-ui";

interface UseGiftModalProps {
  visible?: boolean;
  gift: SubscriptionCustomerDetail;
  onClose?: () => void;
}

interface ProductSelected {
  product: Product;
  quantity: number;
}

const UseGiftModal = ({ visible, gift, onClose }: UseGiftModalProps) => {
  const { subscriptionDetailDTO, giftDescription, limit } = gift;

  const dispatch = useDispatch<AppDispatch>();

  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );
  const [quantityUse, setQuantityUse] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsSelected, setProductsSelected] = useState<ProductSelected[]>(
    []
  );

  const totalMoneyGift = useMemo(() => {
    let totalMoney = 0;
    productsSelected.forEach((item) => {
      if (item.product.price) {
        totalMoney += item.product.price * item.quantity;
      }
    });
    return totalMoney;
  }, [productsSelected]);

  useEffect(() => {
    if (Array.isArray(order.subscriptionGifts)) {
      const giftExits = order.subscriptionGifts.find(
        (item) => item.giftId === gift.id
      );
      if (giftExits) {
        setQuantityUse(giftExits.quantity);
      } else {
        setQuantityUse(0);
      }
    }
  }, [order.subscriptionGifts, gift, visible]);

  useEffect(() => {
    if (!visible) {
      setQuantityUse(0);
      setProductsSelected([]);
    }
  }, [visible]);

  useEffect(() => {
    if (Array.isArray(order.subscriptionGifts)) {
      const productGifts: ProductSelected[] = [];
      order.subscriptionGifts.forEach((subGift) => {
        if (subGift.nhanhVnProductId && gift.id === subGift.giftId) {
          productGifts.push({
            product: { nhanhVnId: subGift.nhanhVnProductId },
            quantity: subGift.quantity,
          });
        }
      });
      setProductsSelected([...productGifts]);
    }
  }, [order.subscriptionGifts, gift]);

  useEffect(() => {
    if (
      gift.subscriptionDetailDTO?.type === SubscriptionDetailType.GIFT_MONEY &&
      gift.subscriptionDetailDTO.nhanhVnProductCategoryId
    ) {
      handleGetProductsByCategory(
        gift.subscriptionDetailDTO.nhanhVnProductCategoryId
      );
    }
  }, [gift]);

  const handleGetProductsByCategory = async (
    nhanhVnProductCategoryId: string
  ) => {
    try {
      const categories = await categoryService.getCategoryById(
        nhanhVnProductCategoryId
      );
      if (Array.isArray(categories.products)) {
        setProducts(categories.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        return `${subscriptionDetailDTO.description}`;
      default:
        return "Quà tặng";
    }
  }, [gift]);

  const maximumQuantity = (
    quantityUse: number,
    limit: number | undefined,
    giftTotalUsed: number,
    giftQuantity: number
  ) => {
    if (limit) {
      if (quantityUse + giftTotalUsed < giftQuantity && quantityUse < limit) {
        return false;
      }
    } else {
      if (quantityUse + giftTotalUsed < giftQuantity) {
        return false;
      }
    }

    return true;
  };

  const getLimitUseGift = useMemo(() => {
    switch (subscriptionDetailDTO?.type) {
      case SubscriptionDetailType.GIFT_MONEY:
        return (
          <>
            {gift?.subscriptionDetailDTO?.giftMoney ? (
              <Text>{`+ Số tiền tặng: ${formatCurrencyVND(
                gift.subscriptionDetailDTO.giftMoney
              )}`}</Text>
            ) : null}
            <Text>{`+ Số lượng sử dụng tối đa mỗi lần nhận: ${
              limit || "(không giới hạn)"
            }`}</Text>
            {gift.subscriptionDetailDTO?.giftMoney ? (
              <Text>
                + Tổng tiền đã sử dụng:{" "}
                <span className="">{`${formatCurrencyVND(
                  gift.giftTotalUsed || 0
                )}/${formatCurrencyVND(
                  gift.subscriptionDetailDTO?.giftMoney || 0
                )}`}</span>
              </Text>
            ) : null}
          </>
        );
      case SubscriptionDetailType.PRODUCT:
      case SubscriptionDetailType.VOUCHER:
        return (
          <>
            <Text>
              {`+ Số lượng sử dụng tối đa mỗi lần nhận: ${
                limit || "(không giới hạn)"
              }`}
              {maximumQuantity(
                quantityUse,
                limit,
                gift.giftTotalUsed || 0,
                gift.giftQuantity || 0
              ) ? (
                <span className="text-[12px] ml-1 text-red-400">{`(Đã đạt số lượng tối đa)`}</span>
              ) : null}
            </Text>
            <Text>{`+ Số lượng quà đã sử dụng: ${gift.giftTotalUsed}/${gift.giftQuantity}`}</Text>
          </>
        );
      default:
        return "";
    }
  }, [gift, quantityUse]);

  const isUsed = useMemo(() => {
    return order.subscriptionGifts?.some((item) => item.giftId === gift.id);
  }, [order.subscriptionGifts, visible]);

  const handleMinus = () => {
    if (quantityUse >= 1) {
      setQuantityUse(quantityUse - 1);
    }
  };

  const handlePlus = () => {
    if (limit === 0) {
      return;
    } else if (
      !limit &&
      subscriptionDetailDTO?.quantity &&
      subscriptionDetailDTO?.quantity > quantityUse
    ) {
      setQuantityUse(quantityUse + 1);
    } else if (limit && subscriptionDetailDTO?.quantity) {
      if (limit > quantityUse && subscriptionDetailDTO.quantity > quantityUse) {
        setQuantityUse(quantityUse + 1);
      }
    }
  };

  const onConfirm = () => {
    if (
      gift.subscriptionDetailDTO?.type === SubscriptionDetailType.GIFT_MONEY
    ) {
      const productGifts: SubscriptionGiftUseRequest[] = [];
      productsSelected.forEach((item) => {
        if (gift.id && item.quantity) {
          productGifts.push({
            giftId: gift.id,
            quantity: item.quantity,
            nhanhVnProductId: item.product.nhanhVnId,
          });
        }
      });
      dispatch(setSubscriptionProductGifts(productGifts));
      setProductsSelected([]);
    } else {
      dispatch(
        setSubscriptionGifts({
          giftId: gift?.id,
          quantity: quantityUse,
          nhanhVnProductId: "",
        })
      );
      setQuantityUse(0);
    }
    onClose?.();
  };

  const onCancelGift = () => {
    dispatch(
      setDeleteSubscriptionById({
        giftId: gift.id,
      })
    );
    onClose?.();
  };

  const RenderPickProduct = () => {
    const handleMinus = (product: Product) => {
      const exitsProductIndex = productsSelected.findIndex(
        (item) => item.product.nhanhVnId === product.nhanhVnId
      );
      if (exitsProductIndex !== -1) {
        const exitsProduct = productsSelected[exitsProductIndex];
        if (exitsProduct.quantity > 0) {
          productsSelected[exitsProductIndex].quantity--;
          setProductsSelected([...productsSelected]);
        } else {
          setProductsSelected([
            ...productsSelected.filter(
              (item) => item.product.nhanhVnId === product.nhanhVnId
            ),
          ]);
        }
      }
    };

    const handlePlus = (product: Product) => {
      if (product.price) {
        const giftMoney = gift.subscriptionDetailDTO?.giftMoney || 0;

        if (giftMoney >= totalMoneyGift + product.price) {
          const exitsProductIndex = productsSelected.findIndex(
            (item) => item.product.nhanhVnId === product.nhanhVnId
          );
          if (exitsProductIndex !== -1) {
            productsSelected[exitsProductIndex] = {
              ...productsSelected[exitsProductIndex],
              quantity: productsSelected[exitsProductIndex].quantity + 1,
            };
            setProductsSelected([...productsSelected]);
          } else {
            setProductsSelected([
              ...productsSelected,
              { product, quantity: 1 },
            ]);
          }
        }
      }
    };

    const disabledPlus = (price: number) => {
      let totalQuantity = 0;
      productsSelected.forEach((item) => {
        totalQuantity += item.quantity;
      });
      const giftMoney = gift.subscriptionDetailDTO?.giftMoney || 0;
      const giftTotalUsed = gift.giftTotalUsed || 0;
      if (limit) {
        if (
          totalQuantity < limit &&
          totalMoneyGift + giftTotalUsed + price < giftMoney
        ) {
          return false;
        }
      } else {
        if (totalMoneyGift + giftTotalUsed + price < giftMoney) {
          return false;
        }
      }
      return true;
    };

    return (
      <Box className="mt-2">
        {products.map((product) => {
          const exitsProductSelected = productsSelected.find(
            (item) => item.product.nhanhVnId === product.nhanhVnId
          );

          return (
            <Box
              key={product.id}
              className={`flex mb-1 flex-row border-[1px] border-slate-100 rounded-md pb-2 relative`}
            >
              <img src={product.image} className="w-[60px] h-[60px]" />
              <div className="px-1 flex flex-row w-full flex-1 justify-between">
                <Box className="flex flex-col flex-1 justify-between">
                  <p className="line-clamp-2 text-xs">{product.name}</p>
                  <p className="text-red-color font-bold text-sm">
                    {formatCurrencyVND(product.price || 0)}
                  </p>
                </Box>
                <Box className="flex flex-row items-center justify-center">
                  <TouchOpacity
                    onClick={() => handleMinus(product)}
                    disabled={
                      exitsProductSelected?.quantity
                        ? exitsProductSelected.quantity < 1
                        : true
                    }
                  >
                    <Icon
                      icon="zi-minus-circle-solid"
                      className="text-primary font-bold"
                      size={25}
                    />
                  </TouchOpacity>
                  <Text className="text-primary font-bold text-xl mx-2">
                    {exitsProductSelected?.quantity || 0}
                  </Text>
                  <TouchOpacity
                    onClick={() => handlePlus(product)}
                    disabled={disabledPlus(product.price || 0)}
                  >
                    <Icon
                      icon="zi-plus-circle-solid"
                      className="text-primary font-bold"
                      size={25}
                    />
                  </TouchOpacity>
                </Box>
              </div>
            </Box>
          );
        })}
      </Box>
    );
  };

  const RenderPickQuantity = () => {
    return (
      <Box className="flex flex-row items-center justify-center my-3">
        <TouchOpacity onClick={handleMinus} disabled={quantityUse < 1}>
          <Icon
            icon="zi-minus-circle-solid"
            className="text-primary font-bold"
            size={35}
          />
        </TouchOpacity>
        <Text className="text-primary font-bold text-2xl mx-2">
          {quantityUse}
        </Text>
        <TouchOpacity
          onClick={handlePlus}
          disabled={maximumQuantity(
            quantityUse,
            limit,
            gift.giftTotalUsed || 0,
            gift.giftQuantity || 0
          )}
        >
          <Icon
            icon="zi-plus-circle-solid"
            className="text-primary font-bold"
            size={35}
          />
        </TouchOpacity>
      </Box>
    );
  };

  return (
    <Modal
      visible={visible || false}
      onClose={onClose}
      onRequestClose={onClose}
      className="mx-4 min-w-[90%]"
    >
      <Box>
        <TouchOpacity
          className="p-[6px] absolute top-2 right-2 z-[9999]"
          onClick={onClose}
        >
          <Icon icon="zi-close" style={{ color: "black" }} size={18} />
        </TouchOpacity>
        <Box className="bg-background sticky top-0 z-[999] pb-2">
          <Text className="font-bold text-center mx-4">{nameGift || ""}</Text>
        </Box>
        <Box className="bg-background">
          <Box className="mt-5">
            {gift.subscriptionDetailDTO?.quantity ? (
              <Text>{`+ Số lượng quà tặng ${gift.subscriptionDetailDTO.quantity}`}</Text>
            ) : null}
            <Text>{getLimitUseGift}</Text>
            {gift.subscriptionDetailDTO?.type ===
            SubscriptionDetailType.GIFT_MONEY ? (
              <>
                <Text className="font-normal">{`Lựa chọn sản phẩm:`}</Text>
                {totalMoneyGift ? (
                  <Text className="text-[12px]">{`( Tổng tiền sản phẩm đã chọn: ${formatCurrencyVND(
                    totalMoneyGift
                  )} )`}</Text>
                ) : null}
              </>
            ) : null}
          </Box>
        </Box>
        <Box>
          {gift.subscriptionDetailDTO?.type ===
          SubscriptionDetailType.GIFT_MONEY ? (
            <RenderPickProduct />
          ) : (
            <RenderPickQuantity />
          )}
        </Box>
        <Box className="flex gap-2 w-full sticky bottom-0">
          {isUsed && (
            <Button
              className="rounded-lg mt-4 w-full text-center"
              type="danger"
              size="medium"
              onClick={onCancelGift}
            >
              Huỷ s/d quà
            </Button>
          )}
          <Button
            className="rounded-lg mt-4 w-full"
            size="medium"
            disabled={!(productsSelected.length > 0) && !(quantityUse > 0)}
            onClick={onConfirm}
          >
            Xác nhận
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UseGiftModal;
