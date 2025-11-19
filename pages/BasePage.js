import { controlFunctions } from '../utils/controlFunctions.js';
/**
 * Base Page - Parent class for all page objects
 * Contains common methods used across all pages
 */
export class BasePage {
  constructor(page) {
    this.page = page;
    this.controls = new controlFunctions();
  }

  /**
   * Navigate to a specific URL
   * @param {string} path - URL path to navigate to
   */
  async navigate(path = '') {
    await this.page.goto(path);
  }

  /**
   * Get current page URL
   * @returns {string} Current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Get page title
   * @returns {string} Page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Reload current page
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward() {
    await this.page.goForward();
  }

  /**
   * Take screenshot with custom name
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `screenshots/${timestamp}-${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for specific time (use sparingly)
   * @param {number} milliseconds - Time to wait
   */
  async wait(milliseconds) {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Accept browser alert/confirm dialog
   */
  async acceptDialog() {
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  /**
   * Dismiss browser alert/confirm dialog
   */
  async dismissDialog() {
    this.page.on('dialog', async dialog => {
      await dialog.dismiss();
    });
  }

  /**
   * Get dialog message text
   * @returns {Promise<string>} Dialog message
   */
  async getDialogMessage() {
    return new Promise((resolve) => {
      this.page.once('dialog', async dialog => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }

  /**
   * Switch to iframe by selector
   * @param {string} iframeSelector - Iframe selector
   * @returns {Frame} Iframe frame object
   */
  async switchToIframe(iframeSelector) {
    const frame = this.page.frameLocator(iframeSelector);
    return frame;
  }

  /**
   * Execute JavaScript in browser context
   * @param {string} script - JavaScript code to execute
   * @returns {Promise<any>} Result of script execution
   */
  async executeScript(script) {
    return await this.page.evaluate(script);
  }

  /**
   * Scroll to element
   * @param {Locator} locator - Element locator
   */
  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Get all cookies
   * @returns {Promise<Array>} Array of cookie objects
   */
  async getCookies() {
    return await this.page.context().cookies();
  }

  /**
   * Clear all cookies
   */
  async clearCookies() {
    await this.page.context().clearCookies();
  }

  /**
   * Set cookie
   * @param {Object} cookie - Cookie object
   */
  async setCookie(cookie) {
    await this.page.context().addCookies([cookie]);
  }

  /**
   * Get local storage item
   * @param {string} key - Storage key
   * @returns {Promise<string>} Storage value
   */
  async getLocalStorage(key) {
    return await this.page.evaluate((key) => {
      return localStorage.getItem(key);
    }, key);
  }

  /**
   * Set local storage item
   * @param {string} key - Storage key
   * @param {string} value - Storage value
   */
  async setLocalStorage(key, value) {
    await this.page.evaluate(({key, value}) => {
      localStorage.setItem(key, value);
    }, {key, value});
  }

  /**
   * Clear local storage
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Verify element is visible
   * @param {Locator} locator - Element locator
   * @returns {Promise<boolean>} True if visible
   */
  async isElementVisible(locator) {
    return await this.controls.isVisible(locator);
  }

  /**
   * Verify element is enabled
   * @param {Locator} locator - Element locator
   * @returns {Promise<boolean>} True if enabled
   */
  async isElementEnabled(locator) {
    return await this.controls.isEnabled(locator);
  }

  /**
   * Get element count
   * @param {Locator} locator - Element locator
   * @returns {Promise<number>} Number of elements
   */
  async getElementCount(locator) {
    return await this.controls.getElementCount(locator);
  }
}

