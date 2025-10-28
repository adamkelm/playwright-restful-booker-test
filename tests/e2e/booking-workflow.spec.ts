import { test, expect } from "../../fixtures/base-test";
import { TestDataFactory } from "../../utils/test-data-factory";
import { BookingValidators } from "../../utils/validators";
import { BookingIdObject } from "../../types/booking-types";

test.describe("E2E - Complete Booking Workflow", () => {
  test("should complete full booking lifecycle: create → read → update → delete", async ({
    bookingApi,
    authToken,
  }) => {
    // Step 1: Create a new booking
    const originalBooking = TestDataFactory.generateBookingWithGuest(
      "E2E",
      "TestUser"
    );

    const createResponse = await bookingApi.createBooking(originalBooking);
    const createdBooking =
      await BookingValidators.assertValidCreateBookingResponseSchema(
        createResponse
      );

    const bookingId = createdBooking.bookingid;

    expect(bookingId).toBeGreaterThan(0);
    expect(createdBooking.booking.firstname).toBe("E2E");
    expect(createdBooking.booking.lastname).toBe("TestUser");

    // Step 2: Retrieve the booking to verify it was created
    const getResponse = await bookingApi.getBooking(bookingId);
    const retrievedBooking =
      await BookingValidators.assertValidGetBookingResponseSchema(getResponse);

    expect(retrievedBooking.firstname).toBe("E2E");
    expect(retrievedBooking.lastname).toBe("TestUser");
    expect(retrievedBooking.firstname).toBe(originalBooking.firstname);
    expect(retrievedBooking.lastname).toBe(originalBooking.lastname);
    expect(retrievedBooking.totalprice).toBe(originalBooking.totalprice);
    expect(retrievedBooking.depositpaid).toBe(originalBooking.depositpaid);
    expect(retrievedBooking.bookingdates.checkin).toBe(
      originalBooking.bookingdates.checkin
    );
    expect(retrievedBooking.bookingdates.checkout).toBe(
      originalBooking.bookingdates.checkout
    );

    // Step 3: Update the booking
    const updatedBooking = TestDataFactory.generateBookingWithGuest(
      "Updated",
      "Name",
      {
        totalprice: 999,
        depositpaid: true,
        additionalneeds: "Late checkout",
      }
    );

    const updateResponse = await bookingApi.updateBooking(
      bookingId,
      updatedBooking,
      authToken
    );
    const updatedData =
      await BookingValidators.assertValidUpdateBookingResponseSchema(
        updateResponse
      );

    expect(updatedData.firstname).toBe("Updated");
    expect(updatedData.lastname).toBe("Name");
    expect(updatedData.totalprice).toBe(999);
    expect(updatedData.additionalneeds).toBe("Late checkout");

    // Step 4: Retrieve again to verify update persisted
    const getUpdatedResponse = await bookingApi.getBooking(bookingId);
    const verifyUpdated = await getUpdatedResponse.json();

    expect(verifyUpdated.firstname).toBe("Updated");
    expect(verifyUpdated.lastname).toBe("Name");

    // Step 5: Delete the booking
    const deleteResponse = await bookingApi.deleteBooking(bookingId, authToken);
    expect(deleteResponse.status()).toBe(201);

    // Step 6: Verify booking no longer exists
    const getDeletedResponse = await bookingApi.getBooking(bookingId);
    expect(getDeletedResponse.status()).toBe(404);
  });

  test("should handle multiple bookings concurrently", async ({
    bookingApi,
    authToken,
  }) => {
    // Create multiple bookings
    const booking1Data = TestDataFactory.generateBookingWithGuest(
      "Concurrent1",
      "User1"
    );
    const booking2Data = TestDataFactory.generateBookingWithGuest(
      "Concurrent2",
      "User2"
    );
    const booking3Data = TestDataFactory.generateBookingWithGuest(
      "Concurrent3",
      "User3"
    );

    const [create1, create2, create3] = await Promise.all([
      bookingApi.createBooking(booking1Data),
      bookingApi.createBooking(booking2Data),
      bookingApi.createBooking(booking3Data),
    ]);

    const created1 = await create1.json();
    const created2 = await create2.json();
    const created3 = await create3.json();

    // All should have unique IDs
    expect(created1.bookingid).not.toBe(created2.bookingid);
    expect(created2.bookingid).not.toBe(created3.bookingid);
    expect(created1.bookingid).not.toBe(created3.bookingid);

    // Retrieve all concurrently
    const [get1, get2, get3] = await Promise.all([
      bookingApi.getBooking(created1.bookingid),
      bookingApi.getBooking(created2.bookingid),
      bookingApi.getBooking(created3.bookingid),
    ]);

    const retrieved1 = await get1.json();
    const retrieved2 = await get2.json();
    const retrieved3 = await get3.json();

    expect(retrieved1.firstname).toBe("Concurrent1");
    expect(retrieved2.firstname).toBe("Concurrent2");
    expect(retrieved3.firstname).toBe("Concurrent3");

    // Delete all
    await Promise.all([
      bookingApi.deleteBooking(created1.bookingid, authToken),
      bookingApi.deleteBooking(created2.bookingid, authToken),
      bookingApi.deleteBooking(created3.bookingid, authToken),
    ]);
  });

  test("should filter bookings by name after creating test data", async ({
    bookingApi,
  }) => {
    // Create bookings with specific names
    const uniqueFirstname = `TestFilter${Date.now()}`;
    const booking1 = TestDataFactory.generateBookingWithGuest(
      uniqueFirstname,
      "Smith"
    );
    const booking2 = TestDataFactory.generateBookingWithGuest(
      uniqueFirstname,
      "Jones"
    );

    const create1 = await bookingApi.createBooking(booking1);
    const create2 = await bookingApi.createBooking(booking2);

    const created1 = await create1.json();
    const created2 = await create2.json();

    // Filter by firstname
    const filterResponse = await bookingApi.getBookingIds({
      firstname: uniqueFirstname,
    });
    const filteredIds = await filterResponse.json();

    // Should include our created bookings
    const ids = filteredIds.map((item: BookingIdObject) => item.bookingid);

    expect(ids).toContain(created1.bookingid);
    expect(ids).toContain(created2.bookingid);
  });
});
