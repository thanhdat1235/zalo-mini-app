import { ga4 } from "components/app";
import ProductItem from "components/product/product-item";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { Product } from "models/product";
import React from "react";
import { InfiniteData } from "react-query";
import { useNavigate } from "react-router";
import { ListResponse } from "types/api";
import { Box, Text } from "zmp-ui";

export interface ResultProps {
  results?: InfiniteData<ListResponse<Product>>;
  keyword?: string;
}

export const SearchResult = ({ results, keyword }: ResultProps) => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`${PATH_NAME.PRODUCT}/${id}`);

    ga4.trackEvent(EVENT_ACTION.PRODUCT.CLICK, {
      search_term: { id: id },
    });
  };

  return (
    <Box flex flexDirection="column" className="bg-background relative ">
      <Text.Title className="px-4 py-3 text-gray bg-[#eee]" size="small">
        {keyword !== ""
          ? `${
              results?.pages && results?.pages[0].totalElements
            } kết quả tìm kiếm`
          : "Gợi ý cho bạn"}
      </Text.Title>
      <Box>
        <Box className="px-4 grid grid-cols-2 relative mb-4 gap-2 py-2">
          {results?.pages.map((page) =>
            page.content.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onClick={() => product?.id && handleClick(product.id)}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};
