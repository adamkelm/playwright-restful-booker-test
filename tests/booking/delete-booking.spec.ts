import { test, expect } from "../../fixtures/base-test";
import { TestDataFactory } from "../../utils/test-data-factory";
import { AUTH_CREDENTIALS } from "../../utils/constants";

test.describe("Booking API - DeleteBooking", () => {
  test.describe("Happy Path - Token Authentication", () => {
    test("should delete booking with valid token", async ({
      bookingApi,
      authToken,
    }) => {
      // Create a booking to delete
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      // Delete the booking
      const deleteResponse = await bookingApi.deleteBooking(
        created.bookingid,
        authToken
      );

      expect(deleteResponse.status()).toBe(201);

      // Verify booking no longer exists
      const getResponse = await bookingApi.getBooking(created.bookingid);

      expect(getResponse.status()).toBe(404);
    });

    test("should return 201 Created on successful deletion", async ({
      bookingApi,
      authToken,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      const deleteResponse = await bookingApi.deleteBooking(
        created.bookingid,
        authToken
      );

      expect(deleteResponse.status()).toBe(201);
    });
  });

  test.describe("Happy Path - Basic Authentication", () => {
    test("should delete booking with basic auth", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      const deleteResponse = await bookingApi.deleteBooking(
        created.bookingid,
        undefined,
        AUTH_CREDENTIALS.VALID
      );

      expect(deleteResponse.status()).toBe(201);

      // Verify deletion
      const getResponse = await bookingApi.getBooking(created.bookingid);

      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe("Error Scenarios - Authentication", () => {
    test("should reject delete without authentication", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      const deleteResponse = await bookingApi.deleteBooking(created.bookingid);

      expect(deleteResponse.status()).toBe(401);

      // Booking should still exist
      const getResponse = await bookingApi.getBooking(created.bookingid);

      expect(getResponse.status()).toBe(200);
    });

    test("should reject delete with invalid token", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      const deleteResponse = await bookingApi.deleteBooking(
        created.bookingid,
        "invalid-token-12345"
      );

      expect(deleteResponse.status()).toBe(401);

      // Booking should still exist
      const getResponse = await bookingApi.getBooking(created.bookingid);

      expect(getResponse.status()).toBe(200);
    });

    test("should reject delete with invalid basic auth", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      const deleteResponse = await bookingApi.deleteBooking(
        created.bookingid,
        undefined,
        AUTH_CREDENTIALS.INVALID
      );

      expect(deleteResponse.status()).toBe(401);
    });

    test("should reject delete with empty token", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      const deleteResponse = await bookingApi.deleteBooking(
        created.bookingid,
        ""
      );

      expect(deleteResponse.status()).toBe(401);
    });

    test("should reject delete with malformed authorization header", async ({
      request,
      baseURL,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await request.post(`${baseURL}/booking`, {
        headers: { "Content-Type": "application/json" },
        data: bookingData,
      });
      const created = await createResponse.json();

      const deleteResponse = await request.delete(
        `${baseURL}/booking/${created.bookingid}`,
        {
          headers: {
            Authorization: "InvalidFormat",
          },
        }
      );

      expect(deleteResponse.status()).toBe(401);
    });
  });

  test.describe("Error Scenarios - Invalid Booking IDs", () => {
    test("should handle delete of non-existent booking ID", async ({
      bookingApi,
      authToken,
    }) => {
      const nonExistentId = 9999999;

      const response = await bookingApi.deleteBooking(nonExistentId, authToken);

      expect(response.status()).toBe(404);
    });

    test("should handle negative booking ID", async ({
      bookingApi,
      authToken,
    }) => {
      const response = await bookingApi.deleteBooking(-1, authToken);

      expect(response.status()).toBe(404);
    });

    test("should handle zero booking ID", async ({ bookingApi, authToken }) => {
      const response = await bookingApi.deleteBooking(0, authToken);

      expect(response.status()).toBe(404);
    });

    test("should handle very large booking ID", async ({
      bookingApi,
      authToken,
    }) => {
      const response = await bookingApi.deleteBooking(
        Number.MAX_SAFE_INTEGER,
        authToken
      );

      expect(response.status()).toBe(404);
    });

    test("should handle string ID in URL", async ({
      request,
      baseURL,
      authToken,
    }) => {
      const response = await request.delete(`${baseURL}/booking/invalid-id`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${authToken}`,
        },
      });

      expect(response.status()).toBe(404);
    });
  });

  test.describe("Idempotency", () => {
    test("should handle double deletion of same booking", async ({
      bookingApi,
      authToken,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      // First deletion - should succeed
      const delete1 = await bookingApi.deleteBooking(
        created.bookingid,
        authToken
      );
      expect(delete1.status()).toBe(201);

      // Second deletion - should fail (booking already deleted)
      const delete2 = await bookingApi.deleteBooking(
        created.bookingid,
        authToken
      );
      expect(delete2.status()).toBe(404);
    });

    test("should not allow retrieval after deletion", async ({
      bookingApi,
      authToken,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      await bookingApi.deleteBooking(created.bookingid, authToken);

      const getResponse = await bookingApi.getBooking(created.bookingid);

      expect(getResponse.status()).toBe(404);
    });

    test("should not allow update after deletion", async ({
      bookingApi,
      authToken,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking();
      const createResponse = await bookingApi.createBooking(bookingData);
      const created = await createResponse.json();

      await bookingApi.deleteBooking(created.bookingid, authToken);

      // Attempt to update deleted booking
      const updatedData = TestDataFactory.generateValidBooking();
      const updateResponse = await bookingApi.updateBooking(
        created.bookingid,
        updatedData,
        authToken
      );

      expect(updateResponse.status()).toBe(404);
    });
  });
});
