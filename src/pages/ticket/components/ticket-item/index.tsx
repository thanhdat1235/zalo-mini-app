import React, { useEffect, useMemo, useState } from "react";
import { Box, Checkbox, Text, useNavigate } from "zmp-ui";

import TicketIcon from "assets/svg/ticket.svg";
import { PATH_NAME } from "constants/router";
import useURLParams from "hooks/useURLParams";
import { VoucherByCode, VoucherSystem, VoucherType } from "models/voucher";
import { saleService } from "services/sale-service";
import { displayDate } from "utils/date";
import { formatCurrencyVND } from "utils/number";
import { TouchOpacity } from "zalo-ui";

interface TicketItemProps {
  voucherSystem?: VoucherSystem;
  voucherByCode?: VoucherByCode;
  voucherSystemSelected?: VoucherSystem;
  voucherByCodeSelected?: VoucherByCode;
  showCheckBox?: boolean;
}

const VoucherItem = ({
  voucherByCode,
  voucherSystem,
  voucherSystemSelected,
  voucherByCodeSelected,
  showCheckBox = true,
}: TicketItemProps) => {
  const navigate = useNavigate();

  const { canUse } = useURLParams();

  const [voucherByCodeDetail, setVoucherByCodeDetail] =
    useState<VoucherByCode>();

  useEffect(() => {
    if (
      voucherByCode?.id &&
      voucherByCode.type === VoucherType.GIFT &&
      !voucherByCodeDetail
    ) {
      getVoucherCodeById(voucherByCode.id);
    }
  }, [voucherByCode]);

  const getVoucherCodeById = async (id: number) => {
    try {
      const response = await saleService.getVoucherCodeById({ id });
      setVoucherByCodeDetail(response);
    } catch (error) {
      throw error;
    }
  };

  const getInfoVoucherByCode = () => {
    if (voucherByCode?.type === VoucherType.SALE) {
      return voucherByCode?.discount
        ? `Mã giảm ${formatCurrencyVND(voucherByCode.discount)}`
        : voucherByCode?.discountPercent
        ? `Mã giảm ${voucherByCode.discountPercent}%`
        : "Mã giảm giá";
    } else {
      return `Quà tặng sản phẩm ${voucherByCodeDetail?.productConfigDTO?.name || ''}`;
    }
  };

  const getInfoVoucherSystem = () => {
    let description = "Mã ưu đãi";
    if (voucherSystem?.name) {
      description = voucherSystem.name;
    } else if (voucherSystem?.description) {
      description = voucherSystem.description;
    } else if (voucherSystem?.discount) {
      description = `Mã giảm ${formatCurrencyVND(voucherSystem.discount)}`;
    } else if (voucherSystem?.discountPercent) {
      description = `Mã giảm ${voucherSystem.discountPercent}%`;
    }
    return description;
  };

  const infoVoucher = useMemo(() => {
    return {
      id: voucherSystem?.id || voucherByCode?.id,
      name: voucherSystem
        ? getInfoVoucherSystem()
        : voucherByCode
        ? getInfoVoucherByCode()
        : "Mã giảm giá",
      endDate: displayDate(
        new Date(voucherSystem?.endDate || voucherByCode?.endDate || "")
      ),
      canUse: voucherSystem ? voucherSystem.canUse : true,
      checked: () => {
        if (voucherSystem) {
          return voucherSystemSelected?.id === voucherSystem?.id;
        } else if (voucherByCode) {
          return (
            voucherByCodeSelected?.customerVoucherCode ===
            voucherByCode.customerVoucherCode
          );
        }
        return false;
      },
    };
  }, [
    voucherSystemSelected,
    voucherSystem,
    voucherByCodeSelected,
    voucherByCode,
    voucherByCodeDetail,
  ]);

  const handleNavigate = () => {
    if (voucherSystem?.id) {
      navigate(
        `${PATH_NAME.VOUCHER_PAGE}/${voucherSystem?.id}?canUse=${infoVoucher.canUse}&type=voucherSystem`
      );
    } else if (voucherByCode?.id) {
      navigate(
        `${PATH_NAME.VOUCHER_PAGE}/${voucherByCode?.id}?canUse=true&type=voucherByCode`
      );
    }
  };

  return (
    <TouchOpacity className={`flex my-3 relative overflow-hidden`}>
      {!canUse && showCheckBox && (
        <Box className="m-auto">
          <Checkbox value={0} checked={infoVoucher.checked()} size="small" />
        </Box>
      )}
      <Box className="flex-1 flex bg-background-primary rounded-l-xl rounded-r-[8px] pl-5 pr-2 py-2">
        <img src={TicketIcon} alt="ticket icon" />
        <Box className="ml-4 w-full">
          <Text className="mb-1 line-clamp-2 font-semibold text-[14px]">
            {infoVoucher.name || ""}
          </Text>
          <Text size="small" className="font-light text-[12px]">
            Hết hạn vào ngày {infoVoucher.endDate}
          </Text>
          {!canUse && (
            <TouchOpacity
              className="py-1 px-2 w-fit ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
            >
              <Text className="text-primary-color text-xs">Điều kiện</Text>
            </TouchOpacity>
          )}
        </Box>
      </Box>
      <Box className="w-[48px] top-0 right-0 bottom-0 bg-background-primary rounded-l-lg rounded-r-[8px] relative">
        <Box className="w-[2px] h-3 bg-background absolute top-0 left-[-1px]"></Box>
        <Box className="w-[2px] h-3 bg-background absolute top-[20px] left-[-1px]"></Box>
        <Box className="w-[2px] h-3 bg-background absolute top-[40px] left-[-1px]"></Box>
        <Box className="w-[2px] h-3 bg-background absolute top-[60px] left-[-1px]"></Box>
        <Box className="w-[2px] h-3 bg-background absolute top-[80px] left-[-1px]"></Box>
      </Box>
    </TouchOpacity>
  );
};

export default VoucherItem;
