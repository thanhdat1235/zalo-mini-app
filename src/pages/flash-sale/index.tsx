import FlashSaleBanner from "assets/images/FlashSaleBanner.png";
import React, { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Page, Text } from "zmp-ui";

import { globalModal } from "components/global-modal";
import HeaderSecond from "components/header/header-second";
import { FlashSaleItemSkeleton } from "components/skeletons";
import { PATH_NAME } from "constants/router";
import { SaleType } from "models/sale";
import { useDispatch, useSelector } from "react-redux";
import {
  FlashSaleState,
  setExpired,
  setFlashSaleTimeRemaining,
} from "redux/slices/home-config-slice";
import { AppDispatch, RootState } from "redux/store";
import { flashSaleService } from "services/flash-sale-service";
import { QueryKey } from "types/api";
import { calculateTimeRemaining } from "utils/date";
import FlashSaleItem from "./flash-sale-item";
import FlashSaleSvg from "assets/svg/flash-sale.svg";

const FlashSale = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const flashSaleHomeConfig = useSelector<RootState, FlashSaleState[]>(
    (state) => state.homeConfigStore.flashSale
  );

  const { data: flashSaleDetail, isFetching: isLoadingFlashSale } = useQuery(
    [QueryKey.FLASH_SALE, id],
    async () => {
      return await flashSaleService.getFlashSaleDetailById(id);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const flashSaleConfig = useMemo(() => {
    return flashSaleHomeConfig.find((item) => item.flashSale?.id == id);
  }, [flashSaleHomeConfig, id]);

  useEffect(() => {
    let interval: any = null;
    if (flashSaleDetail?.endDate) {
      if (new Date().getTime() > new Date(flashSaleDetail.endDate).getTime()) {
        dispatch(
          setExpired({
            flashSale: flashSaleDetail,
            expired: true,
          })
        );
      } else {
        interval = setInterval(() => {
          const { hours, minutes, seconds } = calculateTimeRemaining(
            flashSaleDetail.endDate as string
          );
          if (
            new Date().getTime() > new Date(flashSaleDetail.endDate!).getTime()
          ) {
            dispatch(
              setExpired({
                flashSale: flashSaleDetail,
                expired: true,
              })
            );
            clearInterval(interval);
          } else {
            dispatch(
              setFlashSaleTimeRemaining({
                flashSale: flashSaleDetail,
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
    }

    return () => {
      clearInterval(interval);
      dispatch(
        setExpired({
          flashSale: flashSaleDetail,
          expired: false,
        })
      );
    };
  }, [flashSaleDetail]);

  useEffect(() => {
    if (flashSaleConfig?.expired) {
      globalModal.show({
        title: "Chương trình flash sale đã hết",
        description: `Hãy luôn luôn theo dõi để nhận được nhưng ưu đãi hấp dẫn nhất nhé.`,
        isShowBtnAccept: true,
        onAccept: () => {
          navigate(PATH_NAME.HOME);
        },
      });
    }
  }, [flashSaleConfig]);

  const getTitle = useMemo(() => {
    switch (flashSaleDetail?.type) {
      case SaleType.FLASH_SALE:
        return (
          <span className="flex flex-row tracking-[0.1px] uppercase text-[#ff0003] items-center font-bold justify-start text-[19px]">
            <span className="flex flex-row items-center justify-start !font-black">
              F
              <img
                src={FlashSaleSvg}
                className="w-3.5 h-5 object-contain mx-[1px] "
              />
              ash
            </span>
            &nbsp;Sale
          </span>
        );
      case SaleType.SALE_FOR_NEW_CUSTOMER:
        return "Quà tặng cho thành viên mới";
      case SaleType.SALE_CAMPAIGN:
      case SaleType.VOUCHER:
      case SaleType.SUBSCRIPTION_VOUCHER:
        return "Chương trình khuyến mãi";

      default:
        return "Chương trình khuyến mãi";
    }
  }, [flashSaleDetail?.type]);

  return (
    <Page className="relative flex-1 flex flex-col bg-background-primary ">
      <HeaderSecond
        title={getTitle as string}
        showBackIcon={true}
        onBack={() => navigate(`${PATH_NAME.HOME}`)}
        className="!-tracking-[1px]"
      />
      <Box className="overflow-auto">
        {isLoadingFlashSale ? (
          <>
            {[...Array(10).keys()].map((__item, index) => (
              <FlashSaleItemSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            <div className="flex flex-col ">
              {(flashSaleDetail?.type === SaleType.FLASH_SALE ||
                flashSaleDetail?.type === SaleType.SALE_CAMPAIGN) && (
                <>
                  <div className="items-center text-center h-full relative">
                    <img src={FlashSaleBanner} className="w-full h-auto" />
                    {/* <img
                    src={
                      "https://mammy-be.dulichtriton.com/mammy/data/banner/9d676b1a-843c-46c5-bbb2-e4d51e2e9003-92f21c21-4a6d-4827-8210-021d39c515ab-zalo%20a%CC%89nh%20sa%CC%89n%20pha%CC%82%CC%89m%20wm-30.jpg"
                    }
                    className="w-full object-contain h-[430px]"
                  /> */}

                    {/* <p className="absolute font-bold top-[50%] translate-y-[-50%] right-2 max-w-[40vw] text-white text-base">
                    {flashSaleDetail?.name || ""}
                  </p> */}
                  </div>
                  <div className="flex self-end items-center px-2 mt-2">
                    <>
                      <Text className="text-primary-color text-[16px] font-bold">
                        Kết thúc trong
                      </Text>
                      <div className="ml-[19px] flex items-center">
                        <div className="w-8 h-7 rounded-[5px] bg-primary-color flex justify-center items-center">
                          <Text className="text-xs font-bold text-text-color leading-[20px]">
                            {flashSaleConfig?.timeRemaining?.hoursRemaining?.padStart(
                              2,
                              "0"
                            ) || 0}
                          </Text>
                        </div>
                        <Text className="font-bold mx-[2px]">:</Text>
                        <div className="w-7 h-7 rounded-[5px] bg-primary-color flex justify-center items-center">
                          <Text className="text-xs font-bold text-text-color leading-[20px]">
                            {flashSaleConfig?.timeRemaining?.minutesRemaining?.padStart(
                              2,
                              "0"
                            ) || 0}
                          </Text>
                        </div>
                        <Text className="font-bold mx-[2px]">:</Text>
                        <div className="w-7 h-7 rounded-[5px] bg-primary-color flex justify-center items-center">
                          <Text className="text-xs font-bold text-text-color leading-[20px]">
                            {flashSaleConfig?.timeRemaining?.secondsRemaining?.padStart(
                              2,
                              "0"
                            ) || 0}
                          </Text>
                        </div>
                      </div>
                    </>
                  </div>
                </>
              )}
            </div>

            {/* <div className="mt-1 overflow-auto flex-1"> */}
            <div className="mt-1 flex-1">
              {flashSaleDetail?.saleDetailDTOs?.map((saleDetailItem) => (
                <FlashSaleItem
                  saleDetailItem={saleDetailItem}
                  key={saleDetailItem.id}
                  // product={saleDetailItem.productDTO}
                />
              ))}
            </div>
          </>
        )}
      </Box>
    </Page>
  );
};

export default FlashSale;
