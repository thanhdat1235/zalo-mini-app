import { Product } from "./product";

export enum SaleStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export enum SaleType {
  FLASH_SALE = "FLASH_SALE",
  VOUCHER = "VOUCHER",
  SALE_CAMPAIGN = "SALE_CAMPAIGN",
  SUBSCRIPTION_VOUCHER = "SUBSCRIPTION_VOUCHER",
  SALE_FOR_NEW_CUSTOMER = "SALE_FOR_NEW_CUSTOMER",
}

export enum SaleScope {
  ALL = "ALL",
  PRODUCT = "PRODUCT",
}

export enum PromotionType {
  SALE = "SALE",
  RECEIVE_MONEY = "RECEIVE_MONEY",
}

export interface SaleDetail {
  id?: number;
  discount?: number;
  discountPercent?: number;
  totalQuantity?: number;
  totalQuantityUsed?: number;
  maxQuantityInOrder?: number;
  productId?: number;
  productDTO?: Product;
}

export interface Sale {
  id?: number;
  name?: string;
  code?: string;
  description?: string;
  createdDate?: string;
  modifiedDate?: string;
  status?: SaleStatus;
  startDate?: string;
  endDate?: string;
  type?: SaleType;
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

export interface SaleAutomationShowDefault {
  id?: number;
  saleName?: string;
  startTime?: string;
  endTime?: string;
  saleId?: number;
  saleDTO?: Sale;
}

export enum SaleDiscountDetailDTOType {
  DISCOUNT = "DISCOUNT",
  GIFT = "GIFT",
  ORDER_DISCOUNT = "ORDER_DISCOUNT",
  ORDER_GIFT = "ORDER_GIFT",
}
export interface SaleDiscountDetailDTO {
  id: number;
  type: SaleDiscountDetailDTOType;
  discountPrice?: number;
  productIds: number[];
  minProductQuantity?: number;
  maxProductQuantity?: number;
  giftIds: number[];
  orderDiscountPercent?: number;
  orderDiscountMax?: number;
  minOrderAmount?: number;
  userUsedIds: number[];
  maxQuantityPerUser: number;
  productGifts?: Product[];
}

export interface SaleDiscount extends Sale {
  saledDiscountDetailDTOs: SaleDiscountDetailDTO[];
}
