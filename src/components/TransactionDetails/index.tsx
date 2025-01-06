'use client';

import { motion } from 'framer-motion';

interface TransactionDetailsProps {
  transaction: any;
}

export const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  if (!transaction) return null;

  return (
    <div className="transaction-details">
      <div className="transaction-field">
        <span className="terminal-text-dim">signature:</span>
        <span className="transaction-signature">{transaction.signature}</span>
      </div>
      <div className="transaction-field">
        <span className="terminal-text-dim">type:</span>
        <span className="transaction-type">{transaction.type}</span>
      </div>
      <div className="transaction-field">
        <span className="terminal-text-dim">status:</span>
        <span className="transaction-status">{transaction.status}</span>
      </div>
      <div className="transaction-field">
        <span className="terminal-text-dim">timestamp:</span>
        <span className="transaction-timestamp">{transaction.timestamp}</span>
      </div>
      <div className="transaction-field">
        <span className="terminal-text-dim">fee:</span>
        <span className="transaction-fee">{transaction.fee} SOL</span>
      </div>
    </div>
  );
}; 