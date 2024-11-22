import { test, expect } from '@playwright/test';
import { LinearClient, LinearDocument } from "@linear/sdk";

test('test', async ({ page }) => {
  await page.goto('https://online.eahli.com/corp/AuthenticationController?__START_TRAN_FLAG__=Y&FORMSGROUP_ID__=AuthenticationFG&__EVENT_ID__=LOAD&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=7&BANK_ID=01&LANGUAGE_ID=001');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('User ID').fill(process.env.ABK_USER_ID!);
  await page.getByLabel('Password').fill(process.env.ABK_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');

  // // Wait for OTP input to be visible
  const otpInput = page.getByLabel('OTP');
  await otpInput.waitFor();

  // Wait before checking Linear
  await new Promise(resolve => setTimeout(resolve, 5000));


  // Enter OTP
  // await otpInput.fill(otp);
  // await page.getByRole('button', { name: 'Submit' }).click();
  // await page.waitForLoadState('networkidle');
});