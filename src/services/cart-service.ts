import { Cart, CartItemUpdate } from "models/cart";
import axiosClient from "./axios-service";
import { CART_URL } from "./url";
import { ListResponse, SearchParams } from "types/api";

export const cartService = {
  getCart: async (params?: SearchParams): Promise<ListResponse<Cart>> => {
    return axiosClient()({
      method: "GET",
      url: `${CART_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateCartItem: async (cartItem: CartItemUpdate) => {
    return axiosClient()({
      method: "PATCH",
      url: `${CART_URL}/${cartItem.id}`,
      params: {
        id: cartItem.id,
      },
      data: {
        quantity: cartItem.quantity,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  deleteCartItem: async (cartItemId: number) => {
    return axiosClient()({
      method: "DELETE",
      url: CART_URL,
      params: {
        ids: cartItemId,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  addCartItem: async (nhanhVnId: string, quantity?: number) => {
    return axiosClient()({
      method: "POST",
      url: CART_URL,
      data: {
        quantity,
        nhanhVnProductId: nhanhVnId,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
