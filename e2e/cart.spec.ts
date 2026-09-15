import { expect, test } from "@playwright/test";

test("cart page shows empty or shopping cart heading", async ({ page }) => {
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", {
      name: /Your cart is empty|Shopping Cart/,
    }),
  ).toBeVisible({ timeout: 15_000 });
});
