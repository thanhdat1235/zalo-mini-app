import axios, { AxiosInstance } from "axios";

import { LOCAL_STORAGE } from "constants";
import { BASE_URL } from "./url";

const axiosClient = (): AxiosInstance => {
  // const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  // New
  // const token =
  //   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiI1ODMwOTkyNDc1NDI0NTUwOTk2IiwidHlwZSI6IkNVU1RPTUVSIiwiaWF0IjoxNjk5NjA1NTI3LCJqdGkiOiI5NWE5ZWM5Yi05MjdlLTQ1MGMtYmQ4MS05MDc0MTNmMDBmYWYiLCJleHAiOjE3MDE3NjU1Mjd9.8aWRsbvJ0AFyYWhseg18NeaWcNp-jGjX1YtOfFDvHzVxJ4Ok46gm0KhSIF5gVmkz3UFN3UuPCLjlM9UmmTDDQQ";

  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcm5hbWUiOiI1ODMwOTkyNDc1NDI0NTUwOTk2IiwidHlwZSI6IkNVU1RPTUVSIiwiaWF0IjoxNjk4MjI0NzE0LCJqdGkiOiI1MDc1ODg2Ny1jMDVmLTQ2MjktOGVhZS0wM2JjYWFmMDRlMzUiLCJleHAiOjE3MDAzODQ3MTR9.DiD3Rkpr9_DiLabLljeXQO9JWfkgiyurH0XT8WmCepJL3IQYUf6VQI96XspETsMWFxibnH8c1GGpfbWNrgeC7w";

  const axiosOption = axios.create({
    baseURL: BASE_URL,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  axiosOption.interceptors.request.use(
    async (config) => {
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axiosOption.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      throw error;
    }
  );

  return axiosOption;
};

export default axiosClient;
