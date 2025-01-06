'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockchainExplorer } from '@/components/BlockchainExplorer';
import { TransactionDetails } from '@/components/TransactionDetails';
import { WaveVisualizer } from '@/components/WaveVisualizer';
import { InteractiveTerminal } from '@/components/InteractiveTerminal';
import { ShareMenu } from '@/components/ShareMenu';
import { BlockchainService } from '@/lib/blockchain';
import { MusicGenerator } from '@/lib/music';
import { VisualizerSelector } from '@/components/VisualizerSelector';
import { CommandHelp } from '@/components/CommandHelp';
import { VolumeControl } from '@/components/VolumeControl';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';
import { NetworkStats } from '@/components/NetworkStats';
import { PublicKey } from '@solana/web3.js';
import { ConstellationField } from '@/components/ConstellationField';
import { DreamcatcherPortal } from '@/components/DreamcatcherPortal';

export default function Home() {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<string>('7omp98JBaH3a9okQwwPCtGfHaZh4m4TRKqNuZAdBpump');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const blockchainService = useMemo(() => new BlockchainService(), []);
  const musicGenerator = useMemo(() => new MusicGenerator(), []);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  const handleTokenAddressChange = async (address: string) => {
    try {
      const cleanAddress = address.trim();
      
      // Validate using PublicKey
      try {
        new PublicKey(cleanAddress);
      } catch {
        throw new Error('Invalid Solana address format');
      }
      
      blockchainService.tokenAddress = cleanAddress;
      setTokenAddress(cleanAddress);
      setRefreshTrigger(prev => prev + 1);
      
      const transactions = await blockchainService.getRecentTransactions();
      if (transactions.length === 0) {
        console.log('No transactions found for address:', cleanAddress);
      }
      
      return `Changed token address to ${cleanAddress}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error: ${errorMessage}`);
    }
  };

  const handleTransactionSelect = useCallback(async (signature: string) => {
    const transaction = await blockchainService.getTransaction(signature);
    setSelectedTransaction(transaction);
    
    if (transaction) {
      const notes = musicGenerator.hashToNotes(signature);
      setIsPlaying(true);
      await musicGenerator.playSequence(notes);
      setIsPlaying(false);
    }
  }, [blockchainService, musicGenerator]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && selectedTransaction) {
        e.preventDefault();
        handleTransactionSelect(selectedTransaction.signature);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedTransaction, handleTransactionSelect]);

  const handleCommand = async (command: string) => {
    if (command.startsWith('Error:')) {
      // Pass error messages directly to the terminal
      return;
    }

    switch (command.toLowerCase()) {
      case 'play':
        if (selectedTransaction) {
          await handleTransactionSelect(selectedTransaction.signature);
        }
        break;
      case 'refresh':
        setRefreshTrigger(prev => prev + 1);
        break;
      case 'share':
        if (selectedTransaction) {
          await navigator.clipboard.writeText(
            `${window.location.origin}?tx=${selectedTransaction.signature}`
          );
        }
        break;
    }
  };

  const handleVolumeChange = (volume: number) => {
    musicGenerator.setVolume(volume);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await blockchainService.getRecentTransactions();
      setRecentTransactions(transactions);
    };
    fetchTransactions();
  }, [blockchainService, refreshTrigger]);

  return (
    <div className="app-container">
      {/* Mystical Background Layers */}
      <div className="background-layer">
        <DreamcatcherPortal transactions={recentTransactions} />
        <ConstellationField 
          transactions={recentTransactions} 
          musicGenerator={musicGenerator}
          onTransactionSelect={handleTransactionSelect}
        />
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="content-grid">
          {/* Left side */}
          <div className="side-panel">
            <LiveActivityFeed />
          </div>

          {/* Center */}
          <div className="terminal-container">
            <motion.main className="terminal-content">
              <motion.h1 className="title">SYMPH-AI</motion.h1>
              {/* Rest of terminal content */}
            </motion.main>
          </div>

          {/* Right side */}
          <div className="side-panel">
            <NetworkStats />
          </div>
        </div>
      </div>
    </div>
  );
}
