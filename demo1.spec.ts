import {test, expect} from "@playwright/test";

test("my first playwright demo", async ({page}) => {

    await page.goto("https://google.com");

    await page.locator("#ti6dpd").fill("Playwright");

    await page.keyboard.press("Enter");

    await page.waitForTimeout(2000);

    const title = await page.title();

    expect(title).toBe("Playwright - Google Search");

}
)
