// ============================================
// tests/e2e/user-journey.spec.js
// Complete user journey in one test
// ============================================

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { RegistrationPage } = require('../../pages/RegistrationPage');
const {ProductPage} = require('../../Pages/ProductPage');
const { CartPage } = require('../../pages/CartPage');
const { HelperFunctions } = require('../../utils/helperFunctions');
const testData = require('../../fixtures/testData.json');

test.describe.serial('Complete User Journey E2E @e2e', () => {
  let page, loginPage, registrationPage, productPage, cartPage;
  let userEmail, userName;

  // Serial execution - tests run in order
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    registrationPage = new RegistrationPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Step 1: Should register new user successfully', async () => {
    // Generate unique user data
    userName = HelperFunctions.generateUsername('E2EUser');
    userEmail = HelperFunctions.generateEmail('e2euser');

    const accountData = testData.accountData.default;
    const addressData = testData.addressData.usa;

    // Registration flow
    await loginPage.navigateToLogin();
    await loginPage.signup(userName, userEmail);
    await registrationPage.completeRegistration(accountData, addressData, 'Mr');
    
    // Verify account created
    await expect(registrationPage.accountCreatedMsg).toBeVisible();
    await registrationPage.clickContinue();
    
    // Verify logged in
    await expect(loginPage.loggedInUser).toBeVisible();
    await expect(loginPage.loggedInUser).toContainText(userName);
    
    console.log(`✅ User registered: ${userEmail}`);
  });

  test('Step 2: Should logout and login with created user', async () => {
    // Logout
    await loginPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    
    // Login with created credentials
    await loginPage.login(userEmail, 'Test@123');
    
    // Verify successful login
    await expect(loginPage.loggedInUser).toBeVisible();
    await expect(loginPage.loggedInUser).toContainText(userName);
    
    console.log(`✅ User logged in: ${userEmail}`);
  });

  test('Step 3: Should browse and add products to cart', async () => {
    // Navigate to products
    await productPage.navigateToProducts();
    
    // Add first product
    await productPage.hoverAndAddToCart(0);
    await expect(productPage.addedToCartModal).toBeVisible();
    const product1Name = await productPage.getProductName(0);
    await productPage.continueShopping();
    
    // Add second product
    await productPage.hoverAndAddToCart(1);
    await expect(productPage.addedToCartModal).toBeVisible();
    const product2Name = await productPage.getProductName(1);
    await productPage.viewCart();
    
    // Verify cart
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(2);
    
    console.log(`✅ Added 2 products to cart`);
  });

  test('Step 4: Should proceed to checkout', async () => {
    // Verify user is on cart page
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBeGreaterThan(0);
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Verify checkout page loaded
    await expect(page).toHaveURL(/.*checkout/);
    
    console.log(`✅ Proceeded to checkout`);
  });

  test('Step 5: Should delete account (cleanup)', async () => {
    // Delete account
    await loginPage.deleteAccount();
    
    // Verify account deleted
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
    
    console.log(`✅ User account deleted: ${userEmail}`);
  });
});

// ============================================
// Run this test:
// npx playwright test tests/e2e/user-journey.spec.js
// ============================================