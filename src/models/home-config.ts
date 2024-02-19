import { CategoryStatus } from "./category";
import { Product } from "./product";
import { Sale } from "./sale";

export enum HomeConfigSaleDetailPosition {
  TOP = "TOP",
  BODY = "BODY",
  BOTTOM = "BOTTOM",
}

export interface HomeBannerConfig {
  id?: number;
  saleBannerFileName?: string;
  saleBannerUrl?: string;
  position?: HomeConfigSaleDetailPosition;
  saleDTO?: Sale;
  productCategoryConfigDTO?: HomeConfigCategory;
  type?: HomeBannerType;
}
export interface HomeConfigCategory {
  id?: number;
  banner?: string;
  content?: string;
  existInDatabase?: boolean;
  image?: string;
  name?: string;
  nhanhVnId?: string;
  products?: Product[];
  status?: CategoryStatus;
}

export interface Notification {
  message?: string;
  modelId?: string;
  type?: HomeContentType;
}

export interface HomeConfig {
  id?: number;
  bannerSliders?: BannerSlider[];
  bodies?: HomeContentBody[];
  dailyQuestion?: string;
  notificationDTOs?: Notification[];
}

export interface HomeContentBody {
  id?: number;
  name?: string;
  order?: number;
  bannerFileName?: string;
  bannerUrl?: string;
  type?: HomeContentType;
  data?: any;
  typeId?: number;
}

export interface BannerSlider {
  id?: number;
  name?: string;
  order?: number;
  bannerFileName?: string;
  bannerUrl?: string;
  type?: HomeContentType;
  typeId?: number;
}

export enum HomeContentType {
  SALE = "SALE",
  FLASH_SALE = "FLASH_SALE",
  CATEGORY = "CATEGORY",
  SUBSCRIPTION = "SUBSCRIPTION",
  PRODUCT = "PRODUCT",
}

export enum HomeBannerType {
  SALE = "SALE",
  CATEGORY = "CATEGORY",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export enum Position {
  SLIDER = "SLIDER",
  BODY = "BODY",
}

export interface HomeBanner {
  id?: string;
  saleBannerFileName?: string;
  saleBannerUrl?: string;
  type?: HomeBannerType;
  saleDTO?: Sale;
}
