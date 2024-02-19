import React, { FC } from "react";
import { Box, Button, Icon, Swiper, Text } from "zmp-ui";
import { SwiperRefObject } from "zmp-ui/swiper";
import { RefObject } from "react";

interface IntroduceSlideProps {
  image: string;
  titleIntro: React.JSX.Element;
  desc: string;
  onNext: () => void;
  onExit: () => void;
}
const IntroduceSlide: FC<{ image; titleIntro; desc; onNext; onExit }> = ({
  image,
  titleIntro,
  desc,
  onNext,
  onExit,
}: IntroduceSlideProps) => {
  return (
    <Box className="m-4">
      <img
        src={image}
        alt="introduce img"
        className="block h-full object-contain w-full max-h-[310px] max-w-[365px] mb-2 leading-10"
      />
      {titleIntro}
      <Box className="mt-4 mb-[110px]">
        <Text className="text-center">{desc}</Text>
      </Box>
      <Box className="fixed bottom-0 left-0 right-0 flex justify-around items-center pb-[20px] pt-2 z-[99] bg-background">
        <Box className="font-bold text-black py-4 px-6" onClick={onExit}>
          Bỏ qua
        </Box>
        <Button
          className="h-[55px] w-[180px] rounded-3xl relative"
          size="large"
          onClick={onNext}
        >
          Tiếp tục{" "}
          <Icon
            className="absolute top-1/2 right-[20px] translate-y-[-50%]"
            icon="zi-arrow-right"
            size={20}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default IntroduceSlide;
