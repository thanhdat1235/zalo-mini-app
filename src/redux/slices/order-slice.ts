import { createSlice } from "@reduxjs/toolkit";
import { OrderRequest } from "models/orders";

type initialStateType = {
  order: OrderRequest;
  totalAmount: number;
};

const initialState: initialStateType = {
  order: {},
  totalAmount: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order = { ...state.order, ...action.payload };
    },
    setSubscriptionGifts: (state, action) => {
      const subscriptionGifts = state.order.subscriptionGifts;
      if (subscriptionGifts) {
        const existsIndex = subscriptionGifts.findIndex(
          (item) => item.giftId === action.payload.giftId
        );
        if (existsIndex !== -1) {
          subscriptionGifts[existsIndex] = {
            ...subscriptionGifts[existsIndex],
            quantity: action.payload.quantity,
            nhanhVnProductId: action.payload.nhanhVnProductId,
          };
          state.order = {
            ...state.order,
            subscriptionGifts: subscriptionGifts,
          };
        } else {
          state.order = {
            ...state.order,
            subscriptionGifts: [...subscriptionGifts, action.payload],
          };
        }
      } else {
        state.order = {
          ...state.order,
          subscriptionGifts: [action.payload],
        };
      }
    },
    setSubscriptionProductGifts: (state, action) => {
      const productsSelected = action.payload;
      if (Array.isArray(productsSelected)) {
        productsSelected.forEach((product) => {
          const subscriptionGifts = state.order?.subscriptionGifts;
          if (subscriptionGifts) {
            const existsIndex = subscriptionGifts.findIndex(
              (item) =>
                item.nhanhVnProductId === product.nhanhVnProductId &&
                item.giftId === product.giftId
            );
            if (existsIndex !== -1) {
              subscriptionGifts[existsIndex] = {
                ...subscriptionGifts[existsIndex],
                quantity: product.quantity,
              };
              state.order = {
                ...state.order,
                subscriptionGifts: subscriptionGifts,
              };
            } else {
              state.order = {
                ...state.order,
                subscriptionGifts: [...subscriptionGifts, product],
              };
            }
          } else {
            state.order = {
              ...state.order,
              subscriptionGifts: [product],
            };
          }
        });
      }
    },
    setDeleteSubscriptionById: (state, action) => {
      state.order = {
        ...state.order,
        subscriptionGifts: state.order.subscriptionGifts?.filter(
          (item) => item.giftId !== action.payload.giftId
        ),
      };
    },
    resetOrder: (state, action) => {
      state.order = {};
    },
    setOrderByQuickBuy: (state, action) => {
      const { quantity, nhanhVnProductId, price, id } = action.payload;
      state.order = {
        id,
        quantity,
        nhanhVnProductId,
        price: price,
        cartIds: null,
        carts: null,
        voucherIds: null,
        affiliateCode: state.order?.affiliateCode,
      };
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
  },
});

const { reducer, actions } = orderSlice;

export const {
  setOrder,
  resetOrder,
  setOrderByQuickBuy,
  setTotalAmount,
  setSubscriptionGifts,
  setDeleteSubscriptionById,
  setSubscriptionProductGifts,
} = actions;

export default reducer;
