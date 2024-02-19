import { Product } from "./product";

export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export interface Category {
  id?: number;
  name?: string;
  image?: string;
  nhanhVnId?: string;
  content?: string;
  status?: CategoryStatus;
  existInDatabase?: boolean;
  products?: Product[];
  banner?: string;
}
