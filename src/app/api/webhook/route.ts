import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let webhookUrl: string;

    // Differentiate based on the payload structure
    if (body.event === 'get-data-trigger') {
      // This is for the "Candidates" page
      webhookUrl = 'https://votim.app.n8n.cloud/webhook-test/24b249fc-5bc7-43ef-ad88-be26ab7f4dbd';
    } else {
      // This is for the "Job Posting" page
      webhookUrl = 'https://likah123.app.n8n.cloud/webhook-test/firebase-job-post';
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
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
