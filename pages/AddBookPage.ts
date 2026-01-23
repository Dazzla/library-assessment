import { expect, Locator, Page } from "@playwright/test";

export type NewBook = {
  title: string;
  author: string;
  genreLabel: string; // e.g. "Fiction"
  isbn: string;
  publicationDate: string; // YYYY-MM-DD
  price: string; // keep as string because UI input is type="text"
};

export class AddBookPage {
  constructor(private readonly page: Page) {}

  readonly heading = () =>
    this.page.getByRole("heading", { name: "Add a New Book" });

  readonly title = () => this.page.locator("#title");
  readonly author = () => this.page.locator("#author");
  readonly genre = () => this.page.locator("#genre");
  readonly isbn = () => this.page.locator("#isbn");
  readonly publicationDate = () => this.page.locator("#publicationDate");
  readonly price = () => this.page.locator("#price");

  //Error message containers
  readonly summaryAlert = () =>
      this.page.locator('div[role="alert"][aria-live="assertive"]');

  readonly titleError = () => this.page.locator("#title-error");
  readonly authorError = () => this.page.locator("#author-error");
  readonly genreError = () => this.page.locator("#genre-error");
  readonly isbnError = () => this.page.locator("#isbn-error");
  readonly publicationDateError = () => this.page.locator("#publicationDate-error");
  readonly priceError = () => this.page.locator("#price-error");


  readonly submit = () =>
      this.page.getByRole("button", { name: /submit add new book form/i });
  async assertLoaded() {
    await expect(this.heading()).toBeVisible();
  }

  async fill(book: NewBook) {
    await this.title().fill(book.title);
    await this.author().fill(book.author);
    await this.genre().selectOption({ label: book.genreLabel });
    await this.isbn().fill(book.isbn);
    await this.publicationDate().fill(book.publicationDate);
    await this.price().fill(book.price);
  }

  async submitForm() {
    await expect(this.submit()).toBeVisible();
    await this.submit().click();
  }

  async assertFieldInvalid(field: Locator) {
    const ariaInvalid = await field.getAttribute("aria-invalid");
    const className = (await field.getAttribute("class")) ?? "";
    const isInvalid = ariaInvalid === "true" || /\berror\b/.test(className);

    expect(
      isInvalid,
      `Expected invalid. aria-invalid=${ariaInvalid}, class="${className}"`
    ).toBeTruthy();
  }
  async assertSummaryErrorMessages() {
    const alert = this.summaryAlert();

    await expect(alert).toBeVisible();

    const items = alert.locator("li");
    await expect(items).toHaveCount(6);

    await expect(items).toHaveText([
      "Title is required.",
      "Author is required.",
      "Genre is required.",
      "ISBN is required.",
      "Publication Date is required.",
      "Price is required.",
    ]);

    // And check the heading line
    await expect(alert).toContainText("Please correct the following errors:");
  }

  async assertFieldErrorMessages() {
    await expect(this.titleError()).toBeVisible();
    await expect(this.titleError()).toHaveText("Title is required.");

    await expect(this.authorError()).toBeVisible();
    await expect(this.authorError()).toHaveText("Author is required.");

    await expect(this.genreError()).toBeVisible();
    await expect(this.genreError()).toHaveText("Genre is required.");

    await expect(this.isbnError()).toBeVisible();
    await expect(this.isbnError()).toHaveText("ISBN is required.");

    await expect(this.publicationDateError()).toBeVisible();
    await expect(this.publicationDateError()).toHaveText("Publication Date is required.");

    await expect(this.priceError()).toBeVisible();
    await expect(this.priceError()).toHaveText("Price is required.");
  }

}
