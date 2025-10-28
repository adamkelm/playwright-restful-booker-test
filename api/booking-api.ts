import { APIRequestContext } from "@playwright/test";
import {
  CreateBookingRequest,
  UpdateBookingRequest,
  GetBookingIdsParams,
  ResponseFormat,
} from "../types/booking-types";

export class BookingAPI {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Helper method to encode basic auth credentials
   */
  private encodeBasicAuth(username: string, password: string): string {
    return Buffer.from(`${username}:${password}`).toString("base64");
  }

  async getBookingIds(
    params?: GetBookingIdsParams,
    format: ResponseFormat = "application/json"
  ) {
    return this.request.get(`${this.baseURL}/booking`, {
      headers: {
        Accept: format,
      },
      params: params as Record<string, string | number | boolean>,
    });
  }

  async getBooking(
    bookingId: number,
    format: ResponseFormat = "application/json"
  ) {
    return this.request.get(`${this.baseURL}/booking/${bookingId}`, {
      headers: {
        Accept: format,
      },
    });
  }

  async createBooking(
    booking: CreateBookingRequest,
    format: ResponseFormat = "application/json"
  ) {
    return this.request.post(`${this.baseURL}/booking`, {
      headers: {
        "Content-Type": "application/json",
        Accept: format,
      },
      data: booking,
    });
  }

  async updateBooking(
    bookingId: number,
    booking: UpdateBookingRequest,
    token?: string,
    basicAuth?: { username: string; password: string },
    format: ResponseFormat = "application/json"
  ) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: format,
    };

    // Add authentication - either token or basic auth
    if (token) {
      headers["Cookie"] = `token=${token}`;
    } else if (basicAuth) {
      headers["Authorization"] = `Basic ${this.encodeBasicAuth(
        basicAuth.username,
        basicAuth.password
      )}`;
    }

    return this.request.put(`${this.baseURL}/booking/${bookingId}`, {
      headers,
      data: booking,
    });
  }

  async deleteBooking(
    bookingId: number,
    token?: string,
    basicAuth?: { username: string; password: string }
  ) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authentication - either token or basic auth
    if (token) {
      headers["Cookie"] = `token=${token}`;
    } else if (basicAuth) {
      headers["Authorization"] = `Basic ${this.encodeBasicAuth(
        basicAuth.username,
        basicAuth.password
      )}`;
    }

    return this.request.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers,
    });
  }
}
