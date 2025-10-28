import { faker } from "@faker-js/faker";
import { CreateBookingRequest, BookingDates } from "../types/booking-types";
import { PRICE_RANGES, ADDITIONAL_NEEDS } from "./constants";

export class TestDataFactory {
  static generateBookingDates(): BookingDates {
    const checkinDate = faker.date.soon({ days: 90 });

    const checkoutDate = faker.date.soon({ days: 14, refDate: checkinDate });

    return {
      checkin: this.formatDate(checkinDate),
      checkout: this.formatDate(checkoutDate),
    };
  }

  static formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  static generateValidBooking(
    overrides?: Partial<CreateBookingRequest>
  ): CreateBookingRequest {
    const bookingDates = this.generateBookingDates();

    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({
        min: PRICE_RANGES.MIN,
        max: PRICE_RANGES.MAX,
      }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: bookingDates,
      additionalneeds: faker.helpers.arrayElement([...ADDITIONAL_NEEDS]),
      ...overrides,
    };
  }

  static generateBookingWithPrice(
    price: number,
    overrides?: Partial<CreateBookingRequest>
  ): CreateBookingRequest {
    return this.generateValidBooking({ totalprice: price, ...overrides });
  }

  static generateBookingWithGuest(
    firstname: string,
    lastname: string,
    overrides?: Partial<CreateBookingRequest>
  ): CreateBookingRequest {
    return this.generateValidBooking({ firstname, lastname, ...overrides });
  }

  static generateBookingWithDates(
    checkin: string,
    checkout: string,
    overrides?: Partial<CreateBookingRequest>
  ): CreateBookingRequest {
    return this.generateValidBooking({
      bookingdates: { checkin, checkout },
      ...overrides,
    });
  }

  static generateMinimalBooking(
    overrides?: Partial<CreateBookingRequest>
  ): CreateBookingRequest {
    const booking = this.generateValidBooking(overrides);
    delete booking.additionalneeds;
    return booking;
  }

  static generateInvalidBooking(
    invalidField:
      | "firstname"
      | "lastname"
      | "totalprice"
      | "depositpaid"
      | "dates"
  ): Partial<CreateBookingRequest> {
    const baseBooking = this.generateValidBooking();

    switch (invalidField) {
      case "firstname":
        return { ...baseBooking, firstname: "" };
      case "lastname":
        return { ...baseBooking, lastname: "" };
      case "totalprice":
        return { ...baseBooking, totalprice: -100 };
      case "depositpaid":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...baseBooking, depositpaid: "not-a-boolean" as any };
      case "dates":
        return {
          ...baseBooking,
          bookingdates: { checkin: "invalid-date", checkout: "invalid-date" },
        };
      default:
        return baseBooking;
    }
  }

  static generateBookingWithPastDates(): CreateBookingRequest {
    const checkinDate = faker.date.past();

    const checkoutDate = faker.date.soon({ days: 7, refDate: checkinDate });

    return this.generateValidBooking({
      bookingdates: {
        checkin: this.formatDate(checkinDate),
        checkout: this.formatDate(checkoutDate),
      },
    });
  }

  static generateBookingWithInvalidDateOrder(): CreateBookingRequest {
    const checkinDate = faker.date.future();

    const checkoutDate = faker.date.recent({ days: 30, refDate: checkinDate });

    return this.generateValidBooking({
      bookingdates: {
        checkin: this.formatDate(checkinDate),
        checkout: this.formatDate(checkoutDate),
      },
    });
  }

  static generateMultipleBookings(count: number): CreateBookingRequest[] {
    return Array.from({ length: count }, () => this.generateValidBooking());
  }
}
