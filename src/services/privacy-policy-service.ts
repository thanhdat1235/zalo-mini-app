import { ListResponse } from "types/api";
import axiosClient from "./axios-service";
import { STORE_INFORMATION_URL } from "./url";
import { PrivacyPolicy } from "models/privacy-policy";

export const PrivacyPolicyService = {
  getPrivacyPolicy: async (): Promise<PrivacyPolicy> => {
    return axiosClient()({
      method: "GET",
      url: `${STORE_INFORMATION_URL}/default`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
