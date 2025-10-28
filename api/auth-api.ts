import { APIRequestContext } from "@playwright/test";
import {
  CreateTokenRequest,
  CreateTokenResponse,
} from "../types/booking-types";

/**
 * Auth API client following Page Object Model pattern
 * Handles authentication operations for the Restful Booker API
 */
export class AuthAPI {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Creates a new authentication token
   * POST /auth
   *
   * @param credentials - Username and password for authentication
   * @returns Auth token response
   *
   * Default credentials from API docs:
   * - username: "admin"
   * - password: "password123"
   */
  async createToken(credentials: CreateTokenRequest) {
    return this.request.post(`${this.baseURL}/auth`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: credentials,
    });
  }

  /**
   * Helper method to get a valid token for authenticated requests
   *
   * @returns Token string or null if authentication fails
   */
  async getValidToken(
    credentials: CreateTokenRequest = {
      username: "admin",
      password: "password123",
    }
  ): Promise<string | null> {
    const response = await this.createToken(credentials);

    if (response.ok()) {
      const body = (await response.json()) as CreateTokenResponse;
      return body.token;
    }

    return null;
  }
}
