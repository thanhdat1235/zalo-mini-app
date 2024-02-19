import { HomeConfig, HomeContentBody } from "models/home-config";
import axiosClient from "./axios-service";
import { HOME_CONFIG_URL } from "./url";

export const configService = {
  getHomeConfig: async (): Promise<HomeConfig> => {
    return axiosClient()({
      method: "GET",
      url: `${HOME_CONFIG_URL}/get-all`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getInterstitialAd: async (): Promise<HomeContentBody> => {
    return axiosClient()({
      method: "GET",
      url: `${HOME_CONFIG_URL}/interstitial-ad`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
