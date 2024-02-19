import { Product } from "./product";

export enum SalePackageStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export interface SalePackage {
  id?: number;
  name?: string;
  periodTime?: number;
  createdDate?: string | null;
  modifiedDate?: string | null;
  period?: string;
  status?: SalePackageStatus;
  totalProduct?: number;
  productIds?: number[];
  condition?: string;
  conditionMoney?: number;
  products?: Product[] | null;
}
