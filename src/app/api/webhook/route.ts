import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let webhookUrl: string = ''; // Define outside to be accessible in catch block

  try {
    const body = await request.json();

    // Differentiate based on the payload structure
    if (body.event === 'get-data-trigger') {
      // This is for the "Candidates" page
      webhookUrl = 'https://abu.awsaibot.com/webhook-test/contracts';
    } else if (body.event === 'get-interview-data-trigger') {
        // This is for the "AI Interviews" page
        webhookUrl = 'https://abu.awsaibot.com/webhook-test/candidateresult';
    } else if (body.event === 'sync-calendar-trigger') {
        // This is for the "Timesheets" page
        webhookUrl = 'https://abu.awsaibot.com/webhook-test/employee';
    } else if (body.event === 'get-contract-data-trigger') {
        // This is for the "Contract Data" page
        webhookUrl = 'https://abu.awsaibot.com/webhook-test/contracts';
    } else {
      // This is for the "Job Posting" page
      webhookUrl = 'https://abu.awsaibot.com/webhook-test/contracts';
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook call to ${webhookUrl} failed with status: ${response.status}`, errorText);
      // Propagate a more descriptive error message to the client-side fetch.
      return new NextResponse(`Request to webhook destination failed with status ${response.status}. Details: ${errorText}`, { status: response.status });
    }
    
    // Handle potential empty responses or non-json responses gracefully
    const responseText = await response.text();
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        if (!responseText) {
            // If response is empty but claims to be JSON, return an empty JSON object.
            return NextResponse.json({});
        }
        try {
            // Attempt to parse the text as JSON.
            const responseData = JSON.parse(responseText);
            return NextResponse.json(responseData);
        } catch (e) {
            console.error('Failed to parse JSON from webhook:', responseText);
            // The service returned invalid JSON. This is a server-side issue with the webhook.
            return new NextResponse(`Received malformed JSON from the webhook at ${webhookUrl}.`, { status: 502 }); // 502 Bad Gateway
        }
    } else {
        // If not JSON, return the raw text response.
        return new NextResponse(responseText, { status: response.status });
    }

  } catch (error: any) {
    console.error('Error in webhook proxy route:', error);
    // This catch block handles errors from the fetch() call itself, e.g., network errors.
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    
    // Return a descriptive error message indicating a proxy failure.
    const fullErrorMessage = `Error connecting to the webhook destination at ${webhookUrl || 'an unknown URL'}. Reason: ${errorMessage}`;
    return new NextResponse(fullErrorMessage, { status: 502 }); // 502 Bad Gateway is appropriate for proxy connection issues.
  }
}
