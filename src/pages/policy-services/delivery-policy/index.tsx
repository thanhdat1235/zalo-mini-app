import HeaderSecond from "components/header/header-second";
import React from "react";
import { useQuery } from "react-query";
import { PrivacyPolicyService } from "services/privacy-policy-service";
import { QueryKey } from "types/api";
import { PageScrollView } from "zalo-ui";
import { Box } from "zmp-ui";

const DeliveryPolicy = () => {
  const { data } = useQuery({
    queryKey: [QueryKey.PRIVACY_POLICY],
    queryFn: PrivacyPolicyService.getPrivacyPolicy,
  });

  return (
    <PageScrollView
      renderHeader={
        <HeaderSecond title="Chính sách giao hàng" showBackIcon={true} />
      }
      scrollToTop
      targetIdScroll="policy-page"
    >
      <Box id="policy-page" className="overflow-auto flex-1 px-2">
        <Box
          dangerouslySetInnerHTML={{
            __html: data?.deliveryPolicy || "",
          }}
        ></Box>
      </Box>
    </PageScrollView>
  );
};

export default DeliveryPolicy;
