import { ga4 } from "components/app";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { Product } from "models/product";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";
import { TouchOpacity } from "zalo-ui";
import { Box, Text } from "zmp-ui";

const ComboItem = ({
  id,
  name,
  oldPrice,
  image,
  price,
  salePriceBackup,
}: Product) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${PATH_NAME.PRODUCT}/${id}`);

    ga4.trackEvent(EVENT_ACTION.PRODUCT.CLICK, {
      search_term: { id: id },
    });
  };

  return (
    <TouchOpacity
      className="bg-background-primary flex flex-col justify-between rounded-lg overflow-hidden"
      onClick={handleClick}
    >
      <img src={image} className="object-cover w-full" alt={name} />
      <Box className="flex flex-col items-center">
        <Text className="text-center font-normal mt-1 text-[13px]">{name}</Text>
        <Box className="flex flex-col flex-wrap ">
          <Text className="text-grey-color text-center font-normal text-[11px] line-through">
            {formatCurrencyVND(getOldPriceProduct(oldPrice, salePriceBackup))}
          </Text>
          <Text className="font-normal text-center text-red-color text-[18px] ml-[2px]">
            {formatCurrencyVND(price || 0)}
          </Text>
        </Box>
      </Box>
    </TouchOpacity>
  );
};

export default ComboItem;
