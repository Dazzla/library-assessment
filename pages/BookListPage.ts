import { expect, Page } from "@playwright/test";

export class BookListPage {
  constructor(private readonly page: Page) {}

  readonly heading = () => this.page.getByRole("heading", { name: "Book List" });
  readonly welcome = () => this.page.getByText("Welcome, Admin!");
  readonly addBook = () => this.page.getByRole("button", { name: "Add Book" });
  readonly logout = () => this.page.getByRole("button", { name: "Log Out" });
  readonly totalTitles = () => this.page.getByText(/Total Book Titles:/i);

  rowForTitle(title: string) {
    return this.page.locator("tbody tr").filter({ hasText: title });
  }

  async assertLoaded() {
    await expect(this.heading()).toBeVisible();
    await expect(this.welcome()).toBeVisible();
    await expect(this.logout()).toBeVisible();
  }

  async clickAddBook() {
    await this.addBook().click();
  }

  async logoutAndAssertBackToLogin() {
    await this.logout().click();
    await expect(this.page.getByRole("heading", { name: "Login" })).toBeVisible();
  }

  async getTotalCount(): Promise<number | null> {
    if (!(await this.totalTitles().isVisible())) return null;

    const text = (await this.totalTitles().textContent()) ?? "";
    const match = text.match(/Total Book Titles:\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  }
}
