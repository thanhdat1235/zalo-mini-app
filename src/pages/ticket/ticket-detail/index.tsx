import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Page, Text, useSnackbar } from "zmp-ui";

import TicketIcon from "assets/svg/ticket.svg";
import HeaderSecond from "components/header/header-second";
import { TicketDetailPageSkeleton } from "components/skeletons";
import useURLParams from "hooks/useURLParams";
import { VoucherByCode, VoucherSystem, VoucherType } from "models/voucher";
import { setOrder } from "redux/slices/order-slice";
import {
  VoucherStateType,
  setVoucherByCodeSelected,
  setVoucherSystemSelected,
} from "redux/slices/voucher-slice";
import { AppDispatch, RootState } from "redux/store";
import { saleService } from "services/sale-service";
import {
  DATE_FORMAT_DDMMYYYYTHHMMSS_DISPLAY,
  displayDate,
  formatDate,
} from "utils/date";
import { formatCurrencyVND } from "utils/number";

enum TypeVoucher {
  VOUCHER_SYSTEM = "voucherSystem",
  VOUCHER_BY_CODE = "voucherByCode",
}

const TicketDetailPage = () => {
  const { openSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { id } = useParams();
  const { canUse, type } = useURLParams();

  const dispatch = useDispatch<AppDispatch>();

  const voucherStore = useSelector<RootState, VoucherStateType>(
    (state) => state.voucherStore
  );

  const [voucherSystem, setVoucherSystem] = useState<VoucherSystem>({});
  const [voucherByCode, setVoucherByCode] = useState<VoucherByCode>({});

  useEffect(() => {
    if (id) {
      if (type === TypeVoucher.VOUCHER_SYSTEM) {
        handleGetVoucherSystemDetail(Number.parseInt(id));
      } else if (type === TypeVoucher.VOUCHER_BY_CODE) {
        handleGetVoucherByCodeDetail(Number.parseInt(id));
      }
    }
  }, [id]);

  const handleGetVoucherSystemDetail = async (id: number) => {
    try {
      const response = await saleService.getVoucherSystemDetailById(id);
      setVoucherSystem(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetVoucherByCodeDetail = async (id: number) => {
    try {
      const response = await saleService.getVoucherCodeById({ id });
      setVoucherByCode(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApplyVoucher = () => {
    if (type === TypeVoucher.VOUCHER_SYSTEM) {
      dispatch(
        setOrder({
          voucherIds: [voucherSystem?.id],
        })
      );
      dispatch(setVoucherSystemSelected({ ...voucherSystem, isNew: true }));
    } else if (type === TypeVoucher.VOUCHER_BY_CODE) {
      const voucherByCode = voucherStore.vouchersByCode?.find(
        (item) => item.id == id
      );
      dispatch(
        setOrder({
          customerVoucherCode: voucherByCode?.customerVoucherCode,
        })
      );
      dispatch(setVoucherByCodeSelected({ ...voucherByCode, isNew: true }));
    }
    openSnackbar({
      icon: true,
      type: "success",
      text: "Sử dụng mã giảm giá thành công",
    });
    navigate(-2);
  };

  const getNameVoucherByCode = () => {
    if (voucherByCode?.type === VoucherType.SALE) {
      return voucherByCode?.discount
        ? `Mã giảm ${formatCurrencyVND(voucherByCode.discount)}`
        : voucherByCode?.discountPercent
        ? `Mã giảm ${voucherByCode.discountPercent}%`
        : "Mã giảm giá";
    } else {
      return `Quà tặng sản phẩm ${voucherByCode?.productConfigDTO?.name}`;
    }
  };

  const getInfoVoucher = useMemo(() => {
    return {
      startDate: voucherSystem.startDate || voucherByCode.startDate || null,
      endDate: voucherSystem.endDate || voucherByCode.endDate || null,
      name: voucherSystem.name || getNameVoucherByCode() || "",
      description: voucherSystem.description || "",
      minimumOrderPrice:
        voucherSystem.minimumOrderPrice || voucherByCode.minimumOrderPrice || 0,
      maxQuantityUseInUser:
        voucherSystem.maxQuantityUseInUser ||
        voucherByCode.maxQuantityUseInUser ||
        0,
      totalQuantity:
        voucherSystem.totalQuantity || voucherByCode.totalQuantity || 0,
      totalQuantityUsed:
        voucherSystem.totalQuantityUsed || voucherByCode.totalQuantityUsed || 0,
    };
  }, [voucherByCode, voucherSystem]);

  return (
    <Page className="flex-1 flex flex-col bg-background">
      <HeaderSecond title="Chi tiết mã ưu đãi" showBackIcon={true} />
      {Object.keys(voucherByCode)?.length > 0 ||
      Object.keys(voucherSystem)?.length > 0 ? (
        <Box className="flex-1 overflow-auto scrollbar-hide">
          <Box className="m-4">
            <Box className="flex-1 flex bg-background-primary rounded-l-xl rounded-r-[8px] pl-5 pr-2 py-2">
              <img src={TicketIcon} alt="ticket icon" />
              <Box className="ml-4 w-full">
                <Text className="mb-1 line-clamp-2 font-semibold text-[14px]">
                  {getInfoVoucher.name || ""}
                </Text>
                {getInfoVoucher.endDate ? (
                  <Text size="small" className="font-light text-[12px]">
                    Hết hạn vào ngày{" "}
                    {formatDate(
                      getInfoVoucher.endDate,
                      DATE_FORMAT_DDMMYYYYTHHMMSS_DISPLAY
                    )}
                  </Text>
                ) : null}
              </Box>
            </Box>
          </Box>
          {getInfoVoucher.startDate && getInfoVoucher.endDate && (
            <Box className="mt-2 mx-4">
              <Text className="text-lg font-normal">Hạn sử dụng mã:</Text>
              <Text className="mx-2 text-sm">{`+ ${displayDate(
                new Date(getInfoVoucher.startDate)
              )} - ${displayDate(
                new Date(getInfoVoucher.endDate || "")
              )}`}</Text>
            </Box>
          )}
          <Box className="mt-2 mx-4">
            <Text className="text-lg font-normal">Giới thiệu:</Text>
            <Text className="mt mx-2 text-sm font-normal">
              {`+ ${getInfoVoucher.name || ""}`}
            </Text>
            {getInfoVoucher?.description && (
              <Text className="mt-1 mx-2 text-sm font-normal">
                {`+ ${getInfoVoucher?.description}`}
              </Text>
            )}
          </Box>
          <Box className="mt-2 mx-4">
            <Text className="text-lg font-normal">Điều kiện áp dụng:</Text>
            <Text>
              {getInfoVoucher.minimumOrderPrice != null ? (
                <Text className="mx-2 text-sm">{`+ Giá trị đơn hàng tối thiểu ${formatCurrencyVND(
                  getInfoVoucher.minimumOrderPrice
                )}`}</Text>
              ) : null}
              {getInfoVoucher.maxQuantityUseInUser ? (
                <Text className="mx-2 text-sm">{`+ Số lượng có thể sử dụng mã tối đa ${getInfoVoucher.maxQuantityUseInUser} lần`}</Text>
              ) : null}
              {getInfoVoucher.totalQuantity ? (
                <Text className="mx-2 text-sm">{`+ Tổng số lượng ${getInfoVoucher.totalQuantity}`}</Text>
              ) : null}
              {getInfoVoucher.totalQuantityUsed ? (
                <Text className="mx-2 text-sm">{`+ Số lượng đã sử dụng ${getInfoVoucher.totalQuantityUsed}`}</Text>
              ) : null}
            </Text>
          </Box>
          <Box className="bg-background px-4 fixed bottom-0 left-0 right-0 z-[99] pb-[20px] pt-2">
            <Button
              className="w-full rounded-2xl text-lg"
              size="large"
              disabled={canUse === "false"}
              onClick={handleApplyVoucher}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>
      ) : (
        <TicketDetailPageSkeleton />
      )}
    </Page>
  );
};

export default TicketDetailPage;
