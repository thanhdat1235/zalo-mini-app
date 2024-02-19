import HeaderSearch from "components/header/header-search";
import LoaderBottom from "components/loader-bottom";
import { ProductSkeletonSearch } from "components/skeletons";
import { PAGE_DEFAULT } from "constants/defaultValue";
import useDebounce from "hooks/useDebounce";
import React, { useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { productService } from "services/product-service";
import { QueryKey } from "types/api";
import { PageScrollView } from "zalo-ui";
import { Box } from "zmp-ui";
import { SearchResult } from "./result";

const SearchPage = () => {
  const isFetchNextPage = useRef<boolean>(false);
  const searchInputRef = useRef<any>();
  const [keyword, setKeyword] = useState<string>("");
  const searchText = useDebounce(keyword, 500);

  const {
    data: searchResult,
    fetchNextPage,
    isLoading,
    isFetchingNextPage: isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QueryKey.PRODUCT_SEARCH, searchText],
    queryFn: async ({ pageParam = 0 }) => {
      const params = {
        name: searchText,
        pageIndex: pageParam,
        pageSize: PAGE_DEFAULT,
      };
      const response = await productService.products(params);
      isFetchNextPage.current = false;
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) {
        return lastPage.pageable.pageNumber + 1;
      }
      return undefined;
    },
  });

  const handleLoadMoreSearchResult = () => {
    if (!isFetchNextPage.current) {
      isFetchNextPage.current = true;
      fetchNextPage();
    }
  };

  return (
    <PageScrollView
      renderHeader={
        <HeaderSearch
          showBackIcon={true}
          ref={searchInputRef}
          autoFocus={true}
          onSearch={(value) => setKeyword(value)}
        />
      }
      scrollToTop
      targetIdScroll="search-list"
      scrollToTopClassName="bottom-4 left-2"
      onLoadMore={handleLoadMoreSearchResult}
    >
      <Box id="search-list" className="overflow-auto flex-1">
        {!isLoading ? (
          <SearchResult results={searchResult} keyword={keyword} />
        ) : (
          <ProductSkeletonSearch />
        )}
        {isFetchingNextPage && (
          <Box className="flex bg-background items-center w-full">
            <LoaderBottom />
          </Box>
        )}
      </Box>
    </PageScrollView>
  );
};

export default SearchPage;
