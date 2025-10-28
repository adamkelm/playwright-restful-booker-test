import { APIRequestContext } from "@playwright/test";

export class PingAPI {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async healthCheck() {
    return this.request.get(`${this.baseURL}/ping`);
  }
}
