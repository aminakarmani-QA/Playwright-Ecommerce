const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');
const { controlFunctions } = require('../utils/controlFunctions.js');

/**
 * Login Page - https://automationexercise.com/login
 * Handles both Login and Signup functionality
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    
    // ========== LOGIN SECTION ==========
    this.loginEmail = page.locator('input[data-qa="login-email"]');
    this.loginPassword = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    
    // ========== SIGNUP SECTION ==========
    this.signupName = page.locator('input[data-qa="signup-name"]');
    this.signupEmail = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    
    // ========== MESSAGES ==========
    this.loginErrorMsg = page.locator('p:has-text("Your email or password is incorrect!")');
    this.emailExistsMsg = page.locator('p:has-text("Email Address already exist!")');
    
    // ========== LOGGED IN STATE ==========
    this.loggedInUser = page.locator('a:has-text("Logged in as")');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
  }

  // ==================== NAVIGATION ====================
  
  async navigateToLogin() {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  // ==================== LOGIN ACTIONS ====================
  
  async login(email, password) {
    await this.controls.fillInput(this.loginEmail, email);
    await this.controls.fillInput(this.loginPassword, password);
    await this.controls.clickElement(this.loginButton);
  }

  async verifyLoginSuccess(username) {
    await expect(this.loggedInUser).toBeVisible();
    await expect(this.loggedInUser).toContainText(username);
  }

  async verifyLoginError() {
    await expect(this.loginErrorMsg).toBeVisible();
  }

  // ==================== SIGNUP ACTIONS ====================
  
  async signup(name, email) {
    await this.controls.fillInput(this.signupName, name);
    await this.controls.fillInput(this.signupEmail, email);
    await this.controls.clickElement(this.signupButton);
  }

  async verifySignupError() {
    await expect(this.emailExistsMsg).toBeVisible();
  }

  // ==================== LOGOUT ====================
  
  async logout() {
    await this.controls.clickElement(this.logoutLink);
  }

  async isLoggedIn() {
    return await this.controls.isVisible(this.loggedInUser);
  }

  // ==================== DELETE ACCOUNT ====================
  
  async deleteAccount() {
    await this.controls.clickElement(this.deleteAccountLink);
  }
}

module.exports = { LoginPage };