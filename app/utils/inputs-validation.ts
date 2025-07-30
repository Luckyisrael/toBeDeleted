export const PASSWORD_INPUT_VALIDATION = {
  required: "Password is required",
  minLength: {
    value: 6,
    message: "At least six characters, combination of letters and numbers",
  },
  validate: {
    hasNumberAndLetter: (value: string) =>
      /[A-Za-z]/.test(value) && /\d/.test(value) ||
      "Password must contain at least one letter and one number",
  },
};


export const PHONE_NUMBER_INPUT_VALIDATION = {
  required: "Phone number is required",
  minLength: {
    value: 10,
    message: "Must be atleast ten digits",
  },
  maxLength: {
    value: 11,
    message: "Must be eleven digits",
  },
  pattern: {
    value: /^[0-9]/,
    message: "Phone number can only contain numbers",
  },
};
export const PROPERTY_NAME_INPUT_VALIDATION = {
  required: "Name is required",
  minLength: {
    value: 3,
    message: "At least six characters",
  },
};

export const PROPERTY_UNIT_INPUT_VALIDATION = {
  required: "Number of unit is required",
  pattern: {
    value: /\d+/,
    message: "Number of units can only contain numberssss",
  },
};

export const PROPERTY_TITLE_INPUT_VALIDATION = {
  required: "Title is required",
  minLength: {
    value: 2,
    message: "At least two characters",
  },
};

export const PROPERTY_PRICE_INPUT_VALIDATION = {
  required: "Price is required",
  pattern: {
    value: /^[0-9]/,
    message: "Price can only contain numbers",
  },
};

export const PROPERTY_DESC_INPUT_VALIDATION = {
  required: "Description is required",
  minLength: {
    value: 10,
    message: "At least ten characters",
  },
};

export const INSPECTION_DATE_VALIDATION = {
  required: "Inspection Date is required",
};

export const INSPECTION_TIME_VALIDATION = {
  required: "Inspection Time is required",
};

export const FULL_NAME_INPUT_VALIDATION = {
  required: "Full name is required",
  minLength: {
    value: 6,
    message: "At least six characters",
  },
};

export const PROPERTY_ADDRESS_INPUT_VALIDATION = {
  required: "Address is required",
};

export const PROPERTY_CITY_INPUT_VALIDATION = {
  required: "City is required",
};

export const PROPERTY_STATE_INPUT_VALIDATION = {
  required: "State/Provionce is required",
};

export const FIRST_NAME_INPUT_VALIDATION = {
  required: "First name is required",
  minLength: {
    value: 3,
    message: "At least three characters",
  },
};

export const LAST_NAME_INPUT_VALIDATION = {
  required: "Last name is required",
  minLength: {
    value: 3,
    message: "At least three letters",
  },
};

export const MIDDLE_NAME_INPUT_VALIDATION = {
  required: "Middle name is required",
  minLength: {
    value: 3,
    message: "At least three letters",
  },
};

export const NAME_INPUT_VALIDATION = {
  required: "Name is required",
  minLength: {
    value: 3,
    message: "At least three letters",
  },
};

export const EMAIL_INPUT_VALIDATION = {
  required: "Email is required",

  pattern: {
    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
    message: "This is not a valid email",
  },
  minLength: {
    value: 3,
    message: "This is not a valid email",
  },
};

export const ADDRESS_INPUT_VALIDATION = {
  required: "Field is required",
  minLength: {
    value: 3,
    message: "At least three characters",
  },
};

export const COUNTRY_INPUT_VALIDATION = {
  required: "Field is required",
};

export const RESIDENCE_STATUS_INPUT_VALIDATION = {
  required: "Field is required",
};

export const POSTALCODE_INPUT_VALIDATION = {
  required: "Field is required",
  pattern: {
    value: /^[0-9]/,
    message: "Can only contain numbers",
  },
};

export const DATE_INPUT_VALIDATION = {
  required: "Field is required",
  pattern: {
    value:
      /(((0[1-9])|([12][0-9])|(3[01]))-((0[0-9])|(1[012]))-((20[012]\d|19\d\d)|(1\d|2[0123])))/,
    message: "Must be a date",
  },
};

export const MOBILE_NETWORK_SELECT_INPUT_VALIDATION = {
  required: "Field is required",
};

export const NUMBER_INPUT_VALIDATION = {
  required: "Field is required",
  pattern: {
    value: /^[0-9]/,
    message: "Can only contain numbers",
  },
};

export const NIN_VALIDATION = {
  required: "Your nin is required",
  minLength: {
    value: 10,
    message: "Must be atleast 11 digits",
  },
  maxLength: {
    value: 11,
    message: "Must be 11 digits",
  },
  pattern: {
    value: /^[0-9]/,
    message: "NIN can only contain numbers",
  },
};
