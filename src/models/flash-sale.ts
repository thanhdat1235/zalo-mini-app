import { Product } from "./product";

export interface FlashSaleDetail {
  id?: number;
  name?: string;
  createdDate?: string;
  modifiedDate?: string;
  status?: string;
  discount?: number;
  discountPercent?: number;
  startDate?: string;
  endDate?: string;
  totalQuantityProduct?: number;
  removeFlashSaleDetailIds?: number[] | null;
  productDTO: Product;
}

export interface FlashSale {
  id: number;
  name: string;
  createdDate: string;
  modifiedDate: string;
  status: string;
  startDate: string;
  endDate: string;
  totalQuantityProduct: number;
  removeFlashSaleDetailIds: number[] | null;
  saleDetailDTOs: FlashSaleDetail[];
}
