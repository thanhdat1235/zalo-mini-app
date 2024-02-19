import { ga4 } from "components/app";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { BannerSlider, HomeContentType } from "models/home-config";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "zmp-ui";
interface BannerSwiperProps {
  banners: BannerSlider[];
}

const BannerSwiper = (props: BannerSwiperProps) => {
  const navigate = useNavigate();

  const handleNavigate = (banner: BannerSlider) => {
    let path = "";
    switch (banner.type) {
      case HomeContentType.SALE:
        banner.typeId && (path = `${PATH_NAME.FLASH_SALE}/${banner.typeId}`);
        break;
      case HomeContentType.CATEGORY:
        // path = `${PATH_NAME.PRODUCT}?categoryId=${banner.productCategoryConfigDTO?.nhanhVnId}`;
        path = `${PATH_NAME.COMBO_ADVANTAGE_PACKS}`;
        break;
      case HomeContentType.SUBSCRIPTION:
        path = `${PATH_NAME.SUBSCRIPTION}`;
        break;
      default:
        break;
    }
    path && navigate(path);

    ga4.trackEvent(EVENT_ACTION.BANNER.CLICK, {
      search_term: { id: banner?.id },
    });
  };

  return (
    <Box className="mt-2">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
        }}
        autoplay
        loop
        cssMode
      >
        {props?.banners
          .sort((a, b) => a.order! - b.order!)
          .map((banner) => (
            <SwiperSlide key={banner.id}>
              <img
                src={banner.bannerUrl}
                alt={banner.bannerFileName}
                className="w-full h-full object-cover"
                onClick={() => handleNavigate(banner)}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </Box>
  );
};

export default BannerSwiper;
