import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Icon, useSnackbar } from "zmp-ui";

import { globalLoading } from "components/global-loading";
import useDidMountEffect from "hooks/useDidMountEffect";
import { setVouchersByCode } from "redux/slices/voucher-slice";
import { RootState } from "redux/store";
import { saleService } from "services/sale-service";
import { TouchOpacity } from "zalo-ui";

interface TicketInputProps {}

const TicketInput = ({}: TicketInputProps) => {
  const { openSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [codeInput, setCodeInput] = useState<string>("");

  const totalAmount = useSelector<RootState, number>(
    (state) => state.orderStore.totalAmount
  );

  const getVoucherCode = async ({
    amount,
    code,
  }: {
    amount: number;
    code: string;
  }) => {
    try {
      globalLoading.show();
      const response = await saleService.getVoucherCode({ amount, code });
      dispatch(setVouchersByCode({ ...response, customerVoucherCode: code }));
    } catch (error: any) {
      openSnackbar({
        icon: true,
        type: "warning",
        text:
          error?.data?.response?.message ||
          "Không tìm thấy, hết hạn hoặc voucher này đã được sử dụng",
        duration: 1000,
      });
      console.log(error);
    } finally {
      globalLoading.hide();
    }
  };

  const handleClickGetVoucherCode = () => {
    if (totalAmount) {
      getVoucherCode({
        code: codeInput,
        amount: totalAmount,
      });
    }
  };

  return (
    <Box className="m-4 flex items-center bg-background-primary rounded-3xl h-[57px] z-10">
      <Box className="relative px-2 py-1 flex-1 h-full">
        <label
          htmlFor="ticket-input"
          className="text-md block text-[13px] font-semibold ml-3"
        >
          Nhập mã giảm giá
        </label>
        <input
          value={codeInput}
          type="text"
          id="ticket-input"
          className="w-full border-none outline-none bg-transparent text-[12px] ml-3 pr-4"
          placeholder="XXXXXX"
          onChange={(e) => setCodeInput(e.target.value)}
        />
        {codeInput.length > 0 ? (
          <TouchOpacity onClick={() => setCodeInput("")}>
            <Icon
              icon="zi-close-circle"
              size={13}
              className="absolute right-2 top-[65%] translate-y-[-50%]"
            />
          </TouchOpacity>
        ) : null}
      </Box>
      <Button
        size="medium"
        className="rounded-2xl h-full"
        disabled={!(codeInput.length > 0)}
        onClick={handleClickGetVoucherCode}
      >
        Nhập
      </Button>
    </Box>
  );
};

export default TicketInput;
