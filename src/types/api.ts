export interface SearchParams {
  searchText?: string;
  pageIndex?: number;
  pageSize?: number;
  status?: string;
  sortBy?: string;
  createFrom?: string;
  createTo?: string;
  ascending?: boolean;

  [key: string]: any;
}

export interface ListResponse<T> {
  content: T[];
  pageable: {
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements?: number;
  empty: boolean;
}

export interface DataProps {
  [key: string]: any;
}

export interface SignRequest {
  token: string;
}

export interface GetPhoneNumber {
  number?: string;
  token?: string;
}

export interface GetLocation {
  /** latitude */
  latitude?: string;
  /** longitude */
  longitude?: string;
  /** timestamp */
  timestamp?: string;
  /** provider */
  provider?: string;
  token?: string;
}

export interface UpdatePhoneNumberOrLocation {
  token?: string;
  phoneNumber?: string | null;
  locationDTO?: {
    provider?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    timestamp?: string | null;
  };
}


export enum QueryKey {
  PRODUCT = "PRODUCT",
  PRODUCT_SEARCH = "PRODUCT_SEARCH",
  PRODUCT_DETAIL = "PRODUCT_DETAIL",
  PRODUCT_PAID = "PRODUCT_PAID",
  CATEGORY = "CATEGORY",
  CATEGORY_COMBO = "CATEGORY_COMBO",
  PRIVACY_POLICY = "PRIVACY_POLICY",
  CART = "CART",
  LOCATION_CITY = "LOCATION_CITY",
  LOCATION_DISTRICT = "LOCATION_DISTRICT",
  LOCATION_WARD = "LOCATION_WARD",
  SUBSCRIPTION = "SUBSCRIPTION",
  SUBSCRIPTION_BY_ID = "SUBSCRIPTION_BY_ID",
  MY_SUBSCRIPTION = "MY_SUBSCRIPTION",
  ORDER = "ORDER",
  REORDER = "REORDER",
  HOME = "HOME",
  INTERSTITIAL_AD = "INTERSTITIAL_AD",
  CALCULATE = "CALCULATE",
  BANK_ACCOUNT = "BANK_ACCOUNT",
  FAQS = "FAQS",
  MAMMY_CLUB = "MAMMY_CLUB",
  FLASH_SALE = "LASH_SALE",
  SALE = "SALE",
  SALE_DETAIL = "SALE_DETAIL",
  TOTAL_ORDER = "TOTAL_ORDER",
  BANK_APP = "BANK_APP",
  RECEIVED_GIFTS = "RECEIVED_GIFTS",
  AFFILIATE_LIST = "AFFILIATE_LIST",
  SUBSCRIPTION_GIFT = "SUBSCRIPTION_GIFT",
  VOUCHERS = "VOUCHERS",
  PRODUCT_PRICE_CHANGE = "PRODUCT_PRICE_CHANGE",
  SYSTEM_CONFIG = "SYSTEM_CONFIG",
  SALE_DISCOUNT = "SALE_DISCOUNT"
}

export enum SearchKey {
  PRODUCT = "PRODUCT",
}
