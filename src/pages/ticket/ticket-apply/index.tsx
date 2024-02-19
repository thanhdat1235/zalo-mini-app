import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Page, useSnackbar } from "zmp-ui";

import HeaderSecond from "components/header/header-second";
import { OrderRequest } from "models/orders";
import { setOrder } from "redux/slices/order-slice";
import {
  VoucherStateType,
  setVouchersSystem,
} from "redux/slices/voucher-slice";
import { RootState } from "redux/store";
import { saleService } from "services/sale-service";
import TicketInput from "../ticket-input";
import TicketList from "../ticket-list";

const TicketApplyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );
  const voucher = useSelector<RootState, VoucherStateType>(
    (state) => state.voucherStore
  );
  const totalAmount = useSelector<RootState, number>(
    (state) => state.orderStore.totalAmount
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reFetchSaleVouchers, setReFetchSaleVouchers] =
    useState<boolean>(false);

  useEffect(() => {
    handleGetSaleVoucher();
  }, [reFetchSaleVouchers]);

  const handleGetSaleVoucher = async () => {
    try {
      setIsLoading(true);
      let nhanhVnProductIds: string[] = [];
      if (order.nhanhVnProductId) {
        nhanhVnProductIds = [order.nhanhVnProductId];
      } else if (order.carts && order.carts?.length > 0) {
        nhanhVnProductIds = order.carts.map(
          (product) => product.nhanhVnProductId as string
        );
      }
      if (nhanhVnProductIds.length > 0) {
        const response = await saleService.getVouchersSystem(
          nhanhVnProductIds,
          totalAmount || 0
        );
        dispatch(setVouchersSystem(response));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyVoucher = () => {
    openSnackbar({
      icon: true,
      type: "success",
      text: "Sử dụng mã giảm giá thành công",
      duration: 1000,
    });
    dispatch(
      setOrder({
        voucherIds: [voucher.voucherSystemSelected.id],
        customerVoucherCode: voucher.voucherByCodeSelected.customerVoucherCode,
      })
    );
    navigate(-1);
  };

  return (
    <Page className="flex-1 flex flex-col bg-background">
      <HeaderSecond title="Ưu đãi của bạn" showBackIcon={true} />
      <Box className="fixed top-[70px] left-0 right-0">
        <TicketInput />
      </Box>
      <Box id="ticket-page" className="overflow-auto flex-1 mt-[100px]">
        <TicketList
          vouchersSystem={voucher.vouchersSystem}
          vouchersByCode={voucher.vouchersByCode}
          isLoadingSale={isLoading}
        />
      </Box>
      <Box className="bg-background px-4 fixed bottom-0 left-0 right-0 z-[99] pb-[20px] pt-2">
        <Button
          className="w-full rounded-2xl text-lg"
          size="large"
          disabled={
            !voucher.voucherSystemSelected?.id &&
            !voucher.voucherByCodeSelected?.id
          }
          onClick={handleApplyVoucher}
        >
          Áp dụng
        </Button>
      </Box>
    </Page>
  );
};

export default TicketApplyPage;
