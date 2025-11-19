const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { RegistrationPage } = require('../../pages/RegistrationPage');
const { HelperFunctions } = require('../../utils/helperFunctions');
const testData = require('../../fixtures/testData.json');

/**
 * Login Test Suite - AutomationExercise
 * Uses: HelperFunctions (utils) for dynamic data + testData.json (fixtures) for static data
 * @tags @smoke @regression @auth
 */

// Store registered user credentials for login tests
let registeredUser = null;

test.describe('Login Functionality', () => {
  let loginPage;

  test.beforeAll(async ({ browser }) => {
    // Register a user once before all login tests
    const page = await browser.newPage();
    loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);

    // Dynamic credentials
    registeredUser = {
      userName: HelperFunctions.generateUsername('LoginTest'),
      email: HelperFunctions.generateEmail('logintest'),
      password: 'Test@123'
    };

    // Static data from fixtures
    const accountData = testData.accountData.default;
    const addressData = testData.addressData.minimal;

    await loginPage.navigateToLogin();
    await loginPage.signup(registeredUser.userName, registeredUser.email);
    await registrationPage.completeRegistration(accountData, addressData);
    await registrationPage.clickContinue();
    
    // Logout after registration
    await loginPage.logout();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should login successfully with valid credentials @smoke', async () => {
    // Act - Login with registered user
    await loginPage.login(registeredUser.email, registeredUser.password);
    
    // Assert
    await expect(loginPage.loggedInUser).toBeVisible();
    await expect(loginPage.loggedInUser).toContainText(registeredUser.userName);
  });

  test('should show error with invalid credentials @regression', async () => {
    // Act
    await loginPage.login('invalid@email.com', 'wrongpassword');
    
    // Assert
    await expect(loginPage.loginErrorMsg).toBeVisible();
    await expect(loginPage.loginErrorMsg).toContainText('Your email or password is incorrect!');
  });

  test('should show error with empty credentials @regression', async () => {
    // Act
    await loginPage.loginEmail.click();
    await loginPage.loginPassword.click();
    await loginPage.loginButton.click();
    
    // Assert - Browser validation kicks in
    const emailValidation = await loginPage.loginEmail.evaluate((el) => el.validationMessage);
    expect(emailValidation).toBeTruthy();
  });

  test('should logout successfully after login @smoke', async () => {
    // Arrange - Login first
    await loginPage.login(registeredUser.email, registeredUser.password);
    await expect(loginPage.loggedInUser).toBeVisible();
    
    // Act
    await loginPage.logout();
    
    // Assert
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loggedInUser).not.toBeVisible();
  });

  // Cleanup - Delete the test user after all tests
  test.afterAll(async ({ browser }) => {
    const page = await browser.newPage();
    loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.deleteAccount();
    
    await page.close();
  });
});

/**
 * Signup Functionality Tests
 */
test.describe('Signup Functionality', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should show error when email already exists @regression', async () => {
    // Arrange - Use the registered user's email
    const existingEmail = registeredUser.email;
    
    // Act
    await loginPage.signup('Test User', existingEmail);
    
    // Assert
    await expect(loginPage.emailExistsMsg).toBeVisible();
    await expect(loginPage.emailExistsMsg).toContainText('Email Address already exist!');
  });

  test('should navigate to registration page with new email @smoke', async ({ page }) => {
    // Arrange
    const timestamp = Date.now();
    const newEmail = `newuser${timestamp}@example.com`;
    
    // Act
    await loginPage.signup('New User', newEmail);
    
    // Assert
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.locator('h2:has-text("Enter Account Information")')).toBeVisible();
  });

  test('should validate email format @regression', async () => {
    // Act
    await loginPage.signupEmail.fill('invalidemail');
    await loginPage.signupButton.click();
    
    // Assert - Browser validation
    const emailValidation = await loginPage.signupEmail.evaluate((el) => el.validationMessage);
    expect(emailValidation).toContain('@');
  });

  test('should validate required fields @regression', async () => {
    // Act - Try to submit empty signup form
    await loginPage.signupButton.click();
    
    // Assert - Browser validation for name field
    const nameValidation = await loginPage.signupName.evaluate((el) => el.validationMessage);
    expect(nameValidation).toBeTruthy();
  });
});