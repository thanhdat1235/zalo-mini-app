import NoImage from "assets/images/no-image.png";
// import IconCartActive from "assets/svg/bottom-menu/cart-active.svg";
import IconCartActive from "assets/images/cart-plus.png";
import SelectQuantityProduct, {
  SelectType,
} from "components/product/quick-buy";
import { PATH_NAME } from "constants/router";
import { Product } from "models/product";
import { SaleDetail } from "models/sale";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";
import { TouchOpacity } from "zalo-ui";
import { Box, Text } from "zmp-ui";
import FlashSaleSvg from "assets/svg/flash-sale.svg";

// import CartIcon from "assets/svg/bottom-menu/cart.svg";

type FlashSaleItemProps = {
  saleDetailItem: SaleDetail;
};

type FlashSaleComboItemProps = {
  product: Product;
};

const FlashSaleItem = ({ saleDetailItem }: FlashSaleItemProps) => {
  const { productDTO, discount, discountPercent } = saleDetailItem;

  const navigate = useNavigate();

  const [isOpenPopupQuickBuy, setIsOpenPopupQuickBuy] = useState(false);
  const [typeSheet, setTypeSheet] = useState<SelectType>("buy");

  const discountPercentLabel = useMemo(() => {
    if (
      discount &&
      discount > 0 &&
      productDTO?.oldPrice &&
      productDTO.oldPrice > 0
    ) {
      return ((discount / productDTO?.oldPrice) * 100).toFixed(0);
    } else if (discountPercent) {
      return discountPercent.toFixed(0);
    }

    return 0;
  }, []);

  return (
    <>
      <Box
        className="flex flex-col py-1 px-4 my-[2px] bg-background relative"
        onClick={() =>
          productDTO?.nhanhVnId &&
          navigate(`${PATH_NAME.PRODUCT}/${productDTO.id}`)
        }
      >
        <Box className="w-full flex mr-2 relative items-center">
          <img
            src={productDTO?.image}
            alt="product img"
            className="object-cover  w-full"
          />
          <Box className="absolute top-0 left-1 bg-red-color sale-tag">
            <Text className="text-background px-[3px] text-[7px] font-semibold py-[3px]">
              HOT
            </Text>
          </Box>
        </Box>
        <Box className="flex-1 flex flex-col justify-between my-1">
          <Box className="flex flex-row justify-between">
            <Box>
              <Text className="text-[15px] leading-[17px] line-clamp-2">
                {productDTO?.name || ""}
              </Text>
            </Box>
            {/* {discountPercentLabel ? (
              <Text className="flex justify-center border-primary-color text-primary-color border border-solid rounded-xl px-2 text-[10px] max-h-[23px] min-w-[94px] w-[94px]">
                Giảm {discountPercentLabel} %
              </Text>
            ) : (
              <></>
            )} */}
          </Box>
          <Box className="mt-1 flex justify-between items-center">
            <Box className="flex items-start flex-col flex-1">
              <Box className="flex items-start">
                {/* {(productDTO?.oldPrice && productDTO.oldPrice > 0) ||
              (productDTO?.salePriceBackup &&
                productDTO.salePriceBackup > 0) ? (
                <Text className="text-[10px] font-normal text-gray line-through">
                  {formatCurrencyVND(
                    getOldPriceProduct(
                      productDTO.oldPrice,
                      productDTO.salePriceBackup
                    )
                  )}
                </Text>
              ) : (
                <></>
              )} */}
                <Text className="text-[13px] font-normal text-gray line-through mr-2.5">
                  {formatCurrencyVND(
                    getOldPriceProduct(
                      productDTO?.oldPrice,
                      productDTO?.salePriceBackup
                    )
                  )}
                </Text>

                {discountPercentLabel ? (
                  <Box className="flex flex-row">
                    <Text className="flex justify-center items-center text-primary-color font-medium bg-[#ffe97a]/[.70] pr-1 text-[14px] max-h-[23px]">
                      <img
                        src={FlashSaleSvg}
                        className="w-3 h-[16px] object-contain mr-1"
                      />
                      {`-${discountPercentLabel}%`}
                    </Text>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
              <Text className="mr-2 text-primary-color font-medium text-[17.5px]">
                {formatCurrencyVND(productDTO?.price || 0)}
              </Text>
            </Box>
            <Box className="flex flex-row">
              <TouchOpacity
                className="rounded-md mt-2 bg-primary flex px-4 my-2 py-3 items-center"
                onClick={(e) => {
                  // e.stopPropagation();
                  // setTypeSheet("buy");
                  // setIsOpenPopupQuickBuy(true);
                  e.stopPropagation();
                  setTypeSheet("cart");
                  setIsOpenPopupQuickBuy(true);
                }}
              >
                <Text className="text-[#ffffff] text-center">
                  Thêm vào giỏ hàng
                </Text>
              </TouchOpacity>
            </Box>
          </Box>
        </Box>
      </Box>
      <SelectQuantityProduct
        isVisible={isOpenPopupQuickBuy}
        type={typeSheet}
        onClose={() => setIsOpenPopupQuickBuy(false)}
        product={productDTO}
      />
    </>
  );
};

export const FlashSaleComboItem = (props: FlashSaleComboItemProps) => {
  const { product } = props;

  const navigate = useNavigate();

  const [isOpenPopupQuickBuy, setIsOpenPopupQuickBuy] = useState(false);

  return (
    <>
      <TouchOpacity
        onClick={() => navigate(`${PATH_NAME.PRODUCT}/${product.id}`)}
        className="relative bg-background flex flex-col rounded-xl justify-between overflow-hidden pb-1 border-[1px] border-slate-100"
      >
        <Box className="absolute top-0 left-1 bg-red-color sale-tag w-[14%] flex items-center justify-center">
          <Text className="text-background text-[8px] font-semibold py-1">
            HOT
          </Text>
        </Box>
        <img
          src={product.image}
          className="w-full object-cover"
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = NoImage;
          }}
        />
        <Box className="flex flex-col items-center">
          <Box className="flex flex-col items-center w-full mb-1 relative">
            <Text className="px-[8px] text-center font-normal mt-1 text-[15px] leading-[17px] line-clamp-2">
              {product?.name || ""}
            </Text>
            <Box className="flex flex-row flex-wrap items-center">
              <Text
                className="text-grey-color text-center font-normal text-[11px] line-through"
                style={{
                  visibility:
                    (product?.oldPrice && product.oldPrice > 0) ||
                    (product?.salePriceBackup && product.salePriceBackup > 0)
                      ? "visible"
                      : "hidden",
                }}
              >
                {formatCurrencyVND(
                  getOldPriceProduct(product.oldPrice, product.salePriceBackup)
                )}
              </Text>
              <Text className="font-normal text-center text-primary-color text-[15px] mt-1">
                {formatCurrencyVND(product?.price || 0)}
              </Text>
            </Box>
          </Box>
          <Box className="w-full flex justify-center">
            <TouchOpacity
              className="flex justify-center items-center my-1 bg-green-color w-[90%] py-1.5 rounded-[10px] absolute"
              onClick={(e) => {
                setIsOpenPopupQuickBuy(true);
                e.stopPropagation();
              }}
            >
              <Text className="text-[14px] font-medium text-text-color">
                Mua ngay
              </Text>
            </TouchOpacity>
          </Box>
        </Box>
      </TouchOpacity>
      <SelectQuantityProduct
        isVisible={isOpenPopupQuickBuy}
        onClose={() => setIsOpenPopupQuickBuy(false)}
        product={product}
      />
    </>
  );
};

export default FlashSaleItem;
