import {
  Subscription,
  SubscriptionBuyRequest,
  SubscriptionCustomerDetail,
  SubscriptionDTO,
  SubscriptionGiftCanUseRequest,
} from "models/subscription";
import qs from "qs";

import { ListResponse, SearchParams } from "types/api";
import axiosClient from "./axios-service";
import {
  CUSTOMER_URL,
  SUBSCRIPTION_GIFT_DETAIL_URL,
  SUBSCRIPTION_URL,
} from "./url";

export const subscriptionService = {
  getSubscription: async (
    params?: SearchParams
  ): Promise<ListResponse<Subscription>> => {
    return axiosClient()({
      method: "GET",
      url: `${SUBSCRIPTION_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getSubscriptionById: async (id: number): Promise<SubscriptionDTO> => {
    return axiosClient()({
      method: "GET",
      url: `${SUBSCRIPTION_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  buySubscription: async (
    subscriptionId: number,
    requestBody: SubscriptionBuyRequest
  ) => {
    return axiosClient()({
      method: "POST",
      url: `${SUBSCRIPTION_URL}/buy`,
      params: {
        subscriptionId,
      },
      data: requestBody,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getMySubscriptions: async (): Promise<Subscription[]> => {
    return axiosClient()({
      method: "GET",
      url: `${CUSTOMER_URL}/your-subscription`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getMyGifts: async (): Promise<SubscriptionCustomerDetail[]> => {
    return axiosClient()({
      method: "GET",
      url: `${SUBSCRIPTION_URL}/gift`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getGiftCanUse: async (
    params: SubscriptionGiftCanUseRequest
  ): Promise<SubscriptionCustomerDetail[]> => {
    return axiosClient()({
      method: "GET",
      url: `${SUBSCRIPTION_URL}/gift-can-use`,
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getSubscriptionGiftById: async (
    id: number
  ): Promise<SubscriptionCustomerDetail> => {
    return axiosClient()({
      method: "GET",
      url: `${SUBSCRIPTION_GIFT_DETAIL_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  receiveGifts: async ({
    subscriptionCustomerDetailId,
  }: {
    subscriptionCustomerDetailId: number;
  }) => {
    return axiosClient()({
      method: "GET",
      url: `/api/subscription-gift/receive-gifts/${subscriptionCustomerDetailId}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
