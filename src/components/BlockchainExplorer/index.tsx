'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlockchainService } from '../../lib/blockchain/index';

interface BlockchainExplorerProps {
  onTransactionSelect: (signature: string) => void;
  blockchainService: BlockchainService;
  refreshTrigger?: number;
}

export const BlockchainExplorer = ({ onTransactionSelect, blockchainService, refreshTrigger }: BlockchainExplorerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const recentTxns = await blockchainService.getRecentTransactions();
      console.log('Fetched transactions:', recentTxns);
      if (recentTxns && recentTxns.length > 0) {
        setTransactions(recentTxns);
      }
    } catch (error) {
      console.error('Error in BlockchainExplorer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Refresh triggered');
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [blockchainService, refreshTrigger]);

  const handleClick = async (signature: string) => {
    setIsLoading(true);
    await onTransactionSelect(signature);
    setIsLoading(false);
  };

  return (
    <div className="recent-transactions">
      <h3 className="terminal-text">Recent Transactions</h3>
      <div className="transaction-list">
        {isLoading ? (
          <div className="transaction-loading">Loading...</div>
        ) : (
          transactions.map((tx: any) => (
            <div
              key={tx.signature}
              onClick={() => handleClick(tx.signature)}
              className="transaction-item"
            >
              {tx.signature}
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 