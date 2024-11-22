import { test, expect } from '@playwright/test';
import { CREDENTIALS } from './credentials';
import { LinearClient } from '@linear/sdk';

async function getOTPFromLinear(): Promise<string> {
    const linearClient = new LinearClient({
        apiKey: CREDENTIALS.linearApiKey
    });

    // Adjust this query based on how you store OTPs in Linear
    // This is just an example - you'll need to modify based on your Linear setup
    const issues = await linearClient.issues({
        filter: {
            updatedAt: { gt: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
            // Add more filters as needed
        }
    });

    // Extract OTP from the most recent relevant issue
    // Modify this logic based on how your OTP is stored in Linear
    const latestIssue = issues.nodes[0];
    if (!latestIssue) {
        throw new Error('No recent OTP found in Linear');
    }

    // Extract OTP from issue title or description
    // This is an example - adjust based on your actual Linear setup
    const otpMatch = latestIssue.title.match(/OTP:\s*(\d+)/);
    return otpMatch ? otpMatch[1] : '';
}

test('Login to Ahli Bank and handle OTP', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://online.eahli.com/corp/AuthenticationController?__START_TRAN_FLAG__=Y&FORMSGROUP_ID__=AuthenticationFG&__EVENT_ID__=LOAD&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=7&BANK_ID=01&LANGUAGE_ID=001');

    // Fill login form
    
    await page.fill('input[name="AuthenticationFG.USER_PRINCIPAL"]', CREDENTIALS.username);
    await page.fill('input[name="AuthenticationFG.ACCESS_CODE"]', CREDENTIALS.password);
    
    // Click login button
    await page.click('input[type="submit"]');

    // Wait for OTP input field to appear
    await page.waitForSelector('input[name="AuthenticationFG.OTP_VALUE"]');

    // Get OTP from Linear
    const otp = await getOTPFromLinear();
    
    // Fill OTP
    await page.fill('input[name="AuthenticationFG.OTP_VALUE"]', otp);
    
    // Submit OTP
    await page.click('input[type="submit"]');

    // Wait for successful login
    // Add appropriate selector for the dashboard or landing page
    await page.waitForSelector('.dashboard-element', { timeout: 30000 });

    // Add your scraping logic here
    // Example:
    // const balance = await page.textContent('.account-balance');
    // const transactions = await page.$$eval('.transaction-row', rows => rows.map(row => row.textContent));
}); 