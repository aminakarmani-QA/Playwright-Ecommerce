# 🎭 Playwright Automation Framework

A robust and scalable test automation framework built with Playwright and JavaScript, following the Page Object Model (POM) design pattern.

## 🌐 Application Under Test

**Website:** [AutomationExercise.com](https://automationexercise.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [Test Reports](#-test-reports)
- [Writing Tests](#-writing-tests)
- [CI/CD Integration](#-cicd-integration)
- [Best Practices](#-best-practices)

## ✨ Features

- ✅ **Page Object Model (POM)** - Clean separation of test logic and page elements
- ✅ **Reusable Components** - Common control functions for all interactions
- ✅ **Multi-Browser Support** - Chrome, Firefox, Safari
- ✅ **Parallel Execution** - Fast test execution with configurable workers
- ✅ **Allure Reporting** - Beautiful and detailed test reports
- ✅ **Environment Management** - Easy switching between environments
- ✅ **CI/CD Ready** - Optimized for GitHub Actions, Jenkins, etc.
- ✅ **Auto-waiting** - Built-in smart waits, no explicit waits needed
- ✅ **Screenshot & Video** - Automatic capture on test failures

## 🛠️ Tech Stack

- **Test Framework:** Playwright v1.56+
- **Language:** JavaScript (Node.js)
- **Design Pattern:** Page Object Model (POM)
- **Reporting:** Allure, HTML
- **CI/CD:** GitHub Actions compatible

## 📁 Project Structure

```
Playwright-project/
├── .env                          # Environment variables
├── package.json                  # Dependencies and scripts
├── playwright.config.js          # Playwright configuration
├── pages/                        # Page Object Models
│   ├── BasePage.js              # Base class with common methods
│   ├── LoginPage.js             # Login/Signup page
│   ├── RegistrationPage.js      # Registration form page
│   ├── ProductPage.js           # Product listing & details
│   └── CartPage.js              # Shopping cart page
├── utils/                        # Utility functions
│   └── controlFunctions.js      # Reusable control methods
├── tests/                        # Test specifications
│   ├── auth/                    # Authentication tests
│   │   ├── login.spec.js
│   │   └── registration.spec.js
│   └── ecommerce/               # E-commerce tests
│       └── cart.spec.js
├── allure-results/              # Allure test results
├── allure-report/               # Generated Allure reports
└── playwright-report/           # HTML test reports
```

## 📦 Prerequisites

- **Node.js** - v18 or higher
- **npm** - v9 or higher
- **Git** - For version control

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Playwright-project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install Playwright browsers:**
```bash
npx playwright install
```

4. **Setup environment variables:**
```bash
# Create .env file in root directory
cp .env.example .env
```

## ⚙️ Configuration

### Environment Variables (.env)

```env
ENV=staging
BASE_URL=https://automationexercise.com
```

### Playwright Config (playwright.config.js)

- **Timeout:** 30 seconds per test
- **Retries:** 0 locally, 2 in CI/CD
- **Workers:** 3 locally, 2 in CI/CD
- **Browsers:** Chromium, Firefox, WebKit

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific browser
```bash
npm run test:chrome
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests by tags
```bash
# Smoke tests only
npm run test:smoke

# Regression tests only
npm run test:regression
```

### Run specific test file
```bash
npx playwright test tests/auth/login.spec.js
```

### Run with custom workers
```bash
# Sequential execution
npx playwright test --workers=1

# Parallel with 4 workers
npx playwright test --workers=4
```

## 📊 Test Reports

### HTML Report (Built-in)
```bash
# View last test report
npm run report
```

### Allure Report
```bash
# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open
```

Reports are automatically generated after each test run:
- **HTML Report:** `playwright-report/index.html`
- **Allure Report:** `allure-report/index.html`

## ✍️ Writing Tests

### Test Structure Example

```javascript
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should login successfully @smoke', async () => {
    await loginPage.login('test@example.com', 'Password123');
    await expect(loginPage.loggedInUser).toBeVisible();
  });
});
```

### Page Object Example

```javascript
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.loginEmail = page.locator('[data-qa="login-email"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
  }

  async login(email, password) {
    await this.controls.fillInput(this.loginEmail, email);
    await this.controls.fillInput(this.loginPassword, password);
    await this.controls.clickElement(this.loginButton);
  }
}

module.exports = { LoginPage };
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 📝 Best Practices

### 1. **Page Objects**
- Keep page objects clean with only actions
- Use descriptive method names
- Avoid assertions in page objects

### 2. **Tests**
- Follow AAA pattern (Arrange, Act, Assert)
- Use meaningful test names
- One assertion per test when possible
- Use tags (@smoke, @regression) for organization

### 3. **Locators**
- Prefer `data-qa` attributes
- Use `page.locator()` over deprecated methods
- Avoid XPath when possible

### 4. **Waits**
- Rely on Playwright's auto-waiting
- Avoid `wait()` or `sleep()` methods
- Use `waitForLoadState()` when needed

### 5. **Data Management**
- Use timestamps for unique data
- Keep test data inline for clarity
- No hardcoded credentials

## 🏗️ Design Patterns

### Page Object Model (POM)
- **BasePage:** Common functionality inherited by all pages
- **Page Classes:** Encapsulate page elements and actions
- **Control Functions:** Reusable interaction methods

### Benefits:
- ✅ Maintainability - Update locators in one place
- ✅ Readability - Tests read like user stories
- ✅ Reusability - Share common actions
- ✅ Scalability - Easy to add new pages/tests

## 🐛 Troubleshooting

### Tests failing randomly?
- Increase timeout in `playwright.config.js`
- Reduce number of workers
- Check for race conditions

### Browser not launching?
```bash
npx playwright install --with-deps
```

### .env not loading?
- Ensure `.env` is in root directory
- No spaces around `=` in .env file
- Restart terminal after changes

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [AutomationExercise API](https://automationexercise.com/api_list)

## 👤 Author

**Amina**

## 📄 License

ISC

---

**Happy Testing! 🎭**