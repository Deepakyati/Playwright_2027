import {test} from "@playwright/test";
import {LoginPage} from "../Pages/loginPage_old";

test("login test", async ({page}) => {

    const loginPage = new LoginPage(page);
    
    await loginPage.gotoLoginPage();
    await loginPage.login("standard_user", "secret_sauce");
    await loginPage.verifyLoginSucess();
});
