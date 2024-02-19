import { Sale } from "models/sale";
import axiosClient from "./axios-service";
import { SALE_URL } from "./url";
import { FlashSale } from "models/flash-sale";

export const flashSaleService = {
  getFlashSaleDetailById: async (id?: string): Promise<Sale> => {
    return axiosClient()({
      method: "GET",
      url: `${SALE_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
