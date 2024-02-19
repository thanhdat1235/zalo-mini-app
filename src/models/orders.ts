import { Customer, CustomerRequest } from "models/user";
import { Cart } from "./cart";
import { Product } from "./product";
import { SubscriptionGiftUseRequest } from "./subscription";

export enum OrderStatus {
  NEW = "NEW",
  WAITING_CONFIRM = "WAITING_CONFIRM",
  WAITING_PICKUP = "WAITING_PICKUP",
  SHIPPING = "SHIPPING",
  SUCCESS = "SUCCESS",
  CANCELED = "CANCELED",
  RETURNED = "RETURNED",
}

export enum OrderPaymentMethod {
  COD = "COD",
  GATEWAY = "GATEWAY",
}

export enum OrderType {
  SHIPPING = "SHIPPING",
  SHOPPING = "SHOPPING",
  PREORDER = "PREORDER",
}

export enum ReorderStatus {
  SUCCESS = "Success",
}

export interface ProductOrder extends Product {
  orderQuantity: number;
  existInDatabase: boolean;
}

export enum OrderSortField {
  CREATED_DATE = "createdDate",
}

export interface Order {
  id?: number;
  nhanhVnId?: string;
  createdDate?: string;
  modifiedDate?: string;
  status?: OrderStatus;
  paymentMethod?: OrderPaymentMethod;
  totalMoney?: number;
  customerDTO?: CustomerRequest | Customer;
  productDTOs?: ProductOrder[] | null;
  cartIds?: number[];
  nhanhVnProductId?: string | null;
  quantity?: number;
  recipientName?: string;
  recipientPhoneNumber?: string;
  recipientChildName?: string;
  recipientChildGender?: string;
  recipientCity?: string;
  recipientDistrict?: string;
  recipientWard?: string;
  recipientAddress?: string;
  paymentImage?: string;
  totalAmount?: number;
  totalShipFee?: number;
  shipDiscount?: number;
  shipFee?: number;
  voucherDiscount?: number;
  type?: OrderType;
  bankingDescription?: string;
  coin?: number;
  totalPayment?: number;
}

export interface OrderRequest {
  id?: number;
  status?: OrderStatus;
  paymentMethod?: OrderPaymentMethod;
  totalMoney?: number;
  price?: number;
  cartIds?: number[] | null;
  carts?: Cart[] | null;
  nhanhVnProductId?: string | null;
  quantity?: number | null;
  type?: OrderType;
  customerDTO?: Customer;
  note?: string;
  voucherIds?: number[] | null;
  subscriptionGifts?: SubscriptionGiftUseRequest[] | null;
  affiliateCode?: string;
  coin?: number | null;
  customerVoucherCode?: string;
}

export interface SubscriptionGift {
  giftId?: number;
  quantity?: number;
  nhanhVnProductId?: string;
}

export interface CalculateReq {
  cartIds?: number[] | null;
  voucherIds?: number[] | null;
  nhanhVnProductId?: string | number | null;
  quantity?: number | null;
  coin?: number | null;
  customerVoucherCode?: string | null;
  subscriptionGifts?: SubscriptionGiftUseRequest[] | null;
}

export interface CalculateRes {
  shipDiscount?: number;
  shipFee?: number;
  totalAmount?: number;
  totalMammyCoinReceive?: number;
  totalMoneyDiscount?: number;
  totalOldProductPrice?: number;
  totalPayment?: number;
  totalShipFee?: number;
  priceChangedNotification?: boolean;
  coinDiscount?: number;
  gifts?: Product[];
}

export interface TotalOrderRes {
  cancel?: number;
  shippingPending?: number;
  shipping?: number;
  paymentPending?: number;
}

export interface UploadBillRequest {
  id: number;
  imageName: string;
  imageLink: string;
}
