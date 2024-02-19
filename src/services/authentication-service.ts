import axios from "axios";
import axiosService from "./axios-service";
import { BASE_URL, SIGN_IN_URL, SIGN_OUT_URL } from "./url";
import { SignRequest } from "types/api";

export interface RefreshTokenResponse {
  accessToken: string;
}
export interface SignIn {
  username: string;
  password: string;
}
export interface SignInResponse {
  id: number;
  username: string;
  accessToken: string;
  type: string;
  refreshToken: string;
}
interface Logout {
  pushToken: string | null;
}
export interface LogoutResponse {
  message: string;
}

const authenticationService = {
  signIn: async (params: SignRequest): Promise<SignInResponse> => {
    return axios({
      method: "POST",
      url: SIGN_IN_URL,
      data: params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  signOut: async (params: Logout): Promise<LogoutResponse> => {
    return (await axiosService())({
      method: "POST",
      url: SIGN_OUT_URL,
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

export default authenticationService;
