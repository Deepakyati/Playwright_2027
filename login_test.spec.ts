import {test, expect} from "@playwright/test";
import {LoginPage} from "../Pages/loginPage";
import loginData from "../test-data/loginData.json";


test("login test", async ({page}) => {

    const loginPage = new LoginPage(page);
    
    await loginPage.gotoLoginPage();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password);

    await expect(loginPage.page).toHaveURL("https://www.saucedemo.com/inventory.html");

});
