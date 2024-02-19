import {
  CalculateReq,
  CalculateRes,
  Order,
  OrderRequest,
  ReorderStatus,
  UploadBillRequest,
} from "models/orders";
import { ListResponse, SearchParams } from "types/api";
import axiosClient from "./axios-service";
import { ORDER_URL, ORDER_USER_URL } from "./url";
import qs from "qs";

export const orderService = {
  getOrders: async (params: SearchParams): Promise<ListResponse<Order>> => {
    return axiosClient()({
      method: "GET",
      url: `${ORDER_USER_URL}/search`,
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getOrderById: async (id: number): Promise<Order> => {
    return axiosClient()({
      method: "GET",
      url: `${ORDER_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getCalculateOrder: async (data: CalculateReq): Promise<CalculateRes> => {
    return axiosClient()({
      method: "POST",
      url: `${ORDER_URL}/calculate`,
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createOrder: async (data: OrderRequest): Promise<Order> => {
    return axiosClient()({
      method: "POST",
      url: `${ORDER_URL}`,
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  reorderOrderByNhanhVnId: async (
    nhanhVnId: string,
  ): Promise<ReorderStatus> => {
    return axiosClient()({
      method: "POST",
      url: `${ORDER_URL}/re-order/${nhanhVnId}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  cancelOrder: async (id: number): Promise<string> => {
    return axiosClient()({
      method: "PATCH",
      url: `${ORDER_URL}/cancel/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  uploadBill: async (data: UploadBillRequest): Promise<string> => {
    return axiosClient()({
      method: "PATCH",
      url: `${ORDER_URL}/upload/bill/${data.id}`,
      params: {
        imageName: data.imageName,
        imageLink: data.imageLink,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
