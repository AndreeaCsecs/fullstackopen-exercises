const { test, expect, describe, beforeEach } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");

    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Test User",
        username: "testuser",
        password: "password",
      },
    });

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

      await expect(page.locator("text=Welcome Test User!")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.fill("#username", "testuser");
      await page.fill("#password", "wrongpassword");
      await page.click('button[type="submit"]');

      await expect(
        page.locator("text=Wrong username or password")
      ).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.fill("#username", "testuser");
      await page.fill("#password", "password");
      await page.click('button[type="submit"]');
      await page.waitForSelector("text=Welcome Test User!");
    });

    test("a new blog can be created", async ({ page }) => {
      const blog = {
        title: "Test Blog",
        author: "John Doe",
        url: "http://testblog.com",
      };

      await page.click('button:has-text("create new blog")');

      await page.fill('input[name="title"]', blog.title);
      await page.fill('input[name="author"]', blog.author);
      await page.fill('input[name="url"]', blog.url);

      await page.click('button[type="submit"]');

      await page.waitForSelector(`text=${blog.title} by ${blog.author}`);

      await expect(
        page.locator(`text=${blog.title} by ${blog.author}`)
      ).toBeVisible();
    });

    /*
    test("a blog can be liked", async ({ page }) => {
      const blog = {
        title: "Test Blog",
        author: "John Doe",
        url: "http://testblog.com",
      };

      await page.click('button:has-text("create new blog")');
      await page.fill('input[name="title"]', blog.title);
      await page.fill('input[name="author"]', blog.author);
      await page.fill('input[name="url"]', blog.url);
      await page.click('button[type="submit"]');
      await page.waitForSelector(`text=${blog.title} by ${blog.author}`);

      await page.click(`text=view`);

      await page.waitForSelector(".blog-details");

      await page.click("#like-button");

      await page.waitForTimeout(1000); 

      const likeCountElement = await page.locator(".like-count");
      const likeCountText = await likeCountElement.textContent();
      expect(likeCountText).toContain("1");
    });

    test("the user can delete their blog", async ({ page }) => {
      const blog = {
        title: "Test Blog",
        author: "John Doe",
        url: "http://testblog.com",
      };

      await page.click('button:has-text("create new blog")');
      await page.fill('input[name="title"]', blog.title);
      await page.fill('input[name="author"]', blog.author);
      await page.fill('input[name="url"]', blog.url);
      await page.click('button[type="submit"]');
      await page.waitForSelector(`text=${blog.title} by ${blog.author}`);

      await page.click(`text=view`);

      await page.waitForSelector(".blog-details");

      await page.click(`[data-testid="delete-blog-${blog.id}"]`);

      await page.waitForSelector(
        `text=Remove blog ${blog.title} by ${blog.author}?`
      );
      await page.click('button:has-text("Confirm")');

      await page.waitForSelector(`text=${blog.title} by ${blog.author}`, {
        state: "detached",
      });

      const removedBlog = await page.locator(
        `text=${blog.title} by ${blog.author}`
      );
      expect(removedBlog).toBeNull();
    });

    test("the user can delete their blog", async ({ page }) => {
      const blog = {
        title: "Test Blog",
        author: "John Doe",
        url: "http://testblog.com",
      };

      await page.click('button:has-text("create new blog")');
      await page.fill('input[name="title"]', blog.title);
      await page.fill('input[name="author"]', blog.author);
      await page.fill('input[name="url"]', blog.url);
      await page.click('button[type="submit"]');
      await page.waitForSelector(`text=${blog.title} by ${blog.author}`);

      const createdBlog = await page.locator(
        `text=${blog.title} by ${blog.author}`
      );
      const blogId = await createdBlog.getAttribute("data-blog-id");

      await page.click(`text=view`);

      await page.waitForSelector(".blog-details");

      const deleteButton = await page.locator(
        `[data-testid="delete-blog-${blogId}"]`
      );
      expect(deleteButton).not.toBeNull();

      await page.click("text=logout");

      await page.goto("http://localhost:5173");

      await page.fill("#username", "anotheruser");
      await page.fill("#password", "password");
      await page.click('button[type="submit"]');

      const deleteButtonForAnotherUser = await page.locator(
        `[data-testid="delete-blog-${blogId}"]`
      );
      expect(deleteButtonForAnotherUser).toBeNull();
    });
        */

    test("blogs are ordered by likes (most likes first)", async ({ page }) => {
      const blogs = [
        { title: "Blog A", author: "Author A", likes: 5 },
        { title: "Blog B", author: "Author B", likes: 2 },
        { title: "Blog C", author: "Author C", likes: 7 },
      ];

      for (const blog of blogs) {
        await createBlog(page, blog);
      }

      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

      const blogTitles = await page.$$eval(".blog", (blogs) =>
        blogs.map((blog) => blog.textContent.trim())
      );

      for (let i = 0; i < sortedBlogs.length; i++) {
        const { title, author } = sortedBlogs[i];
        const expectedText = `${title} by ${author}`;
        expect(blogTitles[i]).toContain(expectedText);
      }
    });

    async function createBlog(page, blog) {
      await page.click('button:has-text("create new blog")');
      await page.fill('input[name="title"]', blog.title);
      await page.fill('input[name="author"]', blog.author);
      await page.fill('input[name="url"]', "http://example.com");
      await page.click('button[type="submit"]');
      await page.waitForSelector(`text=${blog.title} by ${blog.author}`);
    }
  });
});
