export enum ProductStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export interface ProductPriceChangedRequest {
  [key: string]: number;
}

export interface Product {
  info?: any;
  id?: number;
  name?: string;
  price?: number;
  oldPrice?: number;
  images?: string[];
  image?: string;
  nhanhVnId?: string | number;
  nhanhVnCategoryId?: string | number;
  status?: ProductStatus;
  newProduct?: boolean;
  comboCategory?: boolean;
  description?: string;
  salePriceBackup?: number;
  freeShipDescription?: string;
  relatedProducts?: Product[];
  attributes?: Product[];
  attributeTypeName?: string;
  addyImageUrl?: string;
}
