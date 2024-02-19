import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cart, CartItemUpdate } from "models/cart";
import { cartService } from "services/cart-service";
import { ListResponse } from "types/api";

type initialStateType = {
  // cart: ListResponse<CartItem> | null;
  // cartItemQuantity: number;
  cartItemSelected: number[];
};

const initialState: initialStateType = {
  // cart: null,
  // cartItemQuantity: 0,
  cartItemSelected: [],
};

// export const getCart = createAsyncThunk(
//   "cart/getCart",
//   async (_, { dispatch }) => {
//     try {
//       const cartRes = await cartService.getCart();
//       dispatch(setCart(cartRes));
//     } catch (err) {
//       console.log(err);
//     }
//   }
// );

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    // setCart: (state, action) => {
    //   state.cart = action.payload;
    // },
    // setCartItemQuantity: (state, action) => {
    //   state.cartItemQuantity = action.payload;
    // },
    setCartItemSelected: (state, action) => {
      state.cartItemSelected = action.payload;
    },
  },
});

const { reducer, actions } = cartSlice;

export const { setCartItemSelected } = actions;

export default reducer;
