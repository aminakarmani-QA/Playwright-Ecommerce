/**
 * Helper Functions - Dynamic data generation utilities
 * For static data, use fixtures/testData.json
 */
class HelperFunctions {
  
  /**
   * Generate random string
   * @param {number} length - Length of string
   * @returns {string} Random string
   */
  static generateRandomString(length = 8) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate unique email with timestamp
   * @param {string} prefix - Email prefix (default: 'test')
   * @returns {string} Unique email address
   */
  static generateEmail(prefix = 'test') {
    const timestamp = Date.now();
    const random = this.generateRandomString(5);
    return `${prefix}${random}${timestamp}@example.com`;
  }

  /**
   * Generate unique username with timestamp
   * @param {string} prefix - Username prefix (default: 'user')
   * @returns {string} Unique username
   */
  static generateUsername(prefix = 'user') {
    const timestamp = Date.now();
    const random = this.generateRandomString(4);
    return `${prefix}${random}${timestamp}`;
  }

  /**
   * Generate random phone number
   * @param {string} countryCode - Country code (default: '+1')
   * @returns {string} Random phone number
   */
  static generatePhone(countryCode = '+1') {
    const number = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${countryCode}${number}`;
  }

  /**
   * Get current timestamp
   * @returns {number} Current timestamp
   */
  static getTimestamp() {
    return Date.now();
  }

  /**
   * Get current date in specified format
   * @param {string} format - Date format (YYYY-MM-DD, MM/DD/YYYY, DD-MM-YYYY)
   * @returns {string} Formatted date
   */
  static getCurrentDate(format = 'YYYY-MM-DD') {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }

  /**
   * Get future date
   * @param {number} daysFromNow - Days to add to current date
   * @returns {string} Future date in YYYY-MM-DD format
   */
  static getFutureDate(daysFromNow = 30) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}

module.exports = { HelperFunctions };