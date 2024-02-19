import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  Subscription,
  SubscriptionBuyRequest,
  SubscriptionBuyResponse,
  SubscriptionDTO,
} from "models/subscription";
import { RootState } from "redux/store";
import { subscriptionService } from "services/subscription-service";

type initialStateType = {
  currentSubscription: Subscription | undefined;
  subscriptionBuyResponse: SubscriptionBuyResponse;
  subscriptionBuyRequest: SubscriptionBuyRequest;
  purchasedSubscription: SubscriptionDTO;
};

const initialState: initialStateType = {
  currentSubscription: undefined,
  subscriptionBuyRequest: {},
  subscriptionBuyResponse: {},
  purchasedSubscription: {},
};

export const setTempSubscription = createAsyncThunk(
  "subscription/setTempSubscription",
  async (_, { dispatch }) => {
    try {
      const subscriptions = await subscriptionService.getSubscription();
      if (subscriptions?.content?.[0])
        dispatch(setSubscription(subscriptions.content[0]));
    } catch (error) {
      console.log("Error when get user info:", error);
    }
  }
);

export const buySubscription = createAsyncThunk(
  "subscription/buy",
  async (buyInfo: SubscriptionBuyRequest, { getState, dispatch }) => {
    try {
      const { subscriptionStore } = getState() as RootState;
      const subscriptionId = subscriptionStore?.currentSubscription?.id;

      if (subscriptionId) {
        const response = await subscriptionService.buySubscription(
          subscriptionId,
          buyInfo
        );
        console.log(
          "🚀 ~ file: subscription-slice.ts:48 ~ response:",
          response
        );
        dispatch(setSubscriptionBuyResponse(response));
      }
    } catch (error) {}
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.currentSubscription = action.payload;
    },
    setSubscriptionBuyRequest: (state, action) => {
      state.subscriptionBuyRequest = {
        ...state.subscriptionBuyRequest,
        ...action.payload,
      };
    },
    setSubscriptionBuyResponse: (state, action) => {
      state.subscriptionBuyResponse = action.payload;
    },
    setPurchasedSubscription: (state, action) => {
      state.purchasedSubscription = action.payload;
    },
  },
});

const { reducer, actions } = subscriptionSlice;

export const {
  setSubscription,
  setSubscriptionBuyRequest,
  setSubscriptionBuyResponse,
  setPurchasedSubscription,
} = actions;

export default reducer;
