const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { RegistrationPage } = require('../../pages/RegistrationPage');
const { HelperFunctions } = require('../../utils/helperFunctions');
const testData = require('../../fixtures/testData.json');


/**
 * User Registration Test Suite - AutomationExercise
 * Uses: HelperFunctions (utils) for dynamic data + testData.json (fixtures) for static data
 * @tags @smoke @regression @auth
 */
test.describe('User Registration', () => {
  let loginPage;
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registrationPage = new RegistrationPage(page);
    await loginPage.navigateToLogin();
  });

  test('should register new user successfully @smoke', async ({ page }) => {
    // Dynamic data (always unique)
    const userName = HelperFunctions.generateUsername('TestUser');
    const userEmail = HelperFunctions.generateEmail('testuser');
    
    // Static data from fixtures
    const accountData = testData.accountData.default;
    const addressData = testData.addressData.usa;

    // Act - Signup
    await loginPage.signup(userName, userEmail);
    
    // Act - Complete registration
    await registrationPage.completeRegistration(accountData, addressData, 'Mr');
    
    // Assert - Account created
    await expect(registrationPage.accountCreatedMsg).toBeVisible();
    await expect(registrationPage.accountCreatedMsg).toContainText('Account Created!');
    
    // Continue and verify login
    await registrationPage.clickContinue();
    await expect(loginPage.loggedInUser).toBeVisible();
    await expect(loginPage.loggedInUser).toContainText(userName);
  });

  test('should show error with existing email @regression', async () => {
    // Arrange - Existing email
    const existingEmail = 'testuser@example.com';
    
    // Act
    await loginPage.signup('Test User', existingEmail);
    
    // Assert
    await expect(loginPage.emailExistsMsg).toBeVisible();
    await expect(loginPage.emailExistsMsg).toContainText('Email Address already exist!');
  });

  test('should validate required fields in registration form @regression', async ({ page }) => {
    // Arrange
    const newEmail = `testuser${Date.now()}@example.com`;
    
    // Act - Go to registration page
    await loginPage.signup('Test User', newEmail);
    
    // Wait for registration page to load
    await expect(page).toHaveURL(/.*signup/);
    await expect(registrationPage.password).toBeVisible();
    
    // Try to submit without filling required fields (just click create account)
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.reportValidity();
    });
    
    // Assert - Browser validation should prevent submission
    // Check if password field is required
    const isPasswordRequired = await registrationPage.password.evaluate((el) => el.required);
    expect(isPasswordRequired).toBe(true);
  });

  test('should register with minimal required data @regression', async ({ page }) => {
    // Dynamic data
    const userName = HelperFunctions.generateUsername('MinUser');
    const userEmail = HelperFunctions.generateEmail('minuser');
    
    // Static data from fixtures
    const accountData = testData.accountData.minimal;
    const addressData = testData.addressData.minimal;

    // Act
    await loginPage.signup(userName, userEmail);
    await registrationPage.completeRegistration(accountData, addressData);
    
    // Assert
    await expect(registrationPage.accountCreatedMsg).toBeVisible();
  });

  test('should allow registration with newsletter subscription @regression', async ({ page }) => {
    // Dynamic data
    const userName = HelperFunctions.generateUsername('NewsUser');
    const userEmail = HelperFunctions.generateEmail('newsuser');
    
    // Static data from fixtures
    const accountData = testData.accountData.alternate;
    const addressData = testData.addressData.india;

    // Act
    await loginPage.signup(userName, userEmail);
    await registrationPage.selectTitle('Mrs');
    await registrationPage.fillAccountInfo(accountData);
    await registrationPage.selectNewsletterAndOffers(); // Subscribe
    await registrationPage.fillAddressInfo(addressData);
    await registrationPage.clickCreateAccount();
    
    // Assert
    await expect(registrationPage.accountCreatedMsg).toBeVisible();
  });

  test('should delete account after registration @smoke', async ({ page }) => {
    // Dynamic data
    const userName = HelperFunctions.generateUsername('DelUser');
    const userEmail = HelperFunctions.generateEmail('deluser');
    
    // Static data from fixtures
    const accountData = testData.accountData.default;
    const addressData = testData.addressData.australia;

    // Act - Register
    await loginPage.signup(userName, userEmail);
    await registrationPage.completeRegistration(accountData, addressData);
    await registrationPage.clickContinue();
    
    // Act - Delete account
    await loginPage.deleteAccount();
    
    // Assert - Account deleted
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
  });
});