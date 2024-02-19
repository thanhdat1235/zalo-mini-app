import { LocationReq, LocationRes } from "models/location";
import axiosClient from "./axios-service";
import { SHIPPING_LOCATION_URL } from "./url";

export const locationService = {
  getShippingLocation: async (params: LocationReq): Promise<LocationRes> => {
    return axiosClient()({
      method: "GET",
      url: `${SHIPPING_LOCATION_URL}`,
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
