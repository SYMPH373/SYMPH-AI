import { Connection, PublicKey } from '@solana/web3.js';

export interface IBlockchainService {
  tokenAddress: string;
  getRecentTransactions(): Promise<any[]>;
  getTransaction(signature: string): Promise<any>;
}

export class BlockchainService implements IBlockchainService {
  private connection: Connection;
  public tokenAddress: string;

  constructor() {
    this.connection = new Connection('https://mainnet.helius-rpc.com/?api-key=9dadbc5d-c72e-474f-8623-0b9c4e6940b7');
    this.tokenAddress = '7omp98JBaH3a9okQwwPCtGfHaZh4m4TRKqNuZAdBpump';
  }

  private isValidBase58(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  public setAddress(address: string): void {
    if (!this.isValidBase58(address)) {
      throw new Error('Invalid address format. Must be base58 encoded.');
    }
    this.tokenAddress = address;
  }

  async getRecentTransactions() {
    try {
      if (!this.isValidBase58(this.tokenAddress)) {
        console.error('Invalid token address format');
        return [];
      }

      console.log('Fetching transactions for address:', this.tokenAddress);
      const tokenProgramId = new PublicKey(this.tokenAddress);
      
      const signatures = await this.connection.getSignaturesForAddress(
        tokenProgramId,
        { limit: 10 }
      );

      console.log('Found transactions:', signatures.length);
      
      if (signatures.length === 0) {
        console.log('No transactions found for address');
        return [];
      }

      return signatures.map(sig => ({
        signature: sig.signature,
        timestamp: new Date(sig.blockTime! * 1000).toLocaleString(),
        status: sig.confirmationStatus
      }));

    } catch (error) {
      console.error('Error fetching transactions:', error);
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