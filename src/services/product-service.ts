import { Product, ProductPriceChangedRequest } from "models/product";
import { ListResponse, SearchParams } from "types/api";
import axiosClient from "./axios-service";
import { PRODUCT_URL } from "./url";

export const productService = {
  products: async (params: SearchParams): Promise<ListResponse<Product>> => {
    return axiosClient()({
      method: "GET",
      url: `${PRODUCT_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getProductById: async (id: number | string): Promise<Product> => {
    return axiosClient()({
      method: "GET",
      url: `${PRODUCT_URL}/get-from-nhanhvn/${id}`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getProductsFromNhanhVn: async (
    params: SearchParams
  ): Promise<ListResponse<Product>> => {
    return axiosClient()({
      method: "GET",
      url: `${PRODUCT_URL}/get-from-nhanhvn`,
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getAllProductsPaid: async (): Promise<Product[]> => {
    return axiosClient()({
      method: "GET",
      url: `${PRODUCT_URL}/all-product-paid`,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  productPriceChanged: async (
    data: ProductPriceChangedRequest
  ): Promise<boolean> => {
    return axiosClient()({
      method: "POST",
      url: `${PRODUCT_URL}/price-changed`,
      data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
