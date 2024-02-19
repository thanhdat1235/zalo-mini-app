import { FAQS } from "models/faqs";
import { ListResponse, SearchParams } from "types/api";
import axiosClient from "./axios-service";
import { FAQS_URL } from "./url";

export const faqsService = {
  getFaqs: (params: SearchParams): Promise<ListResponse<FAQS>> => {
    return axiosClient()({
      method: "GET",
      url: `${FAQS_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
