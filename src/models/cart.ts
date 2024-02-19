import { Product } from "./product";

export interface Cart {
  id: number;
  quantity: number;
  userId?: number;
  nhanhVnProductId?: string | number;
  product: Product;
  createDate?: string | Date;
  modifiedDate?: string | Date;
  preSelect?: boolean;
}

export interface CartItemUpdate {
  id: number;
  quantity: number;
}

export enum CartOrderField {
  Quantity = "quantity",
  CreatedDate = "createdDate",
  ModifiedDate = "modifiedDate",
}
