export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export enum CustomerRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface Customer {
  id?: number;
  nhanhVnId?: number | string;
  username?: string;
  phoneNumber?: string;
  fullName?: string;
  childName?: string;
  childBirthday?: string | Date;
  childGender?: boolean;
  status?: CustomerStatus;
  avatar?: string;
  birthday?: string | Date;
  createdDate?: string;
  modifiedDate?: string;
  city?: string;
  cityId?: number;
  district?: string;
  districtId?: number;
  ward?: string;
  wardId?: number;
  address?: string;
  referrerCode?: string;
  affiliateCode?: string;
  isFollowOA?: boolean;
  isNewCustomer?: boolean;
  coin?: number;
}
export interface CustomerRequest {
  id?: number;
  fullName?: string;
  avatar?: string;
  birthday?: Date | string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  cityId?: number;
  district?: string;
  districtId?: number;
  ward?: string;
  wardId?: number;
  roadBuilding?: string;
  childName?: string;
  childBirthday?: string | Date;
  childGender?: boolean;
}
export interface CustomerInfo {
  id: string;
  name: string;
  avatar: string;
  idByOA?: string;
}

export interface Affiliate {
  id?: number;
  affiliateCustomerId?: number;
  referredCustomerId?: number;
  affiliateCustomerFullName?: string;
  referredCustomerFullName?: string;
  createdDate?: string;
}
