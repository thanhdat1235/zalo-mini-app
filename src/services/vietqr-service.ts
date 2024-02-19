import axios from "axios";
import { VietQrBankAppRes } from "./../models/bank-account";
import { ANDROID_BANK_DEEPLINK, IOS_BANK_DEEPLINK } from "./url";
import { PLATFORM } from "models/platform";

export const vietQrService = {
  getBankApp: async (platform: string): Promise<VietQrBankAppRes> => {
    return axios({
      method: "GET",
      url:
        platform === PLATFORM.ANDROID
          ? ANDROID_BANK_DEEPLINK
          : IOS_BANK_DEEPLINK,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
