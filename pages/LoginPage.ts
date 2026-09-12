import { Page, expect } from '@playwright/test';

// Page Object Model for Login Page
export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username: string, password: string) {
        await this.page.fill('[data-test="username"]', username);
        await this.page.fill('[data-test="password"]', password);
        await this.page.click('[data-test="login-button"]');
    }

    async verifyLoginSuccess() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }

    async verifyLoginFailure() {
        await expect(this.page.locator('[data-test="error"]')).toBeVisible();
    }

    async getErrorMessage() {
        return this.page.locator('[data-test="error"]').textContent();
    }
}
