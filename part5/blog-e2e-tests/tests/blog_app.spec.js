//blog-e2e-tests/tests/blog_app.spec.js

const { test, expect, describe, beforeEach } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database
    await request.post("http://localhost:3003/api/testing/reset");

    // Create a user
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Test User",
        username: "testuser",
        password: "password",
      },
    });

    // Optionally create blogs if needed for specific tests
    // await request.post("http://localhost:3003/api/blogs", {
    //   data: {
    //     title: "Test Blog",
    //     author: "Test Author",
    //     url: "http://test.com",
    //     likes: 0,
    //   },
    // });

    // Navigate to the app
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.locator("#username")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.fill("#username", "testuser");
      await page.fill("#password", "password");
      await page.click('button[type="submit"]');

      // Add assertion to verify successful login
      await expect(page.locator("text=Welcome Test User!")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.fill("#username", "testuser");
      await page.fill("#password", "wrongpassword");
      await page.click('button[type="submit"]');

      // Add assertion to verify failed login
      await expect(
        page.locator("text=Wrong username or password")
      ).toBeVisible();
    });
  });
});
