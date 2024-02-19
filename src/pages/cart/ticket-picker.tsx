import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Icon, Text, useNavigate } from "zmp-ui";

import { PATH_NAME } from "constants/router";
import { VoucherByCode, VoucherSystem } from "models/voucher";
import { RootState } from "redux/store";
import { formatCurrencyVND } from "utils/number";
import { TouchOpacity } from "zalo-ui";
import TicketIcon from "../../assets/svg/ticket.svg";

interface TicketPickerProps {
  onSelect(): void;
}

const TicketPicker = ({ onSelect }: TicketPickerProps) => {
  const navigate = useNavigate();

  const voucherSystemSelected = useSelector<RootState, VoucherSystem>(
    (state) => state.voucherStore.voucherSystemSelected
  );
  const voucherByCodeSelected = useSelector<RootState, VoucherByCode>(
    (state) => state.voucherStore.voucherByCodeSelected
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
    <Box className="border-b border-gray/[.2]">
      <Box className="mx-4 flex items-center">
        <Box className="flex items-center my-4">
          <img className="w-[20px]" src={TicketIcon} alt="ticket icon" />
          <Text className="ml-2 font-bold text-[12px]">Mămmy voucher:</Text>
        </Box>
        <Box className="flex-1 flex items-center justify-end">
          <TouchOpacity
            className="text-[12px] flex items-center"
            onClick={() => {
              onSelect();
              navigate(PATH_NAME.TICKET_APPLY);
            }}
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

            {!voucherByCodeSelected?.id && !voucherSystemSelected?.id ? (
              <Button
                className="!bg-background text-primary border border-primary border-solid text-xs w-[100px]"
                size="small"
                onClick={() => navigate(PATH_NAME.TICKET_APPLY)}
              >
                Áp dụng mã
              </Button>
            ) : null}
          </TouchOpacity>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketPicker;
