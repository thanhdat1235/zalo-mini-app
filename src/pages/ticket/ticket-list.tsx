import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text } from "zmp-ui";

import { TicketItemSkeleton } from "components/skeletons";
import { OrderRequest } from "models/orders";
import { VoucherByCode, VoucherSystem } from "models/voucher";
import { setOrder } from "redux/slices/order-slice";
import {
  setVoucherByCodeSelected,
  setVoucherSystemSelected,
} from "redux/slices/voucher-slice";
import { RootState } from "redux/store";
import { TouchOpacity } from "zalo-ui";
import VoucherItem from "./components/ticket-item";

interface TicketListProps {
  vouchersSystem?: VoucherSystem[];
  vouchersByCode?: VoucherByCode[];
  isLoadingSale?: boolean;
}

const TicketList = ({
  vouchersSystem,
  isLoadingSale,
  vouchersByCode,
}: TicketListProps) => {
  const dispatch = useDispatch();

  const cartItemSelected = useSelector<RootState, number[]>(
    (state) => state.cartStore.cartItemSelected
  );
  const voucherSystemSelected = useSelector<RootState, VoucherSystem>(
    (state) => state.voucherStore.voucherSystemSelected
  );
  const voucherByCodeSelected = useSelector<RootState, VoucherByCode>(
    (state) => state.voucherStore.voucherByCodeSelected
  );
  const order = useSelector<RootState, OrderRequest>(
    (state) => state.orderStore.order
  );

  const handleClickVoucherSystem = (voucher: VoucherSystem) => {
    if (voucher.id === voucherSystemSelected.id) {
      dispatch(
        setOrder({
          voucherIds: [],
        })
      );
    }
    dispatch(setVoucherSystemSelected(voucher));
  };

  const handleClickVoucherCode = (voucher: VoucherByCode) => {
    if (
      voucher.customerVoucherCode === voucherByCodeSelected.customerVoucherCode
    ) {
      dispatch(
        setOrder({
          customerVoucherCode: "",
        })
      );
    }
    dispatch(setVoucherByCodeSelected(voucher));
  };

  return (
    <Box className="mx-4">
      <Box className="mb-[100px]">
        {isLoadingSale ? (
          <>
            {[...Array(10)].map((__item, index) => (
              <TicketItemSkeleton key={index} />
            ))}
          </>
        ) : (
          <Box>
            {vouchersByCode && vouchersByCode?.length > 0 ? (
              <Box>
                <Text className="text-[12px] ml-2">
                  Mã giảm giá bạn đã tìm kiếm:
                </Text>
                {vouchersByCode.map((voucher) => (
                  <TouchOpacity
                    onClick={() => {
                      handleClickVoucherCode(voucher);
                    }}
                  >
                    <VoucherItem
                      voucherByCode={voucher}
                      voucherByCodeSelected={voucherByCodeSelected}
                    />
                  </TouchOpacity>
                ))}
              </Box>
            ) : null}
            {vouchersSystem && vouchersSystem?.length > 0 ? (
              <Box>
                <Text className="text-[12px] ml-2">Mã giảm giá hệ thống:</Text>
                {vouchersSystem?.map((voucher, index) => {
                  const disable =
                    !voucher.canUse ||
                    (cartItemSelected?.length <= 0 && !order.nhanhVnProductId);

                  return (
                    <TouchOpacity
                      key={index}
                      className={`${disable && "opacity-60"}`}
                      onClick={() => {
                        if (!disable) {
                          voucher.id && handleClickVoucherSystem(voucher);
                        }
                      }}
                    >
                      <VoucherItem
                        voucherSystem={voucher}
                        voucherSystemSelected={voucherSystemSelected}
                      />
                    </TouchOpacity>
                  );
                })}
              </Box>
            ) : null}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TicketList;
