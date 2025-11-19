const { BasePage } = require('./BasePage');


/**
 * Registration Page - https://automationexercise.com/signup
 * Complete account creation form
 */
class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    
    
    // ========== ACCOUNT INFORMATION ==========
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.password = page.locator('#password');
    this.birthDay = page.locator('#days');
    this.birthMonth = page.locator('#months');
    this.birthYear = page.locator('#years');
    
    // ========== CHECKBOXES ==========
    this.newsletterCheckbox = page.locator('#newsletter');
    this.specialOffersCheckbox = page.locator('#optin');
    
    // ========== ADDRESS INFORMATION ==========
    this.firstName = page.locator('#first_name');
    this.lastName = page.locator('#last_name');
    this.company = page.locator('#company');
    this.address1 = page.locator('#address1');
    this.address2 = page.locator('#address2');
    this.country = page.locator('#country');
    this.state = page.locator('#state');
    this.city = page.locator('#city');
    this.zipcode = page.locator('#zipcode');
    this.mobileNumber = page.locator('#mobile_number');
    
    // ========== BUTTON ==========
    this.createAccountBtn = page.locator('button[data-qa="create-account"]');
    
    // ========== SUCCESS MESSAGE ==========
    this.accountCreatedMsg = page.locator('h2:has-text("Account Created!")');
    this.continueBtn = page.locator('a[data-qa="continue-button"]');
  }

  // ==================== FILL ACCOUNT INFO ====================
  
  async selectTitle(gender = 'Mr') {
    const titleLocator = gender === 'Mr' ? this.titleMr : this.titleMrs;
    await this.controls.checkCheckbox(titleLocator);
  }

  async fillAccountInfo(accountData) {
    await this.controls.fillInput(this.password, accountData.password);
    await this.controls.selectOptionByValue(this.birthDay, accountData.day);
    await this.controls.selectOptionByValue(this.birthMonth, accountData.month);
    await this.controls.selectOptionByValue(this.birthYear, accountData.year);
  }

  async selectNewsletterAndOffers() {
    await this.controls.checkCheckbox(this.newsletterCheckbox);
    await this.controls.checkCheckbox(this.specialOffersCheckbox);
  }

  // ==================== FILL ADDRESS INFO ====================
  
  async fillAddressInfo(addressData) {
    await this.controls.fillInput(this.firstName, addressData.firstName);
    await this.controls.fillInput(this.lastName, addressData.lastName);
    
    if (addressData.company) {
      await this.controls.fillInput(this.company, addressData.company);
    }
    
    await this.controls.fillInput(this.address1, addressData.address1);
    
    if (addressData.address2) {
      await this.controls.fillInput(this.address2, addressData.address2);
    }
    
    await this.controls.selectOptionByValue(this.country, addressData.country);
    await this.controls.fillInput(this.state, addressData.state);
    await this.controls.fillInput(this.city, addressData.city);
    await this.controls.fillInput(this.zipcode, addressData.zipcode);
    await this.controls.fillInput(this.mobileNumber, addressData.mobileNumber);
  }

  // ==================== COMPLETE REGISTRATION ====================
  
  async completeRegistration(accountData, addressData, gender = 'Mr') {
    await this.selectTitle(gender);
    await this.fillAccountInfo(accountData);
    await this.selectNewsletterAndOffers();
    await this.fillAddressInfo(addressData);
    await this.controls.clickElement(this.createAccountBtn);
  }

  async clickCreateAccount() {
    await this.controls.clickElement(this.createAccountBtn);
  }

  async clickContinue() {
    await this.controls.clickElement(this.continueBtn);
  }
}

module.exports = { RegistrationPage };