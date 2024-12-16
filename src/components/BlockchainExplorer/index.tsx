'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlockchainService } from '../../lib/blockchain/index';

interface BlockchainExplorerProps {
  onTransactionSelect: (signature: string) => void;
}

export const BlockchainExplorer = ({ onTransactionSelect }: BlockchainExplorerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const blockchainService = new BlockchainService();
      const recentTxns = await blockchainService.getRecentTransactions();
      setTransactions(recentTxns);
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, []);

  const handleClick = async (signature: string) => {
    setIsLoading(true);
    await onTransactionSelect(signature);
    setIsLoading(false);
  };

  return (
    <motion.div className="terminal-window w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between p-2 border-b border-neon-blue/20 bg-black">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-[#00ff00]">Recent Transactions</span>
        </div>
        {isLoading && (
          <span className="text-[#00ff00] text-sm">Loading...</span>
        )}
      </div>

      <div className="p-4 bg-black">
        <motion.div className="space-y-2">
          {transactions.map((tx) => (
            <motion.div
              key={tx.signature}
              className="flex items-center justify-between p-2 hover:bg-neon-blue/10 cursor-pointer rounded font-mono text-sm"
              onClick={() => handleClick(tx.signature)}
              whileHover={{ scale: 1.01 }}
            >
              <span className="text-[#00ff00] truncate flex-1">{tx.signature}</span>
              <span className="text-white ml-4">{tx.timestamp}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}; 