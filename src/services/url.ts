import config from "../config";

export const BASE_URL = config.BASE_URL;

// Authentication
const AUTH_URL = `${BASE_URL}/auth/app`;
export const SIGN_IN_URL = `${AUTH_URL}/signin`;
export const SIGN_OUT_URL = `${AUTH_URL}/signout`;

//USER
export const CUSTOMER_URL = `${BASE_URL}/api/customers`;
export const CUSTOMER_PROFILE_URL = `${CUSTOMER_URL}/info`;
export const CUSTOMER_AFFILIATE_URL = `${CUSTOMER_URL}/search-affiliate`;
export const CUSTOMER_USE_AFFILIATE_URL = `${CUSTOMER_URL}/use-affiliate`;
export const CUSTOMER_SUBSCRIPTION_URL = `${CUSTOMER_URL}/your-subscription`;

// ORDER
export const ORDER_URL = `${BASE_URL}/api/orders`;
export const ORDER_USER_URL = `${ORDER_URL}/user`;

// SALE-PACKAGE
export const SALE_PACKAGE_URL = `${BASE_URL}/api/sale-package`;

//SUBSCRIPTION
export const SUBSCRIPTION_URL = `${BASE_URL}/api/subscription`;
export const SUBSCRIPTION_GIFT_DETAIL_URL = `${BASE_URL}/api/subscription-gift`;

//CART
export const CART_URL = `${BASE_URL}/api/carts`;

// Product
export const PRODUCT_URL = `${BASE_URL}/api/product-config`;

// Category
export const CATEGORY_URL = `${BASE_URL}/api/product-category-config`;

// Config
export const HOME_CONFIG_URL = `${BASE_URL}/api/home-config`;

// Location
export const SHIPPING_LOCATION_URL = `${BASE_URL}/api/shipping/location`;

// Store Information
export const STORE_INFORMATION_URL = `${BASE_URL}/api/store-informations`;

//bank account
export const BANK_ACCOUNT_URL = `${BASE_URL}/api/bank-account`;

// FAQS
export const FAQS_URL = `${BASE_URL}/api/frequently-asked-questions`;

//Upload
export const UPLOAD_URL = `${BASE_URL}/upload/media`;

//sale
export const SALE_URL = `${BASE_URL}/api/sale`;
export const SALE_AUTOMATION_DEFAULT_URL = `${BASE_URL}/api/sale-automation-show-default/now`;
export const SALE_DISCOUNT = `${BASE_URL}/api/sale/sale-discount`;

// voucher
export const VOUCHER_URL = `${BASE_URL}/api/voucher`;

// system config
export const SYSTEM_CONFIG_URL = `${BASE_URL}/api/system-config`;

// MAMMY
export const MAMMY_WEB_URL = "https://mammy.vn/";

export const ANDROID_BANK_DEEPLINK =
  "https://api.vietqr.io/v2/android-app-deeplinks";

export const IOS_BANK_DEEPLINK = "https://api.vietqr.io/v2/ios-app-deeplinks";
