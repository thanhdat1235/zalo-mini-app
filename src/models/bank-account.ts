export enum BankAccountStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export interface BankAccount {
  id?: number;
  bankAccountNumber?: number;
  bankAccountName?: string;
  bankName?: string;
  bankId?: number;
  status?: BankAccountStatus;
}

export interface BankApp {
  appId?: string;
  appLogo?: string;
  appName?: string;
  bankName?: string;
  monthlyInstall?: number;
  deeplink: string;
}

export interface VietQrBankAppRes {
  apps?: BankApp[];
}
