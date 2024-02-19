import React, { FC, HTMLProps, PropsWithChildren } from "react";
import { Box, Text } from "zmp-ui";
import { BodyTextProps } from "zmp-ui/text";

export const TextSkeleton: FC<PropsWithChildren<BodyTextProps>> = ({
  className,
  ...props
}) => {
  return (
    <Text
      {...props}
      className={`bg-skeleton text-transparent w-fit h-fit animate-pulse ${
        className ?? ""
      }`}
    />
  );
};

export const BoxSkeleton: FC<HTMLProps<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`bg-skeleton animate-pulse ${className ?? ""}`}
    />
  );
};

export const ImageSkeleton: FC<HTMLProps<HTMLImageElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`bg-skeleton animate-pulse ${className ?? ""}`}
    />
  );
};

export const InputSkeleton: FC<HTMLProps<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      {...props}
      className={`bg-skeleton w-[100%] animate-pulse h-[40px] ${
        className ?? ""
      }`}
    />
  );
};

export const BannerMainSkeleton: FC = () => {
  return <BoxSkeleton className="h-[360px] mb-2"></BoxSkeleton>;
};
export const BannerSecondSkeleton: FC = () => {
  return <BoxSkeleton className="h-[180px] mb-2"></BoxSkeleton>;
};

export const AvatarSkeleton: FC = () => {
  return <ImageSkeleton className="w-[48px] h-[48px] rounded-full" />;
};

export const ProductItemSkeleton: FC = () => {
  return (
    <div className="space-y-2">
      <ImageSkeleton className="w-full aspect-square rounded-lg" />
      <TextSkeleton>1234567890</TextSkeleton>
      <TextSkeleton size="xxSmall">20,000đ</TextSkeleton>
    </div>
  );
};
export const FlashSaleSkeleton: FC = () => {
  return (
    <>
      <BoxSkeleton className="w-full flex flex-row justify-between items-center">
        <TextSkeleton>Giá sốc hôm nay </TextSkeleton>
        <Box>
          <Box>
            <BoxSkeleton></BoxSkeleton>
            <BoxSkeleton></BoxSkeleton>
            <BoxSkeleton></BoxSkeleton>
          </Box>
          <BoxSkeleton></BoxSkeleton>
        </Box>
      </BoxSkeleton>
    </>
  );
};

export const NotificationSkeleton: FC = () => {
  return (
    <TextSkeleton className="w-full my-1 flex justify-center mx-2">
      Giảm giá 100% cho đơn hàng đầu tiên 2
    </TextSkeleton>
  );
};

export const GreetingSkeleton: FC = () => {
  return (
    <Box className="ml-2">
      <TextSkeleton className="font-bold mb-2">Chào Pham Van Tan</TextSkeleton>
      <TextSkeleton className="font-light text-[12px]">
        Chào bạn. Hôm nay mua gì không?
      </TextSkeleton>
    </Box>
  );
};

export const ProductSlideSkeleton: FC = () => {
  return (
    <div className="space-y-3">
      <ImageSkeleton className="w-full aspect-video rounded-lg" />
      {/* <Box className="space-y-1">
        <TextSkeleton size="small">1234567890</TextSkeleton>
        <TextSkeleton size="xxSmall">25,000đ</TextSkeleton>
        <TextSkeleton size="large">20,000đ</TextSkeleton>
      </Box> */}
    </div>
  );
};

export const ProductSearchResultSkeleton: FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <ImageSkeleton className="w-[88px] h-[88px] rounded-lg" />
      <Box className="space-y-2">
        <TextSkeleton>1234567890</TextSkeleton>
        <TextSkeleton size="xSmall">25,000đ</TextSkeleton>
      </Box>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <Box className={`flex flex-col items-center py-2 px-1 category`}>
      <ImageSkeleton className="w-[40px] h-[40px] aspect-square rounded-lg" />
      <TextSkeleton className="mt-1 text-center">Danh muc</TextSkeleton>
    </Box>
  );
};

export const ProductComboSkeleton = () => {
  return (
    // <Box className="flex bg-background mb-2">
    //   <Box className="w-[100px]">
    //     <ImageSkeleton className="aspect-square w-[72px] h-[92px]" />
    //   </Box>
    //   <Box className="flex flex-col w-full justify-between">
    //     <TextSkeleton className="font-medium ml-3 mt-2">
    //       Sản phẩm skeleton
    //     </TextSkeleton>
    //     <Box>
    //       <Box className="flex flex-col ml-3">
    //         <TextSkeleton className="text-grey-color font-bold text-[14px] line-through">
    //           122.000đ
    //         </TextSkeleton>
    //       </Box>
    //       <Box className="flex justify-between items-center">
    //         <Box>
    //           <TextSkeleton className="font-bold text-red-color self-start ml-3 text-[14px]">
    //             122.000đ
    //           </TextSkeleton>
    //         </Box>
    //         <Box className="flex justify-center mb-2 self-center py-1 mr-4 px-2 rounded-[4px]">
    //           <TextSkeleton className="text-[12px] font-medium text-text-color">
    //             Mua ngay
    //           </TextSkeleton>
    //         </Box>
    //       </Box>
    //     </Box>
    //   </Box>
    // </Box>

    <Box className="relative bg-background-primary flex flex-col rounded-xl justify-between overflow-hidden pb-1">
      <ImageSkeleton className="aspect-square w-full h-[150px]" />
      <Box className="flex flex-col items-center">
        <Box className="flex flex-col items-center w-full mb-1 relative">
          <TextSkeleton className="px-2 text-center font-normal mt-2">
            San pham skeleton
          </TextSkeleton>
          <Box className="flex flex-col flex-wrap w-full mt-3 items-center">
            <TextSkeleton className="text-grey-color text-center font-normal text-[11px] line-through">
              2000000000
            </TextSkeleton>
            <TextSkeleton className="font-normal text-center text-primary-color text-[18px] mt-1">
              200000000
            </TextSkeleton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ProductSkeleton = () => {
  return (
    <Box className="flex bg-background mb-2">
      <ImageSkeleton className="aspect-square w-[120px] h-[92px]" />
      <Box className="flex flex-col w-full justify-between">
        <TextSkeleton className="font-medium ml-3 mt-2">
          Sản phẩm skeleton
        </TextSkeleton>
        <Box>
          <Box className="flex flex-col ml-3">
            <TextSkeleton className="text-grey-color font-bold text-[14px] line-through">
              122.000đ
            </TextSkeleton>
          </Box>
          <Box className="flex justify-between items-center">
            <Box>
              <TextSkeleton className="font-bold text-red-color self-start ml-3 text-[14px]">
                122.000đ
              </TextSkeleton>
            </Box>
            <Box className="flex justify-center mb-2 self-center py-1 mr-4 px-2 rounded-[4px]">
              <TextSkeleton className="text-[12px] font-medium text-text-color">
                Mua ngay
              </TextSkeleton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ProductSkeletonSearch = () => {
  return (
    <Box className="grid grid-cols-2 gap-5 p-4">
      {[...Array(10).keys()].map((__item, index) => (
        <Box
          key={index}
          className="bg-background flex flex-col overflow-hidden relative h-full border-[1px] border-slate-100 rounded-lg"
        >
          <Box>
            <ImageSkeleton className="w-full h-[150px] aspect-square rounded-lg" />
          </Box>
          <Box>
            <Box className="flex justify-between items-center w-full px-1">
              <Box className="mt-2 w-full">
                <TextSkeleton className="font-medium text-[12px] w-full">
                  100000
                </TextSkeleton>
              </Box>
            </Box>
            <Box className="flex justify-between items-center w-full px-1 pb-4">
              <Box className="mt-2 w-full">
                <TextSkeleton className="font-medium text-[12px] w-full">
                  100000
                </TextSkeleton>
                <TextSkeleton className="line-through font-light text-[10px] text-gray w-full mt-2">
                  100000
                </TextSkeleton>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const HomeSkeleton = () => {
  return (
    <Box className="max-w-full">
      <Box className="flex flex-row bg-background mt-2 px-2 py-2">
        <AvatarSkeleton />
        <GreetingSkeleton />
      </Box>
      <Box className="flex rounded-full items-center mt-3 l px-3 justify-center w-full">
        <InputSkeleton className="rounded-full" />
      </Box>
      <NotificationSkeleton />
      <BannerMainSkeleton />
      <ProductSlideSkeleton />
      <FlashSaleSkeleton />
      <ProductItemSkeleton />
    </Box>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <Box className="w-full">
      <BoxSkeleton className="h-[360px] mb-2"></BoxSkeleton>
      <TextSkeleton className="w-[50%]">100.000đ</TextSkeleton>
      <TextSkeleton className="w-[100%] mt-2">
        Ten san pham skeletion Ten san pham skeletion
      </TextSkeleton>
      <BoxSkeleton className="h-[150px] mt-4"></BoxSkeleton>
    </Box>
  );
};

export const ComboSkeleton = () => {
  return (
    <BoxSkeleton>
      <ImageSkeleton className="aspect-square w-full h-[150px]" />
      <Box className="px-2 bg-background py-2 grid grid-cols-2 gap-2">
        <ProductComboSkeleton />
        <ProductComboSkeleton />
      </Box>
    </BoxSkeleton>
  );
};

export const SubscriptionGiftSkeleton = () => {
  return (
    <div className="border-b border-gray/[.15] bg-background-primary flex items-center p-4">
      <div>
        <BoxSkeleton className="w-[30px] h-[30px]" />
      </div>
      <div className="ml-3 w-full">
        <BoxSkeleton className="h-5" />
        <BoxSkeleton className="h-3 w-1/2 mt-1" />
        <BoxSkeleton className="h-3 w-2/5 mt-1" />
      </div>
    </div>
  );
};

export const OrderDetailSkeleton = () => {
  return (
    <Box className="m-4 bg-white rounded-xl">
      <Box className="grid grid-cols-2 items-center gap-6 border-b-2 border-background-primary border-dashed p-4">
        <Box className="">
          <BoxSkeleton className="h-[20px]" />
          <BoxSkeleton className="h-[20px] mt-1" />
        </Box>
        <BoxSkeleton className="h-[30px]" />
      </Box>
      <Box className="p-4">
        <BoxSkeleton className="w-1/2 h-[30px]" />
        {[...Array(10)].map((__item, index) => (
          <BoxSkeleton className="h-[20px] mt-2" key={index} />
        ))}
        <Box className="flex items-center mt-2">
          <Box className="w-[35%]">
            <BoxSkeleton className="w-full h-[70px]" />
          </Box>
          <Box className="flex-1 ml-2">
            <BoxSkeleton className="h-[20px]" />
            <BoxSkeleton className="h-[20px] mt-2" />
          </Box>
        </Box>
        <Box className="flex items-center mt-2">
          <Box className="w-[35%]">
            <BoxSkeleton className="w-full h-[70px]" />
          </Box>
          <Box className="flex-1 ml-2">
            <BoxSkeleton className="h-[20px]" />
            <BoxSkeleton className="h-[20px] mt-2" />
          </Box>
        </Box>
        <BoxSkeleton className="h-[30px] w-1/2 mt-2" />
        <Box className="flex items-center border-b border-background-primary mt-2 pb-2">
          <BoxSkeleton className="w-[50px] h-[50px] mr-2" />
          <BoxSkeleton className="w-1/2 h-[20px]" />
        </Box>
        <BoxSkeleton className="mt-2 w-1/4 h-[25px]" />
        {[...Array(10)].map((__item, index) => (
          <BoxSkeleton className="h-[20px] mt-2" key={index} />
        ))}
      </Box>
    </Box>
  );
};

export const MySubscriptionSkeleton = () => {
  return (
    <Box className="grid grid-cols-2 p-4 border-[#EDEDED] border rounded-lg mt-4">
      <Box>
        <BoxSkeleton className="h-[20px] w-4/5" />
        <BoxSkeleton className="h-[20px] w-2/5 mt-2" />
        <BoxSkeleton className="h-[20px] w-3/5 mt-2" />
        <BoxSkeleton className="h-[20px] w-4/5 mt-2" />
      </Box>
      <Box>
        <BoxSkeleton className="h-[20px] w-3/5 ml-auto" />
        <BoxSkeleton className="h-[20px] w-4/5 mt-2 ml-auto" />
        <BoxSkeleton className="h-[20px] w-3/5 mt-2 ml-auto" />
        <BoxSkeleton className="h-[20px] w-3/5 mt-2 ml-auto" />
      </Box>
    </Box>
  );
};

export const FaqsItemSkeleton = () => {
  return (
    <li className="bg-background px-[20px] py-[20px] rounded-[20px] border-[#F3F4F6] border-[1px] border-solid mb-[16px]">
      <Text className="text-[16px] font-[700] text-text-black leading-[24px] aspect-square bg-skeleton animate-pulse h-[20px]"></Text>
      <Text className="text-[12px] text-[#6B7280] leading-[18px] mt-1 line-clamp-3 aspect-square bg-skeleton animate-pulse h-[60px]"></Text>
    </li>
  );
};

export const ComboListSkeleton = () => {
  return (
    <BoxSkeleton>
      <Box className="px-2 bg-background py-2 grid grid-cols-2 gap-2">
        <ProductComboSkeleton />
        <ProductComboSkeleton />
      </Box>
    </BoxSkeleton>
  );
};

export const FlashSaleItemSkeleton = () => {
  return (
    <Box className="flex py-2 px-4 my-3 bg-background">
      <Box className="w-1/5 mr-4">
        <ImageSkeleton className="w-full aspect-square rounded-lg" />
      </Box>
      <Box className="flex-1 flex">
        <Box className="mr-4 flex flex-col justify-between flex-1">
          <Box className="aspect-square bg-skeleton animate-pulse h-4"></Box>
          <Box className="flex items-start mt-2 h-5 aspect-square bg-skeleton animate-pulse"></Box>
        </Box>
        <Box className="flex flex-col justify-end items-end">
          <Box className="w-10 h-5 aspect-square bg-skeleton animate-pulse"></Box>
          <Box className="w-16 h-5 aspect-square bg-skeleton animate-pulse mt-4"></Box>
        </Box>
      </Box>
    </Box>
  );
};

export const TicketItemSkeleton = () => {
  return (
    <Box className="flex my-1 relative overflow-hidden">
      <Box className="flex-1 flex bg-background-primary rounded-l-xl rounded-r-[8px] px-5 py-5">
        <ImageSkeleton className="w-16 h-14" />
        <Box className="ml-4">
          <TextSkeleton className="mb-2 leading-3">
            Hết hạn vào ngày 1/1/2020 - 2/2/2020
          </TextSkeleton>
          <TextSkeleton size="small" className="leading-3">
            Hết hạn vào ngày 1/1/2020 - 2/2/2020
          </TextSkeleton>
        </Box>
      </Box>
      <Box className="w-[48px] top-0 right-0 bottom-0 bg-background-primary rounded-l-lg rounded-r-[8px] relative">
        <Box className="w-[2px] h-3 bg-background absolute top-0 left-[-1px]"></Box>
        <Box className="w-[2px] h-3 bg-background absolute top-[20px] left-[-1px]"></Box>
        <Box className="w-[2px] h-3 bg-background absolute top-[40px] left-[-1px]"></Box>
        <Box className="w-[2px] h-3 bg-background absolute top-[60px] left-[-1px]"></Box>
        <Box className="w-[2px] h-3 bg-background absolute top-[80px] left-[-1px]"></Box>
      </Box>
    </Box>
  );
};

export const TicketDetailPageSkeleton = () => {
  return (
    <>
      <Box className="flex-1 overflow-auto scrollbar-hide">
        <Box className="m-4">
          <BoxSkeleton className="h-[70px]" />
        </Box>
        <Box className="m-4">
          <TextSkeleton className="h-5">Hạn sử dụng mã</TextSkeleton>
          <Box className="mt-2">
            <TextSkeleton className="h-5">
              Hạn sử dụng mã - Hạn sử dụng mã
            </TextSkeleton>
          </Box>
        </Box>
        <Box className="m-4">
          <TextSkeleton>Ưu đãi</TextSkeleton>
          <Box className="mt-2">
            <TextSkeleton>
              Hạn sử dụng mã - Hạn sử dụng mã Hạn sử dụng mã - Hạn sử dụng mã
            </TextSkeleton>
          </Box>
        </Box>
        <Box className="m-4">
          <TextSkeleton>Áp dụng cho sản phẩm</TextSkeleton>
          <Box className="mt-2">
            <TextSkeleton>
              Áp dụng cho sản phẩm Áp dụng cho sản phẩm Áp dụng cho sản phẩm Áp
              dụng cho sản phẩm Áp dụng cho sản phẩm Áp dụng cho sản phẩmÁp dụng
              cho sản phẩm Áp dụng cho sản phẩm Áp dụng cho sản phẩm
            </TextSkeleton>
          </Box>
        </Box>
      </Box>
    </>
  );
};
