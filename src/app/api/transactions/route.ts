import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = '3fba9746-b765-46e8-ac4f-97f957f846dd';
  // Get token address from environment variable
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${tokenAddress}/transactions?api-key=${apiKey}&until=&limit=10`
    );

    const data = await response.json();
    
    const transactions = data.map((tx: any) => ({
      signature: tx.signature,
      timestamp: tx.timestamp,
      // Check for error in meta to determine status
      status: tx.meta?.err ? 'failed' : 'success'
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
} 