import { ga4 } from "components/app";
import ProductItem from "components/product/product-item";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { Product } from "models/product";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TouchOpacity } from "zalo-ui";
import { Box, Icon, Text } from "zmp-ui";

interface ProductComboProps {
  banner?: string;
  products?: Product[];
  nhanhVnId?: string;
}

const ProductCombo = ({ banner, products }: ProductComboProps) => {
  const navigate = useNavigate();

  const handelClick = () => {
    navigate(PATH_NAME.COMBO_ADVANTAGE_PACKS);

    ga4.trackEvent(EVENT_ACTION.SUBSCRIPTION.LOAD_MORE, {
      search_term: {},
    });
  };

  return (
    <Box className="relative bg-background">
      <TouchOpacity onClick={handelClick}>
        <img src={banner} className="object-cover mt-[2px]" />
      </TouchOpacity>
      <Box className="p-1.5 flex items-center self-end justify-end rounded-lg">
        <TouchOpacity
          onClick={handelClick}
          className="p-1.5 flex items-center bg-background-primary rounded-lg"
        >
          <Text className="font-medium text-[12px]" onClick={handelClick}>
            Xem thêm
          </Text>
          <Icon icon="zi-chevron-right" className="font-bold" />
        </TouchOpacity>
      </Box>
      <Box className="grid grid-cols-2 gap-3 px-2 bg-background py-2">
        {Array.isArray(products) &&
          products.length > 0 &&
          products.map((product, index) => (
            <ProductItem key={index} product={product} />
          ))}
      </Box>
    </Box>
  );
};

export default ProductCombo;
