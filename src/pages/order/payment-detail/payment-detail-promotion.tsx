import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Icon, Text, useNavigate } from "zmp-ui";

import IconTicket from "assets/svg/ticket.svg";
import { PATH_NAME } from "constants/router";
import { VoucherByCode, VoucherSystem } from "models/voucher";
import { RootState } from "redux/store";
import { formatCurrencyVND } from "utils/number";
import { TouchOpacity } from "zalo-ui";

const PaymentDetailPromotion = () => {
  const navigate = useNavigate();

  const voucherByCodeSelected = useSelector<RootState, VoucherByCode>(
    (state) => state.voucherStore.voucherByCodeSelected
  );
  const voucherSystemSelected = useSelector<RootState, VoucherSystem>(
    (state) => state.voucherStore.voucherSystemSelected
  );

  const getInfoVoucherByCode = useMemo(() => {
    return voucherByCodeSelected.discount
      ? `Mã giảm ${formatCurrencyVND(voucherByCodeSelected.discount)}`
      : voucherByCodeSelected.discountPercent
      ? `Mã giảm ${voucherByCodeSelected.discountPercent}%`
      : "Mã giảm giá";
  }, [voucherByCodeSelected]);

  const getInfoVoucherSystem = useMemo(() => {
    let description = "";
    if (voucherSystemSelected.name) {
      description = voucherSystemSelected.name;
    } else if (voucherSystemSelected.description) {
      description = voucherSystemSelected.description;
    } else if (voucherSystemSelected.discount) {
      description = `Mã giảm ${formatCurrencyVND(
        voucherSystemSelected.discount
      )}`;
    } else if (voucherSystemSelected.discountPercent) {
      description = `Mã giảm ${voucherSystemSelected.discountPercent}%`;
    }
    return description;
  }, [voucherSystemSelected]);

  return (
    <Box className="p-4 pb-0">
      <Text className="text-base">Mã giảm giá</Text>
      <Box className="flex items-center py-4 justify-between">
        <Box className="w-[12%]">
          <img
            src={IconTicket}
            className="w-full object-cover"
            alt="icon ticket"
          />
        </Box>
        <TouchOpacity
          className="flex flex-row items-center gap-2"
          onClick={() => navigate(PATH_NAME.TICKET_APPLY)}
        >
          <>
            {voucherByCodeSelected?.id ? (
              <TouchOpacity className="flex items-center">
                <Box className="border border-primary border-dashed px-2 py-[2px] max-w-[100px] bg-[#9bd929] bg-opacity-5">
                  <Text className="line-clamp-1 text-[8px] text-primary">
                    {getInfoVoucherByCode}
                  </Text>
                </Box>
              </TouchOpacity>
            ) : null}
            {voucherSystemSelected?.id ? (
              <TouchOpacity className="flex items-center">
                <Box className="border border-primary border-dashed px-2 py-[2px] max-w-[100px] bg-[#9bd929] bg-opacity-5">
                  <Text className="line-clamp-1 text-[8px] text-primary">
                    {getInfoVoucherSystem}
                  </Text>
                </Box>
              </TouchOpacity>
            ) : null}
            {voucherByCodeSelected?.id || voucherSystemSelected?.id ? (
              <Icon icon="zi-chevron-right" className="w-2" size={16} />
            ) : null}
          </>
        </TouchOpacity>

        {!voucherByCodeSelected?.id && !voucherSystemSelected?.id ? (
          <Button
            className="!bg-background text-primary border border-primary border-solid text-xs w-[100px]"
            size="small"
            onClick={() => navigate(PATH_NAME.TICKET_APPLY)}
          >
            Áp dụng mã
          </Button>
        ) : null}
      </Box>
      <Box></Box>
    </Box>
  );
};

export default PaymentDetailPromotion;
