import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  saleVoucherSelected: number;
  displayedSaleAutomation: boolean;
};

const initialState: initialStateType = {
  saleVoucherSelected: 0,
  displayedSaleAutomation: false,
};

const saleSlice = createSlice({
  name: "sale-voucher",
  initialState: initialState,
  reducers: {
    setSaleVoucherSelected: (state, action) => {
      state.saleVoucherSelected = action.payload;
    },
    setDisplayedSaleAutomation: (state, action) => {
      state.displayedSaleAutomation = action.payload;
    },
  },
});

const { reducer, actions } = saleSlice;

export const { setSaleVoucherSelected, setDisplayedSaleAutomation } = actions;

export default reducer;
