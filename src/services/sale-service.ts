import { SaleAutomationShowDefault, SaleDiscount, SaleType } from "models/sale";
import { VoucherByCode, VoucherSystem } from "models/voucher";
import { ListResponse, SearchParams } from "types/api";
import axiosClient from "./axios-service";
import {
  SALE_AUTOMATION_DEFAULT_URL,
  SALE_DISCOUNT,
  SALE_URL,
  VOUCHER_URL,
} from "./url";
import qs from "qs";

export const saleService = {
  getVouchersSystem: async (
    productIds: string[],
    amount: number
  ): Promise<VoucherSystem[]> => {
    return axiosClient()({
      method: "GET",
      url: `${SALE_URL}/voucher`,
      params: {
        nhanhVnProductIds: productIds.join("&nhanhVnProductIds="),
        amount,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getVoucherSystemDetailById: async (id: number): Promise<VoucherSystem> => {
    return axiosClient()({
      method: "GET",
      url: `${SALE_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getSaleByProductIdsAndCode: async (
    productIds: (string | number | undefined)[],
    code: string
  ) => {
    return axiosClient()({
      method: "GET",
      url: `${SALE_URL}/code`,
      params: {
        code,
        nhanhVnProductIds: productIds.join("&nhanhVnProductIds="),
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getVoucherCode: async ({
    amount,
    code,
  }: {
    amount: number;
    code: string;
  }): Promise<VoucherByCode> => {
    return axiosClient()({
      method: "GET",
      url: `${VOUCHER_URL}/code/${code}`,
      params: {
        amount,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getVoucherCodeById: async ({
    id,
  }: {
    id: number;
  }): Promise<VoucherByCode> => {
    return axiosClient()({
      method: "GET",
      url: `${VOUCHER_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getAllSale: async (
    params: SearchParams
  ): Promise<ListResponse<VoucherSystem>> => {
    return axiosClient()({
      method: "GET",
      url: `${SALE_URL}/search`,
      params: {
        ...params,
        type: SaleType.VOUCHER,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getSaleAutomationShowDefault:
    async (): Promise<SaleAutomationShowDefault> => {
      return axiosClient()({
        method: "GET",
        url: `${SALE_AUTOMATION_DEFAULT_URL}`,
      })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });
    },
  getSaleDiscount: async ({
    productIds,
  }: {
    productIds: number[];
  }): Promise<SaleDiscount[]> => {
    return axiosClient()({
      method: "GET",
      url: `${SALE_DISCOUNT}`,
      params: { productIds },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
