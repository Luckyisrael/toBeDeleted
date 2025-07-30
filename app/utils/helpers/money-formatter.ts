export const formatToMoney = (amount: number | string) => {
  return `₦${amount?.toLocaleString()}`;
};
