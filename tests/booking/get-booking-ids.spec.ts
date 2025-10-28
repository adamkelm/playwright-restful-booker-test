import { test, expect } from "../../fixtures/base-test";
import { TestDataFactory } from "../../utils/test-data-factory";
import { BookingValidators } from "../../utils/validators";
import { BookingIdObject } from "../../types/booking-types";

test.describe("Booking API - GetBookingIds", () => {
  test.describe("Happy Path", () => {
    test("should return all booking IDs without filters", async ({
      bookingApi,
    }) => {
      const response = await bookingApi.getBookingIds();
      const bookingIds =
        await BookingValidators.assertValidGetBookingIdsResponseSchema(
          response
        );

      expect(bookingIds.length).toBeGreaterThan(0);
      expect(Array.isArray(bookingIds)).toBeTruthy();
    });

    test("should filter bookings by firstname", async ({ bookingApi }) => {
      const uniqueFirstname = `TestUser_${Date.now()}`;
      const testBooking = TestDataFactory.generateBookingWithGuest(
        uniqueFirstname,
        "FilterTest"
      );

      const createResponse = await bookingApi.createBooking(testBooking);

      expect(createResponse.status()).toBe(200);

      const created = await createResponse.json();
      const createdBookingId = created.bookingid;

      // Filter by firstname
      const filterResponse = await bookingApi.getBookingIds({
        firstname: uniqueFirstname,
      });

      expect(filterResponse.status()).toBe(200);

      const bookingIds = await filterResponse.json();

      // Should return array
      expect(Array.isArray(bookingIds)).toBeTruthy();

      // Should contain our created booking
      const foundBooking = bookingIds.find(
        (b: BookingIdObject) => b.bookingid === createdBookingId
      );

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.bookingid).toBe(createdBookingId);
    });

    test("should filter bookings by lastname", async ({ bookingApi }) => {
      // Create a booking with unique lastname
      const uniqueLastname = `TestLastname_${Date.now()}`;
      const testBooking = TestDataFactory.generateBookingWithGuest(
        "FilterTest",
        uniqueLastname
      );

      const createResponse = await bookingApi.createBooking(testBooking);

      expect(createResponse.status()).toBe(200);

      const created = await createResponse.json();
      const createdBookingId = created.bookingid;

      // Filter by lastname
      const filterResponse = await bookingApi.getBookingIds({
        lastname: uniqueLastname,
      });

      expect(filterResponse.status()).toBe(200);

      const bookingIds = await filterResponse.json();

      expect(bookingIds.length).toBeGreaterThan(0);

      // Should contain our created booking
      const foundBooking = bookingIds.find(
        (b: BookingIdObject) => b.bookingid === createdBookingId
      );

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.bookingid).toBe(createdBookingId);
    });

    test("should filter bookings by both firstname and lastname", async ({
      bookingApi,
    }) => {
      // Create a booking with unique names
      const uniqueFirstname = `First_${Date.now()}`;
      const uniqueLastname = `Last_${Date.now()}`;
      const testBooking = TestDataFactory.generateBookingWithGuest(
        uniqueFirstname,
        uniqueLastname
      );

      const createResponse = await bookingApi.createBooking(testBooking);

      expect(createResponse.status()).toBe(200);

      const created = await createResponse.json();
      const createdBookingId = created.bookingid;

      // Filter by both
      const filterResponse = await bookingApi.getBookingIds({
        firstname: uniqueFirstname,
        lastname: uniqueLastname,
      });

      expect(filterResponse.status()).toBe(200);

      const bookingIds = await filterResponse.json();

      expect(bookingIds.length).toBeGreaterThan(0);

      // Should contain our created booking
      const foundBooking = bookingIds.find(
        (b: BookingIdObject) => b.bookingid === createdBookingId
      );

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.bookingid).toBe(createdBookingId);
    });

    test("should filter bookings by checkin date", async ({ bookingApi }) => {
      // Generate booking with specific dates
      const testBooking = TestDataFactory.generateValidBooking();
      const checkinDate = testBooking.bookingdates.checkin;

      const createResponse = await bookingApi.createBooking(testBooking);

      expect(createResponse.status()).toBe(200);

      const created = await createResponse.json();
      const createdBookingId = created.bookingid;

      // Filter by checkin date
      const filterResponse = await bookingApi.getBookingIds({
        checkin: checkinDate,
      });

      expect(filterResponse.status()).toBe(200);

      const bookingIds = await filterResponse.json();

      // Should contain our created booking
      const foundBooking = bookingIds.find(
        (b: BookingIdObject) => b.bookingid === createdBookingId
      );

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.bookingid).toBe(createdBookingId);
    });

    test("should filter bookings by checkout date", async ({ bookingApi }) => {
      // Generate booking with specific dates
      const testBooking = TestDataFactory.generateValidBooking();
      const checkoutDate = testBooking.bookingdates.checkout;

      const createResponse = await bookingApi.createBooking(testBooking);

      expect(createResponse.status()).toBe(200);

      const created = await createResponse.json();
      const createdBookingId = created.bookingid;

      // Filter by checkout date
      const filterResponse = await bookingApi.getBookingIds({
        checkout: checkoutDate,
      });

      expect(filterResponse.status()).toBe(200);

      const bookingIds = await filterResponse.json();

      // Should contain our created booking
      const foundBooking = bookingIds.find(
        (b: BookingIdObject) => b.bookingid === createdBookingId
      );

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.bookingid).toBe(createdBookingId);
    });

    test("should filter bookings by checkin and checkout dates", async ({
      bookingApi,
    }) => {
      // Generate booking with specific dates
      const testBooking = TestDataFactory.generateValidBooking();
      const checkinDate = testBooking.bookingdates.checkin;
      const checkoutDate = testBooking.bookingdates.checkout;

      const createResponse = await bookingApi.createBooking(testBooking);

      expect(createResponse.status()).toBe(200);

      const created = await createResponse.json();
      const createdBookingId = created.bookingid;

      // Filter by both dates
      const filterResponse = await bookingApi.getBookingIds({
        checkin: checkinDate,
        checkout: checkoutDate,
      });

      expect(filterResponse.status()).toBe(200);
      const bookingIds = await filterResponse.json();

      expect(bookingIds.length).toBeGreaterThan(0);

      // Should contain our created booking
      const foundBooking = bookingIds.find(
        (b: BookingIdObject) => b.bookingid === createdBookingId
      );

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.bookingid).toBe(createdBookingId);
    });

    test("should filter with all parameters", async ({ bookingApi }) => {
      // Create booking with all known values
      const uniqueFirstname = `AllFilters_${Date.now()}`;
      const uniqueLastname = `Test_${Date.now()}`;
      const testBooking = TestDataFactory.generateBookingWithGuest(
        uniqueFirstname,
        uniqueLastname
      );

      const createResponse = await bookingApi.createBooking(testBooking);

      expect(createResponse.status()).toBe(200);

      const created = await createResponse.json();
      const createdBookingId = created.bookingid;

      // Filter with all parameters
      const filterResponse = await bookingApi.getBookingIds({
        firstname: uniqueFirstname,
        lastname: uniqueLastname,
        checkin: testBooking.bookingdates.checkin,
        checkout: testBooking.bookingdates.checkout,
      });

      expect(filterResponse.status()).toBe(200);

      const bookingIds = await filterResponse.json();

      expect(bookingIds.length).toBeGreaterThan(0);

      // Should contain our created booking
      const foundBooking = bookingIds.find(
        (b: BookingIdObject) => b.bookingid === createdBookingId
      );

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.bookingid).toBe(createdBookingId);
    });
  });

  test.describe("Error Scenarios & Edge Cases", () => {
    test("should return empty array for non-existent firstname", async ({
      bookingApi,
    }) => {
      const nonExistentName = `NonExistent_${Date.now()}_${Math.random()}`;
      const response = await bookingApi.getBookingIds({
        firstname: nonExistentName,
      });

      expect(response.status()).toBe(200);

      const bookingIds = await response.json();

      expect(bookingIds.length).toBe(0);
    });

    test("should handle special characters in firstname filter", async ({
      bookingApi,
    }) => {
      const response = await bookingApi.getBookingIds({ firstname: "O'Brien" });

      expect(response.status()).toBe(200);

      const bookingIds = await response.json();

      expect(Array.isArray(bookingIds)).toBeTruthy();
    });

    test("should handle invalid date format in checkin filter", async ({
      request,
      baseURL,
    }) => {
      const response = await request.get(
        `${baseURL}/booking?checkin=01/01/2024`
      );

      expect(response.status()).toBe(200);
    });

    test("should handle future dates far in the future", async ({
      bookingApi,
    }) => {
      const response = await bookingApi.getBookingIds({
        checkin: "2099-12-31",
      });

      expect(response.status()).toBe(200);

      const bookingIds = await response.json();

      expect(Array.isArray(bookingIds)).toBeTruthy();
    });

    test("should handle past dates", async ({ bookingApi }) => {
      const response = await bookingApi.getBookingIds({
        checkin: "2000-01-01",
      });

      expect(response.status()).toBe(200);

      const bookingIds = await response.json();

      expect(Array.isArray(bookingIds)).toBeTruthy();
    });

    test("should handle empty string filters", async ({ request, baseURL }) => {
      const response = await request.get(`${baseURL}/booking?firstname=`);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.length).toBeGreaterThan(0);
    });
  });
});
