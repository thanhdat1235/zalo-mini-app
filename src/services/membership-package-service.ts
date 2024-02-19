import { MembershipPackage } from "models/membership-package";
import axiosClient from "./axios-service";
import { SALE_PACKAGE_URL } from "./url";
import { ListResponse } from "types/api";
import { SalePackage } from "models/sale-package";

export const membershipPackageService = {
  getMembershipPackage: async (): Promise<ListResponse<SalePackage>> => {
    return axiosClient()({
      method: "GET",
      url: `${SALE_PACKAGE_URL}/search`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
