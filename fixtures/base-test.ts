import { test as base } from "@playwright/test";
import { AuthAPI as AuthApi } from "../api/auth-api";
import { BookingAPI as BookingApi } from "../api/booking-api";
import { PingAPI as PingApi } from "../api/ping-api";
import { AUTH_CREDENTIALS } from "../utils/constants";

type ApiFixtures = {
  authApi: AuthApi;
  bookingApi: BookingApi;
  pingApi: PingApi;
  authToken: string;
};

export const test = base.extend<ApiFixtures>({
  authApi: async ({ request, baseURL }, use) => {
    const authApi = new AuthApi(request, baseURL || "");
    await use(authApi);
  },

  bookingApi: async ({ request, baseURL }, use) => {
    const bookingApi = new BookingApi(request, baseURL || "");
    await use(bookingApi);
  },

  pingApi: async ({ request, baseURL }, use) => {
    const pingApi = new PingApi(request, baseURL || "");
    await use(pingApi);
  },

  authToken: async ({ authApi }, use) => {
    const token = await authApi.getValidToken(AUTH_CREDENTIALS.VALID);

    if (!token) {
      throw new Error("Failed to generate authentication token for test");
    }

    await use(token);
  },
});

export { expect } from "@playwright/test";
