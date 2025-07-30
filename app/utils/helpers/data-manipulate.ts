import { Logger } from "../logger";

export const filterEmptyObjects = <T extends object>(arr: T[]): T[] =>
  arr.filter((obj) => Object.keys(obj).length > 0);

export const extractKeyFromData = (data: any[], key: string) => {
  return data.map((item) => item[key]);
};
export const deleteValueAtIndexFromData = (
  setData: (data: any) => void,
  indexToDelete: number
) => {
  return setData((prevData: object[]) =>
    prevData.filter((_, index) => index !== indexToDelete)
  );
};

export const sumAdditionalFee = (data: any) => {
  if (!data || !Array.isArray(data)) {
    return 0;
  }

  return data.reduce((sum, fee) => {
    const value = parseFloat(Object.values(fee)[0] as string);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
};

export const maskPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.length < 11) {
    // throw new Error("Phone number must have at least 11 digits."); //TODO(OKIKI): Kindly review why we have to throw this?
    Logger.log("Phone number must have at least 11 digits.");
  }

  const start = phoneNumber.slice(0, 3);
  const end = phoneNumber.slice(-3);
  return `+234${start}*****${end}`;
};

export const getAbrreviation = (type: string) => {
  switch (type.toLowerCase()) {
    case "monthly":
      return "mo";
    case "annually":
      return "yr";
    case "quaterly":
      return "qtr";
    default:
      return "yr";
  }
};
