import { Customer } from "./user";

export interface Subscription {
  id?: number;
  createdDate?: string;
  modifiedDate?: string;
  paymentStatus?: PaymentStatus;
  paymentType?: PaymentType;
  type?: SubscriptionCustomerDetailType;
  expiredDate?: string | null;
  billImage?: string;
  customerFullName?: string;
  customerOrderPhoneNumber?: string;
  giftQuantity?: number;
  giftTotalUsed?: number;
  giftDescription?: null;
  canUseGift?: boolean;
  limit?: number;
  subscriptionDTO?: SubscriptionDTO;
  subscriptionDetailDTOs?: SubscriptionDetail[];
  price?: number;
}

export interface SubscriptionDTO {
  id?: number;
  createdDate?: string | null;
  modifiedDate?: string | null;
  name?: string;
  month?: number;
  moneyRefund?: number;
  price?: number;
  tagLine?: string;
  freeShip?: boolean;
  image?: string;
  expiredDate?: string | null;
  purchaseUrl?: string;
  subscriptionDetailDTOs?: SubscriptionDetail[];
  paid?: boolean;
  updateDetails?: boolean;
  //
  paymentStatus?: PaymentStatus;
  paymentType?: PaymentType;
  type?: SubscriptionCustomerDetailType;
  billImage?: string;
  customerFullName?: string;
  customerOrderPhoneNumber?: string;
  giftQuantity?: number;
  giftTotalUsed?: number;
  giftDescription?: null;
  canUseGift?: boolean;
  limit?: number;
  subscriptionDTO?: SubscriptionDTO;
  receiveGiftAfterAprove?: boolean;
}

export enum PaymentType {
  BANK = "BANK",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCEL = "CANCEL",
}

export interface SubscriptionBuyRequest {
  customerFullName?: string;
  customerOrderPhoneNumber?: string;
  address?: string;
  receiveGiftAfterAprove?: boolean;
}

export interface SubscriptionBuyResponse {
  id?: number;
  createdDate?: string | Date;
  modifiedDate?: string | Date;
  paymentStatus?: PaymentStatus;
  paymentType?: PaymentType;
  expiredDate?: string | Date;
  billImage?: string;
  customerFullName?: string;
  customerOrderPhoneNumber?: string;
  subscriptionDTO?: Subscription;
  customerDTO?: Customer;
  bankingDescription?: string;
}

export enum SubscriptionCustomerDetailType {
  BUY = "BUY",
  GIFT = "GIFT",
}

export interface SubscriptionCustomerDetail {
  id?: number;
  createdDate?: string;
  modifiedDate?: string;
  paymentStatus?: PaymentStatus;
  paymentType?: PaymentType;
  type?: SubscriptionDetailType;
  expiredDate?: string;
  billImage?: string;
  customerFullName?: string;
  customerOrderPhoneNumber?: string;
  giftQuantity?: number;
  giftTotalUsed?: number;
  giftDescription?: string;
  canUseGift?: boolean;
  limit?: number;
  subscriptionDTO?: Subscription;
  customerDTO?: Customer;
  subscriptionDetailDTO?: SubscriptionDetail;
  productName?: string;
  giftMoney?: number;
}

export enum SubscriptionDetailType {
  LINK = "LINK",
  PRODUCT = "PRODUCT",
  GIFT_MONEY = "GIFT_MONEY",
  VOUCHER = "VOUCHER",
  INTRODUCE_GIFT_MONEY = "INTRODUCE_GIFT_MONEY",
}
export interface SubscriptionDetail {
  id?: number;
  type?: SubscriptionDetailType;
  link?: string;
  nhanhVnProductCategoryId?: string;
  giftMoney?: number;
  nhanhVnProductId?: number;
  description?: string;
  quantity?: number;
  limit?: number;
  minimumOrderPrice?: number;
  conditionSubscriptionIds?: number[];
  sendAfterPaid?: boolean;
  productName?: string;
}

export interface SubscriptionGiftCanUseRequest {
  totalAmount: number;
  cartIds?: number[];
  nhanhVnProductId?: string;
  quantity: number;
}

export interface SubscriptionGiftUseRequest {
  giftId: number;
  quantity: number;
  nhanhVnProductId?: string | number;
}
