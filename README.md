# Playwright Restful Booker API Test Automation

[![Playwright Tests](https://img.shields.io/badge/Playwright-1.56-green.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A comprehensive API test automation framework for [Restful Booker](https://restful-booker.herokuapp.com) built with Playwright and TypeScript, demonstrating professional QA engineering practices including Page Object Model (POM) for APIs, comprehensive test coverage, and detailed bug documentation.

## Table of Contents

- [About This Project](#about-this-project)
- [Key Features](#key-features)
- [Skills Demonstrated](#skills-demonstrated)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [API Page Objects](#api-page-objects)
- [Test Data Management](#test-data-management)
- [Architecture](#architecture)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [License](#license)

## About This Project

**Educational resource demonstrating professional API test automation architecture with Playwright + TypeScript.**

This framework showcases production-ready testing patterns for REST API automation, serving as a reference implementation for SDETs learning modern test automation practices. The test suite covers the Restful Booker API, a practice API designed specifically for test automation learning and experimentation.

### 💼 Technical Deep Dive

This project demonstrates the test framework design and quality engineering approaches applied in professional environments. The architectural patterns shown here enable:

- **Comprehensive API Coverage**: 93 tests covering all CRUD operations with both happy path and error scenarios
- **Bug Discovery & Documentation**: Identifies and documents 29 real API bugs with detailed reproduction steps
- **Maintainability**: POM pattern for APIs reduces code duplication and simplifies maintenance
- **Scalability**: Parallel execution and fixture-based architecture support large test suites
- **Type Safety**: Full TypeScript implementation with strong typing throughout
- **Dynamic Test Data**: Faker.js integration for generating realistic, unique test data

**Key Technical Highlights**:

- ✅ **Architecture**: Page Object Model (POM) adapted for API testing with fixture-based dependency injection
- ✅ **Test Coverage**: 93 tests covering Authentication, Booking CRUD operations, Health Check, and E2E workflows
- ✅ **Modern Tools**: Playwright for fast, reliable API testing with built-in retry and auto-waiting
- ✅ **Code Quality**: Centralized validators and test data factories for consistent, reusable test code
- ✅ **Documentation**: Comprehensive README, detailed test results, and inline code documentation
- ✅ **CI/CD Ready**: Configured for GitHub Actions integration with environment variable management

**Test Results**: **69% Pass Rate (64/93 tests)** - Discovered 29 API bugs including date filtering failures, authentication status code inconsistencies, and validation issues. See [TEST_RESULTS.md](TEST_RESULTS.md) for detailed analysis.

## Key Features

- ✅ **Page Object Model for APIs**: Clean separation of API client logic and test logic
- ✅ **TypeScript**: Full type safety and IntelliSense support throughout
- ✅ **Test Data Factory**: Dynamic test data generation using Faker.js for realistic scenarios
- ✅ **Centralized Validators**: Reusable assertion methods for consistent schema validation
- ✅ **Parallel Execution**: Fast test runs with Playwright's built-in parallelization (4 workers)
- ✅ **Custom Fixtures**: Dependency injection for API clients and authentication tokens
- ✅ **Comprehensive Coverage**: Tests for Authentication, CRUD operations, Health Check, and E2E workflows
- ✅ **Error Scenario Testing**: Validation of error handling, edge cases, and security vulnerabilities
- ✅ **E2E Workflows**: Complete booking lifecycle tests (create → read → update → delete)
- ✅ **Rich Reporting**: HTML reports with detailed error messages and traces
- ✅ **Environment Variables**: Secure credential management with configuration files in dedicated `env/` folder

## 🛠️ Skills Demonstrated

### Test Automation & QA

- API test design and implementation across all CRUD operations
- Page Object Model (POM) architecture adapted for API testing
- Test data management with factories and dynamic generation
- Boundary value testing and negative testing for edge cases
- Bug identification, documentation, and detailed reporting with reproduction steps
- Authentication and authorization testing (token and Basic Auth)
- End-to-end workflow testing for complete booking lifecycles
- Security testing (SQL injection, XSS attempts)

### Technical Skills

- **Languages**: TypeScript, JavaScript (ES6+)
- **Frameworks**: Playwright Test, Faker.js for test data generation
- **Tools**: Git, npm, ESLint for code quality
- **Methodologies**: Agile testing, Test-Driven Development
- **Best Practices**: DRY principles, SOLID design patterns, fixture pattern for dependency injection

### Documentation & Communication

- Technical documentation writing with clear examples
- Professional bug reports following industry standards
- Test strategy documentation and architecture decisions
- API contract testing and validation

## Quick Start

```bash
# Clone the repository
git clone https://github.com/adamkelm/playwright-restful-booker-test.git
cd playwright-restful-booker-test

# Install dependencies
npm install

# Install Playwright browsers (optional for API tests, but recommended)
npx playwright install

# Run all tests
npm test

# Run tests in UI mode for interactive debugging
npm run test:ui

# View test report
npm run test:report
```

## Project Structure

```
├── api/                          # API client classes (POM pattern)
│   ├── auth-api.ts              # Authentication API client
│   ├── booking-api.ts           # Booking CRUD operations
│   └── ping-api.ts              # Health check API client
├── fixtures/                     # Custom test fixtures
│   └── api-fixtures.ts          # Dependency injection for API clients
├── types/                        # TypeScript type definitions
│   └── booking.types.ts         # Interfaces and types for API contracts
├── utils/                        # Utility modules
│   ├── constants.ts             # Centralized test data and configuration
│   ├── test-data-factory.ts    # Dynamic test data generation with Faker.js
│   └── validators.ts            # Reusable assertion methods for schema validation
├── tests/                        # Test files organized by endpoint
│   ├── auth/
│   │   └── create-token.spec.ts          # Auth token creation tests (12 tests)
│   ├── booking/
│   │   ├── create-booking.spec.ts        # Create booking tests (23 tests)
│   │   ├── get-booking-ids.spec.ts       # Get booking IDs tests (16 tests)
│   │   ├── get-booking.spec.ts           # Get booking tests (13 tests)
│   │   ├── update-booking.spec.ts        # Update booking tests (15 tests)
│   │   └── delete-booking.spec.ts        # Delete booking tests (21 tests)
│   ├── ping/
│   │   └── health-check.spec.ts          # Health check tests (1 test)
│   └── e2e/
│       └── booking-workflow.spec.ts      # End-to-end workflow tests (3 tests)
├── env/                          # Environment configuration folder
│   └── .env.example              # Example environment configuration
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies and scripts
├── README.md                     # This file
└── TEST_RESULTS.md               # Detailed test results and bug reports
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:auth         # Authentication tests (12 tests)
npm run test:booking      # Booking CRUD tests (75 tests)
npm run test:ping         # Health check tests (1 test)
npm run test:e2e          # End-to-end workflow tests (3 tests)

# Interactive debugging
npm run test:ui           # Opens Playwright UI mode for debugging
npm run test:debug        # Debug specific test with inspector

# Run specific test file
npx playwright test tests/auth/create-token.spec.ts
npx playwright test tests/booking/create-booking.spec.ts

# Run tests in headed mode (with browser visible - less common for API tests)
npm run test:headed

# List all tests without running them
npm run test:list
```

## Test Reports

After running tests, view detailed reports:

```bash
# Open HTML report
npm run test:report
```

The framework generates comprehensive test reports including:

- Test execution summary with pass/fail statistics
- Detailed error messages and stack traces
- Step-by-step execution traces for debugging
- Performance metrics and timing data

**Current Test Results Summary:**

- **Total Tests**: 93
- **Passed**: 64 tests (69%)
- **Failed**: 29 tests (31%) - **Real API bugs discovered**

See [TEST_RESULTS.md](TEST_RESULTS.md) for:

- Detailed bug reports with reproduction steps
- Expected vs actual behavior analysis
- API behavior documentation
- Issues categorized by severity

## API Page Objects

The framework implements the Page Object Model pattern at the API level:

### AuthAPI (`api/auth-api.ts`)

- `createToken(credentials)` - Create authentication token
- `getValidToken()` - Helper method to get a valid token for tests

### BookingAPI (`api/booking-api.ts`)

- `getBookingIds(filters?)` - Get all booking IDs with optional filters (firstname, lastname, checkin, checkout)
- `getBooking(id, accept?)` - Get booking by ID (supports JSON/XML)
- `createBooking(booking, accept?)` - Create new booking
- `updateBooking(id, booking, token?, basicAuth?)` - Update existing booking (requires auth)
- `deleteBooking(id, token?, basicAuth?)` - Delete booking (requires auth)

### PingAPI (`api/ping-api.ts`)

- `healthCheck()` - API health check endpoint

## Test Data Management

### Test Data Factory (`utils/test-data-factory.ts`)

Dynamic test data generation using Faker.js:

```typescript
// Generate valid booking data
const booking = TestDataFactory.generateValidBooking();

// Generate booking with specific fields
const booking = TestDataFactory.generateBookingWithGuest("John", "Doe");

// Generate booking with specific price
const booking = TestDataFactory.generateBookingWithPrice(100);

// Generate booking with specific dates
const booking = TestDataFactory.generateBookingWithDates(
  "2025-01-01",
  "2025-01-05"
);

// Generate invalid data for negative testing
const invalid = TestDataFactory.generateInvalidBooking("firstname");

// Generate booking with past dates
const pastBooking = TestDataFactory.generateBookingWithPastDates();

// Generate booking with invalid date order (checkout before checkin)
const invalidDates = TestDataFactory.generateBookingWithInvalidDateOrder();
```

### Centralized Validators (`utils/validators.ts`)

Reusable assertion methods ensure consistent validation:

```typescript
// Validate complete booking response
await BookingValidators.assertValidCreateBookingResponseSchema(response);

// Validate booking array response
await BookingValidators.assertValidGetBookingIdsResponseSchema(response);

// Validate single booking response
await BookingValidators.assertValidGetBookingResponseSchema(response);

// Validate token response
await BookingValidators.assertValidCreateTokenResponseSchema(response);
```

## Architecture

### Page Object Model (POM) for APIs

The framework implements POM pattern at the API level:

```typescript
// API Client (api/booking-api.ts)
export class BookingAPI {
  async createBooking(booking: CreateBookingRequest) {
    return await this.request.post(`${this.baseURL}/booking`, {
      headers: { "Content-Type": "application/json" },
      data: booking,
    });
  }
  // ... other methods
}

// Test (tests/booking/create-booking.spec.ts)
test("should create a booking", async ({ bookingApi }) => {
  const bookingData = TestDataFactory.generateValidBooking();
  const response = await bookingApi.createBooking(bookingData);
  await BookingValidators.assertValidCreateBookingResponseSchema(response);
});
```

**Benefits:**

- **Separation of Concerns**: Test logic separate from API interaction
- **Reusability**: API methods used across multiple tests
- **Maintainability**: API changes only require updates in one place
- **Readability**: Tests focus on "what" not "how"

### Fixture-Based Dependency Injection

Custom fixtures provide automatic setup and teardown:

```typescript
export const test = base.extend<ApiFixtures>({
  authApi: async ({ request, baseURL }, use) => {
    const authApi = new AuthAPI(request, baseURL);
    await use(authApi);
  },

  authToken: async ({ authApi }, use) => {
    const token = await authApi.getValidToken();
    await use(token!);
  },
});
```

Tests automatically receive configured API clients and authentication tokens.

## Known Issues

The test suite has discovered **29 real API bugs** in the Restful Booker API:

### Critical Issues (3)

1. **Date Filtering Completely Broken** - Checkin/checkout date filters return no results even for exact matches
2. **Delete Returns 403 Instead of 401** - Authentication failures return wrong HTTP status code
3. **Update Returns 403 Instead of 401** - Same authentication issue on update endpoint

### High Severity (14)

- Missing field validation returns 500 instead of 400
- Invalid booking IDs return 405 instead of 404 on delete/update
- Double deletion returns 405 instead of 404
- Negative prices accepted without validation
- Invalid date order (checkout before checkin) accepted
- Empty firstname accepted without validation

### Medium Severity (12)

- Combined date filters return empty results
- Update after deletion returns 405 instead of 404
- Various validation issues on create/update operations

See [TEST_RESULTS.md](TEST_RESULTS.md) for complete bug documentation with:

- Detailed reproduction steps
- Expected vs actual behavior
- Business impact analysis
- Recommendations for fixes

## API Documentation

The test suite covers the following Restful Booker API endpoints:

- **POST** `/auth` - Create authentication token
- **GET** `/booking` - Get all booking IDs with optional filters
- **GET** `/booking/:id` - Get specific booking details
- **POST** `/booking` - Create new booking
- **PUT** `/booking/:id` - Update existing booking (requires auth)
- **DELETE** `/booking/:id` - Delete booking (requires auth)
- **GET** `/ping` - Health check

**Note**: PATCH `/booking/:id` (Partial Update) is intentionally excluded per project requirements.

Full API documentation: https://restful-booker.herokuapp.com/apidoc/index.html

## Environment Configuration

The framework supports environment-specific configuration:

```bash
# env/.env file
AUTH_USERNAME=admin
AUTH_PASSWORD=password123
AUTH_INVALID_USERNAME=invaliduser
AUTH_INVALID_PASSWORD=wrongpassword
```

**Note**: Create a `.env` file in the `env/` folder based on `env/.env.example` for local development. The `.env` file is gitignored for security.

Default base URL: `https://restful-booker.herokuapp.com`

## Contributing

Contributions, issues, and feature requests are welcome! This is an educational project demonstrating professional test automation practices.

## License

This project is [MIT](LICENSE) licensed.

## Author

**Adam Kelm**

- GitHub: [@adamkelm](https://github.com/adamkelm)
- LinkedIn: [Adam Kelm](https://www.linkedin.com/in/adam-kelm)

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Restful Booker API Documentation](https://restful-booker.herokuapp.com/apidoc/index.html)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Results Analysis](TEST_RESULTS.md)
