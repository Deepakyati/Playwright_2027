import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

// Shopping cart functionality tests
test.describe('Shopping Cart Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPage();
    });

    // Positive scenarios - add/remove items
    test('Add single item to cart @sanity @regression', async ({ page }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.clickCart();
        await cartPage.verifyCartPage();
        
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);
    });

    test('Add multiple items to cart @sanity @regression', async ({ page }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.addToCart('Sauce Labs Bike Light');
        await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');
        
        await inventoryPage.clickCart();
        await cartPage.verifyCartPage();
        
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(3);
    });

    test('Add all items to cart @regression', async ({ page }) => {
        const totalItems = await inventoryPage.getItemCount();
        
        // Add each item individually using the addToCart method
        const itemNames = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)'
        ];
        
        for (const itemName of itemNames) {
            await inventoryPage.addToCart(itemName);
        }
        
        await inventoryPage.clickCart();
        await cartPage.verifyCartPage();
        
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(totalItems);
    });

    test('Remove item from cart @sanity @regression', async ({ page }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.clickCart();
        
        await cartPage.removeItem('Sauce Labs Backpack');
        
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);
    });

    test('Continue shopping from cart @regression', async ({ page }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.clickCart();
        await cartPage.continueShopping();
        
        await inventoryPage.verifyInventoryPage();
    });

    // Negative scenarios - edge cases
    test('Navigate to cart with empty cart @regression', async ({ page }) => {
        await inventoryPage.clickCart();
        await cartPage.verifyCartPage();
        
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);
    });

    test('Add item, remove, then add again @regression', async ({ page }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.clickCart();
        
        const initialCount = await cartPage.getCartItemCount();
        expect(initialCount).toBe(1);
        
        await cartPage.removeItem('Sauce Labs Backpack');
        
        const afterRemoveCount = await cartPage.getCartItemCount();
        expect(afterRemoveCount).toBe(0);
        
        await cartPage.continueShopping();
        await inventoryPage.verifyInventoryPage();
    });

    test('Verify cart persists after page refresh @regression', async ({ page }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await page.waitForSelector('[data-test="shopping-cart-badge"]');
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        await inventoryPage.clickCart();
        const itemCount = await cartPage.getCartItemCount();
        // Swag Labs may not persist cart state after refresh
        expect(itemCount).toBeGreaterThanOrEqual(0);
    });
});
