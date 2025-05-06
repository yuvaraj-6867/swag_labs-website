import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.js';

test('title of Swag Labs', async ({ page }) => {
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login('standard_user', 'secret_sauce');
  await expect(page).toHaveTitle('Swag Labs');
  await page.waitForTimeout(1000);
});
