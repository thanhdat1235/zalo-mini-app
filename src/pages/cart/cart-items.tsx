import React from "react";
import { Box, Checkbox, Text } from "zmp-ui";

import { QuantityPicker } from "components/product/quantity-picker";
import { PATH_NAME } from "constants/router";
import { Cart } from "models/cart";
import { useNavigate } from "react-router-dom";
import { cartService } from "services/cart-service";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";
import { TouchOpacity } from "zalo-ui";
import NoImage from "assets/images/no-image.png";

interface CartItemsProps {
  cart: Cart;
  onSelect: (id: number) => void;
  onDelete?: (cart: Cart) => void;
  selectedItem: number[];
  refetchCart?: () => void;
}

export const CartItems = ({
  cart,
  onSelect,
  onDelete,
  selectedItem,
  refetchCart,
}: CartItemsProps) => {
  const { id, product, quantity } = cart;

  const navigate = useNavigate();

  const handleChangeCartItemQuantity = (quantity: number) => {
    cartService.updateCartItem({ id, quantity }).then(() => refetchCart?.());
  };

  const handleNavigateProduct = () => {
    navigate(`${PATH_NAME.PRODUCT}/${product.id}`);
  };

  return (
    <Box className="m-4 p-4 flex items-center rounded-xl bg-background">
      <Checkbox
        size="small"
        value={0}
        checked={selectedItem.indexOf(id) !== -1}
        onChange={() => onSelect(id)}
      />
      <img
        src={
          product?.addyImageUrl ||
          product?.image ||
          product?.images?.[0] ||
          NoImage
        }
        className="block w-1/4 min-w-[30%] h-[100px] object-cover"
        alt="product-detail"
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = NoImage;
        }}
      />
      <Box className="ml-2 w-full max-w-[70%]">
        <Text
          className="line-clamp-3 font-normal text-[14px]"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigateProduct();
          }}
        >
          {product.name || ""}
        </Text>
        <Box className="flex items-end my-2">
          <Text className="text-[14px] font-normal mr-2">
            {formatCurrencyVND(product.price || 0)}
          </Text>
          {(product?.oldPrice && product.oldPrice > 0) ||
          (product?.salePriceBackup && product.salePriceBackup > 0) ? (
            <Text className="text-[10px] line-through text-gray">
              {formatCurrencyVND(
                getOldPriceProduct(product.oldPrice, product.salePriceBackup)
              )}
            </Text>
          ) : (
            <></>
          )}
        </Box>
        <Box className="flex justify-between">
          <QuantityPicker
            value={quantity}
            onChange={handleChangeCartItemQuantity}
            size="small"
          />
          <TouchOpacity
            className="text-[12px] font-bold text-red-color py-1 px-2"
            onClick={() => onDelete?.(cart)}
          >
            Xóa
          </TouchOpacity>
        </Box>
      </Box>
    </Box>
  );
};
