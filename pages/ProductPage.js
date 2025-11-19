const { BasePage } = require('./BasePage');

/**
 * Product Page - https://automationexercise.com/products
 * Product listing, search, and details
 */


class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    
    // ========== SEARCH ==========
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    
    // ========== PRODUCT LIST ==========
    this.allProducts = page.locator('.features_items');
    this.productItems = page.locator('.productinfo');
    this.productNames = page.locator('.productinfo p');
    this.productPrices = page.locator('.productinfo h2');
    this.viewProductLinks = page.locator('a:has-text("View Product")');
    
    // ========== PRODUCT DETAIL PAGE ==========
    this.productName = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p:has-text("Category:")');
    this.productPrice = page.locator('.product-information span span');
    this.productAvailability = page.locator('.product-information p:has-text("Availability:")');
    this.productCondition = page.locator('.product-information p:has-text("Condition:")');
    this.productBrand = page.locator('.product-information p:has-text("Brand:")');
    this.quantityInput = page.locator('#quantity');
    this.addToCartBtn = page.locator('button.cart');
    
    // ========== ADD TO CART MODAL ==========
    this.addedToCartModal = page.locator('#cartModal');
    this.continueShoppingBtn = page.locator('button:has-text("Continue Shopping")');
    this.viewCartBtn = page.locator('a:has-text("View Cart")');
    
    // ========== CATEGORIES (LEFT SIDEBAR) ==========
    this.categoryWomen = page.locator('a[href="#Women"]');
    this.categoryMen = page.locator('a[href="#Men"]');
    this.categoryKids = page.locator('a[href="#Kids"]');
    
    // ========== BRANDS (LEFT SIDEBAR) ==========
    this.brandsPanel = page.locator('.brands_products');
    this.brandLinks = page.locator('.brands_products a');
  }

  // ==================== NAVIGATION ====================
  
  async navigateToProducts() {
    await this.navigate('/products');
    await this.waitForPageLoad();
  }

  // ==================== SEARCH ====================
  
  async searchProduct(searchTerm) {
    await this.controls.fillInput(this.searchInput, searchTerm);
    await this.controls.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  // ==================== PRODUCT LISTING ====================
  
  async getProductCount() {
    return await this.controls.getElementCount(this.productItems);
  }

  async clickViewProduct(index = 0) {
    await this.controls.clickElement(this.viewProductLinks.nth(index));
    await this.waitForPageLoad();
  }

  async getProductName(index) {
    return await this.controls.getText(this.productNames.nth(index));
  }

  async getProductPrice(index) {
    return await this.controls.getText(this.productPrices.nth(index));
  }

  // ==================== PRODUCT DETAIL ====================
  
  async setQuantity(quantity) {
    await this.quantityInput.clear();
    await this.controls.fillInput(this.quantityInput, quantity.toString());
  }

  async addToCart(quantity = 1) {
    if (quantity > 1) {
      await this.setQuantity(quantity);
    }
    await this.controls.clickElement(this.addToCartBtn);
  }

  async continueShopping() {
    await this.controls.clickElement(this.continueShoppingBtn);
  }

  async viewCart() {
    await this.controls.clickElement(this.viewCartBtn);
  }

  // ==================== CATEGORIES ====================
  
  async clickCategory(category) {
    const categoryMap = {
      'Women': this.categoryWomen,
      'Men': this.categoryMen,
      'Kids': this.categoryKids
    };
    await this.controls.clickElement(categoryMap[category]);
  }

  async clickSubCategory(subCategory) {
    const subCategoryLink = this.page.locator(`a:has-text("${subCategory}")`);
    await this.controls.clickElement(subCategoryLink);
    await this.waitForPageLoad();
  }

  // ==================== BRANDS ====================
  
  async clickBrand(brandName) {
    const brandLink = this.page.locator(`.brands_products a:has-text("${brandName}")`);
    await this.controls.clickElement(brandLink);
    await this.waitForPageLoad();
  }

  // ==================== HOVER ADD TO CART ====================
  
  async hoverAndAddToCart(index) {
    // Locate the specific product by index
    const productContainer = this.page.locator('.single-products').nth(index);
    
    // Hover over the product image area to trigger overlay
    const productImage = productContainer.locator('.productinfo');
    await productImage.hover();
    
    // Wait for overlay to appear
    await this.page.waitForTimeout(300);
    
    // Click add to cart - use :visible to get only the visible one
    const addToCartBtn = productContainer.locator('.product-overlay .add-to-cart');
    await addToCartBtn.waitFor({ state: 'visible' });
    await addToCartBtn.click({ force: true });
  }

  /**
   * Alternative: Add to cart using product data-attribute (more reliable)
   */
  async addToCartByProductId(productIndex) {
    const productContainer = this.page.locator('.single-products').nth(productIndex);
    await productContainer.hover();
    
    // Get the product ID from the button
    const addToCartBtn = productContainer.locator('a.add-to-cart').first();
    await addToCartBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addToCartBtn.click({ force: true });
  }
}

module.exports = { ProductPage };