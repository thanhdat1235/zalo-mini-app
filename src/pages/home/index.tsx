import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageScrollView } from "zalo-ui";
import { Box, useSnackbar } from "zmp-ui";

import ButtonGroup from "components/button-group";
import { globalLoading } from "components/global-loading";
import { HeaderPrimary } from "components/header/header-primary";
import { HomeSkeleton } from "components/skeletons";
import { NAVIGATE_TYPE } from "constants";
import { PATH_NAME } from "constants/router";
import useURLParams from "hooks/useURLParams";
import { HomeContentBody, HomeContentType } from "models/home-config";
import {
  Sale,
  SaleAutomationShowDefault,
  SaleStatus,
  SaleType,
} from "models/sale";
import { Customer } from "models/user";
import { setOrder } from "redux/slices/order-slice";
import { setDisplayedSaleAutomation } from "redux/slices/sale-slice";
import { AppDispatch, RootState } from "redux/store";
import { configService } from "services/config-service";
import { orderService } from "services/order-service";
import { saleService } from "services/sale-service";
import { QueryKey } from "types/api";
import appConfig from "../../../app-config.json";
import BannerSwiper from "./components/banner-swiper";
import FlashSale from "./components/flash-sale";
import GiftForIntroducingNewMember from "./components/gift-forIntroducing-new-member";
import HomeBanner from "./components/home-banner";
import MembershipPackage from "./components/membership-package";
import NextFlashSale from "./components/next-flash-sale";
import ProductGroup from "./components/product-group";
import Search from "./components/search";
import SpeakerSale from "./components/speaker-sale";
import Welcome from "./components/welcome";

const HomePage = () => {
  const { orderId, type, affiliateCode, backToFlashSaleAutomation } =
    useURLParams();

  const navigate = useNavigate();

  const { openSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();

  const isShowFollowZaloOA = useSelector<RootState, boolean>(
    (state) => state.homeConfigStore.isShowFollowZaloOA
  );
  const isShowHomeBanner = useSelector<RootState, boolean>(
    (state) => state.homeConfigStore.isShowHomeBanner
  );
  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );
  const expiredFlashSale = useSelector<RootState, boolean>(
    (state) => state.homeConfigStore.flashSale.expired
  );
  const displayedSaleAutomation = useSelector<RootState, boolean>(
    (state) => state.saleStore.displayedSaleAutomation
  );

  const { isLoading, data: homeConfigData } = useQuery(
    [QueryKey.HOME, expiredFlashSale],
    configService.getHomeConfig
  );

  const { data: homeConfigInterstitialAd } = useQuery(
    QueryKey.INTERSTITIAL_AD,
    configService.getInterstitialAd
  );

  useEffect(() => {
    validateExistOrder();
  }, [orderId]);

  useEffect(() => {
    validateAffiliateCode();
  }, [type, user]);

  useEffect(() => {
    handleSaleAutomation();
  }, []);

  const handleSaleAutomation = async () => {
    try {
      const response = await saleService.getSaleAutomationShowDefault();
      response && handleNavigateSaleAutomation(response);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleNavigateSaleAutomation = (
    saleAutomation: SaleAutomationShowDefault
  ) => {
    switch (saleAutomation.saleDTO?.type) {
      case SaleType.FLASH_SALE:
      case SaleType.SALE_CAMPAIGN:
      case SaleType.SALE_FOR_NEW_CUSTOMER:
        const { startDate, endDate } = saleAutomation.saleDTO;
        if (
          endDate &&
          startDate &&
          new Date().getTime() >= new Date(startDate).getTime() &&
          new Date().getTime() < new Date(endDate).getTime()
        ) {
          if (!displayedSaleAutomation) {
            dispatch(setDisplayedSaleAutomation(true));
            navigate(`${PATH_NAME.FLASH_SALE}/${saleAutomation.saleDTO.id}`);
          }
        }
        break;
      default:
        break;
    }
  };

  const validateExistOrder = async () => {
    if (orderId) {
      try {
        globalLoading.show();
        const orderDetail = await orderService.getOrderById(
          Number.parseInt(orderId)
        );

        navigate(
          `${PATH_NAME.ORDER}/${orderDetail.id}?type=${NAVIGATE_TYPE.ZNS}`
        );
      } catch (err) {
        openSnackbar({
          icon: true,
          type: "error",
          text: "Có lỗi xảy ra đơn hàng của bạn không tồn tại",
          duration: 1500,
        });
        navigate(PATH_NAME.HOME, { replace: true });
      } finally {
        globalLoading.hide();
      }
    }
  };

  const validateAffiliateCode = async () => {
    if (
      type &&
      type === NAVIGATE_TYPE.AFFILIATE &&
      user &&
      Object.keys(user).length > 0
    ) {
      try {
        globalLoading.show();
        if (Boolean(affiliateCode)) {
          dispatch(
            setOrder({
              affiliateCode,
            })
          );

          openSnackbar({
            icon: true,
            type: "success",
            text: "Lưu mã giới thiệu thành công. Hãy mua sắm ngay để sử dụng mã giới thiệu ngay bạn nhé!",
            duration: 3000,
          });
        } else {
          throw new Error("Invalid affiliate code");
        }
      } catch (err) {
        openSnackbar({
          icon: true,
          type: "error",
          text: "Mã giới thiệu đã sử dụng hoặc không tồn tại",
          duration: 1500,
        });
      } finally {
        navigate(PATH_NAME.HOME, { replace: true });
        globalLoading.hide();
      }
    }
  };

  const RenderSaleContent = ({
    contentBody,
    data,
  }: {
    contentBody: HomeContentBody;
    data: Sale;
  }) => {
    if (
      data?.endDate &&
      data?.startDate &&
      new Date().getTime() >= new Date(data.startDate).getTime() &&
      new Date().getTime() < new Date(data.endDate).getTime()
    ) {      
      switch (data?.type) {
        case SaleType.FLASH_SALE:
        case SaleType.SALE_CAMPAIGN:
          return (
            <FlashSale
              title="Đang diễn ra"
              sale={data as Sale}
              bannerUrl={contentBody.bannerUrl}
            />
          );
        case SaleType.SALE_FOR_NEW_CUSTOMER:
          return user?.isNewCustomer ? (
            <GiftForIntroducingNewMember
              sale={data as Sale}
              bannerUrl={contentBody.bannerUrl}
              bannerFileName={contentBody.bannerFileName}
            />
          ) : (
            <></>
          );
        default:
          return <></>;
      }
    } else if (
      data.nextSaleDate &&
      new Date(data.nextSaleDate).getTime() > new Date().getTime()
    ) {
      return (
        <NextFlashSale
          nextSaleBannerUrl={data.nextSaleBannerUrl}
          nextSaleDate={data.nextSaleDate}
        />
      );
    } else {
      return null;
    }
  };

  const RenderContent = (content: HomeContentBody) => {
    switch (content.type) {
      case HomeContentType.SALE:
      case HomeContentType.FLASH_SALE:
        return content?.data?.status === SaleStatus.ACTIVE ? (
          <RenderSaleContent
            contentBody={content}
            data={content.data as Sale}
          />
        ) : (
          <></>
        );
      case HomeContentType.SUBSCRIPTION:
        return Object.keys(content.data)?.length > 0 ||
          content?.data?.contents?.length > 0 ? (
          <MembershipPackage
            bannerUrl={content.bannerUrl}
            bannerFileName={content.bannerFileName}
            contents={
              content?.data?.contents?.length > 0 ? content.data.contents : []
            }
            data={content.data}
          />
        ) : (
          <></>
        );
      case HomeContentType.CATEGORY:
      case HomeContentType.PRODUCT:
        return (
          <ProductGroup
            nhanhVnCategoryId={content?.data?.nhanhVnId}
            products={content?.data?.products || []}
            bannerUrl={content.bannerUrl || ""}
          />
        );

      default:
        return <></>;
    }
  };

  const RenderHomeBanner = () => {
    if (
      !isShowHomeBanner &&
      !isShowFollowZaloOA &&
      Object.keys(user).length > 0 &&
      homeConfigInterstitialAd
    ) {
      if (
        homeConfigInterstitialAd?.data?.type ===
          SaleType.SALE_FOR_NEW_CUSTOMER &&
        !user?.isNewCustomer
      ) {
        return <></>;
      }

      return <HomeBanner homeBanner={homeConfigInterstitialAd} />;
    }
    return <></>;
  };

  return (
    <PageScrollView
      renderHeader={
        <HeaderPrimary title={appConfig.app.title} isClickSearch={true} />
      }
      scrollToTop
      targetIdScroll="home-page"
      scrollToTopClassName="bottom-[calc(var(--h-bottom-content))] left-2"
    >
      <Box id="home-page" className="overflow-y-auto overflow-x-hidden flex-1">
        {!isLoading ? (
          <>
            <Welcome dailyQuestion={homeConfigData?.dailyQuestion || ""} />
            <Search />
            {homeConfigData?.notificationDTOs &&
              homeConfigData.notificationDTOs?.length > 0 && (
                <SpeakerSale
                  notificationDTOs={homeConfigData.notificationDTOs}
                />
              )}
            <BannerSwiper banners={homeConfigData?.bannerSliders || []} />
            {homeConfigData?.bodies &&
              homeConfigData.bodies
                .sort((a, b) => a.order! - b.order!)
                .map((item) => <RenderContent {...item} key={item.id} />)}
          </>
        ) : (
          <HomeSkeleton />
        )}
        <ButtonGroup />
      </Box>
      <RenderHomeBanner />
    </PageScrollView>
  );
};

export default HomePage;
