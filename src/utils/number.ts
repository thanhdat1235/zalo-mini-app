export const getOldPriceProduct = (
  oldPrice?: number,
  salePriceBackup?: number
): number => {
  const salePrice =
    salePriceBackup && salePriceBackup > 0 ? salePriceBackup : 0;
  return oldPrice || salePrice || 0;
};

export const formatCurrencyVND = (amount: number): string => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formatter.format(amount);
};

export const convertBooleanToNumber = (value: boolean) => {
  return value ? 1 : 0;
};
