import { test, expect, type Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { BookListPage } from "../pages/BookListPage";
import { AddBookPage, type NewBook } from "../pages/AddBookPage";
import { getCredentials } from "./support/credentials";

const { username, password } = getCredentials();

const createPages = (page: Page) => ({
  login: new LoginPage(page),
  list: new BookListPage(page),
  add: new AddBookPage(page),
});

const makeBook = (): NewBook => {
  const title = `TB ${Date.now()}`.slice(0, 21);

  return {
    title,
    author: "QA Bot",
    genreLabel: "Fiction",
    isbn: "9780694005001",
    publicationDate: "2020-01-02",
    price: "9.99",
  };
};

test("Login with valid credentials", async ({ page }) => {
  const { login, list } = createPages(page);

  await test.step("Login", async () => {
    await login.goto();
    await login.login(username, password);
  });

  await test.step("Book List is visible", async () => {
    await list.assertLoaded();
  });
});

test("When not logged in, accessing Book List redirects to Login", async ({ page }) => {
  const { list, login } = createPages(page);

  await page.goto("/books", { waitUntil: "domcontentloaded" });
  await expect(login.heading()).toBeVisible();
});

test.describe("When logged in", () => {
  test.beforeEach(async ({ page }) => {
    const { login, list } = createPages(page);

    await login.goto();
    await login.login(username, password);
    await list.assertLoaded();
  });

  test("Logging out redirects to login page", async ({ page }) => {
    const { login, list } = createPages(page);

    await list.logout();
    await expect(login.heading()).toBeVisible();
  });

  test("Happy path: login then add a book", async ({ page }) => {
    const { list, add } = createPages(page);

    const before = await list.getTotalCount();
    const book = makeBook();

    await test.step("Open Add Book", async () => {
      await list.clickAddBook();
      await add.assertLoaded();
    });

    await test.step("Fill and submit", async () => {
      await add.fill(book);
      await add.submitForm();
    });

    await test.step("Verify book appears in list", async () => {
      await list.assertLoaded();
      await expect(list.rowForTitle(book.title)).toBeVisible();

      if (before !== null) {
        await expect(list.totalTitles()).toContainText(String(before + 1));
      }
    });
  });

  test("Edit book details", async ({ page }) => {
    const { list, add } = createPages(page);

    const book = makeBook();

    await list.clickAddBook();
    await add.assertLoaded();

    await add.fill(book);
    await add.submitForm();

    await list.assertLoaded();
    await expect(list.rowForTitle(book.title)).toBeVisible();

    // TODO: actually click Edit for that row, change a field, save, then assert updated value
  });

  test("Validation: empty submit shows errors", async ({ page }) => {
    const { list, add } = createPages(page);

    await list.clickAddBook();
    await add.assertLoaded();

    await add.submitForm();

    await test.step("Fields are marked invalid", async () => {
      for (const field of [
        add.title(),
        add.author(),
        add.genre(),
        add.isbn(),
        add.publicationDate(),
        add.price(),
      ]) {
        await add.assertFieldInvalid(field);
      }
    });

    await test.step("Error messages are shown", async () => {
      await add.assertSummaryErrorMessages();
      await add.assertFieldErrorMessages();
    });
  });
});
