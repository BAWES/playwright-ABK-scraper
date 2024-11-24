import { test, expect } from '@playwright/test';
import { LinearClient, LinearDocument } from "@linear/sdk";

const linearClient = new LinearClient({ 
    apiKey: process.env.LINEAR_API_KEY
});

test('test finding recent otp from linear', async ({ page }) => {
    const issues = await linearClient.issues({
        first: 1,
        orderBy: LinearDocument.PaginationOrderBy.CreatedAt,
        filter: {
            team: { name: { eq: "Finance" } },
            state: { name: { eq: "Triage" } },
            title: { startsWith: "ABK" }
        },
    });

    if (!issues.nodes.length) {
        throw new Error('No recent issues found containing OTP in Linear');
    }

    console.log("number of issues", issues.nodes.length);

    // Extract OTP from issue title/description
    const issue = issues.nodes[0];
    const otpMatch = issue.description?.match(/(?:OTP(?:\s*-\s*)?)?(\d{5})/);
    
    // If an OTP has been found
    var otp = "";
    if (otpMatch) {
        console.log("Found OTP in issue", issue, otpMatch);
        otp = otpMatch[1];
    }

    console.log(otp);
});