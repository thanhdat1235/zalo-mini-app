import { SystemConfig } from "models/system-config";
import axiosClient from "./axios-service";
import { SYSTEM_CONFIG_URL } from "./url";

export const systemConfigService = {
  getAllConfig: async (): Promise<SystemConfig> => {
    return axiosClient()({
      method: "GET",
      url: SYSTEM_CONFIG_URL,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
