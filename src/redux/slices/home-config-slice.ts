import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HomeConfig } from "models/home-config";
import { Sale } from "models/sale";
import { configService } from "services/config-service";

export interface FlashSaleTimeRemaining {
  hoursRemaining: string;
  minutesRemaining: string;
  secondsRemaining: string;
}
export interface FlashSaleState {
  flashSale?: Sale;
  timeRemaining?: FlashSaleTimeRemaining;
  expired?: boolean;
}

type initialStateType = {
  homeConfig: HomeConfig;
  flashSale: FlashSaleState[];
  isShowHomeBanner: boolean;
  isShowFollowZaloOA: boolean;
};

// {
//   flashSale: {},
//   timeRemaining: {
//     hoursRemaining: "0",
//     minutesRemaining: "0",
//     secondsRemaining: "0",
//   },
//   expired: false,
// }

const initialState: initialStateType = {
  homeConfig: {},
  flashSale: [],
  isShowHomeBanner: false,
  isShowFollowZaloOA: false,
};

export const getHomeConfig = createAsyncThunk(
  "home/HomeConfig",
  async (_, { dispatch }) => {
    try {
      const response = await configService.getHomeConfig();
      dispatch(setHomeConfig(response));
    } catch (err) {
      console.log(err);
    }
  }
);

const homeConfigSlice = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {
    setHomeConfig: (state, action) => {
      state.homeConfig = action.payload;
    },
    setIsShowHomeBanner: (state, action) => {
      state.isShowHomeBanner = action.payload;
    },
    setIsVisibleModelFollowOA: (state, action) => {
      state.isShowFollowZaloOA = action.payload;
    },
    setFlashSaleTimeRemaining: (state, action) => {
      const id = action.payload?.flashSale?.id;
      const flashSaleIndex = state.flashSale.findIndex(
        (item) => item.flashSale?.id === id
      );
      if (flashSaleIndex !== -1) {
        state.flashSale[flashSaleIndex] = {
          ...state.flashSale[flashSaleIndex],
          timeRemaining: action.payload.timeRemaining,
        };
      } else {
        state.flashSale = [
          ...state.flashSale,
          {
            timeRemaining: action.payload.timeRemaining,
            flashSale: action.payload.flashSale,
          },
        ];
      }
    },
    setExpired: (state, action) => {
      const id = action.payload?.flashSale?.id;
      const flashSaleIndex = state.flashSale.findIndex(
        (item) => item.flashSale?.id === id
      );
      if (flashSaleIndex !== -1) {
        state.flashSale[flashSaleIndex] = {
          ...state.flashSale[flashSaleIndex],
          expired: action.payload.expired,
        };
      } else {
        state.flashSale = [
          ...state.flashSale,
          {
            flashSale: action.payload.flashSale,
            expired: action.payload.expired,
          },
        ];
      }
    },
  },
});

const { reducer, actions } = homeConfigSlice;

export const {
  setHomeConfig,
  setIsShowHomeBanner,
  setIsVisibleModelFollowOA,
  setFlashSaleTimeRemaining,
  setExpired,
} = actions;

export default reducer;
