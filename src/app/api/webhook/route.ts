import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let webhookUrl: string;

    // Differentiate based on the payload structure
    if (body.event === 'get-data-trigger') {
      // This is for the "Candidates" page
      webhookUrl = 'https://abu.awsaibot.com/webhook/candidate';
    } else if (body.event === 'get-interview-data-trigger') {
        // This is for the "AI Interviews" page
        webhookUrl = 'https://abu.awsaibot.com/webhook/candidateresult';
    } else if (body.event === 'sync-calendar-trigger') {
        // This is for the "Timesheets" page
        webhookUrl = 'https://abu.awsaibot.com/webhook/Employee';
    } else if (body.event === 'get-contract-data-trigger') {
        // This is for the "Contract Data" page
        webhookUrl = 'https://abu.awsaibot.com/webhook/contracts';
    } else {
      // This is for the "Job Posting" page
      webhookUrl = 'https://abu.awsaibot.com/webhook/firebase-job-post';
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
      console.error(`Webhook call failed with status: ${response.status}`, errorText);
      return new NextResponse(`Webhook failed with status: ${response.status}.`, { status: response.status });
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const responseData = await response.json();
        return NextResponse.json(responseData);
    } else {
        const textResponse = await response.text();
        return new NextResponse(textResponse, { status: response.status });
    }

  } catch (error: any) {
    console.error('Error in webhook proxy route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred in the webhook proxy.';
    return new NextResponse(errorMessage, { status: 500 });
  }
}
