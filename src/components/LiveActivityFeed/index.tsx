'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  signature: string;
  type: string;
  timestamp: string;
}

export const LiveActivityFeed = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Simulate real-time transactions
    const interval = setInterval(() => {
      const newTransaction = {
        signature: Math.random().toString(36).substring(2, 15),
        type: ['TRANSFER', 'SWAP', 'NFT'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toLocaleTimeString()
      };

      setTransactions(prev => [newTransaction, ...prev].slice(0, 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="terminal-window"
    >
      <div className="flex items-center p-2 border-b border-[var(--primary)]/20">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-[var(--primary)]">Live Activity</span>
      </div>

      <div className="p-2 max-h-[300px] overflow-y-auto">
        <AnimatePresence>
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.signature}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="mb-2 p-2 border border-[var(--primary)]/10 text-xs"
            >
              <div className="text-[var(--primary)]">
                $ {tx.type.toLowerCase()}
              </div>
              <div className="text-[var(--primary)]/50 truncate">
                {tx.signature}
              </div>
              <div className="text-[var(--primary)]/30 text-right">
                {tx.timestamp}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 