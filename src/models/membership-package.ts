import { Product } from "./product";

export enum MembershipPackagePeriod {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum MembershipPackageCondition {
  GREATER = "GREATER",
  EQUAL = "EQUAL",
  LESS = "LESS",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
}

export enum MembershipPackageStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export interface MembershipPackage {
  id?: number;
  name?: string;
  periodTime?: number;
  createdDate?: Date | string | number;
  modifiedDate?: Date | string | number;
  period?: MembershipPackagePeriod;
  status?: MembershipPackageStatus;
  totalProduct?: number;
  productIds?: number[];
  condition?: MembershipPackageCondition;
  conditionMoney?: number;
  products?: Product[];
}
