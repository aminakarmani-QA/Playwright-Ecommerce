# 🎭 Playwright E-Commerce Automation Framework

> A modern, scalable test automation framework built with Playwright and JavaScript using the Page Object Model (POM) design pattern.

[![Playwright Tests](https://github.com/aminakarmani-QA/playwright-ecommerce/actions/workflows/playwright.yml/badge.svg)](https://github.com/yourusername/playwright-ecommerce/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.56.1-45ba4b?logo=playwright)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)

---

## 🌟 Features

- ✅ **Page Object Model** - Clean separation of test logic and page interactions
- ✅ **Reusable Components** - Control functions for consistent element interactions
- ✅ **Multi-Browser Support** - Chrome, Firefox, Safari
- ✅ **Parallel Execution** - Fast test runs with configurable workers
- ✅ **Allure Reports** - Beautiful, detailed test reports
- ✅ **CI/CD Ready** - GitHub Actions integration included
- ✅ **Data-Driven Testing** - JSON fixtures for static data
- ✅ **Helper Functions** - Dynamic data generation utilities

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/playwright-ecommerce.git
cd playwright-ecommerce

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Run Tests

```bash
# Run all tests
npm test

# Run with UI (interactive mode)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# Run smoke tests only
npm run test:smoke

# Run regression tests
npm run test:regression

# View Playwright HTML report
npm run report

# Quick Allure report (starts server immediately)
npm run allure:serve

# Generate Allure report
npm run allure:generate

# Generate single-file Allure report (for sharing)
npm run allure:generate:single

# Open Allure report in browser
npm run allure:open
```

---

## 📁 Project Structure

```
Playwright-Ecommerce/
├── fixtures/
│   └── testData.json          # Static test data (addresses, DOB, etc.)
├── pages/                      # Page Object Models
│   ├── BasePage.js            # Base class with common methods
│   ├── LoginPage.js           # Login & Signup page
│   ├── RegistrationPage.js    # Registration form page
│   ├── ProductPage.js         # Product listing & details
│   └── CartPage.js            # Shopping cart page
├── utils/
│   ├── controlFunctions.js    # Reusable element interactions
│   └── helperFunctions.js     # Dynamic data generators
├── tests/
│   ├── auth/                  # Authentication tests
│   │   ├── login.spec.js
│   │   └── registration.spec.js
│   ├── ecommerce/             # E-commerce tests
│   │   └── cart.spec.js
│   └── e2e/                   # End-to-end flows
│       └── user-journey.spec.js
├── .github/
│   └── workflows/
│       └── playwright.yml     # CI/CD configuration
├── playwright.config.js       # Playwright configuration
└── package.json              # Dependencies & scripts
```

---

## 🧪 Test Scenarios

### Authentication (`tests/auth/`)
- ✅ User registration with multiple data sets
- ✅ Login with valid/invalid credentials
- ✅ Logout functionality
- ✅ Email validation

### E-Commerce (`tests/ecommerce/`)
- ✅ Add products to cart
- ✅ Update cart quantities
- ✅ Remove items from cart
- ✅ Checkout flow

### End-to-End (`tests/e2e/`)
- ✅ Complete user journey: Register → Login → Shop → Checkout

---

## 📊 Test Reports

### HTML Report (Built-in)

```bash
# View last test report (opens automatically in browser)
npm run report
```

### Allure Report

```bash
# Option 1: Serve report directly (fastest - starts server immediately)
npm run allure:serve
# Opens: http://localhost:port with live report

# Option 2: Generate and open report
npm run allure:generate          # Generate report
npm run allure:open              # Open in browser

# Option 3: Generate single-file report (for sharing)
npm run allure:generate:single   # Creates standalone HTML file
npm run allure:open              # Open in browser
```

**Report Locations:**
- **HTML Report**: `playwright-report/index.html`
- **Allure Report**: `allure-report/index.html`
- **Allure Results**: `allure-results/` (raw test data)

**Allure Commands Explained:**

| Command | What It Does | When to Use |
|---------|--------------|-------------|
| `allure:serve` | Starts local server with live report | Quick check after test run |
| `allure:generate` | Creates static HTML report | For archiving/CI |
| `allure:generate:single` | Creates single standalone file | For sharing via email/Slack |
| `allure:open` | Opens existing report in browser | View previously generated report |

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
ENV=staging
BASE_URL=https://automationexercise.com
```

### Playwright Config

Key settings in `playwright.config.js`:

```javascript
{
  timeout: 40000,              // Test timeout
  retries: 2,                  // Retry failed tests (CI only)
  workers: undefined,          // Parallel workers (50% of CPU cores)
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
}
```

---

## 🎯 Writing Tests

### Basic Test Structure

```javascript
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { HelperFunctions } = require('../../utils/helperFunctions');
const testData = require('../../fixtures/testData.json');

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should login successfully @smoke', async () => {
    // Dynamic data
    const email = HelperFunctions.generateEmail('test');
    
    // Static data
    const accountData = testData.accountData.default;
    
    // Test actions
    await loginPage.login(email, 'Password123');
    
    // Assertions
    await expect(loginPage.loggedInUser).toBeVisible();
  });
});
```

### Page Object Example

```javascript
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
```

---

## 🔄 CI/CD Integration

### GitHub Actions

The framework includes a pre-configured GitHub Actions workflow (`.github/workflows/playwright.yml`):

**Features:**
- ✅ Runs on push to main/master branches
- ✅ Runs on pull requests
- ✅ Installs dependencies and browsers
- ✅ Executes all tests
- ✅ Generates both HTML and Allure reports
- ✅ Uploads reports as artifacts
- ✅ Deploys Allure report to GitHub Pages (optional)

### Accessing Reports in CI

After a GitHub Actions run completes:

1. **Go to your GitHub repository**
2. **Click "Actions" tab**
3. **Select the workflow run**
4. **Scroll down to "Artifacts" section**

**Available Artifacts:**
- 📊 `playwright-html-report` - Playwright HTML report
- 📈 `allure-report` - Allure HTML report
- 🔍 `allure-results` - Raw Allure test data
- ❌ `test-results` - Failure screenshots/videos (only on failure)

**GitHub Pages (Optional):**
If enabled, Allure reports are automatically published to:
```
https://yourusername.github.io/playwright-ecommerce/allure-report/
```

**To enable GitHub Pages:**
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

### Running in CI

Tests automatically run on:
- Push to `main` or `master` branch
- Pull request creation/update

**Manual Trigger:**
Go to Actions → Playwright Tests → Run workflow

---

## 📚 Key Concepts

### Data Management

**Dynamic Data** (always unique):
```javascript
const email = HelperFunctions.generateEmail('test');
const username = HelperFunctions.generateUsername('user');
```

**Static Data** (reusable):
```javascript
const accountData = testData.accountData.default;
const addressData = testData.addressData.usa;
```

### Test Tags

Organize tests with tags:
```javascript
test('should login @smoke', async () => { ... });
test('should validate form @regression', async () => { ... });
```

Run by tag:
```bash
npm run test:smoke       # Run smoke tests
npm run test:regression  # Run regression tests
```

---

## 🛠️ Troubleshooting

### Common Issues

**Tests fail with "Cannot find module"**
```bash
npm install
```

**Browsers not launching**
```bash
npx playwright install --with-deps
```

**Timeout errors**
- Increase timeout in `playwright.config.js`
- Check network connectivity
- Reduce parallel workers

**Strict mode violations**
- Make locators more specific
- Use `.first()` or `.nth(index)`
- Add proper waits

---

## 📈 Best Practices

1. **Keep Tests Independent** - Each test should run standalone
2. **Use Page Objects** - Separate test logic from page interactions
3. **Avoid Hard Waits** - Use auto-waiting and proper locators
4. **Tag Your Tests** - Organize with `@smoke`, `@regression` tags
5. **Generate Unique Data** - Use helper functions for emails/usernames
6. **Clean Up After Tests** - Delete created test data

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👤 Author

**Amina**

---

## 🙏 Acknowledgments

- [Playwright Documentation](https://playwright.dev/)
- [AutomationExercise](https://automationexercise.com/) - Test Application
- [Allure Framework](https://docs.qameta.io/allure/) - Reporting

---

## 📞 Support

For issues and questions:
- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/playwright-ecommerce/issues)
- 📖 Docs: [Project Wiki](https://github.com/yourusername/playwright-ecommerce/wiki)

---

<div align="center">
  <p>Built with ❤️ using Playwright</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
