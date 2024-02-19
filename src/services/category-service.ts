import { Category } from "models/category";
import { ListResponse, SearchParams } from "types/api";
import axiosClient from "./axios-service";
import { CATEGORY_URL } from "./url";

export const categoryService = {
  categories: async (params?: SearchParams): Promise<Category[]> => {
    return axiosClient()({
      method: "GET",
      url: `${CATEGORY_URL}/app`,
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getCategoryCombo: async (): Promise<Category> => {
    return axiosClient()({
      method: "GET",
      url: `${CATEGORY_URL}/combo`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getCategoryById: async (id: string): Promise<Category> => {
    return axiosClient()({
      method: "GET",
      url: `${CATEGORY_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
