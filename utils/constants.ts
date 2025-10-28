export const AUTH_CREDENTIALS = {
  VALID: {
    username: process.env.AUTH_USERNAME || "admin",
    password: process.env.AUTH_PASSWORD || "password123",
  },
  INVALID: {
    username: process.env.AUTH_INVALID_USERNAME || "invaliduser",
    password: process.env.AUTH_INVALID_PASSWORD || "wrongpassword",
  },
} as const;

export const DATE_FORMATS = {
  API_FORMAT: "CCYY-MM-DD",
  REGEX: /^\d{4}-\d{2}-\d{2}$/,
} as const;

export const TEST_GUESTS = {
  STANDARD: {
    firstname: "John",
    lastname: "Doe",
  },
  ALTERNATIVE: {
    firstname: "Jane",
    lastname: "Smith",
  },
  SPECIAL_CHARS: {
    firstname: "José",
    lastname: "O'Brien-Smith",
  },
} as const;

export const PRICE_RANGES = {
  MIN: 1,
  MAX: 10000,
  STANDARD: 100,
  PREMIUM: 500,
} as const;

export const ADDITIONAL_NEEDS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Late checkout",
  "Early checkin",
  "Airport shuttle",
  "Baby cot",
  "Wheelchair access",
  "Pet friendly",
  "None",
] as const;
