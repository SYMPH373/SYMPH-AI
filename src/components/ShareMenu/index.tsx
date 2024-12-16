'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaShare, FaCopy } from 'react-icons/fa';

interface ShareMenuProps {
  transaction: any;
}

export const ShareMenu = ({ transaction }: ShareMenuProps) => {
  const [copied, setCopied] = useState(false);

  const handleShareOnX = () => {
    const text = `🎵 Listen to this blockchain melody on SYMPH-AI\n\n`;
    const url = `${window.location.origin}?tx=${transaction.signature}`;
    const hashtags = 'SYMPH-AI,Blockchain,Music';
    
    const xIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
    
    // Open in new window with specific dimensions
    window.open(
      xIntent,
      'Share on X',
      'width=550,height=420,scrollbars=yes,resizable=yes'
    );
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}?tx=${transaction.signature}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <motion.div 
      className="terminal-window w-full max-w-3xl mx-auto mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center p-2 border-b border-[var(--primary)]/20">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-[var(--primary)]">Share Melody</span>
      </div>

      <div className="p-4 flex gap-4">
        <button 
          onClick={handleShareOnX}
          className="flex items-center space-x-2 px-4 py-2 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors duration-300"
        >
          <span>$ share_on_x</span>
        </button>
        <button 
          onClick={handleCopyLink}
          className="flex items-center space-x-2 px-4 py-2 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors duration-300"
        >
          <span>{copied ? '✓ copied!' : '$ copy_link'}</span>
        </button>
      </div>
    </motion.div>
  );
}; 