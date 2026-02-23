import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const webhookUrl = 'https://likah123.app.n8n.cloud/webhook-test/firebase-job-post';

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

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Error in webhook proxy route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
