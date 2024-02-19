import { Product } from "./product";
import { PromotionType, SaleDetail, SaleScope, SaleType } from "./sale";

export interface VoucherSystem {
  id?: number;
  name?: string;
  code?: string;
  description?: string;
  createdDate?: string;
  modifiedDate?: string;
  status?: VoucherStatus;
  startDate?: string;
  endDate?: string;
  type?: SaleType | VoucherType;
  saleScope?: SaleScope;
  promotionType?: PromotionType;
  minimumOrderPrice?: number;
  maxUserUse?: number;
  totalQuantity?: number;
  totalQuantityUsed?: number;
  maxQuantityUseInUser?: number;
  totalQuantityProduct?: number;
  discount?: number;
  discountPercent?: number;
  receiveMoneyPercent?: number;
  receiveMammyCoin?: number;
  maxPromotion?: number;
  canUse?: boolean;
  nextSaleBannerUrl?: string;
  nextSaleDate?: string;
  saleDetailDTOs?: SaleDetail[];
}
export interface VoucherByCode {
  id?: number;
  codes?: string[];
  createdDate?: string;
  modifiedDate?: string;
  status?: VoucherStatus;
  startDate?: string;
  endDate?: string;
  type?: VoucherType;
  minimumOrderPrice?: number;
  totalQuantity?: number;
  maxQuantityUseInUser?: number;
  totalQuantityUsed?: number;
  maxPromotion?: number;
  discount?: number;
  discountPercent?: number;
  usedUserId?: number[];
  voucherCodeLength?: number;
  productId?: number;
  productQuantity?: number;
  customerVoucherCode?: string;
  productConfigDTO?: Product;
}

export enum VoucherStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
  DELETED = "DELETED",
}

export enum VoucherType {
  SALE = "SALE",
  GIFT = "GIFT",
}
