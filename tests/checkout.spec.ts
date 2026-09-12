import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// Checkout flow tests
test.describe('Checkout Flow Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPage();
        
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.clickCart();
        await cartPage.verifyCartPage();
    });

    // Positive scenarios - successful checkout flows
    test('Complete checkout flow with valid information @sanity @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.verifyCheckoutStepOne();
        
        await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
        await checkoutPage.verifyCheckoutStepTwo();
        
        await checkoutPage.finishCheckout();
        await checkoutPage.verifyCheckoutComplete();
    });

    test('Checkout with multiple items @regression', async ({ page }) => {
        await cartPage.continueShopping();
        await inventoryPage.addToCart('Sauce Labs Bike Light');
        await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
        await inventoryPage.clickCart();
        
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('Jane', 'Smith', '67890');
        await checkoutPage.finishCheckout();
        await checkoutPage.verifyCheckoutComplete();
    });

    test('Checkout with special characters in name @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('José', 'O\'Connor', '12345');
        await checkoutPage.finishCheckout();
        await checkoutPage.verifyCheckoutComplete();
    });

    test('Verify order total calculation @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('Test', 'User', '12345');
        
        const totalText = await checkoutPage.getTotalAmount();
        expect(totalText).toContain('Total');
        
        await checkoutPage.finishCheckout();
        await checkoutPage.verifyCheckoutComplete();
    });

    // Negative scenarios - validation errors
    test('Checkout with empty first name @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('', 'Doe', '12345');
        
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('Checkout with empty last name @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('John', '', '12345');
        
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('Checkout with empty postal code @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('John', 'Doe', '');
        
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('Checkout with all empty fields @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('', '', '');
        
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    // Cancel checkout scenarios
    test('Cancel checkout from step one @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.cancelCheckout();
        
        await cartPage.verifyCartPage();
    });

    test('Cancel checkout from step two @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
        await checkoutPage.cancelCheckout();
        
        // Swag Labs returns to inventory page when canceling from step two
        await inventoryPage.verifyInventoryPage();
    });

    // Edge case tests
    test('Checkout with invalid postal code format @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        await checkoutPage.fillCheckoutInfo('John', 'Doe', 'ABC');
        
        // Swag Labs accepts any postal code format
        await checkoutPage.finishCheckout();
        await checkoutPage.verifyCheckoutComplete();
    });

    test('Checkout with very long name @regression', async ({ page }) => {
        await cartPage.clickCheckout();
        const longName = 'A'.repeat(100);
        await checkoutPage.fillCheckoutInfo(longName, longName, '12345');
        
        await checkoutPage.finishCheckout();
        await checkoutPage.verifyCheckoutComplete();
    });
});
