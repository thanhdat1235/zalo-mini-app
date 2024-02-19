import { createSlice } from "@reduxjs/toolkit";
import { VoucherByCode, VoucherSystem } from "models/voucher";

export type VoucherStateType = {
  voucherSystemSelected: VoucherSystem;
  vouchersByCode: VoucherByCode[];
  voucherByCodeSelected: VoucherByCode;
  vouchersSystem: VoucherSystem[];
};

const initialState: VoucherStateType = {
  voucherSystemSelected: {},
  voucherByCodeSelected: {},
  vouchersByCode: [],
  vouchersSystem: [],
};

const voucherSlice = createSlice({
  name: "voucher",
  initialState: initialState,
  reducers: {
    setVoucherSystemSelected: (state, action) => {
      if (
        state.voucherSystemSelected.id === action.payload.id &&
        !action.payload.isNew
      ) {
        state.voucherSystemSelected = {};
      } else {
        state.voucherSystemSelected = action.payload;
      }
    },
    setVoucherByCodeSelected: (state, action) => {
      if (
        state.voucherByCodeSelected.customerVoucherCode ===
          action.payload.customerVoucherCode &&
        !action.payload.isNew
      ) {
        state.voucherByCodeSelected = {};
      } else {
        state.voucherByCodeSelected = action.payload;
      }
    },
    setVouchersByCode: (state, action) => {
      const exitsCode =
        state.vouchersByCode.findIndex(
          (item) =>
            item.customerVoucherCode === action.payload.customerVoucherCode
        ) !== -1;
      if (!exitsCode) {
        state.vouchersByCode = [...state.vouchersByCode, action.payload];
      }
    },
    setVouchersSystem: (state, action) => {
      state.vouchersSystem = action.payload;
    },
  },
});

const { reducer, actions } = voucherSlice;

export const {
  setVoucherByCodeSelected,
  setVouchersByCode,
  setVoucherSystemSelected,
  setVouchersSystem,
} = actions;

export default reducer;
