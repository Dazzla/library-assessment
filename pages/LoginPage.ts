import { expect, Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  readonly heading = () => this.page.getByRole("heading", { name: "Login" });
  readonly username = () => this.page.locator("#username");
  readonly password = () => this.page.locator("#password");
  readonly submit = () => this.page.getByRole("button", { name: "Submit login" })
  

  async goto() {
    await this.page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(this.heading()).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.username().fill(username);
    await this.password().fill(password);
    await this.submit().click();
  }

  async assertLoaded() {
    await expect(this.heading()).toBeVisible();
  }
}
