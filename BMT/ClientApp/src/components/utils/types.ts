/* eslint-disable @typescript-eslint/no-explicit-any */
export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean';
};

export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number';
};

export const isUndefined = (value: any): value is undefined => {
  return typeof value === 'undefined';
};

export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

export const isStringArray = (value: any): value is string[] => {
  return isArray(value) && value.every((item: any) => isString(item));
};

export const isOptionList = (value: any): value is Array<{ value: string; label: string }> => {
  return isArray(value) && value.every((item: any) => isString(item.value) && isString(item.label));
};
export interface PAYMENT_GATEWAY {
  callBackUri: string | null;
  cert: string | null;
  createdAt: string; // ISO Date string
  createdBy: number;
  description: string;
  id: number;
  lastUpdatedAt: string; // ISO Date string
  lastUpdatedBy: number;
  logo: string; // base64-encoded string
  name: string;
  status: number;
  paymentStatusEnquiryUri: string;
  primaryKey: string;
  profileId: string;
  secretKey: string;
  url: string;
  merchantAccountId: string;
}
