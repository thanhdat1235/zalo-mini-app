import { TotalOrderRes } from "models/orders";
import { Affiliate, Customer, CustomerRequest } from "models/user";
import {
  ListResponse,
  SearchParams,
  UpdatePhoneNumberOrLocation,
} from "types/api";
import axiosClient from "./axios-service";
import {
  CUSTOMER_AFFILIATE_URL,
  CUSTOMER_PROFILE_URL,
  CUSTOMER_SUBSCRIPTION_URL,
  CUSTOMER_URL,
  CUSTOMER_USE_AFFILIATE_URL,
} from "./url";
import { Subscription } from "models/subscription";

export const userService = {
  getUserInfo: async (): Promise<Customer> => {
    return axiosClient()({
      method: "GET",
      url: `${CUSTOMER_URL}/info`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateUser: async (data: CustomerRequest): Promise<Customer> => {
    return axiosClient()({
      method: "PATCH",
      url: `${CUSTOMER_URL}`,
      data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updatePhoneNumberOrLocationUser: async (
    data: UpdatePhoneNumberOrLocation,
  ): Promise<Customer> => {
    return axiosClient()({
      method: "PATCH",
      url: `${CUSTOMER_PROFILE_URL}/zalo-profile`,
      data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getTotalOrder: async (): Promise<TotalOrderRes> => {
    return axiosClient()({
      method: "GET",
      url: `${CUSTOMER_URL}/total-your-order`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateFollowZaloOA: async ({
    id,
    isFollowOA,
  }: {
    id?: number;
    isFollowOA: boolean;
  }): Promise<Customer> => {
    return axiosClient()({
      method: "PATCH",
      url: `${CUSTOMER_URL}`,
      data: {
        id,
        isFollowOA,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  affiliates: async (
    params: SearchParams,
  ): Promise<ListResponse<Affiliate>> => {
    return axiosClient()({
      method: "GET",
      url: `${CUSTOMER_AFFILIATE_URL}`,
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  useAffiliateCode: async (affiliateCode: string): Promise<string> => {
    return axiosClient()({
      method: "PATCH",
      url: `${CUSTOMER_USE_AFFILIATE_URL}/${affiliateCode}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
