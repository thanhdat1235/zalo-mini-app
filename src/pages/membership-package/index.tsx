import React, { useState } from "react";
import { useQuery } from "react-query";
import { Box, Page } from "zmp-ui";

import BecomeMammyMember from "assets/svg/become-mammy-member.svg";
import MammyMember from "assets/svg/mammy-member.svg";
import WhatIsMammy from "assets/svg/what-is-mammy.svg";
import HeaderSecond from "components/header/header-second";
import { ComboListSkeleton } from "components/skeletons";
import { subscriptionService } from "services/subscription-service";
import { QueryKey } from "types/api";
import IntroduceSlide from "./components/introduce-slide";
import SlideTitle from "./components/member-slide-title";
import { SubscriptionPaymentInfo } from "./components/sheets/payment/payment-info";
import { SubscriptionPaymentStatus } from "./components/sheets/payment/payment-status";
import { SubscriptionPaymentUpload } from "./components/sheets/payment/payment-upload";
import { SubscriptionRegisterDetails } from "./components/sheets/register/register-details";
import SubscriptionRegisterInfo from "./components/sheets/register/register-info";
import SubscriptionList from "./subscription-list";

interface SubscriptionSlideProps {
  id: number;
  image: string;
  title: React.JSX.Element;
  desc: string;
}

const subscriptionSlide: SubscriptionSlideProps[] = [
  {
    id: 1,
    image: MammyMember,
    title: <SlideTitle isFirst preTitle="Combo sản phẩm ưu đãi" subTitle="" />,
    desc: "MămmyClub là chương trình dành cho các khách hàng đã mua sắm ở Mămmy Zalo Mini App. Mang đến trải nghiệm mua sắm Online an tâm và tiện lợi hơn cho gia đình Việt Nam. MămmyClub được coi như một sự tri ân của Mămmy Việt Nam với mọi người đã và đang mua sắm tại Mămmy",
  },
  {
    id: 2,
    image: WhatIsMammy,
    title: <SlideTitle isFirst={false} preTitle="" subTitle="là gì ?" />,
    desc: `Với việc trở thành thành viên của MămmyClub, khách hàng sẽ nhận được rất nhiều quyền lợi ưu đãi như quà tặng khi mua sản phẩm, ưu đãi cho các sản phẩm mới, hay trong tương lai, Mămmy còn nghĩ "táo bạo" ví dụ như Free ship đơn hàng...vì thế nếu đủ điều kiện hãy tranh thủ trở thành một thành viên của MămmyClub bạn nhé!`,
  },
  {
    id: 3,
    image: BecomeMammyMember,
    title: (
      <SlideTitle
        isFirst={false}
        preTitle="Trở thành thành viên"
        subTitle="và hưởng ưu đãi"
      />
    ),
    desc: "Kể từ lần mua hàng tiếp theo tại Mămmy Zalo Mini App sau khi đăng ký  thì hệ thống sẽ tự động  có ưu đãi cho bạn, nhưng lưu ý cần mua hàng với hóa đơn đủ điều kiện bạn nhé !",
  },
];

const enum SubscriptionRegisterStepType {
  RegisterInfo,
  RegisterDetails,
  PaymentMethod,
  PaymentInfo,
  PaymentUpload,
  PaymentStatus,
}

const SeenSubscriptionKey = "seen-intro-subscription";

const SubscriptionPage = () => {
  const [isFirstView, setIsFirstView] = useState<boolean>(
    Boolean(localStorage.getItem(SeenSubscriptionKey))
  );
  const [currentStep, setCurrentStep] =
    useState<SubscriptionRegisterStepType>();
  const [currentSlide, setCurrentSlide] = useState<SubscriptionSlideProps>(
    subscriptionSlide?.[0]
  );

  const { data: subscriptionRes, isLoading } = useQuery(
    [QueryKey.SUBSCRIPTION],
    async () => await subscriptionService.getSubscription()
  );

  const handleNextSlide = () => {
    if (currentSlide?.id < subscriptionSlide.length) {
      setCurrentSlide(subscriptionSlide[currentSlide?.id]);
    } else {
      setIsFirstView(true);
      localStorage.setItem(SeenSubscriptionKey, "1");
    }
  };

  const handleSubmit = async () => {
    setCurrentStep(SubscriptionRegisterStepType.RegisterInfo);
  };

  return (
    <Page className="flex flex-col bg-background">
      <HeaderSecond title="Combo sản phẩm ưu đãi" showBackIcon />
      <Box className="flex-1 overflow-auto scrollbar-hide">
        {isFirstView ? (
          <Box className="m-4">
            <SlideTitle
              isFirst={false}
              preTitle="Sử dụng combo sản phẩm ưu đãi để có nhiều ưu đãi hơn"
              subTitle=""
            />
            {isLoading ? (
              <ComboListSkeleton />
            ) : (
              <SubscriptionList
                data={subscriptionRes}
                onContinue={() => handleSubmit()}
                onSubmit={() =>
                  setCurrentStep(SubscriptionRegisterStepType.RegisterInfo)
                }
              />
            )}

            {currentStep === SubscriptionRegisterStepType.RegisterInfo && (
              <SubscriptionRegisterInfo
                onContinue={() =>
                  setCurrentStep(SubscriptionRegisterStepType.RegisterDetails)
                }
                onClose={() => setCurrentStep(undefined)}
              />
            )}
            {currentStep === SubscriptionRegisterStepType.RegisterDetails && (
              <SubscriptionRegisterDetails
                onContinue={() => {
                  setCurrentStep(SubscriptionRegisterStepType.PaymentInfo);
                }}
                onClose={() => setCurrentStep(undefined)}
              />
            )}
            {currentStep === SubscriptionRegisterStepType.PaymentInfo && (
              <SubscriptionPaymentInfo
                onContinue={() =>
                  setCurrentStep(SubscriptionRegisterStepType.PaymentUpload)
                }
              />
            )}
            {currentStep === SubscriptionRegisterStepType.PaymentUpload && (
              <SubscriptionPaymentUpload
                onContinue={() =>
                  setCurrentStep(SubscriptionRegisterStepType.PaymentStatus)
                }
              />
            )}
            {currentStep === SubscriptionRegisterStepType.PaymentStatus && (
              <SubscriptionPaymentStatus paymentStatus={true} />
            )}
          </Box>
        ) : (
          <IntroduceSlide
            key={currentSlide.id}
            image={currentSlide.image}
            desc={currentSlide.desc}
            titleIntro={currentSlide.title}
            onNext={handleNextSlide}
            onExit={() => {
              setIsFirstView(true);
              localStorage.setItem(SeenSubscriptionKey, "1");
            }}
          />
        )}
      </Box>
    </Page>
  );
};

export default SubscriptionPage;
