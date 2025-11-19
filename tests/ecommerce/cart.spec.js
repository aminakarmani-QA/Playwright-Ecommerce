const { test, expect } = require('@playwright/test');
const { CartPage } = require('../../pages/CartPage');
const { ProductPage } = require('../../pages/ProductPage');
const { LoginPage } = require('../../pages/LoginPage');
const { RegistrationPage } = require('../../pages/RegistrationPage');
const { HelperFunctions } = require('../../utils/helperFunctions');
const testData = require('../../fixtures/testData.json');

/**
 * Shopping Cart Test Suite - AutomationExercise
 * Uses: HelperFunctions (utils) for dynamic data + testData.json (fixtures) for static data
 * @tags @smoke @regression @ecommerce
 */
test.describe('Shopping Cart Functionality', () => {
  let cartPage;
  let productPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);
    await productPage.navigateToProducts();
  });

  test('should add product to cart from product listing @smoke', async () => {
    // Act - Hover and add first product
    await productPage.hoverAndAddToCart(0);
    
    // Assert - Modal appears
    await expect(productPage.addedToCartModal).toBeVisible();
    
    // Act - View cart
    await productPage.viewCart();
    
    // Assert - Product in cart
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);
  });

  test('should add product with quantity from detail page @smoke', async () => {
    // Act - Go to product detail
    await productPage.clickViewProduct(0);
    const productName = await productPage.productName.textContent();
    
    // Add with quantity 4
    await productPage.addToCart(4);
    await productPage.viewCart();
    
    // Assert - Check product and quantity
    const products = await cartPage.getAllProducts();
    expect(products.length).toBe(1);
    expect(products[0].quantity).toBe('4');
    expect(products[0].name).toContain(productName.trim());
  });

  test('should add multiple products to cart @regression', async () => {
    // Act - Add 3 products
    await productPage.hoverAndAddToCart(0);
    await productPage.continueShopping();
    
    await productPage.hoverAndAddToCart(1);
    await productPage.continueShopping();
    
    await productPage.hoverAndAddToCart(2);
    await productPage.viewCart();
    
    // Assert - 3 items in cart
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(3);
  });

  test('should remove product from cart @regression', async () => {
    // Arrange - Add product
    await productPage.hoverAndAddToCart(0);
    await productPage.viewCart();
    
    const initialCount = await cartPage.getItemCount();
    expect(initialCount).toBe(1);
    
    // Act - Remove product
    await cartPage.removeItem(0);
    
    // Assert - Cart is empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });

  test('should display correct product information in cart @regression', async () => {
    // Arrange - Get product info from listing
    const expectedName = await productPage.getProductName(0);
    const expectedPrice = await productPage.getProductPrice(0);
    
    // Act - Add to cart
    await productPage.hoverAndAddToCart(0);
    await productPage.viewCart();
    
    // Assert - Verify cart information
    const actualName = await cartPage.getProductName(0);
    const actualPrice = await cartPage.getProductPrice(0);
    
    expect(actualName).toContain(expectedName);
    expect(actualPrice).toBe(expectedPrice);
  });

  test('should calculate total correctly @regression', async () => {
    // Act - Add product with quantity
    await productPage.clickViewProduct(0);
    await productPage.addToCart(3);
    await productPage.viewCart();
    
    // Assert - Get price and quantity
    const priceText = await cartPage.getProductPrice(0);
    const quantity = await cartPage.getProductQuantity(0);
    const totalText = await cartPage.getProductTotal(0);
    
    // Extract numbers (Rs. 500 → 500)
    const price = parseInt(priceText.replace(/\D/g, ''));
    const qty = parseInt(quantity);
    const total = parseInt(totalText.replace(/\D/g, ''));
    
    // Verify calculation
    expect(total).toBe(price * qty);
  });

  test('should persist cart items across navigation @regression', async () => {
    // Act - Add product
    await productPage.hoverAndAddToCart(0);
    await productPage.continueShopping();
    
    // Navigate away and back
    await productPage.navigateToProducts();
    await cartPage.navigateToCart();
    
    // Assert - Item still in cart
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);
  });

  test('should show register/login prompt when checkout without login @regression', async ({ page }) => {
    // Arrange - Add product
    await productPage.hoverAndAddToCart(0);
    await productPage.viewCart();
    
    // Act - Try to checkout
    await cartPage.proceedToCheckout();
    
    // Assert - Register/Login modal or link appears
    await expect(cartPage.registerLoginLink).toBeVisible();
  });

  test('should allow checkout for logged in user @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);
    
    // Register and login a user
    const userName = HelperFunctions.generateUsername('CartTest');
    const userEmail = HelperFunctions.generateEmail('carttest');
    const accountData = testData.accountData.default;
    const addressData = testData.addressData.minimal;
    
    await loginPage.navigateToLogin();
    await loginPage.signup(userName, userEmail);
    await registrationPage.completeRegistration(accountData, addressData);
    await registrationPage.clickContinue();
    await expect(loginPage.loggedInUser).toBeVisible();
    
    // Add product
    await productPage.navigateToProducts();
    await productPage.hoverAndAddToCart(0);
    await productPage.viewCart();
    
    // Act - Checkout
    await cartPage.proceedToCheckout();
    
    // Assert - Should go to checkout page
    await expect(page).toHaveURL(/.*checkout/);
  });
});