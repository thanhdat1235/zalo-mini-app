import React from "react";
import { TouchOpacity } from "zalo-ui";
import { Box, Text } from "zmp-ui";

import NoImage from "assets/images/no-image.png";
import { Product } from "models/product";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";

const ProductItem = ({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) => {
  const {
    id,
    name,
    oldPrice,
    image,
    price,
    newProduct,
    images,
    addyImageUrl,
    salePriceBackup,
  } = product;

  return (
    <TouchOpacity
      key={`${id}`}
      className="bg-background relative flex flex-col items-center border-[1px] border-slate-100 rounded-lg justify-between pb-1 overflow-hidden"
      onClick={onClick}
    >
      <img
        src={addyImageUrl || image || images?.[0] || NoImage}
        className="object-cover w-full"
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = NoImage;
        }}
      />
      {(salePriceBackup !== -1 || newProduct) && (
        <Box className="absolute top-0 left-1 bg-red-color sale-tag w-[14%] flex items-center justify-center">
          <Text className="text-background text-[8px] font-semibold py-1">
            {salePriceBackup !== -1 ? "HOT" : "NEW"}
          </Text>
        </Box>
      )}
      <Box className="flex flex-col items-center">
        <Text className="px-[8px] text-center font-normal mt-2 text-[15px] leading-[17px] line-clamp-2">
          {name || ""}
        </Text>
        <Box className="flex flex-row items-center">
          <Text className="text-grey-color font-normal text-center text-[10px] line-through">
            {formatCurrencyVND(getOldPriceProduct(oldPrice, salePriceBackup))}
          </Text>
          <Text className="font-normal text-primary-color text-center text-[15px] ml-[2px]">
            {formatCurrencyVND(price || 0)}
          </Text>
        </Box>
      </Box>
    </TouchOpacity>
  );
};

export default ProductItem;
