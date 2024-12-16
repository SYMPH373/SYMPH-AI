import { Connection, PublicKey } from '@solana/web3.js';

export class BlockchainService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection('https://mainnet.helius-rpc.com/?api-key=9dadbc5d-c72e-474f-8623-0b9c4e6940b7');
  }

  async getRecentTransactions() {
    try {
      // Use a known program ID, like Token Program
      const tokenProgramId = new PublicKey('AUxHAWUDaUVxsKmdU9sFoYbaccDrV8uaRuXvdS19pump');
      
      const signatures = await this.connection.getSignaturesForAddress(
        tokenProgramId,
        { limit: 10 }
      );

      return signatures.map(sig => ({
        signature: sig.signature,
        timestamp: new Date(sig.blockTime! * 1000).toLocaleString(),
        status: sig.confirmationStatus
      }));

    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  async getTransaction(signature: string) {
    try {
      const transaction = await this.connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0
      });
      
      const type = this.getTransactionType(transaction);
      
      return {
        signature,
        type,
        timestamp: new Date().toLocaleString(),
        status: 'SUCCESS',
        fee: transaction?.meta?.fee ? (transaction.meta.fee / 1e9).toFixed(9) : '0'
      };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  private getTransactionType(transaction: any) {
    if (!transaction?.meta?.logMessages) return 'UNKNOWN';

    const logs = transaction.meta.logMessages.join(' ');
    
    if (logs.includes('Initialize mint')) return 'MINT';
    if (logs.includes('Burn')) return 'BURN';
    if (logs.includes('Swap')) return 'SWAP';
    if (logs.includes('Transfer')) return 'TRANSFER';
    if (logs.includes('NFT')) return 'NFT';
    if (logs.includes('Deposit') || logs.includes('Withdraw')) return 'DEFI';
    
    return 'OTHER';
  }
} 