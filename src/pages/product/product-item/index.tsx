import React from "react";
import { TouchOpacity } from "zalo-ui";
import { Box, Text } from "zmp-ui";

import { Product } from "models/product";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";
import NoImage from "assets/images/no-image.png";

interface ProductItemProps {
  product: Product;
  onClick?: () => void;
}

const ProductItem = ({ product, onClick }: ProductItemProps) => {
  const {
    name,
    price,
    oldPrice,
    newProduct,
    image,
    images,
    salePriceBackup,
    addyImageUrl,
  } = product;

  return (
    <TouchOpacity
      className="bg-background relative flex flex-col items-center border-[1px] border-slate-100 rounded-lg justify-between pb-1 overflow-hidden"
      onClick={() => onClick?.()}
    >
      <img
        src={addyImageUrl || image || images?.[0] || NoImage}
        className="object-cover w-full"
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = NoImage;
        }}
      />
      {newProduct && (
        <Box className="absolute top-0 left-1 bg-red-color sale-tag">
          <Text className="text-background px-[5px] text-[8px] font-semibold py-1">
            NEW
          </Text>
        </Box>
      )}
      <Box className="flex flex-col items-center">
        <Text className="px-[8px] text-center font-normal mt-2 text-[15px] leading-[17px] line-clamp-2">
          {name}
        </Text>
        <Box className="flex flex-col items-center">
          {(oldPrice && oldPrice > 0) ||
          (salePriceBackup && salePriceBackup > 0) ? (
            <Text className="text-grey-color font-normal mr-2 text-[11px] line-through">
              {formatCurrencyVND(getOldPriceProduct(oldPrice, salePriceBackup))}
            </Text>
          ) : (
            <></>
          )}
          <Text className="font-medium mr-2 text-primary-color text-[15px] ml-[2px]">
            {formatCurrencyVND(price || 0)}
          </Text>
        </Box>
      </Box>
    </TouchOpacity>
  );
};

export default ProductItem;
