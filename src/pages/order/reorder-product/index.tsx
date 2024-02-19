import React from "react";
import { useQuery } from "react-query";
import { Box, Page, useNavigate } from "zmp-ui";

import HeaderSecond from "components/header/header-second";
import ProductItem from "components/product/product-item";
import { productService } from "services/product-service";
import { QueryKey } from "types/api";
import { PATH_NAME } from "constants/router";

const ReorderProductPage = () => {
  const navigate = useNavigate();

  const { data: allProductPaid } = useQuery(
    [QueryKey.PRODUCT_PAID],
    async () => await productService.getAllProductsPaid()
  );

  return (
    <Page className="flex flex-col bg-background">
      <HeaderSecond title="Mua lại" showBackIcon={true} />
      <Box className="overflow-auto scrollbar-hide">
        <Box className="grid grid-cols-2 gap-2 p-4 pt-0 mt-2">
          {allProductPaid?.map((product) => (
            <ProductItem
              product={product}
              key={product.id}
              onClick={() =>
                product?.id && navigate(`${PATH_NAME.PRODUCT}/${product.id}`)
              }
            />
          ))}
        </Box>
      </Box>
    </Page>
  );
};

export default ReorderProductPage;
