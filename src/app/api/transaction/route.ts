import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { signature } = await req.json();
    const apiKey = '3fba9746-b765-46e8-ac4f-97f957f846dd';
    
    const heliusResponse = await fetch(
      `https://api.helius.xyz/v0/transactions/?api-key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: [signature]
        })
      }
    );

    const data = await heliusResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
} 