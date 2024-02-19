import { motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import ImagePlaceholder from "assets/images/img-placeholder.png";

interface LazyLoadImageProps {
  src: string;
  alt: string;
  placeholderSrc?: string;
  preview?: boolean;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  maskClass?: React.HTMLAttributes<HTMLDivElement>["className"];
  containerClass?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const LazyLoadImage = ({
  src,
  preview,
  alt,
  maskClass,
  containerClass,
  className,
  placeholderSrc,
}: LazyLoadImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isShowingPreview, setIsShowingPreview] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const isInView = useInView(containerRef, {
    once: true,
  });

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className={`relative min-h-[100px] flex items-center justify-center ${
          isLoading && "blur"
        } ${(isLoading || isError) && "bg-gray-second"} ${containerClass}`}
        onClick={() => !isError && setIsShowingPreview(!isShowingPreview)}
      >
        {isInView ? (
          <img
            ref={imageRef}
            onError={() => {
              if (imageSrc) {
                setIsError(true);
                setImageSrc(placeholderSrc || ImagePlaceholder);
              }
            }}
            onLoad={() => setIsLoading(false)}
            loading="lazy"
            src={imageSrc}
            className={`object-cover w-full ${
              isError && !Boolean(placeholderSrc) && "!w-1/6"
            } ${!isError && className}`}
            alt={alt}
          />
        ) : (
          <></>
        )}
        {isLoading && (
          <div className="absolute top-1 left-1 right-1 bottom-1 flex items-center justify-center h-[60px]">
            <div className="loading !bg-primary"></div>
          </div>
        )}
        {preview &&
          !isError &&
          createPortal(
            <div
              className={`absolute top-0 left-0 right-0 bottom-0 bg-black/[.7] items-center justify-center z-[999] ${
                isShowingPreview ? "flex" : "hidden"
              } ${maskClass}`}
              onClick={() => setIsShowingPreview(!isShowingPreview)}
            >
              <motion.img
                src={src}
                alt={alt}
                loading="lazy"
                animate={{
                  width: isShowingPreview ? "100%" : "70%",
                  opacity: isShowingPreview ? 1 : 0,
                }}
              />
            </div>,
            document.body,
          )}
      </div>
    </>
  );
};

export default LazyLoadImage;
