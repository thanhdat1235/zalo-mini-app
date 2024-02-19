import {
  AnyAction,
  Reducer,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import {
  cartReducer,
  homeConfigReducer,
  orderReducer,
  saleReducer,
  subscriptionReducer,
  userReducer,
  voucherReducer,
} from "../slices";
const appReducer = combineReducers({
  userStore: userReducer,
  subscriptionStore: subscriptionReducer,
  cartStore: cartReducer,
  orderStore: orderReducer,
  homeConfigStore: homeConfigReducer,
  saleStore: saleReducer,
  voucherStore: voucherReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "RESET_STATE") {
    state = {} as RootState;
  }

  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
