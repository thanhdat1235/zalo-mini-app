import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "zmp-ui";

import { ga4 } from "components/app";
import ProductItem from "components/product/product-item";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { Product } from "models/product";

interface ProductGroupProps {
  nhanhVnCategoryId?: string;
  products: Product[];
  bannerUrl: string;
}

const ProductGroup = (props: ProductGroupProps) => {
  const navigate = useNavigate();

  const handleClick = (id?: number) => {
    navigate(`${PATH_NAME.PRODUCT}/${id}`);

    ga4.trackEvent(EVENT_ACTION.PRODUCT.CLICK, {
      search_term: { id: id },
    });
  };

  const handleClickBanner = (nhanhVnCategoryId: string | number) => {
    navigate(`${PATH_NAME.PRODUCT}?categoryId=${nhanhVnCategoryId}`);
  };

  return (
    <Box className="bg-background mt-1 pb-1">
      <Box>
        <img
          src={props.bannerUrl}
          className="w-full"
          onClick={() =>
            props?.nhanhVnCategoryId &&
            handleClickBanner(props.nhanhVnCategoryId)
          }
        />
      </Box>
      <Box className="py-2 mx-4 grid grid-cols-2 gap-2 ">
        {props?.products?.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onClick={() => product?.id && handleClick(product.id)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductGroup;
