import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { signature: string } }
) {
  const apiKey = '3fba9746-b765-46e8-ac4f-97f957f846dd';

  try {
    const pathParts = request.url.split('/');
    const signature = pathParts[pathParts.length - 1];

    const response = await fetch(
      `https://api.helius.xyz/v0/transactions/?api-key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: [signature]
        }),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
} 