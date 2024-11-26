import { test, expect } from '@playwright/test';
import { LinearClient, LinearDocument } from "@linear/sdk";

// TODO: Implement similar auth structure as https://www.youtube.com/watch?v=nSHPCLUwwVk&t=123s

test('Login to ABK', async ({ page }) => {
  // await page.pause();
  await page.goto('https://online.eahli.com/corp/AuthenticationController?__START_TRAN_FLAG__=Y&FORMSGROUP_ID__=AuthenticationFG&__EVENT_ID__=LOAD&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=7&BANK_ID=01&LANGUAGE_ID=001');
  // await page.waitForLoadState('networkidle');
  await page.getByLabel('User ID').fill(process.env.ABK_USERNAME!);
  await page.getByLabel('Password').fill(process.env.ABK_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();
  // await page.waitForLoadState('networkidle');

  // Initialize Linear client
  const linearClient = new LinearClient({ 
    apiKey: process.env.LINEAR_API_KEY
  });

  // Function to fetch OTP with retries
  async function getOTPFromLinear(maxAttempts = 12, interval = 5000): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const issues = await linearClient.issues({
        first: 1,
        orderBy: LinearDocument.PaginationOrderBy.CreatedAt,
        filter: {
          team: { name: { eq: "Finance" } },
          state: { name: { eq: "Triage" } },
          title: { startsWith: "ABK" }
        },
      });

      if (issues.nodes.length) {
        const issue = issues.nodes[0];
        // More flexible regex that handles various OTP formats
        const otpMatch = issue.description?.match(/(?:OTP|code|password)[:\s-]*(\d{5,6})/i);
        
        if (otpMatch?.[1]) {
          return otpMatch[1];
        }
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Failed to find OTP after maximum attempts');
  }

  // Wait for OTP input and get OTP
  const otpInput = page.getByLabel('OTP');
  await otpInput.waitFor();

  // Wait 15 seconds before checking Linear for OTP
  await new Promise(resolve => setTimeout(resolve, 15000));
  
  const otp = await getOTPFromLinear();
  if (!otp) {
    throw new Error('Could not extract OTP from Linear issue');
  }

  console.log('OTP:', otp);

  // Enter OTP
  await otpInput.fill(otp);
  await page.getByRole('button', { name: 'Continue' }).click();

  // Extract account summary
  // Find all tables
  const tables = page.locator('table');
  await tables.waitFor();
  const tableCount = await tables.count();

  console.log(`Found ${tableCount} tables`);

  for (let i = 0; i < tableCount; i++) {
    console.log(`Table ${i + 1}:`);

    // Get the rows of the current table
    const rows = await tables.nth(i).locator('tr');
    const rowCount = await rows.count();

    for (let j = 0; j < rowCount; j++) {
      // Get the cells of the current row (both <td> and <th>)
      const cells = await rows.nth(j).locator('th, td');
      const cellCount = await cells.count();

      const rowData = [];
      for (let k = 0; k < cellCount; k++) {
        const cellText = await cells.nth(k).innerText();
        rowData.push(cellText);
      }

      console.log(rowData.join(' | ')); // Print the row contents
    }
    console.log('\n'); // Add a line break between tables
  }

  await page.pause();

});