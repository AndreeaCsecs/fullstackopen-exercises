import { test, expect } from "@playwright/test";

test.describe("Blog app", () => {
  test("Login form is shown", async ({ page }) => {
    // Navigate to the login page
    await page.goto("http://localhost:5173"); // Replace with your actual URL

    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");

    // Debugging: Take a screenshot before checking for visibility
    await page.screenshot({ path: "screenshot-before.png" });
    console.log(await page.content()); // Print the HTML content of the page

    // Check if the login form is visible on the page
    await expect(page.getByRole("textbox", { name: "Username" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("button", { name: "login" })).toBeVisible({
      timeout: 10000,
    });

    // Debugging: Take a screenshot after checking for visibility
    await page.screenshot({ path: "screenshot-after.png" });
  });
});
