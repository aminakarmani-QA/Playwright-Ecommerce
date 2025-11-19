const { BasePage } = require('./BasePage');

/**
 * Cart Page - https://automationexercise.com/view_cart
 * Shopping cart and checkout functionality
 */
class CartPage extends BasePage {
  constructor(page) {
    super(page);
  
    
    // ========== CART TABLE ==========
    this.cartInfo = page.locator('#cart_info_table');
    this.cartItems = page.locator('.cart_description');
    this.productNames = page.locator('.cart_description h4 a');
    this.productPrices = page.locator('.cart_price p');
    this.productQuantities = page.locator('.cart_quantity button');
    this.productTotals = page.locator('.cart_total_price');
    this.deleteButtons = page.locator('.cart_quantity_delete');
    
    // ========== CART SUMMARY ==========
    this.totalAmount = page.locator('.cart_total_price').last();
    
    // ========== CHECKOUT ==========
    this.proceedToCheckoutBtn = page.locator('.check_out');
    
    // ========== EMPTY CART ==========
    this.emptyCartText = page.locator('b:has-text("Cart is empty!")');
    
    // ========== CHECKOUT MODAL (if not logged in) ==========
    this.registerLoginLink = page.locator('a[href="/login"]:has-text("Register / Login")');
  }

  // ==================== NAVIGATION ====================
  
  async navigateToCart() {
    await this.navigate('/view_cart');
    await this.waitForPageLoad();
  }

  // ==================== CART ITEMS ====================
  
  async getItemCount() {
    return await this.controls.getElementCount(this.cartItems);
  }

  async getProductName(index) {
    return await this.controls.getText(this.productNames.nth(index));
  }

  async getProductPrice(index) {
    return await this.controls.getText(this.productPrices.nth(index));
  }

  async getProductQuantity(index) {
    return await this.controls.getText(this.productQuantities.nth(index));
  }

  async getProductTotal(index) {
    return await this.controls.getText(this.productTotals.nth(index));
  }

  // ==================== REMOVE ITEMS ====================
  
  async removeItem(index) {
    await this.controls.clickElement(this.deleteButtons.nth(index));
    await this.waitForNetworkIdle();
  }

  async removeAllItems() {
    const count = await this.getItemCount();
    for (let i = count - 1; i >= 0; i--) {
      await this.removeItem(0); // Always remove first item
    }
  }

  // ==================== CHECKOUT ====================
  
  async proceedToCheckout() {
    await this.controls.clickElement(this.proceedToCheckoutBtn);
  }

  async clickRegisterLogin() {
    await this.controls.clickElement(this.registerLoginLink);
  }

  // ==================== CART STATE ====================
  
  async isCartEmpty() {
    return await this.controls.isVisible(this.emptyCartText);
  }

  // ==================== GET ALL PRODUCT INFO ====================
  
  async getAllProducts() {
    const count = await this.getItemCount();
    const products = [];
    
    for (let i = 0; i < count; i++) {
      products.push({
        name: await this.getProductName(i),
        price: await this.getProductPrice(i),
        quantity: await this.getProductQuantity(i),
        total: await this.getProductTotal(i)
      });
    }
    
    return products;
  }
}

module.exports = { CartPage };