import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as userData from '../test-data/users.json';

// Data-driven login tests using user credentials from JSON file
test.describe('Login Tests - Data Driven', () => {
    // Test valid user logins - should successfully authenticate
    userData.validUsers.forEach((user) => {
        test(`Valid login - ${user.description} @sanity @regression`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.navigate();
            await loginPage.login(user.username, user.password);
            
            // Verify successful login redirects to inventory page
            if (user.expectedResult === 'success') {
                await loginPage.verifyLoginSuccess();
            }
        });
    });

    // Test invalid user logins - should fail with error message
    userData.invalidUsers.forEach((user) => {
        test(`Invalid login - ${user.description} @regression`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.navigate();
            await loginPage.login(user.username, user.password);
            
            // Verify login fails and displays expected error message
            if (user.expectedResult === 'failure') {
                await loginPage.verifyLoginFailure();
                const errorMessage = await loginPage.getErrorMessage();
                expect(errorMessage).toContain(user.expectedError);
            }
        });
    });

    // Security edge case tests
    test('Login with special characters in username @regression', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        // Test input validation with special characters
        await loginPage.login('user@#$%', 'secret_sauce');
        await loginPage.verifyLoginFailure();
    });

    test('Login with SQL injection attempt @regression', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        // Test system is secure against SQL injection attacks
        await loginPage.login("' OR '1'='1", 'secret_sauce');
        await loginPage.verifyLoginFailure();
    });
});
