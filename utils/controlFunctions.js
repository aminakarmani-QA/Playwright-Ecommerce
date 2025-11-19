export class controlFunctions {
  constructor(timeout = 30000) {
    this.defaultTimeout = timeout;
  }

  /**
   * Click on an element with proper waiting and error handling
   */
  async clickElement(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      await element.click(options);
    } catch (error) {
      throw new Error(`Failed to click element: ${error.message}`);
    }
  }

  /**
   * Fill input field - removed unnecessary click before fill
   */
  async fillInput(element, value, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      // Clear existing value first (best practice)
      await element.clear();
      await element.fill(value, options);
    } catch (error) {
      throw new Error(`Failed to fill input with value "${value}": ${error.message}`);
    }
  }

  /**
   * Type text with delay (useful for autocomplete fields)
   */
  async typeInput(element, value, options = { delay: 100 }) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      await element.clear();
      await element.type(value, options);
    } catch (error) {
      throw new Error(`Failed to type into element: ${error.message}`);
    }
  }

  /**
   * Select dropdown option by value, label, or index
   */
  async selectOptionByValue(element, value, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      await element.selectOption(value);
    } catch (error) {
      throw new Error(`Failed to select option "${value}": ${error.message}`);
    }
  }

  /**
   * Select by visible label text
   */
  async selectOptionByLabel(element, label, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      await element.selectOption({ label });
    } catch (error) {
      throw new Error(`Failed to select option by label "${label}": ${error.message}`);
    }
  }

  /**
   * Check checkbox (only if not already checked)
   */
  async checkCheckbox(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      const isChecked = await element.isChecked();
      if (!isChecked) {
        await element.check(options);
      }
    } catch (error) {
      throw new Error(`Failed to check checkbox: ${error.message}`);
    }
  }

  /**
   * Uncheck checkbox (only if currently checked)
   */
  async uncheckCheckbox(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      const isChecked = await element.isChecked();
      if (isChecked) {
        await element.uncheck(options);
      }
    } catch (error) {
      throw new Error(`Failed to uncheck checkbox: ${error.message}`);
    }
  }

  /**
   * Toggle checkbox state
   */
  async toggleCheckbox(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      const isChecked = await element.isChecked();
      if (isChecked) {
        await element.uncheck(options);
      } else {
        await element.check(options);
      }
    } catch (error) {
      throw new Error(`Failed to toggle checkbox: ${error.message}`);
    }
  }

  /**
   * Press keyboard key
   */
  async pressKey(element, key, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      await element.press(key, options);
    } catch (error) {
      throw new Error(`Failed to press key "${key}": ${error.message}`);
    }
  }

  /**
   * Get text content from element
   */
  async getText(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      return await element.textContent();
    } catch (error) {
      throw new Error(`Failed to get text content: ${error.message}`);
    }
  }

  /**
   * Get inner text (renders as user sees it)
   */
  async getInnerText(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      return await element.innerText();
    } catch (error) {
      throw new Error(`Failed to get inner text: ${error.message}`);
    }
  }

  /**
   * Get attribute value
   */
  async getAttribute(element, attributeName, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      return await element.getAttribute(attributeName);
    } catch (error) {
      throw new Error(`Failed to get attribute "${attributeName}": ${error.message}`);
    }
  }

  /**
   * Check if element is visible
   */
  async isVisible(element, options = {}) {
    try {
      return await element.isVisible(options);
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(element, options = {}) {
    try {
      return await element.isEnabled(options);
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'hidden', 
        timeout: options.timeout || this.defaultTimeout 
      });
    } catch (error) {
      throw new Error(`Element did not become hidden: ${error.message}`);
    }
  }

  /**
   * Hover over element
   */
  async hoverElement(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      await element.hover(options);
    } catch (error) {
      throw new Error(`Failed to hover over element: ${error.message}`);
    }
  }

  /**
   * Double click element
   */
  async doubleClickElement(element, options = {}) {
    try {
      await element.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || this.defaultTimeout 
      });
      await element.dblclick(options);
    } catch (error) {
      throw new Error(`Failed to double click element: ${error.message}`);
    }
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(element, options = {}) {
    try {
      await element.scrollIntoViewIfNeeded(options);
    } catch (error) {
      throw new Error(`Failed to scroll element into view: ${error.message}`);
    }
  }

  /**
   * Take screenshot - Only use for debugging, not in regular tests
   * Configure playwright.config.js for automatic failure screenshots
   */
  async takeScreenshot(page, fileName = 'screenshot.png', options = {}) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const path = options.path || `test-results/${timestamp}-${fileName}`;
      await page.screenshot({ 
        path, 
        fullPage: options.fullPage || false 
      });
      console.log(`Screenshot saved: ${path}`);
      return path;
    } catch (error) {
      console.error(`Failed to take screenshot: ${error.message}`);
    }
  }

  /**
   * Upload file to input element
   */
  async uploadFile(element, filePath, options = {}) {
    try {
      await element.waitFor({ 
        state: 'attached', 
        timeout: options.timeout || this.defaultTimeout 
      });
      await element.setInputFiles(filePath);
    } catch (error) {
      throw new Error(`Failed to upload file "${filePath}": ${error.message}`);
    }
  }

  /**
   * Get element count
   */
  async getElementCount(locator) {
    try {
      return await locator.count();
    } catch (error) {
      throw new Error(`Failed to count elements: ${error.message}`);
    }
  }

  /**
   * Wait for network to be idle (useful after form submissions)
   */
  async waitForNetworkIdle(page, options = {}) {
    try {
      await page.waitForLoadState('networkidle', {
        timeout: options.timeout || this.defaultTimeout
      });
    } catch (error) {
      throw new Error(`Network did not become idle: ${error.message}`);
    }
  }
}