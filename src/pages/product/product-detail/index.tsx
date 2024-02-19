import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { PageScrollView, TouchOpacity } from "zalo-ui";
import { Box, Icon, Text } from "zmp-ui";

import NoImage from "assets/images/no-image.png";
import { ga4, queryClient } from "components/app";
import ButtonGroup from "components/button-group";
import Preview from "components/gallery/preview";
import HeaderPrimary from "components/header/header-second";
import LoaderBottom from "components/loader-bottom";
import { ProductDetailSkeleton } from "components/skeletons";
import { EVENT_ACTION, NAVIGATE_TYPE } from "constants";
import { PAGE_DEFAULT } from "constants/defaultValue";
import { PATH_NAME } from "constants/router";
import useURLParams from "hooks/useURLParams";
import { Product } from "models/product";
// import { SaleDiscountDetailDTO, SaleDiscountDetailDTOType } from "models/sale";
import {
  SaleDiscount,
  SaleDiscountDetailDTO,
  SaleDiscountDetailDTOType,
} from "models/sale";
import { productService } from "services/product-service";
import { saleService } from "services/sale-service";
import { zaloService } from "services/zalo-service";
import { QueryKey } from "types/api";
import { ShareCurrentPage } from "types/zmp-sdk";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";
import appConfig from "../../../../app-config.json";
import BottomContent from "../components/bottom-content";
import ProductItem from "../product-item";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { Customer } from "models/user";

interface MinMaxProductQuantity {
  minProductQuantity?: number;
  maxProductQuantity?: number;
  orderDiscountPercent?: number;
  orderDiscountMax?: number;
  type?: SaleDiscountDetailDTOType;
  discountPrice?: number;
  productGifts?: Product[];
}

interface MinOrderAmount {
  minOrderAmount?: number;
  productGifts?: Product[];
  maxQuantityPerUser?: number;
  orderDiscountPercent?: number;
  orderDiscountMax?: number;
  type?: SaleDiscountDetailDTOType;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { type } = useURLParams();
  const isFetchNextPage = useRef<boolean>(false);

  const navigate = useNavigate();

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );

  const [indexSlider, setIndexSlider] = useState<number>(1);
  const [productImages, setProductImages] = useState<string[]>();
  const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
  const [visibleBtnQuickBuy, setVisibleBtnQuickBuy] = useState<boolean>(true);
  const [activeIndexPreview, setActiveIndexPreview] = useState<number>(1);
  const [detailView, setDetailView] = useState({
    isShowDetailButton: true,
    isShowViewMoreDesc: false,
  });

  const [productDetail, setProductDetail] = useState<Product>({});

  const {
    data: productDiscover,
    fetchNextPage: fetchNextPageProductDiscover,
    isFetchingNextPage: isFetchingNextPageProductDiscover,
  } = useInfiniteQuery(
    [QueryKey.PRODUCT],
    async ({ pageParam = 0 }) => {
      const response = await productService.products({
        pageIndex: pageParam,
        pageSize: PAGE_DEFAULT,
      });
      isFetchNextPage.current = false;
      return response;
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        if (!lastPage.last) {
          return lastPage.pageable.pageNumber + 1;
        }
        return undefined;
      },
    }
  );

  const { data: productResponse, isFetching } = useQuery(
    [QueryKey.PRODUCT_DETAIL, id],
    async () => (id ? await productService.getProductById(id) : null),
    { refetchOnWindowFocus: false }
  );

  const { data: saleDiscounts } = useQuery(
    [QueryKey.SALE_DISCOUNT, id, productDetail.id, user.id],
    async () => {
      const response = await saleService.getSaleDiscount({
        productIds: [productDetail.id as unknown as number],
      });
      const results = convertSaleDiscount(response);
      return [...results];
    },
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(id) && Boolean(user.id) && Boolean(productDetail.id),
    }
  );

  useEffect(() => {
    handleChangeProductAttribute(productResponse);
  }, [productResponse, isFetching]);

  useEffect(() => {
    if (productDetail && Object.keys(productDetail).length > 0) {
      const descElementHeight =
        document.querySelector("#product-desc")?.clientHeight;

      if (descElementHeight && descElementHeight < 320) {
        //320 is desc length
        setDetailView({
          ...detailView,
          isShowDetailButton: true,
        });
      }
    }
  }, [productDetail?.description, isFetching]);

  const convertSaleDiscount = (saleDiscounts: SaleDiscount[]) => {
    let results: SaleDiscount[] = [];
    if (saleDiscounts && Array.isArray(saleDiscounts)) {
      saleDiscounts.forEach((saleDiscount) => {
        let resultsSaleDiscountDetail: SaleDiscountDetailDTO[] = [];
        saleDiscount.saledDiscountDetailDTOs.forEach((saleDiscountDetail) => {
          let totalUsed = 0;
          if (
            saleDiscountDetail.userUsedIds &&
            Array.isArray(saleDiscountDetail.userUsedIds)
          ) {
            saleDiscountDetail.userUsedIds.forEach((id) => {
              if (id == user.id) {
                totalUsed++;
              }
            });
          }
          if (totalUsed < saleDiscountDetail.maxQuantityPerUser) {
            resultsSaleDiscountDetail = [
              ...resultsSaleDiscountDetail,
              saleDiscountDetail,
            ];
          }
        });

        results.push({
          ...saleDiscount,
          saledDiscountDetailDTOs: resultsSaleDiscountDetail,
        });
      });
    }

    return results;
  };

  const handleChangeProductAttribute = (
    productAttribute?: Product | undefined | null
  ) => {
    if (productAttribute && Object.keys(productAttribute).length > 0) {
      let product: Product = productAttribute;

      if (
        productAttribute?.attributes &&
        Array.isArray(productAttribute.attributes) &&
        productAttribute.attributes.length > 0
      )
        product = productAttribute.attributes[0];

      let images: string[] = [];
      if (product?.image) {
        images = [product.image];
      }
      if (product?.images && Array.isArray(product.images)) {
        images = [...images, ...product.images];
      }

      if (images.length === 0) {
        if (
          productResponse?.id !== productAttribute.id &&
          productResponse?.image
        )
          images = [productResponse.image];
        else images = [NoImage];
      }

      setProductImages(images);
      setProductDetail(product);
      setIndexSlider(1);
    }
  };

  const handleShareCurrentPage = async () => {
    const data: ShareCurrentPage = {
      title: productDetail?.name || "",
      description: `${appConfig.app.title} - Chi tiết sản phẩm - ${
        productDetail?.name
      } - Giá ${formatCurrencyVND(productDetail?.price || 0)}`,
      thumbnail: `${productDetail?.image}`,
      path: `${PATH_NAME.PRODUCT}/${productDetail?.id}?type=${NAVIGATE_TYPE.SHARE}`,
    };
    await zaloService.shareCurrentPage(data);
  };

  const handleLoadMoreProductDiscover = () => {
    if (!isFetchNextPage.current) {
      isFetchNextPage.current = true;
      fetchNextPageProductDiscover();
    }
  };

  const scrollIntoView = () => {
    document.getElementById("product-desc")?.scrollIntoView();
  };

  const resetValue = () => {
    queryClient.removeQueries({ queryKey: QueryKey.PRODUCT_DETAIL });
    setProductImages([]);
    setIndexSlider(1);
  };

  const handleNavigateProduct = (id: string | number) => {
    resetValue();
    navigate(`${PATH_NAME.PRODUCT}/${id}`, { replace: id == id });

    ga4.trackEvent(EVENT_ACTION.PRODUCT.CLICK, {
      search_term: { id: id },
    });
  };

  const handleBack = () => {
    if (type && type === NAVIGATE_TYPE.SHARE) {
      navigate(`${PATH_NAME.HOME}`, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const RenderMinMaxGift = (
    minMaxProductQuantityGift: MinMaxProductQuantity
  ) => {
    if (minMaxProductQuantityGift.type === SaleDiscountDetailDTOType.DISCOUNT) {
      if (minMaxProductQuantityGift.discountPrice) {
        return (
          <Text className="font-medium">{`+ Khi mua từ ${
            minMaxProductQuantityGift.minProductQuantity
          } sản phẩm ${
            minMaxProductQuantityGift.minProductQuantity !==
            minMaxProductQuantityGift.maxProductQuantity
              ? `đến ${minMaxProductQuantityGift.maxProductQuantity}`
              : ""
          } giá còn ${formatCurrencyVND(
            minMaxProductQuantityGift.discountPrice || 0
          )}`}</Text>
        );
      } else if (minMaxProductQuantityGift.orderDiscountPercent) {
        return (
          <Text className="font-medium">{`+ Khi mua từ ${
            minMaxProductQuantityGift.minProductQuantity
          } sản phẩm ${
            minMaxProductQuantityGift.minProductQuantity !==
            minMaxProductQuantityGift.maxProductQuantity
              ? `đến ${minMaxProductQuantityGift.maxProductQuantity}`
              : ""
          } sẽ được giảm ${minMaxProductQuantityGift.orderDiscountPercent}% ${
            minMaxProductQuantityGift.orderDiscountMax
              ? `(giảm tối đã ${formatCurrencyVND(
                  minMaxProductQuantityGift.orderDiscountMax || 0
                )})`
              : ""
          } :`}</Text>
        );
      }
    } else if (
      minMaxProductQuantityGift.type === SaleDiscountDetailDTOType.GIFT &&
      minMaxProductQuantityGift &&
      Array.isArray(minMaxProductQuantityGift.productGifts) &&
      minMaxProductQuantityGift.productGifts.length > 0
    ) {
      const length = minMaxProductQuantityGift.productGifts?.length;

      return (
        <>
          <Text className="font-medium">{`+ Khi mua từ ${
            minMaxProductQuantityGift.minProductQuantity
          } sản phẩm ${
            minMaxProductQuantityGift.minProductQuantity !==
            minMaxProductQuantityGift.maxProductQuantity
              ? `đến ${minMaxProductQuantityGift.maxProductQuantity}`
              : ""
          } sẽ được tặng:`}</Text>

          <Box
            className={`grid gap-2`}
            style={{
              gridTemplateColumns:
                length <= 3
                  ? [...Array(length)].map((__item) => "1fr").join(" ")
                  : [...Array(3)].map((__item) => "1fr").join(" "),
            }}
          >
            <>
              {minMaxProductQuantityGift.productGifts.map((item, index) => {
                const isNotLastItem =
                  index !== length - 1 && (index + 1) % 3 !== 0;
                return (
                  <Box
                    key={index}
                    className={`gift-item ${
                      isNotLastItem && length > 1 ? "plus" : ""
                    }`}
                    onClick={() => item.id && handleNavigateProduct(item.id)}
                  >
                    <img
                      src={item.image}
                      className="w-[100px] h-[100px] mt-2 border-[0.2px] border-grey-color rounded-[5px] overflow-hidden"
                    />
                    <Text className="text-sm text-center">
                      <span className="text-[7px] text-red-500 border-[0.5px] p-[2px] border-red-500 rounded-md">
                        Quà tặng
                      </span>{" "}
                      {item.name}
                    </Text>
                  </Box>
                );
              })}
            </>
          </Box>
        </>
      );
    }
    return null;
  };

  const RenderMinOrderAmount = (minOrderAmount: MinOrderAmount) => {
    if (minOrderAmount.type === SaleDiscountDetailDTOType.ORDER_DISCOUNT) {
      if (minOrderAmount.orderDiscountPercent) {
        return (
          <Text className="font-medium mt-2">{`+ Khi mua đơn hàng từ ${formatCurrencyVND(
            minOrderAmount.minOrderAmount || 0
          )} sẽ được giảm ${minOrderAmount.orderDiscountPercent}% ${
            minOrderAmount.orderDiscountMax
              ? `(giảm tối đã ${formatCurrencyVND(
                  minOrderAmount.orderDiscountMax || 0
                )})`
              : ""
          }`}</Text>
        );
      }
    } else if (minOrderAmount.type === SaleDiscountDetailDTOType.ORDER_GIFT) {
      if (
        minOrderAmount.productGifts &&
        Array.isArray(minOrderAmount.productGifts) &&
        minOrderAmount.productGifts.length > 0
      ) {
        const length = minOrderAmount.productGifts?.length || 0;
        return (
          <>
            <Text className="font-medium mt-2">{`+ Khi mua đơn hàng từ ${formatCurrencyVND(
              minOrderAmount.minOrderAmount || 0
            )} sẽ được tặng:`}</Text>
            <Box
              className={`grid gap-2`}
              style={{
                gridTemplateColumns:
                  length <= 3
                    ? [...Array(length)].map((__item) => "1fr").join(" ")
                    : [...Array(3)].map((__item) => "1fr").join(" "),
              }}
            >
              <>
                {minOrderAmount.productGifts.map((item, index) => {
                  const isNotLastItem =
                    index !== length - 1 && (index + 1) % 3 !== 0;
                  return (
                    <Box
                      key={index}
                      className={`gift-item ${
                        isNotLastItem && length > 1 ? "plus" : ""
                      }`}
                      onClick={() => item.id && handleNavigateProduct(item.id)}
                    >
                      <img
                        src={item.image}
                        className="w-[100px] h-[100px] mt-2 border-[0.2px] border-grey-color rounded-[5px] overflow-hidden"
                      />
                      <Text className="text-sm text-center">
                        <span className="text-[7px] text-red-500 border-[0.5px] p-[2px] border-red-500 rounded-md">
                          Quà tặng
                        </span>{" "}
                        {item.name}
                      </Text>
                    </Box>
                  );
                })}
              </>
            </Box>
          </>
        );
      }
    }

    return null;
  };

  const RenderSaleDiscount = useMemo(() => {
    let minMaxProductQuantities: MinMaxProductQuantity[] = [];
    let minOrderAmounts: MinOrderAmount[] = [];
    saleDiscounts?.forEach((saleDiscount) => {
      saleDiscount?.saledDiscountDetailDTOs.forEach((saleDiscountDetail) => {
        if (
          saleDiscountDetail.minProductQuantity &&
          saleDiscountDetail.maxProductQuantity
        ) {
          let newMinMaxProductQuantities: MinMaxProductQuantity[] = [];
          const minMaxProductQuantityExistsIndex =
            minMaxProductQuantities.findIndex(
              (item) =>
                item.minProductQuantity ===
                  saleDiscountDetail.minProductQuantity &&
                item.maxProductQuantity ===
                  saleDiscountDetail.maxProductQuantity
            );
          if (minMaxProductQuantityExistsIndex !== -1) {
            let minMaxProductQuantity =
              minMaxProductQuantities[minMaxProductQuantityExistsIndex];
            if (
              minMaxProductQuantity.type === SaleDiscountDetailDTOType.DISCOUNT
            ) {
              const discountPriceOld =
                minMaxProductQuantity?.discountPrice || 0;
              const discountPriceNew = saleDiscountDetail?.discountPrice || 0;
              const discount = discountPriceOld - discountPriceNew;
              minMaxProductQuantity = {
                ...minMaxProductQuantity,
                discountPrice: discount >= 0 ? discount : 0,
              };
              minMaxProductQuantities[minMaxProductQuantityExistsIndex] =
                minMaxProductQuantity;
            } else if (
              minMaxProductQuantity.type === SaleDiscountDetailDTOType.GIFT &&
              saleDiscountDetail.productGifts
            ) {
              minMaxProductQuantity = {
                ...minMaxProductQuantity,
                productGifts: minMaxProductQuantity.productGifts
                  ? [
                      ...minMaxProductQuantity.productGifts,
                      ...saleDiscountDetail.productGifts,
                    ].filter((item) => item.id === item.id)
                  : [...saleDiscountDetail.productGifts],
              };
              minMaxProductQuantities[minMaxProductQuantityExistsIndex] =
                minMaxProductQuantity;
            }
          } else {
            newMinMaxProductQuantities.push({
              minProductQuantity: saleDiscountDetail.minProductQuantity,
              maxProductQuantity: saleDiscountDetail.maxProductQuantity,
              type: saleDiscountDetail.type,
              discountPrice: saleDiscountDetail.discountPrice,
              productGifts: saleDiscountDetail.productGifts,
            });
          }
          if (newMinMaxProductQuantities.length > 0) {
            minMaxProductQuantities = [
              ...minMaxProductQuantities,
              ...newMinMaxProductQuantities,
            ];
            newMinMaxProductQuantities = [];
          } else if (minMaxProductQuantities.length === 0) {
            minMaxProductQuantities.push({
              minProductQuantity: saleDiscountDetail.minProductQuantity,
              maxProductQuantity: saleDiscountDetail.maxProductQuantity,
              type: saleDiscountDetail.type,
              discountPrice: saleDiscountDetail.discountPrice,
              productGifts: saleDiscountDetail.productGifts,
            });
          }
        }
        if (saleDiscountDetail.minOrderAmount) {
          const minOrderAmountExistsIndex = minOrderAmounts.findIndex(
            (item) => item.minOrderAmount === saleDiscountDetail.minOrderAmount
          );
          if (minOrderAmountExistsIndex !== -1) {
            let minOrderAmount = minOrderAmounts[minOrderAmountExistsIndex];
            if (
              minOrderAmount.type === SaleDiscountDetailDTOType.ORDER_DISCOUNT
            ) {
              minOrderAmount = {
                ...minOrderAmount,
                orderDiscountMax:
                  minOrderAmount.orderDiscountMax &&
                  saleDiscountDetail.orderDiscountMax
                    ? minOrderAmount.orderDiscountMax +
                      saleDiscountDetail.orderDiscountMax
                    : 0,
              };
              minOrderAmounts[minOrderAmountExistsIndex] = minOrderAmount;
            } else if (
              minOrderAmount.type === SaleDiscountDetailDTOType.ORDER_GIFT &&
              saleDiscountDetail.productGifts
            ) {
              minOrderAmount = {
                ...minOrderAmount,
                productGifts: minOrderAmount.productGifts
                  ? [
                      ...minOrderAmount.productGifts,
                      ...saleDiscountDetail.productGifts,
                    ].filter((item) => item.id === item.id)
                  : [...saleDiscountDetail.productGifts],
              };
              minOrderAmounts[minOrderAmountExistsIndex] = minOrderAmount;
            }
          } else {
            minOrderAmounts.push({
              minOrderAmount: saleDiscountDetail.minOrderAmount,
              productGifts: saleDiscountDetail.productGifts,
              maxQuantityPerUser: saleDiscountDetail.maxQuantityPerUser,
              orderDiscountPercent: saleDiscountDetail.orderDiscountPercent,
              orderDiscountMax: saleDiscountDetail.orderDiscountMax,
              type: saleDiscountDetail.type,
            });
          }
        }
      });
    });

    return (
      <div>
        {minMaxProductQuantities?.length > 0 || minOrderAmounts?.length > 0 ? (
          <p className="text-[red] ">Khuyến mãi: </p>
        ) : null}
        {minMaxProductQuantities.map((item, index) => (
          <RenderMinMaxGift {...item} key={index} />
        ))}
        {minOrderAmounts.map((item, index) => (
          <RenderMinOrderAmount {...item} key={index} />
        ))}
      </div>
    );
  }, [productDetail, saleDiscounts]);

  return (
    <PageScrollView
      renderHeader={
        <HeaderPrimary
          title="Chi tiết sản phẩm"
          showBackIcon={true}
          onBack={handleBack}
        />
      }
      scrollToTop
      targetIdScroll="product-page"
      scrollToTopClassName="bottom-[calc(var(--h-bottom-content)+10px)] left-2"
      onLoadMore={handleLoadMoreProductDiscover}
    >
      <Box
        id="product-page"
        className="relative overflow-auto flex-1 pb-[var(--h-bottom-content)] overflow-x-hidden"
      >
        {!isFetching ? (
          <>
            <Box className="wrapper__slider bg-slider">
              <Swiper
                onSlideChange={({ activeIndex }) => {
                  setIndexSlider(activeIndex + 1);
                }}
                autoplay={{ delay: 2500 }}
                modules={[Autoplay]}
              >
                {productImages?.map((url, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        className={`m-auto object-cover w-[100vw] h-[100vw]`}
                        loading="lazy"
                        onClick={() => {
                          setIsShowPreview(!isShowPreview);
                          setActiveIndexPreview(index);
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
                <Box className="z-10 ml-[auto] flex justify-center absolute bottom-5 right-5 items-center bg-[#4C4C4CB2] rounded-[16px] w-[35px] h-[22px]">
                  <Text className="text-text-color text-[13px] font-normal leading-[22px]">
                    {indexSlider}/{productImages?.length || 0}
                  </Text>
                </Box>
              </Swiper>
              {productDetail?.freeShipDescription && (
                <Box className="m-2 mb-0">
                  <Text className="text-[10px] border border-primary-color w-fit py-1 px-2 text-primary-color rounded-lg leading-none">
                    {productDetail?.freeShipDescription}
                  </Text>
                </Box>
              )}
              <Box className="px-[10px] pt-4 py-2 mt-2 bg-background">
                <Box className="flex items-start">
                  <Text className="text-[22px] leading-[24px] font-black text-primary-color mr-4">
                    {formatCurrencyVND(productDetail?.price || 0)}
                  </Text>
                  {(productDetail?.oldPrice && productDetail.oldPrice > 0) ||
                  (productDetail?.salePriceBackup &&
                    productDetail.salePriceBackup > 0) ? (
                    <Text className="text-[16px] font-normal text-grey-color line-through">
                      {formatCurrencyVND(
                        getOldPriceProduct(
                          productDetail.oldPrice,
                          productDetail.salePriceBackup
                        )
                      )}
                    </Text>
                  ) : (
                    <></>
                  )}
                </Box>
                <Box className="flex items-center  pt-[8px]">
                  <Text className="text-[16px] flex items-center flex-[3] font-normal text-grey-second-color">
                    {productDetail?.name || ""}
                  </Text>
                  <TouchOpacity
                    className="px-2 h-[35px]"
                    onClick={handleShareCurrentPage}
                  >
                    <Icon
                      icon="zi-share-solid"
                      size={22}
                      className="text-[#646566]"
                    />
                  </TouchOpacity>
                </Box>
              </Box>
              {productResponse &&
                Array.isArray(productResponse?.attributes) &&
                productResponse?.attributes.length > 0 && (
                  <Box className="p-2 mt-[2px] bg-background">
                    <p>{productResponse?.attributeTypeName}</p>
                    <Box className="flex flex-wrap">
                      {productResponse?.attributes.map((productAttribute) => (
                        <Box
                          onClick={() =>
                            handleChangeProductAttribute(productAttribute)
                          }
                          className={`mt-2 mr-2 border ${
                            productAttribute.id === productDetail.id
                              ? "border-gray/30"
                              : "bg-gray/10 border-gray/10"
                          } py-1 px-2 relative`}
                        >
                          {productAttribute.id === productDetail.id && (
                            <div
                              style={{
                                border: "5px solid",
                                borderColor:
                                  "var(--zmp-primary-color) transparent transparent var(--zmp-primary-color)",
                              }}
                              className="absolute top-0 left-0"
                            ></div>
                          )}
                          {productAttribute.attributeTypeName}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              <Box className="bg-background px-2 py-4">
                {RenderSaleDiscount}
              </Box>
            </Box>

            {productDetail?.description && (
              <Box className="px-[10px] pt-2 mt-[2px] bg-background relative">
                <Text className="text-[17px]">Chi tiết sản phẩm</Text>
                <Box
                // className={
                //   detailView.isShowViewMoreDesc ||
                //   !detailView.isShowDetailButton
                //     ? "pb-4"
                //     : "h-[300px] overflow-hidden"
                // }
                >
                  <Box
                    id="product-desc"
                    className="mt-3 max-w-full"
                    dangerouslySetInnerHTML={{
                      __html: productDetail?.description,
                    }}
                  />
                </Box>
                {/* {!detailView.isShowDetailButton ? (
        <></>
      ) : detailView.isShowViewMoreDesc ? (
        <Box className="h-[45px]" onClick={scrollIntoView}>
          <TouchOpacity
            className="text-center px-4 py-3"
            onClick={() =>
              setDetailView({
                ...detailView,
                isShowViewMoreDesc: false,
              })
            }
          >
            Thu gọn <Icon icon="zi-chevron-up" size={20} />
          </TouchOpacity>
        </Box>
      ) : (
        <>
          <Box className="bg-overlay h-[50px] absolute left-[10px] right-[10px] bottom-[45px]"></Box>
          <Box className="h-[45px]">
            <TouchOpacity
              className="text-center px-4 py-3"
              onClick={() =>
                setDetailView({
                  ...detailView,
                  isShowViewMoreDesc: true,
                })
              }
            >
              Xem thêm <Icon icon="zi-chevron-down" size={20} />
            </TouchOpacity>
          </Box>
        </>
      )} */}
              </Box>
            )}
            <Box className="mt-4">
              {productDetail?.relatedProducts &&
                productDetail.relatedProducts.length > 0 && (
                  <Box className="mt-[40px] mx-2 mb-[20px]">
                    <Box className="flex items-center">
                      <Text className="text-[17px] font-normal text-text-second-color min-w-[134px] mx-1">
                        Các mẹ hay mua cùng
                      </Text>
                    </Box>
                    <Box className="mt-[22px] px-[10px] grid grid-cols-2 gap-2">
                      {productDetail.relatedProducts.map(
                        (productRelated) =>
                          productRelated && (
                            <ProductItem
                              key={productRelated?.nhanhVnId}
                              product={productRelated}
                              onClick={() =>
                                productRelated?.nhanhVnId &&
                                handleNavigateProduct(productRelated.nhanhVnId)
                              }
                            />
                          )
                      )}
                    </Box>
                  </Box>
                )}
              {productDiscover?.pages?.[0]?.content &&
                productDiscover.pages[0].content.length > 0 && (
                  <Box className="mt-2 mx-2 mb-[20px]">
                    <Box className="discover__more flex items-center">
                      <Text className="text-[17px] font-normal text-text-second-color min-w-[134px] mx-1">
                        Khám phá thêm
                      </Text>
                    </Box>
                    <Box
                      className="mt-[22px] grid grid-cols-2 gap-2 overflow-auto"
                      id="product-discover"
                    >
                      {productDiscover.pages.map((page) =>
                        page.content.map(
                          (product) =>
                            product && (
                              <ProductItem
                                key={product.id}
                                product={product}
                                onClick={() =>
                                  product?.id &&
                                  handleNavigateProduct(product.id)
                                }
                              />
                            )
                        )
                      )}
                    </Box>
                  </Box>
                )}
              {isFetchingNextPageProductDiscover && <LoaderBottom />}
            </Box>
            <Preview
              isShowPreview={isShowPreview}
              indexActive={activeIndexPreview}
              imageList={
                productImages?.map((image) => ({
                  url: image,
                  alt: image,
                })) || []
              }
              action={(state: boolean) => {
                setIsShowPreview(state);
              }}
            />
          </>
        ) : (
          <ProductDetailSkeleton />
        )}
        {visibleBtnQuickBuy && <ButtonGroup />}
        <BottomContent
          product={productDetail}
          isFetching={isFetching}
          onShowQuickBuyModel={(value) => setVisibleBtnQuickBuy(value)}
        />
      </Box>
    </PageScrollView>
  );
};

export default ProductDetail;
