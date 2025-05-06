const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Pages/login'); // Use require
const { HomePage } = require('../Pages/home'); // Use require

test.describe('Login and homePage Functionality', () => {
    test('should navigate, login, and verify homePage UI and actions', async ({ page }) => {
        const login = new LoginPage(page);
        await login.gotoLoginPage();
        await login.login('standard_user', 'secret_sauce');

        await page.waitForTimeout(1000);

        const homePage = new HomePage(page); // Initialize HomePage

        // Get item titles
        const titles = await homePage.getItemTitles();
        expect(titles).toEqual([
            "Sauce Labs Backpack",
            "Sauce Labs Bike Light",
            "Sauce Labs Bolt T-Shirt",
            "Sauce Labs Fleece Jacket",
            "Sauce Labs Onesie",
            "Test.allTheThings() T-Shirt (Red)"
        ]);
        await page.waitForTimeout(1000);

        // Dropdown interaction
        await homePage.clickDropdown();
        const dropdownOptions = await page.locator('select.product_sort_container option').allTextContents();
        expect(dropdownOptions).toEqual([
            "Name (A to Z)",
            "Name (Z to A)",
            "Price (low to high)",
            "Price (high to low)"
        ]);
        await page.waitForTimeout(1000);

        // Check current option
        const selected = await page.locator('select.product_sort_container').inputValue();
        await page.selectOption('select.product_sort_container', selected);
        const current = await page.locator('select.product_sort_container').inputValue();
        expect(current).toBe(selected);
        await page.waitForTimeout(1000);

        // Logo and subtitle
        const logo = await homePage.getLogo();
        expect(logo.trim()).toBe('Swag Labs');
        await page.waitForTimeout(1000);

        const subtitle = await homePage.getSubtitle();
        expect(subtitle.trim()).toBe('Products');

        // Check product titles again
        const productTitles = await homePage.getItemTitles();
        expect(productTitles).toEqual([
            "Sauce Labs Backpack",
            "Sauce Labs Bike Light",
            "Sauce Labs Bolt T-Shirt",
            "Sauce Labs Fleece Jacket",
            "Sauce Labs Onesie",
            "Test.allTheThings() T-Shirt (Red)"
        ]);
        await page.waitForTimeout(1000);

        // Add item to cart
        const cartButtonText = await homePage.clickAddToCart();
        expect(cartButtonText.trim()).toBe('Remove');
        await page.waitForTimeout(1000);

        // Go to cart
        await homePage.clickCartIcon();
        await expect(page).toHaveURL(/.*cart\.html/);
        await page.waitForTimeout(1000);
    });
});
