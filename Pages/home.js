const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
    this.url = 'https://www.saucedemo.com/inventory.html';
    this.titleElement = page.locator('div.app_logo');
    this.subtitleElement = page.locator('span.title');
    this.dropdown = page.locator('span.select_container');
    this.items = page.locator('div.inventory_list div.inventory_item');
    this.cartIcon = page.locator('div.primary_header .shopping_cart_container .shopping_cart_link');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async getLogo() {
    return await this.titleElement.textContent();
  }

  async getSubtitle() {
    return await this.subtitleElement.textContent();
  }

  async clickDropdown() {
    await this.dropdown.click();
  }

  async getItemTitles() {
    const itemLinks = await this.page.locator('div.inventory_item_description .inventory_item_label a').all();
    return Promise.all(itemLinks.map(link => link.textContent()));
  }

  async clickAddToCart() {
    const firstItemDesc = this.page.locator('div.inventory_item_description').first();
    await firstItemDesc.locator('button.btn.btn_primary.btn_small.btn_inventory').click();
    return await firstItemDesc.locator('button.btn.btn_secondary.btn_small.btn_inventory').textContent();
  }

  async clickCartIcon() {
    await this.cartIcon.click();
  }

  async collectItemsData() {
    const filteredItems = this.page.locator('div.inventory_list div.inventory_item')
      .filter({ has: this.page.locator('button.btn.btn_secondary.btn_small.btn_inventory') });

    const count = await filteredItems.count();
    const header = [];
    const desc = [];
    const rate = [];

    for (let i = 0; i < count; i++) {
      const item = filteredItems.nth(i);
      const itemHeaders = await item.locator('.inventory_item_label a').allTextContents();
      const itemDescs = await item.locator('.inventory_item_desc').allTextContents();
      const itemPrices = await item.locator('.pricebar .inventory_item_price').allTextContents();

      header.push(itemHeaders);
      desc.push(itemDescs);
      rate.push(itemPrices);
    }

    return { header, desc, rate };
  }
}

module.exports = { HomePage };
