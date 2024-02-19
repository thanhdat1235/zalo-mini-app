import HeaderSecond from "components/header/header-second";
import React from "react";
import { useQuery } from "react-query";
import { PrivacyPolicyService } from "services/privacy-policy-service";
import { QueryKey } from "types/api";
import { PageScrollView } from "zalo-ui";
import { Box } from "zmp-ui";

const InspectionPolicy = () => {
  const { data } = useQuery({
    queryKey: [QueryKey.PRIVACY_POLICY],
    queryFn: PrivacyPolicyService.getPrivacyPolicy,
  });

  return (
    <PageScrollView
      renderHeader={
        <HeaderSecond title="Chính sách kiểm hàng" showBackIcon={true} />
      }
    >
      <Box className="overflow-auto flex-1 px-2">
        <Box
          dangerouslySetInnerHTML={{
            __html: data?.inspectionPolicy || "",
          }}
        ></Box>
      </Box>
    </PageScrollView>
  );
};

export default InspectionPolicy;
