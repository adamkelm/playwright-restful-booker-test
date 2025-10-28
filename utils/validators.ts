import { expect, APIResponse } from "@playwright/test";
import {
  Booking,
  CreateBookingResponse,
  BookingIdObject,
  CreateTokenResponse,
} from "../types/booking-types";
import { DATE_FORMATS } from "./constants";

export class BookingValidators {
  static assertValidBookingSchema(booking: Booking): void {
    expect(booking).toBeDefined();
    expect(typeof booking.firstname).toBe("string");
    expect(booking.firstname.length).toBeGreaterThan(0);
    expect(typeof booking.lastname).toBe("string");
    expect(booking.lastname.length).toBeGreaterThan(0);
    expect(typeof booking.totalprice).toBe("number");
    expect(booking.totalprice).toBeGreaterThanOrEqual(0);
    expect(typeof booking.depositpaid).toBe("boolean");

    // Validate booking dates object
    expect(booking.bookingdates).toBeDefined();
    this.assertValidDateFormat(booking.bookingdates.checkin);
    this.assertValidDateFormat(booking.bookingdates.checkout);

    // Validate checkout is on or after checkin (same-day checkouts allowed)
    expect(
      new Date(booking.bookingdates.checkout).valueOf()
    ).toBeGreaterThanOrEqual(new Date(booking.bookingdates.checkin).valueOf());

    // Additional needs is optional
    if (booking.additionalneeds !== undefined) {
      expect(typeof booking.additionalneeds).toBe("string");
    }
  }

  static assertValidDateFormat(date: string): void {
    expect(date).toMatch(DATE_FORMATS.REGEX);
  }

  static async assertValidCreateBookingResponseSchema(
    response: APIResponse
  ): Promise<CreateBookingResponse> {
    expect(response.status()).toBe(200);

    const body = (await response.json()) as CreateBookingResponse;

    expect(body.bookingid).toBeDefined();
    expect(typeof body.bookingid).toBe("number");
    expect(body.bookingid).toBeGreaterThan(0);

    expect(body.booking).toBeDefined();
    this.assertValidBookingSchema(body.booking);

    return body;
  }

  static async assertValidGetBookingIdsResponseSchema(
    response: APIResponse
  ): Promise<BookingIdObject[]> {
    expect(response.status()).toBe(200);

    const body = (await response.json()) as BookingIdObject[];

    expect(Array.isArray(body)).toBeTruthy();

    if (body.length > 0) {
      body.forEach((item) => {
        expect(item.bookingid).toBeDefined();
        expect(typeof item.bookingid).toBe("number");
        expect(item.bookingid).toBeGreaterThan(0);
      });
    }

    return body;
  }

  static async assertValidGetBookingResponseSchema(
    response: APIResponse
  ): Promise<Booking> {
    expect(response.status()).toBe(200);

    const body = (await response.json()) as Booking;
    this.assertValidBookingSchema(body);

    return body;
  }

  static async assertValidUpdateBookingResponseSchema(
    response: APIResponse
  ): Promise<Booking> {
    expect(response.status()).toBe(200);

    const body = (await response.json()) as Booking;
    this.assertValidBookingSchema(body);

    return body;
  }

  static async assertValidCreateTokenResponseSchema(
    response: APIResponse
  ): Promise<CreateTokenResponse> {
    expect(response.status()).toBe(200);

    const body = (await response.json()) as CreateTokenResponse;

    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThan(0);

    return body;
  }
}
