import { expect, test } from "@playwright/test";

test("contact page loads the inquiry form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Message")).toBeVisible();
});
