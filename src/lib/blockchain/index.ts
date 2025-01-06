import { Connection, PublicKey } from '@solana/web3.js';

export class BlockchainService {
  private apiKey = '3fba9746-b765-46e8-ac4f-97f957f846dd';
  tokenAddress: string = '7omp98JBaH3a9okQwwPCtGfHaZh4m4TRKqNuZAdBpump';

  async getRecentTransactions() {
    try {
      const response = await fetch('/api/transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  async getTransaction(signature: string) {
    try {
      console.log('Fetching transaction:', signature);
      
      const response = await fetch(
        `https://api.helius.xyz/v0/transactions/?api-key=${this.apiKey}`,
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

      const data = await response.json();
      console.log('Raw transaction data:', data);

      if (data && data[0]) {
        const transformedData = {
          signature: data[0].signature || signature,
          timestamp: data[0].timestamp,
          fee: data[0].fee,
          err: data[0].err,
          type: data[0].type,
          source: data[0].source,
          description: data[0].description
        };
        console.log('Transformed data:', transformedData);
        return transformedData;
      }

      return null;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }
}
