import React, { useState } from "react";
import { Box, Text } from "zmp-ui";
import { useInfiniteQuery } from "react-query";

import IconCart from "assets/svg/bottom-menu/cart.svg";
import IconCartActive from "assets/svg/bottom-menu/cart-active.svg";
import { QueryKey } from "types/api";
import { cartService } from "services/cart-service";

interface CartIconProps {
  isActive?: boolean;
}

const CartIcon = ({ isActive }: CartIconProps) => {
  const { data } = useInfiniteQuery([QueryKey.CART], async () => {
    return await cartService.getCart();
  });

  return (
    <Box className="relative">
      {isActive ? <img src={IconCartActive}></img> : <img src={IconCart}></img>}
      {data?.pages?.[0].totalElements && data.pages[0].totalElements > 0 ? (
        <Box className="absolute -right-3 -top-[3px] p-[2px] bg-background rounded-full">
          <Text
            className="w-4 h-4 bg-red-500 rounded-full text-white"
            size="xxxxSmall"
          >
            {data.pages[0].totalElements}
          </Text>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default CartIcon;
