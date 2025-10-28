export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export type CreateBookingRequest = Booking;

export interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

export type UpdateBookingRequest = Booking;

export interface BookingIdObject {
  bookingid: number;
}

export interface GetBookingIdsParams {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export interface CreateTokenRequest {
  username: string;
  password: string;
}

export interface CreateTokenResponse {
  token: string;
}
