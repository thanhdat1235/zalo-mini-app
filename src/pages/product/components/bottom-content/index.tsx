import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Box, Text, useSnackbar } from "zmp-ui";

import ChatEmailIcon from "assets/images/chat-mail.png";
import CartIcon from "assets/svg/bottom-menu/cart.svg";
import SelectQuantityProduct, {
  SelectType,
} from "components/product/quick-buy";
import { PATH_NAME } from "constants/router";
import { Product } from "models/product";
import { cartService } from "services/cart-service";
import { zaloService } from "services/zalo-service";
import { QueryKey } from "types/api";
import { TouchOpacity } from "zalo-ui";
import { ga4 } from "components/app";
import { EVENT_ACTION } from "constants";

interface BottomContentProps {
  product?: Product | null;
  isFetching?: boolean;
  onShowQuickBuyModel?: (value: boolean) => void;
}

const BottomContent = ({
  product,
  isFetching,
  onShowQuickBuyModel,
}: BottomContentProps) => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const [visibleQuickBuy, setVisibleQuickBuy] = useState<boolean>(false);
  const [selectType, setSelectType] = useState<SelectType>("buy");

  const { data: cartResData, refetch: refetchCart } = useInfiniteQuery(
    [QueryKey.CART],
    async () => await cartService.getCart()
  );

  const handleAddProductToCart = async (quantity: number) => {
    if (product?.nhanhVnId) {
      await cartService.addCartItem(product.nhanhVnId as string, quantity);
      openSnackbar({
        icon: true,
        text: "Đã thêm sản phẩm vào giỏ hàng.",
        type: "success",
        duration: 1500,
      });
      refetchCart();

      ga4.trackEvent(EVENT_ACTION.PRODUCT.ADD_TO_CART, {
        search_term: { id: product.nhanhVnId },
      });
    }
  };

  const handleOpenChatScreen = async () => {
    await zaloService.openChatScreen();
  };

  const handleClickBuyNow = (nhanhVnId: string | number) => {
    setVisibleQuickBuy(true);
    onShowQuickBuyModel?.(false);

    ga4.trackEvent(EVENT_ACTION.PRODUCT.CLICK_BUY_NOW, {
      search_term: { id: nhanhVnId },
    });
  };

  return (
    <Box className="fixed bottom-0 left-0 right-0 flex bg-background py-2 items-center justify-evenly px-2  h-[var(--h-bottom-content)]">
      <Box className="flex">
        <TouchOpacity
          className="flex flex-col items-center"
          onClick={handleOpenChatScreen}
        >
          <img src={ChatEmailIcon} className="w-[26px] h-[26px]" />
          <Text className="text-[13px]">Tư vấn</Text>
        </TouchOpacity>
        <TouchOpacity
          className="flex flex-col relative items-center ml-4"
          onClick={() => navigate(PATH_NAME.CART)}
        >
          <img src={CartIcon} className="w-[26px] h-[26px]" />
          <Text className="text-[13px]">Giỏ hàng</Text>
          {cartResData?.pages?.[0]?.totalElements &&
          cartResData.pages[0].totalElements > 0 ? (
            <Box className="absolute top-0 right-[12px] bg-red-color h-[12px] w-auto min-w-[12px] p-[4px] flex items-center justify-center rounded-full ">
              <Text className="text-[9px] text-text-color font-bold text-center">
                {cartResData.pages[0].totalElements}
              </Text>
            </Box>
          ) : (
            <></>
          )}
        </TouchOpacity>
      </Box>
      <Box
        className={`flex flex-row ${
          isFetching && "opacity-25 pointer-events-none"
        }`}
      >
        <TouchOpacity
          className="bg-lime-100 px-4 py-3 rounded-l-full"
          onClick={() => {
            setSelectType("cart");
            setVisibleQuickBuy(true);
            onShowQuickBuyModel?.(false);
          }}
        >
          <Text className="text-[13px] font-medium text-black">
            Thêm vào giỏ hàng
          </Text>
        </TouchOpacity>
        <TouchOpacity
          className="flex items-center px-2 bg-primary rounded-r-full"
          onClick={() => {
            product?.nhanhVnId && handleClickBuyNow(product.nhanhVnId);
          }}
        >
          <Text className="text-[13px] text-center text-text-color font-bold">
            Mua ngay
          </Text>
        </TouchOpacity>
      </Box>
      <SelectQuantityProduct
        isVisible={visibleQuickBuy}
        product={product}
        onClose={() => {
          setSelectType("buy");
          setVisibleQuickBuy(false);
          onShowQuickBuyModel?.(true);
        }}
        type={selectType}
        // onAddToCart={(quantity: number) => handleAddProductToCart(quantity)}
        onRefetchCart={() => refetchCart()}
      />
    </Box>
  );
};

export default BottomContent;
