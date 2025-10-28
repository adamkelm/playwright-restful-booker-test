import { test, expect } from "../../fixtures/base-test";
import { TestDataFactory } from "../../utils/test-data-factory";
import { BookingValidators } from "../../utils/validators";

test.describe("Booking API - GetBooking", () => {
  let testBookingId: number;

  test.beforeAll(async ({ bookingApi }) => {
    // Create a test booking to retrieve
    const bookingData = TestDataFactory.generateValidBooking();
    const response = await bookingApi.createBooking(bookingData);
    const body = await response.json();
    testBookingId = body.bookingid;
  });

  test.describe("Happy Path", () => {
    test("should retrieve an existing booking by ID", async ({
      bookingApi,
    }) => {
      const response = await bookingApi.getBooking(testBookingId);
      const booking =
        await BookingValidators.assertValidGetBookingResponseSchema(response);

      expect(booking.firstname).toBeTruthy();
      expect(booking.lastname).toBeTruthy();
      expect(booking.totalprice).toBeGreaterThanOrEqual(0);
      expect(typeof booking.depositpaid).toBe("boolean");
      expect(booking.bookingdates).toBeDefined();
    });

    test("should return JSON format by default", async ({ bookingApi }) => {
      const response = await bookingApi.getBooking(testBookingId);

      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/json");
    });

    test("should retrieve multiple different bookings", async ({
      bookingApi,
    }) => {
      // Create two bookings
      const booking1Data = TestDataFactory.generateBookingWithGuest(
        "Test1",
        "User1"
      );
      const booking2Data = TestDataFactory.generateBookingWithGuest(
        "Test2",
        "User2"
      );

      const create1 = await bookingApi.createBooking(booking1Data);
      const create2 = await bookingApi.createBooking(booking2Data);

      const body1 = await create1.json();
      const body2 = await create2.json();

      // Retrieve both
      const response1 = await bookingApi.getBooking(body1.bookingid);
      const response2 = await bookingApi.getBooking(body2.bookingid);

      const retrieved1 = await response1.json();
      const retrieved2 = await response2.json();

      expect(retrieved1.firstname).toBe("Test1");
      expect(retrieved2.firstname).toBe("Test2");
    });

    test("should retrieve booking with all optional fields populated", async ({
      bookingApi,
    }) => {
      const additionalneeds = "Breakfast and late checkout";
      const bookingWithAllFields = TestDataFactory.generateValidBooking({
        additionalneeds: additionalneeds,
      });

      const createResponse =
        await bookingApi.createBooking(bookingWithAllFields);
      const created = await createResponse.json();

      const response = await bookingApi.getBooking(created.bookingid);
      const booking =
        await BookingValidators.assertValidGetBookingResponseSchema(response);

      expect(booking.additionalneeds).toBe(additionalneeds);
    });

    test("should retrieve booking without optional additionalneeds field", async ({
      bookingApi,
    }) => {
      const bookingMinimal = TestDataFactory.generateMinimalBooking();

      const createResponse = await bookingApi.createBooking(bookingMinimal);
      const created = await createResponse.json();

      const response = await bookingApi.getBooking(created.bookingid);
      const booking =
        await BookingValidators.assertValidGetBookingResponseSchema(response);

      expect(booking.additionalneeds).toBeUndefined();
    });
  });

  test.describe("Error Scenarios & Edge Cases", () => {
    test("should return 404 for non-existent booking ID", async ({
      bookingApi,
    }) => {
      const nonExistentId = 9999999;
      const response = await bookingApi.getBooking(nonExistentId);

      // Should return 404 Not Found
      expect(response.status()).toBe(404);
    });

    test("should handle negative booking ID", async ({ bookingApi }) => {
      const response = await bookingApi.getBooking(-1);

      // Should return error for invalid ID
      expect(response.status()).toBe(404);
    });

    test("should handle zero booking ID", async ({ bookingApi }) => {
      const response = await bookingApi.getBooking(0);

      expect(response.status()).toBe(404);
    });

    test("should handle very large booking ID", async ({ bookingApi }) => {
      const response = await bookingApi.getBooking(Number.MAX_SAFE_INTEGER);

      expect(response.status()).toBe(404);
    });

    test("should handle string ID in URL path", async ({
      request,
      baseURL,
    }) => {
      const response = await request.get(`${baseURL}/booking/invalid-id`, {
        headers: { Accept: "application/json" },
      });

      // Should return error for invalid ID format
      expect(response.status()).toBe(404);
    });
  });

  test.describe("Data Integrity", () => {
    test("should return same data on multiple retrievals", async ({
      bookingApi,
    }) => {
      const response1 = await bookingApi.getBooking(testBookingId);
      const response2 = await bookingApi.getBooking(testBookingId);

      const booking1 = await response1.json();
      const booking2 = await response2.json();

      expect(booking1).toEqual(booking2);
    });

    test("should preserve data after creation", async ({ bookingApi }) => {
      const originalData = TestDataFactory.generateValidBooking();

      const createResponse = await bookingApi.createBooking(originalData);
      const created = await createResponse.json();

      const getResponse = await bookingApi.getBooking(created.bookingid);
      const retrieved = await getResponse.json();

      expect(retrieved.firstname).toBe(originalData.firstname);
      expect(retrieved.lastname).toBe(originalData.lastname);
      expect(retrieved.totalprice).toBe(originalData.totalprice);
      expect(retrieved.depositpaid).toBe(originalData.depositpaid);
      expect(retrieved.bookingdates.checkin).toBe(
        originalData.bookingdates.checkin
      );
      expect(retrieved.bookingdates.checkout).toBe(
        originalData.bookingdates.checkout
      );

      if (originalData.additionalneeds) {
        expect(retrieved.additionalneeds).toBe(originalData.additionalneeds);
      }
    });
  });
});
