import { test, expect } from "../../fixtures/base-test";

test.describe("Ping API - HealthCheck", () => {
  test.describe("Happy Path", () => {
    test("should return 201 Created when API is healthy", async ({
      pingApi,
    }) => {
      const response = await pingApi.healthCheck();

      expect(response.status()).toBe(201);
    });
  });
});
