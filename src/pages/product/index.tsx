import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { TouchOpacity } from "zalo-ui";
import { Box, Button, Page, Text } from "zmp-ui";

import NoImage from "assets/images/no-image.png";
import SearchIcon from "assets/svg/search.svg";
import { ga4 } from "components/app";
import { HeaderPrimary } from "components/header/header-primary";
import LoaderBottom from "components/loader-bottom";
import SelectQuantityProduct from "components/product/quick-buy";
import { CategorySkeleton, ProductSkeleton } from "components/skeletons";
import { EVENT_ACTION } from "constants";
import { PAGE_DEFAULT } from "constants/defaultValue";
import { PATH_NAME } from "constants/router";
import useAddURLParams from "hooks/useAddURLParam";
import useDebounce from "hooks/useDebounce";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import useURLParams from "hooks/useURLParams";
import { Product as ProductModel } from "models/product";
import { categoryService } from "services/category-service";
import { productService } from "services/product-service";
import { QueryKey } from "types/api";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";

interface ProductItemProps {
  product: ProductModel;
  onBuy?(): void;
  onNavigate?(): void;
}

const ProductItem = (props: ProductItemProps) => {
  const { product, onBuy } = props;
  const [productImage, setProductImage] = useState<string>(
    product?.image || ""
  );

  useEffect(() => {
    let imgStr: any[] = [
      product?.image,
      ...(product?.images || []),
      product?.addyImageUrl,
    ];

    if (
      product?.attributes &&
      Array.isArray(product.attributes) &&
      product?.attributes.length > 0
    ) {
      for (let i = 0; i < product?.attributes.length; i++) {
        const productAttribute = product.attributes[i];

        imgStr.push(productAttribute.image, productAttribute.images);
      }
    }

    const firstImage = imgStr.filter((img) => Boolean(img))?.[0];
    setProductImage(firstImage);

    setProductImage(firstImage || NoImage);
  }, [product]);

  return (
    <>
      <TouchOpacity
        className="flex relative bg-background pr-2 mb-2 items-center min-h-[130px] border-b-[1px] border-b-slate-100"
        onClick={() => props.onNavigate?.()}
      >
        {(product?.oldPrice &&
          product?.price &&
          product.oldPrice > product.price) ||
        product.comboCategory ? (
          <Box className="absolute top-0 left-1 w-6 h-10">
            <Box className="bg-primary-color w-full sale-tag">
              <Text className="text-[7px] text-center text-white uppercase py-[3px]">
                sale
              </Text>
            </Box>
          </Box>
        ) : (
          <></>
        )}
        <Box className="w-[40%] h-full flex items-center object-cover">
          <img
            src={productImage}
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = NoImage;
            }}
          />
        </Box>
        <Box className="ml-2 flex flex-col flex-1 min-h-[130px] bg-background justify-between">
          <Box className="flex-1 my-3 h-full">
            <Text className="text-sm line-clamp-2">{product.name}</Text>
          </Box>
          <Box className="mb-2">
            <Box className="flex items-start">
              <Text className="text-primary-color mr-3">
                {formatCurrencyVND(product.price || 0)}
              </Text>
              {(product?.oldPrice && product.oldPrice > 0) ||
              (product?.salePriceBackup && product.salePriceBackup > 0) ? (
                <Text className="text-[10px] text-gray line-through">
                  {formatCurrencyVND(
                    getOldPriceProduct(
                      product.oldPrice,
                      product.salePriceBackup
                    )
                  )}
                </Text>
              ) : (
                <></>
              )}
            </Box>
            <TouchOpacity
              className="mt-1"
              onClick={(e) => {
                e.stopPropagation();
                onBuy?.();
              }}
            >
              <Button size="small" className="rounded-md w-full">
                Mua ngay
              </Button>
            </TouchOpacity>
          </Box>
        </Box>
      </TouchOpacity>
    </>
  );
};

const Product = () => {
  const navigate = useNavigate();

  const isFetchNextProductPage = useRef<boolean>(false);
  const isFetchNextCategoryPage = useRef<boolean>(false);

  const [valueSearch, setValueSearch] = useState("");
  const queryText = useDebounce(valueSearch, 500);
  const { categoryId } = useURLParams();
  const addParamsToURL = useAddURLParams();

  const [isOpenPopupQuickBuy, setIsOpenPopupQuickBuy] = useState(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();

  const {
    data: productData,
    fetchNextPage: fetchNextPageProduct,
    isLoading: isLoadingProduct,
    isFetchingNextPage: isFetchingNextPageProduct,
  } = useInfiniteQuery(
    [QueryKey.PRODUCT, categoryId, queryText],
    async ({ pageParam = 0 }) => {
      const params = {
        pageIndex: pageParam,
        pageSize: PAGE_DEFAULT,
        nhanhVnCategoryId: categoryId,
        name: queryText,
        isIgnoreAttribute: true,
        isGift: false, // not get product is gift
      };

      const response = await productService.products(params);
      isFetchNextProductPage.current = false;
      handleTrackingSearch(queryText);
      return response;
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.last) {
          return lastPage.pageable.pageNumber + 1;
        }
        return undefined;
      },
    }
  );

  const { data: categoryData, isLoading: isLoadingCategory } = useQuery(
    [QueryKey.CATEGORY],
    async () => {
      const response = await categoryService.categories();
      handleScrollIntoView(categoryId);
      isFetchNextCategoryPage.current = false;
      return response;
    }
  );

  useInfiniteScroll(() => handleLoadMoreProduct(), "product-list");

  const handleScrollIntoView = (elementId: string) => {
    if (elementId) {
      const element = document.getElementById(elementId);
      element?.scrollIntoView();
    }
  };

  const handleLoadMoreProduct = () => {
    if (!isFetchNextProductPage.current) {
      isFetchNextProductPage.current = true;
      fetchNextPageProduct();
    }
  };

  const handelClickProductItem = (id: number) => {
    navigate(`${PATH_NAME.PRODUCT}/${id}`);

    ga4.trackEvent(EVENT_ACTION.PRODUCT.CLICK, {
      search_term: { id },
    });
  };

  const handelClickCategoryItem = (categoryId: string) => {
    addParamsToURL({ categoryId: categoryId });

    ga4.trackEvent(EVENT_ACTION.CATEGORY_PRODUCT.CLICK, {
      search_term: { id: categoryId },
    });
  };

  const handleTrackingSearch = (keyword: string) => {
    try {
      ga4.trackEvent(EVENT_ACTION.PRODUCT.SEARCH, {
        search_term: { keyword: keyword },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page className="overflow-hidden product-page">
      <HeaderPrimary title={"Sản phẩm"} />
      <Box className="border-none rounded-full h-search-input flex items-center justify-center">
        <Box className="bg-background flex items-center rounded-full border border-gray/[.2] mx-4 mt-4 px-4 w-full">
          <img src={SearchIcon} className="w-5 object-contain" />
          <input
            value={valueSearch}
            autoFocus={false}
            onChange={(e) => setValueSearch(e.target.value)}
            placeholder="Tìm nhanh sản phẩm ..."
            className="rounded-full text-sm h-[36px] pl-5 outline-none border-none bg-transparent w-full"
          />
        </Box>
      </Box>
      <Box className="mt-2 product__grid relative">
        <Box
          id="category-list"
          className="sticky top-0 z-10 overflow-auto scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            scrollSnapAlign: "start",
          }}
        >
          {isLoadingCategory ? (
            <>
              {[...Array(8)].map((__, index) => (
                <CategorySkeleton key={index} />
              ))}
            </>
          ) : (
            <>
              <TouchOpacity
                className={`flex flex-col items-center py-4 px-1 category ${
                  !categoryId
                    ? "category_active bg-background text-primary"
                    : "bg-background-primary"
                }`}
                onClick={() => addParamsToURL({ categoryId: "" })}
              >
                <Text className="font-medium text-[12px] ml-2 text-center">
                  TẤT CẢ
                </Text>
              </TouchOpacity>
              {categoryData?.map((category) => (
                <TouchOpacity
                  key={category.nhanhVnId}
                  className={`flex flex-col items-center py-4 px-1 category ${
                    categoryId === category.nhanhVnId
                      ? "category_active bg-background text-primary"
                      : "bg-background-primary"
                  }`}
                  onClick={() =>
                    category.nhanhVnId &&
                    handelClickCategoryItem(category.nhanhVnId)
                  }
                >
                  <Text className="font-medium text-[12px] ml-2 text-center">
                    {`${category.name}`}
                    {category.name?.toLocaleUpperCase() === "COMBO" && (
                      <span className="mt-[-4px] text-red-color">*</span>
                    )}
                  </Text>
                </TouchOpacity>
              ))}
            </>
          )}
        </Box>
        <Box
          id="product-list"
          className="bg-background mb-2 overflow-auto pb-4"
        >
          {isLoadingProduct ? (
            <>
              {[...Array(6)].map((__, index) => (
                <ProductSkeleton key={index} />
              ))}
            </>
          ) : (
            <>
              {productData?.pages?.map((page) =>
                page.content.map((item, index) => (
                  <ProductItem
                    key={index}
                    product={item}
                    onBuy={() => {
                      setProductSelected(item);
                      setIsOpenPopupQuickBuy(true);
                    }}
                    onNavigate={() =>
                      item?.id && handelClickProductItem(item.id)
                    }
                  />
                ))
              )}
              {isFetchingNextPageProduct && <LoaderBottom />}
              {productData?.pages?.[0].totalElements === 0 && (
                <Box className="flex-1 flex justify-center items-center pb-24 mt-4">
                  <Text size="xSmall" className="text-gray">
                    Không có dữ liệu sản phẩm
                  </Text>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
      <SelectQuantityProduct
        isVisible={isOpenPopupQuickBuy}
        onClose={() => setIsOpenPopupQuickBuy(false)}
        product={productSelected}
        showAttribute
      />
    </Page>
  );
};

export default Product;
