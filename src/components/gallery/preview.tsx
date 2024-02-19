import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { EffectCoverflow, Pagination } from "swiper";
import { SwiperSlide, Swiper as SwiperSlideContainer } from "swiper/react";
import { Box } from "zmp-ui";

export type Image = {
  url: string;
  alt?: string;
};

export interface ImageList {
  imageList: Image[];
  isShowPreview: boolean;
  action?: (val: boolean) => void;
  indexActive?: number;
}

const Preview = (props: ImageList) => {
  const previewRef = useRef<any>(null);

  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (
      previewRef.current &&
      !previewRef.current.contains?.(event.target as Node)
    ) {
      props.action?.(false);
    }
  };

  return createPortal(
    <>
      {props.isShowPreview && (
        <div
          className="fixed inset-0 overflow-y-auto z-[999]"
          onClick={(e) => handleClickOutside(e)}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div
              className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <SwiperSlideContainer
                ref={previewRef}
                initialSlide={props.indexActive || 0}
                id="swiper"
                slidesPerView={1}
                loop={true}
                effect="coverflow"
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination]}
              >
                {Array.isArray(props.imageList) &&
                  props.imageList.map((item, index) => (
                    <SwiperSlide key={index}>
                      <img
                        loading="lazy"
                        src={item.url}
                        alt={item.alt ? item.alt : "preview-image"}
                        className="m-auto object-cover max-w-[95vw] max-h-[95vh] w-full rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
              </SwiperSlideContainer>
            </div>
            <Box className="absolute bottom-6 text-sm pt-2 px-4 text-white">
              Đóng
            </Box>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
};

export default Preview;
