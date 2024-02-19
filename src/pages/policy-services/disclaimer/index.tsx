import HeaderSecond from "components/header/header-second";
import React from "react";
import { useQuery } from "react-query";
import { PrivacyPolicyService } from "services/privacy-policy-service";
import { QueryKey } from "types/api";
import { PageScrollView } from "zalo-ui";
import { Box } from "zmp-ui";

const Disclaimer = () => {
  const { data } = useQuery({
    queryKey: [QueryKey.PRIVACY_POLICY],
    queryFn: PrivacyPolicyService.getPrivacyPolicy,
  });

  return (
    <PageScrollView
      renderHeader={
        <HeaderSecond title="Tuyên bố miễn trừ" showBackIcon={true} />
      }
      scrollToTop
      targetIdScroll="disclaimer-page"
    >
      <Box id="disclaimer-page" className="overflow-auto flex-1 px-2">
        <Box
          dangerouslySetInnerHTML={{
            __html: data?.disclaimer || "",
          }}
        ></Box>
      </Box>
    </PageScrollView>
  );
};

export default Disclaimer;
