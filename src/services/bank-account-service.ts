import { BankAccount, BankAccountStatus } from "models/bank-account";
import axiosClient from "./axios-service";
import { BANK_ACCOUNT_URL } from "./url";

export const bankAccountService = {
  getBankAccounts: async (): Promise<BankAccount[]> => {
    return axiosClient()({
      method: "GET",
      url: `${BANK_ACCOUNT_URL}/status`,
      params: {
        status: BankAccountStatus.ACTIVE,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
