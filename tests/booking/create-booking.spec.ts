import { test, expect } from "../../fixtures/base-test";
import { TestDataFactory } from "../../utils/test-data-factory";
import { BookingValidators } from "../../utils/validators";
import { TEST_GUESTS } from "../../utils/constants";

test.describe("Booking API - CreateBooking", () => {
  test.describe("Happy Path", () => {
    test("should create a new booking with valid data", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking();

      const response = await bookingApi.createBooking(bookingData);
      const createdBooking =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );

      expect(createdBooking.bookingid).toBeGreaterThan(0);
      expect(createdBooking.booking.firstname).toBe(bookingData.firstname);
      expect(createdBooking.booking.lastname).toBe(bookingData.lastname);
      expect(createdBooking.booking.totalprice).toBe(bookingData.totalprice);
      expect(createdBooking.booking.depositpaid).toBe(bookingData.depositpaid);
      expect(createdBooking.booking.bookingdates.checkin).toBe(
        bookingData.bookingdates.checkin
      );
      expect(createdBooking.booking.bookingdates.checkout).toBe(
        bookingData.bookingdates.checkout
      );

      if (bookingData.additionalneeds) {
        expect(createdBooking.booking.additionalneeds).toBe(
          bookingData.additionalneeds
        );
      }
    });

    test("should create booking without optional additionalneeds field", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateMinimalBooking();

      const response = await bookingApi.createBooking(bookingData);
      const createdBooking =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );

      expect(createdBooking.bookingid).toBeGreaterThan(0);
      expect(createdBooking.booking.firstname).toBe(bookingData.firstname);
      expect(createdBooking.booking.lastname).toBe(bookingData.lastname);
    });

    test("should create booking with depositpaid=true", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking({
        depositpaid: true,
      });
      const response = await bookingApi.createBooking(bookingData);
      const createdBooking =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );

      expect(createdBooking.booking.depositpaid).toBe(true);
    });

    test("should create booking with depositpaid=false", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking({
        depositpaid: false,
      });

      const response = await bookingApi.createBooking(bookingData);
      const createdBooking =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );

      expect(createdBooking.booking.depositpaid).toBe(false);
    });

    test("should create booking with special characters in guest names", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateBookingWithGuest(
        TEST_GUESTS.SPECIAL_CHARS.firstname,
        TEST_GUESTS.SPECIAL_CHARS.lastname
      );

      const response = await bookingApi.createBooking(bookingData);
      const createdBooking =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );

      expect(createdBooking.booking.firstname).toBe(bookingData.firstname);
      expect(createdBooking.booking.lastname).toBe(bookingData.lastname);
    });

    test("should create booking with minimum price (1)", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateBookingWithPrice(1);

      const response = await bookingApi.createBooking(bookingData);
      const createdBooking =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );

      expect(createdBooking.booking.totalprice).toBe(1);
    });

    test("should create booking with high price", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateBookingWithPrice(99999);

      const response = await bookingApi.createBooking(bookingData);
      const createdBooking =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );

      expect(createdBooking.booking.totalprice).toBe(99999);
    });

    test("should create multiple bookings with same guest name", async ({
      bookingApi,
    }) => {
      const bookingData1 = TestDataFactory.generateBookingWithGuest(
        "John",
        "Doe"
      );
      const bookingData2 = TestDataFactory.generateBookingWithGuest(
        "John",
        "Doe"
      );

      const response1 = await bookingApi.createBooking(bookingData1);
      const response2 = await bookingApi.createBooking(bookingData2);

      const booking1 =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response1
        );
      const booking2 =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response2
        );

      // Should create separate bookings with different IDs
      expect(booking1.bookingid).not.toBe(booking2.bookingid);
    });

    test("should create booking with long additionalneeds text", async ({
      bookingApi,
    }) => {
      const longText =
        "Breakfast, Lunch, Dinner, Late checkout, Early checkin, Airport shuttle, Extra towels, Room service".repeat(
          3
        );
      const bookingData = TestDataFactory.generateValidBooking({
        additionalneeds: longText,
      });

      const response = await bookingApi.createBooking(bookingData);
      const createdBooking =
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );

      expect(createdBooking.booking.additionalneeds).toBe(longText);
    });

    test("should handle JSON response format", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateValidBooking();

      const response = await bookingApi.createBooking(
        bookingData,
        "application/json"
      );

      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/json");
    });
  });

  test.describe("Error Scenarios & Edge Cases", () => {
    test("should reject booking with missing firstname", async ({
      request,
      baseURL,
    }) => {
      const invalidBooking = {
        lastname: "Doe",
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-01-01",
          checkout: "2024-01-05",
        },
      };

      const response = await request.post(`${baseURL}/booking`, {
        headers: { "Content-Type": "application/json" },
        data: invalidBooking,
      });

      // Should return error for missing required field
      expect(response.status()).toBe(400);
    });

    test("should reject booking with missing lastname", async ({
      request,
      baseURL,
    }) => {
      const invalidBooking = {
        firstname: "John",
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-01-01",
          checkout: "2024-01-05",
        },
      };

      const response = await request.post(`${baseURL}/booking`, {
        headers: { "Content-Type": "application/json" },
        data: invalidBooking,
      });

      expect(response.status()).toBe(400);
    });

    test("should reject booking with missing totalprice", async ({
      request,
      baseURL,
    }) => {
      const invalidBooking = {
        firstname: "John",
        lastname: "Doe",
        depositpaid: true,
        bookingdates: {
          checkin: "2024-01-01",
          checkout: "2024-01-05",
        },
      };

      const response = await request.post(`${baseURL}/booking`, {
        headers: { "Content-Type": "application/json" },
        data: invalidBooking,
      });

      expect(response.status()).toBe(400);
    });

    test("should reject booking with missing bookingdates", async ({
      request,
      baseURL,
    }) => {
      const invalidBooking = {
        firstname: "John",
        lastname: "Doe",
        totalprice: 100,
        depositpaid: true,
      };

      const response = await request.post(`${baseURL}/booking`, {
        headers: { "Content-Type": "application/json" },
        data: invalidBooking,
      });

      expect(response.status()).toBe(400);
    });

    test("should handle negative price", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateBookingWithPrice(-100);

      const response = await bookingApi.createBooking(bookingData);

      expect(response.status()).toBe(400);
    });

    test("should handle zero price", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateBookingWithPrice(0);

      const response = await bookingApi.createBooking(bookingData);

      expect(response.status()).toBe(200);
    });

    test("should handle invalid date format in checkin", async ({
      request,
      baseURL,
    }) => {
      const invalidBooking = {
        firstname: "John",
        lastname: "Doe",
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: "01-01-2024", // Invalid format
          checkout: "2024-01-05",
        },
      };

      const response = await request.post(`${baseURL}/booking`, {
        headers: { "Content-Type": "application/json" },
        data: invalidBooking,
      });
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.booking.bookingdates.checkin).toBe("2024-01-01");
    });

    test("should handle checkout before checkin", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateBookingWithInvalidDateOrder();

      const response = await bookingApi.createBooking(bookingData);

      expect(response.status()).toBe(400);
    });

    test("should handle past dates", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateBookingWithPastDates();

      const response = await bookingApi.createBooking(bookingData);

      // Document whether API accepts bookings with past dates
      if (response.ok()) {
        await BookingValidators.assertValidCreateBookingResponseSchema(
          response
        );
      } else {
        expect(response.status()).toBe(400);
      }
    });

    test("should handle empty firstname string", async ({ bookingApi }) => {
      const bookingData = TestDataFactory.generateValidBooking({
        firstname: "",
      });

      const response = await bookingApi.createBooking(bookingData);

      expect(response.status()).toBe(400);
    });

    test("should handle numeric values in firstname", async ({
      bookingApi,
    }) => {
      const bookingData = TestDataFactory.generateValidBooking({
        firstname: "12345",
      });

      const response = await bookingApi.createBooking(bookingData);

      expect(response.status()).toBe(200);
    });
  });
});
