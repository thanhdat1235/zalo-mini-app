import api, {
  GetAppInfoReturns,
  GetUserInfoReturns,
  getAppInfo,
  openWebview,
} from "zmp-sdk";
import {
  createShortcut,
  followOA,
  getLocation,
  getPhoneNumber,
  onNetworkStatusChange,
  openChat,
  unfollowOA,
  openShareSheet,
} from "zmp-sdk/apis";
import config from "../config";
import { GetLocation, GetPhoneNumber } from "types/api";
import { ShareCurrentPage } from "types/zmp-sdk";
import { userService } from "./user-service";

export const zaloService = {
  getAccessToken: async (): Promise<string> => {
    try {
      await api.login({});
      const accessToken = await api.getAccessToken({});
      return accessToken;
    } catch (error) {
      throw error;
    }
  },
  getUser: async (): Promise<GetUserInfoReturns> => {
    try {
      const response = await api.getUserInfo({});
      return response;
    } catch (error) {
      throw error;
    }
  },
  getCurrentLocation: (): Promise<GetLocation> => {
    return new Promise((resolve, reject) => {
      getLocation({
        success: (data) => {
          resolve(data);
        },
        fail: (error) => {
          reject(error);
        },
      });
    });
  },
  getUserPhoneNumber: (): Promise<GetPhoneNumber> => {
    return new Promise((resolve, reject) => {
      getPhoneNumber({
        success: (data) => {
          resolve(data);
        },
        fail: (error) => {
          reject(error);
        },
      });
    });
  },
  followZaloOA: async () => {
    const oaID = config.OA_ID;
    if (oaID) {
      try {
        const userInfo = await userService.getUserInfo();
        if (!userInfo.isFollowOA) {
          await followOA({
            id: oaID,
          });
          return await userService.updateFollowZaloOA({
            id: userInfo.id,
            isFollowOA: true,
          });
        }
      } catch (error) {
        console.log("Follow OA error: ", error);
      }
    }
    throw new Error("OA_ID is not exist");
  },
  unFollowOA: async () => {
    const oaID = config.OA_ID;
    if (oaID) {
      try {
        const res = await unfollowOA({
          id: oaID,
        });
      } catch (error) {
        // xử lý khi gọi api thất bại
        console.log(error);
      }
    }
  },
  createMiniAppShortcut: async () => {
    try {
      await createShortcut({
        params: {
          utm_source: "shortcut",
        },
      });
    } catch (error) {
      console.log("Error when create short cut:", error);
    }
  },
  openChatScreen: async (message?: string) => {
    try {
      await openChat({
        type: "oa",
        id: config.OA_ID,
        message,
      });
    } catch (error) {
      console.log(error);
    }
  },
  onNetworkStatusChange: async () => {
    return new Promise((resolve) => {
      onNetworkStatusChange((data) => {
        resolve(data);
      });
    });
  },
  shareCurrentPage: async (dataShare: ShareCurrentPage) => {
    try {
      const res = await openShareSheet({
        type: "zmp_deep_link",
        data: dataShare,
      });
      console.log("Success", res);
    } catch (err) {
      console.log(err);
    }
  },
  getAppInfo: async (): Promise<GetAppInfoReturns | undefined> => {
    try {
      const res = await getAppInfo({});
      console.log("App info: ", res);
      return res;
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
      return undefined;
    }
  },
  openUrlInWebview: async (url: string) => {
    try {
      await openWebview({
        url,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
