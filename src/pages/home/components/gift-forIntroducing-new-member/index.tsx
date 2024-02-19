import { ga4 } from "components/app";
import { EVENT_ACTION } from "constants";
import { PATH_NAME } from "constants/router";
import { Sale, SaleType } from "models/sale";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "zmp-ui";

interface GiftForIntroducingNewMemberProps {
  sale?: Sale;
  bannerUrl?: string;
  bannerFileName?: string;
}

const GiftForIntroducingNewMember = ({
  sale,
  bannerUrl,
  bannerFileName,
}: GiftForIntroducingNewMemberProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (sale?.type === SaleType.SALE_FOR_NEW_CUSTOMER) {
      navigate(`${PATH_NAME.FLASH_SALE}/${sale.id}`);

      ga4.trackEvent(EVENT_ACTION.SALE_FOR_NEW_CUSTOMER.CLICK, {
        search_term: { id: sale?.id },
      });
    }
  };

  return (
    <Box className="mt-1" onClick={handleNavigate}>
      <img src={bannerUrl} alt={bannerFileName} className="bg-cover" />
    </Box>
  );
};

export default GiftForIntroducingNewMember;
