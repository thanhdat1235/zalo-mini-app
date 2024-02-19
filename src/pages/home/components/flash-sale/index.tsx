import { PATH_NAME } from "constants/router";
import { Sale, SaleDetail } from "models/sale";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { TouchOpacity } from "zalo-ui";
import { Box, Icon, Text } from "zmp-ui";

import { ga4 } from "components/app";
import { EVENT_ACTION } from "constants";
import {
  FlashSaleState,
  setExpired,
  setFlashSaleTimeRemaining,
} from "redux/slices/home-config-slice";
import { AppDispatch, RootState } from "redux/store";
import { calculateTimeRemaining } from "utils/date";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";

const ProductItem = (props: SaleDetail) => {
  const { productDTO } = props;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${PATH_NAME.PRODUCT}/${productDTO?.id}`);

    ga4.trackEvent(EVENT_ACTION.PRODUCT.CLICK, {
      search_term: { id: productDTO?.id },
    });
  };

  return (
    <TouchOpacity
      className="bg-background relative flex flex-col items-center rounded-lg border-[1px] border-slate-100 justify-between overflow-hidden pb-1"
      onClick={handleClick}
    >
      <img src={productDTO?.image} className="object-cover w-full" />
      <Box className="absolute top-0 left-1 bg-red-color sale-tag">
        <Text className="text-background px-[5px] text-[8px] font-semibold py-1">
          HOT
        </Text>
      </Box>
      <Box className="flex flex-col items-center">
        <Text className="px-[8px] text-center font-normal mt-2 text-[13px] leading-[17px] line-clamp-2 ">
          {productDTO?.name || ""}
        </Text>
        <Box className="flex flex-col flex-wrap w-full justify-center ">
          <Text className="text-grey-color font-normal text-center line-through text-[11px]">
            {formatCurrencyVND(
              getOldPriceProduct(
                productDTO?.oldPrice,
                productDTO?.salePriceBackup
              )
            )}
          </Text>
          <Text className="font-normal text-[15px] text-center text-primary-color">
            {formatCurrencyVND(productDTO?.price || 0)}
          </Text>
        </Box>
      </Box>
    </TouchOpacity>
  );
};

interface FlashSaleProps {
  title?: string;
  sale?: Sale;
  bannerUrl?: string;
  isShowProduct?: boolean;
}

const FlashSale = ({
  title,
  sale,
  bannerUrl,
  isShowProduct = true,
}: FlashSaleProps) => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const flashSaleHomeConfig = useSelector<RootState, FlashSaleState[]>(
    (state) => state.homeConfigStore.flashSale
  );

  const flashSaleConfig = useMemo(() => {
    return flashSaleHomeConfig.find((item) => item.flashSale?.id === sale?.id);
  }, [flashSaleHomeConfig, sale]);

  useEffect(() => {
    let interval: any = null;
    if (sale?.endDate) {
      interval = setInterval(() => {
        const { hours, minutes, seconds } = calculateTimeRemaining(
          sale.endDate!
        );
        if (new Date().getTime() > new Date(sale.endDate!).getTime()) {
          dispatch(
            setExpired({
              flashSale: sale,
              expired: true,
            })
          );
          clearInterval(interval);
        } else {
          dispatch(
            setFlashSaleTimeRemaining({
              flashSale: sale,
              timeRemaining: {
                hoursRemaining: `${hours}`,
                minutesRemaining: `${minutes}`,
                secondsRemaining: `${seconds}`,
              },
            })
          );
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleNavigate = () => {
    navigate(`${PATH_NAME.FLASH_SALE}/${sale?.id}`);

    ga4.trackEvent(EVENT_ACTION.FLASH_SALE.CLICK, {
      search_term: { id: sale?.id },
    });
  };

  return (
    <Box className="bg-background py-1 rounded-t-2xl">
      <img src={bannerUrl} className="object-cover" onClick={handleNavigate} />
      <Box className="flex flex-row relative items-center my-2 px-2">
        <Text className="text-primary-color font-bold">{title || ""}</Text>
        <Box className="flex flex-row ml-4 items-center">
          <Box className="bg-primary-color p-1 rounded-lg text-center ">
            <Text className="text-text-color font-bold min-w-[16px]">
              {flashSaleConfig?.timeRemaining?.hoursRemaining?.padStart(
                2,
                "0"
              ) || 0}
            </Text>
          </Box>
          <Text className="text-black font-bold text-[20px] px-0.5">:</Text>
          <Box className="bg-primary-color p-1 rounded-lg text-center">
            <Text className="text-text-color font-bold min-w-[16px]">
              {flashSaleConfig?.timeRemaining?.minutesRemaining?.padStart(
                2,
                "0"
              ) || 0}
            </Text>
          </Box>
          <Text className="text-black font-bold text-[20px] px-0.5">:</Text>
          <Box className="bg-primary-color p-1 rounded-lg text-center">
            <Text className="text-text-color font-bold min-w-[16px]">
              {flashSaleConfig?.timeRemaining?.secondsRemaining?.padStart(
                2,
                "0"
              ) || 0}
            </Text>
          </Box>
        </Box>
        <TouchOpacity
          className="p-1.5 flex items-center bg-background-primary absolute top-50 right-2 rounded-lg"
          onClick={handleNavigate}
        >
          <Text className="font-medium text-[12px]">Xem thêm</Text>
          <Icon icon="zi-chevron-right" className="font-bold" />
        </TouchOpacity>
      </Box>
      {isShowProduct && (
        <Box className="px-2 bg-background">
          {Array.isArray(sale?.saleDetailDTOs) && (
            <Swiper slidesPerView={3.2} spaceBetween={8}>
              {sale?.saleDetailDTOs.map((item, index) => (
                <SwiperSlide key={index}>
                  <ProductItem {...item} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FlashSale;
