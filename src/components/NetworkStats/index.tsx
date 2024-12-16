'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface NetworkStatsData {
  activeNodes: number;
  totalTransactions: number;
  avgBlockTime: string;
  networkHealth: string;
  lastBlock: string;
}

export const NetworkStats = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState<NetworkStatsData>({
    activeNodes: 0,
    totalTransactions: 0,
    avgBlockTime: '0s',
    networkHealth: 'Excellent',
    lastBlock: '0000000'
  });

  // Audio setup for network events
  const playNetworkSound = (type: 'node' | 'transaction' | 'block') => {
    const frequencies = {
      node: 440,
      transaction: 520,
      block: 660
    };
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.value = frequencies[type];
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  };

  // Network visualization
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff00ff';
      
      // Create dynamic bars based on network activity
      const bars = 20;
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height;
        ctx.fillRect(
          (canvas.width / bars) * i,
          canvas.height - height,
          canvas.width / bars - 2,
          height
        );
      }
    };

    const animation = setInterval(animate, 100);
    return () => clearInterval(animation);
  }, []);

  // Simulated network updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newStats = {
        activeNodes: Math.floor(Math.random() * 1000) + 500,
        totalTransactions: Math.floor(Math.random() * 100000) + 50000,
        avgBlockTime: `${(Math.random() * 2 + 1).toFixed(1)}s`,
        networkHealth: 'Excellent',
        lastBlock: Math.random().toString(36).substring(2, 15)
      };
      
      setStats(newStats);
      playNetworkSound('transaction');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="terminal-window"
    >
      <div className="flex items-center p-2 border-b border-[var(--primary)]/20">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-[var(--primary)]">Network Stats</span>
      </div>

      <div className="p-4 space-y-4 text-[var(--primary)]">
        <div>
          <div className="text-sm opacity-70">Active Nodes</div>
          <div className="text-lg font-mono cursor-pointer hover:text-pink-400" 
               onClick={() => playNetworkSound('node')}>
            $ {stats.activeNodes}
          </div>
        </div>
        
        <div>
          <div className="text-sm opacity-70">Total Transactions</div>
          <div className="text-lg font-mono cursor-pointer hover:text-pink-400"
               onClick={() => playNetworkSound('transaction')}>
            $ {stats.totalTransactions}
          </div>
        </div>

        <div>
          <div className="text-sm opacity-70">Average Block Time</div>
          <div className="text-lg font-mono cursor-pointer hover:text-pink-400"
               onClick={() => playNetworkSound('block')}>
            $ {stats.avgBlockTime}
          </div>
        </div>

        <div>
          <div className="text-sm opacity-70">Network Health</div>
          <div className="text-lg font-mono text-green-400">$ {stats.networkHealth}</div>
        </div>

        <div>
          <div className="text-sm opacity-70">Last Block</div>
          <div className="text-lg font-mono">$ {stats.lastBlock}</div>
        </div>

        <canvas 
          ref={canvasRef}
          className="w-full h-16 mt-4 border-t border-[var(--primary)]/20"
        />
      </div>
    </motion.div>
  );
}; 