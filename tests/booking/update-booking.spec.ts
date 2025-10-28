import { test, expect } from "../../fixtures/base-test";
import { TestDataFactory } from "../../utils/test-data-factory";
import { BookingValidators } from "../../utils/validators";
import { AUTH_CREDENTIALS } from "../../utils/constants";

test.describe("Booking API - UpdateBooking", () => {
  let testBookingId: number;

  test.beforeEach(async ({ bookingApi }) => {
    const bookingData = TestDataFactory.generateValidBooking();
    const response = await bookingApi.createBooking(bookingData);
    const body = await response.json();
    testBookingId = body.bookingid;
  });

  test.describe("Happy Path - Token Authentication", () => {
    test("should update booking with valid token", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedData = TestDataFactory.generateBookingWithGuest(
        "Updated",
        "Name"
      );

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData,
        authToken
      );
      const updated =
        await BookingValidators.assertValidUpdateBookingResponseSchema(
          response
        );

      expect(updated.firstname).toBe("Updated");
      expect(updated.lastname).toBe("Name");
    });

    test("should update all booking fields", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedData = TestDataFactory.generateValidBooking({
        firstname: "NewFirst",
        lastname: "NewLast",
        totalprice: 500,
        depositpaid: false,
        additionalneeds: "Updated needs",
      });

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData,
        authToken
      );
      const updated =
        await BookingValidators.assertValidUpdateBookingResponseSchema(
          response
        );

      expect(updated.firstname).toBe(updatedData.firstname);
      expect(updated.lastname).toBe(updatedData.lastname);
      expect(updated.totalprice).toBe(updatedData.totalprice);
      expect(updated.depositpaid).toBe(updatedData.depositpaid);
      expect(updated.bookingdates.checkin).toBe(
        updatedData.bookingdates.checkin
      );
      expect(updated.bookingdates.checkout).toBe(
        updatedData.bookingdates.checkout
      );
      if (updatedData.additionalneeds) {
        expect(updated.additionalneeds).toBe(updatedData.additionalneeds);
      }
    });

    test("should update booking dates", async ({ bookingApi, authToken }) => {
      const updatedData = TestDataFactory.generateBookingWithDates(
        "2025-06-01",
        "2025-06-10"
      );

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData,
        authToken
      );
      const updated =
        await BookingValidators.assertValidUpdateBookingResponseSchema(
          response
        );

      expect(updated.bookingdates.checkin).toBe("2025-06-01");
      expect(updated.bookingdates.checkout).toBe("2025-06-10");
    });
  });

  test.describe("Happy Path - Basic Authentication", () => {
    test("should update booking with basic auth", async ({ bookingApi }) => {
      const updatedData = TestDataFactory.generateBookingWithGuest(
        "BasicAuth",
        "User"
      );

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData,
        undefined,
        AUTH_CREDENTIALS.VALID
      );
      const updated =
        await BookingValidators.assertValidUpdateBookingResponseSchema(
          response
        );

      expect(updated.firstname).toBe("BasicAuth");
      expect(updated.lastname).toBe("User");
    });
  });

  test.describe("Error Scenarios - Authentication", () => {
    test("should reject update without authentication", async ({
      bookingApi,
    }) => {
      const updatedData = TestDataFactory.generateValidBooking();

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData
      );

      expect(response.status()).toBe(401);
    });

    test("should reject update with invalid token", async ({ bookingApi }) => {
      const updatedData = TestDataFactory.generateValidBooking();

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData,
        "invalid-token"
      );

      expect(response.status()).toBe(401);
    });

    test("should reject update with invalid basic auth credentials", async ({
      bookingApi,
    }) => {
      const updatedData = TestDataFactory.generateValidBooking();

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData,
        undefined,
        AUTH_CREDENTIALS.INVALID
      );

      expect(response.status()).toBe(401);
    });

    test("should reject update with empty token", async ({ bookingApi }) => {
      const updatedData = TestDataFactory.generateValidBooking();

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData,
        ""
      );

      expect(response.status()).toBe(401);
    });
  });

  test.describe("Error Scenarios - Invalid Data", () => {
    test("should reject update for non-existent booking ID", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedData = TestDataFactory.generateValidBooking();
      const nonExistentId = 9999999;

      const response = await bookingApi.updateBooking(
        nonExistentId,
        updatedData,
        authToken
      );

      // Should return 404 Not Found or 405 Method Not Allowed
      expect(response.status()).toBe(404);
    });

    test("should reject update with missing required fields", async ({
      request,
      baseURL,
      authToken,
    }) => {
      const invalidUpdate = {
        firstname: "John",
        // Missing other required fields
      };

      const response = await request.put(
        `${baseURL}/booking/${testBookingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${authToken}`,
          },
          data: invalidUpdate,
        }
      );

      // Should reject incomplete data
      expect(response.status()).toBe(400);
    });

    test("should handle negative price in update", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedData = TestDataFactory.generateBookingWithPrice(-100);

      const response = await bookingApi.updateBooking(
        testBookingId,
        updatedData,
        authToken
      );

      // Document API behavior for negative prices
      expect(response.status()).toBe(400);
    });

    test("should handle checkout before checkin in update", async ({
      bookingApi,
      authToken,
    }) => {
      const invalidData = TestDataFactory.generateBookingWithInvalidDateOrder();

      const response = await bookingApi.updateBooking(
        testBookingId,
        invalidData,
        authToken
      );

      expect(response.status()).toBe(400);
    });
  });

  test.describe("Data Integrity", () => {
    test("should persist update after retrieval", async ({
      bookingApi,
      authToken,
    }) => {
      const updatedData = TestDataFactory.generateBookingWithGuest(
        "Persistent",
        "Update"
      );

      await bookingApi.updateBooking(testBookingId, updatedData, authToken);

      // Retrieve and verify
      const getResponse = await bookingApi.getBooking(testBookingId);
      const retrieved = await getResponse.json();

      expect(retrieved.firstname).toBe("Persistent");
      expect(retrieved.lastname).toBe("Update");
    });

    test("should handle multiple sequential updates", async ({
      bookingApi,
      authToken,
    }) => {
      const update1 = TestDataFactory.generateBookingWithGuest(
        "First",
        "Update"
      );
      const update2 = TestDataFactory.generateBookingWithGuest(
        "Second",
        "Update"
      );
      const update3 = TestDataFactory.generateBookingWithGuest(
        "Third",
        "Update"
      );

      await bookingApi.updateBooking(testBookingId, update1, authToken);
      await bookingApi.updateBooking(testBookingId, update2, authToken);

      const response = await bookingApi.updateBooking(
        testBookingId,
        update3,
        authToken
      );

      const final =
        await BookingValidators.assertValidUpdateBookingResponseSchema(
          response
        );

      // Should have the last update
      expect(final.firstname).toBe("Third");
      expect(final.lastname).toBe("Update");
    });
  });
});
