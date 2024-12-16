'use client';

import { motion } from 'framer-motion';

interface TransactionDetailsProps {
  transaction: any;
}

export const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  if (!transaction) return null;

  return (
    <motion.div className="terminal-window w-full max-w-3xl mx-auto mb-4">
      <div className="flex items-center p-2 border-b border-neon-blue/20 bg-black">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-[#00ff00]">Transaction Details</span>
      </div>

      <div className="p-4 bg-black font-mono text-sm">
        <div className="grid gap-2">
          <div className="flex">
            <span className="text-[#00ff00] w-24">$ signature:</span>
            <span className="text-white break-all">{transaction.signature}</span>
          </div>

          <div className="flex">
            <span className="text-[#00ff00] w-24">$ type:</span>
            <span className="text-white">{transaction.type}</span>
          </div>

          <div className="flex">
            <span className="text-[#00ff00] w-24">$ status:</span>
            <span className="text-green-400">{transaction.status}</span>
          </div>

          <div className="flex">
            <span className="text-[#00ff00] w-24">$ timestamp:</span>
            <span className="text-white">{transaction.timestamp}</span>
          </div>

          <div className="flex">
            <span className="text-[#00ff00] w-24">$ fee:</span>
            <span className="text-white">{transaction.fee} SOL</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-[#00ff00] italic">
          Press any key to play the melody...
        </div>
      </div>
    </motion.div>
  );
}; 