# Contributing to Playwright Restful Booker Test

Thank you for your interest in contributing to this project! This is an educational project demonstrating professional test automation practices for API testing.

## 🎯 Purpose

This project serves as a portfolio piece showcasing:

- API test automation with Playwright
- TypeScript implementation with strict typing
- Page Object Model (POM) pattern adapted for API testing
- Professional test organization and reporting
- Bug discovery and documentation

## 🤝 How to Contribute

Contributions, issues, and feature requests are welcome! Here are some ways you can contribute:

### Reporting Bugs

If you find a bug in the test framework (not the API being tested):

1. Check if the issue already exists in the [Issues](../../issues) section
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version, etc.)

### Suggesting Enhancements

Have ideas for improving the test framework? Open an issue with:

- Clear description of the enhancement
- Why it would be valuable
- Example implementation (if applicable)

### Code Contributions

1. **Fork the Repository**

   ```bash
   git clone https://github.com/adamkelm/playwright-restful-booker-test.git
   cd playwright-restful-booker-test
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment**

   ```bash
   # Create .env file in the env/ folder
   cp env/.env.example env/.env
   # Edit env/.env with your credentials if needed
   ```

4. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

5. **Make Your Changes**
   - Follow existing code style and patterns
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass: `npm test`
   - Run linting: `npm run lint`

6. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add new feature" # or "fix: resolve bug"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `test:` for test changes
   - `refactor:` for code refactoring
   - `chore:` for maintenance tasks

7. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots/examples if applicable

## 📋 Code Style Guidelines

### TypeScript

- Use strict typing - avoid `any`
- Follow existing patterns for API clients and fixtures
- Use interfaces for data structures
- Add JSDoc comments for complex functions

### Test Structure

- One test file per API endpoint or feature
- Use descriptive test names that explain what's being tested
- Group related tests with `describe` blocks
- Keep tests independent and isolated
- Use custom fixtures for API client setup

### Naming Conventions

- Files: `kebab-case.ts` or `kebab-case.spec.ts`
- Classes: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

### Project Structure

When adding new files, follow the existing structure:

```
api/          → API client classes (Page Objects for APIs)
fixtures/     → Playwright fixtures for dependency injection
types/        → TypeScript type definitions
utils/        → Utility functions and helpers
tests/        → Test files organized by endpoint/feature
```

## 🧪 Testing Guidelines

- Write tests that are clear, maintainable, and repeatable
- Test both positive and negative scenarios
- Include edge cases and boundary conditions
- Validate response schemas and data types
- Test error handling and status codes
- Add meaningful assertions with descriptive messages

## 📝 Documentation

When adding new features:

- Update README.md if it affects setup or usage
- Add JSDoc comments for public APIs
- Update TEST_RESULTS.md if tests are affected
- Include examples in comments for complex functionality

## 🐛 Known Issues

Before contributing, review the [Known Issues](README.md#known-issues) section in the README and [TEST_RESULTS.md](TEST_RESULTS.md) to understand current API limitations and bugs.

Note: This project tests the public Restful Booker API, which has known bugs (29 documented). Contributors should focus on improving the test framework, not fixing API bugs.

## ✅ Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] New tests added for new features
- [ ] Documentation updated as needed
- [ ] Commits follow conventional commit format
- [ ] PR description clearly explains changes

## 📧 Questions?

If you have questions about contributing:

- Open a [Discussion](../../discussions)
- Contact me on [LinkedIn](https://www.linkedin.com/in/adam-kelm)

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for helping improve this project! 🎉
