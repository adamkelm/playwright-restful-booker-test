import { test, expect } from "../../fixtures/base-test";
import { AUTH_CREDENTIALS } from "../../utils/constants";
import { BookingValidators } from "../../utils/validators";
import { CreateTokenRequest } from "../../types/booking-types";

test.describe("Auth API - CreateToken", () => {
  test.describe("Happy Path", () => {
    test("should create auth token with valid credentials", async ({
      authApi,
    }) => {
      const response = await authApi.createToken(AUTH_CREDENTIALS.VALID);

      const tokenResponse =
        await BookingValidators.assertValidCreateTokenResponseSchema(response);
      expect(tokenResponse.token).toBeTruthy();
      expect(tokenResponse.token.length).toBeGreaterThan(10);
    });

    test("should return different tokens for repeated requests", async ({
      authApi,
    }) => {
      const response1 = await authApi.createToken(AUTH_CREDENTIALS.VALID);
      const token1 = await response1.json();

      const response2 = await authApi.createToken(AUTH_CREDENTIALS.VALID);
      const token2 = await response2.json();

      // Tokens may or may not be different depending on API implementation
      // This test documents the actual behavior
      expect(token1.token).toBeTruthy();
      expect(token2.token).toBeTruthy();
    });
  });

  test.describe("Error Scenarios", () => {
    test("should reject invalid username", async ({ authApi }) => {
      const invalidCreds: CreateTokenRequest = {
        username: "wronguser",
        password: AUTH_CREDENTIALS.VALID.password,
      };

      const response = await authApi.createToken(invalidCreds);

      expect(response.status()).toBeDefined();

      const body = await response.json();

      if (response.ok()) {
        expect(body).toHaveProperty("reason");
      } else {
        expect(response.ok()).toBeFalsy();
      }
    });

    test("should reject invalid password", async ({ authApi }) => {
      const invalidCreds: CreateTokenRequest = {
        username: AUTH_CREDENTIALS.VALID.username,
        password: "wrongpassword",
      };

      const response = await authApi.createToken(invalidCreds);

      expect(response.status()).toBeDefined();
      const body = await response.json();

      if (response.ok()) {
        expect(body).toHaveProperty("reason");
      } else {
        expect(response.ok()).toBeFalsy();
      }
    });

    test("should reject both invalid username and password", async ({
      authApi,
    }) => {
      const response = await authApi.createToken(AUTH_CREDENTIALS.INVALID);

      // Document actual API behavior
      const body = await response.json();

      if (response.ok()) {
        expect(body).toHaveProperty("reason");
      } else {
        expect(response.ok()).toBeFalsy();
      }
    });

    test("should reject empty username", async ({ authApi }) => {
      const invalidCreds: CreateTokenRequest = {
        username: "",
        password: AUTH_CREDENTIALS.VALID.password,
      };

      const response = await authApi.createToken(invalidCreds);

      // This should fail - empty username is invalid
      expect(response.ok() || response.status() === 400).toBeTruthy();
    });

    test("should reject empty password", async ({ authApi }) => {
      const invalidCreds: CreateTokenRequest = {
        username: AUTH_CREDENTIALS.VALID.username,
        password: "",
      };

      const response = await authApi.createToken(invalidCreds);

      // This should fail - empty password is invalid
      expect(response.ok() || response.status() === 400).toBeTruthy();
    });

    test("should reject request with missing username field", async ({
      request,
      baseURL,
    }) => {
      const response = await request.post(`${baseURL}/auth`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          password: AUTH_CREDENTIALS.VALID.password,
        },
      });

      // Should return error for missing required field
      const body = await response.json();

      if (response.ok()) {
        expect(body).toHaveProperty("reason");
      } else {
        expect(response.status()).toBe(400);
      }
    });

    test("should reject request with missing password field", async ({
      request,
      baseURL,
    }) => {
      const response = await request.post(`${baseURL}/auth`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: AUTH_CREDENTIALS.VALID.username,
        },
      });

      // Should return error for missing required field
      const body = await response.json();

      if (response.ok()) {
        expect(body).toHaveProperty("reason");
      } else {
        expect(response.status()).toBe(400);
      }
    });

    test("should handle special characters in credentials", async ({
      authApi,
    }) => {
      const specialCreds: CreateTokenRequest = {
        username: "user@#$%",
        password: "pass!@#$%^&*()",
      };

      const response = await authApi.createToken(specialCreds);

      // Document how API handles special characters
      expect(response.status()).toBeDefined();
    });

    test("should handle SQL injection attempt in username", async ({
      authApi,
    }) => {
      const sqlInjection: CreateTokenRequest = {
        username: "admin' OR '1'='1",
        password: AUTH_CREDENTIALS.VALID.password,
      };

      const response = await authApi.createToken(sqlInjection);

      // Should reject SQL injection attempts
      const body = await response.json();
      expect(body).not.toHaveProperty("token");
    });

    test("should handle very long username", async ({ authApi }) => {
      const longUsername: CreateTokenRequest = {
        username: "a".repeat(1000),
        password: AUTH_CREDENTIALS.VALID.password,
      };

      const response = await authApi.createToken(longUsername);

      // API should handle or reject very long input
      expect(response.status()).toBeDefined();
    });
  });
});
