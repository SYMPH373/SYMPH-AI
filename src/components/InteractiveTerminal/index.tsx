'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlockchainService } from '@/lib/blockchain';
import { MusicGenerator } from '@/lib/music';
import { WaveVisualizer } from '../WaveVisualizer';

interface Props {
  onCommand: (command: string) => void;
  onTokenAddressChange: (address: string) => Promise<string>;
  blockchainService: BlockchainService;
  musicGenerator: MusicGenerator;
  transaction?: any;
  isPlaying?: boolean;
  type?: string;
  visualizers?: Array<{ name: string; component: React.ComponentType<any> }>;
  currentVisualizer?: number;
  setCurrentVisualizer?: (index: number) => void;
  transactions?: any[];
}

export function InteractiveTerminal({ 
  onCommand, 
  onTokenAddressChange, 
  blockchainService,
  musicGenerator,
  transaction = {},
  isPlaying = false,
  type = '',
  visualizers = [],
  currentVisualizer = 0,
  setCurrentVisualizer = () => {},
  transactions = [],
}: Props) {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>(['Welcome to SYMPH-AI v1.0 | 7omp98JBaH3a9okQwwPCtGfHaZh4m4TRKqNuZAdBpump', 'Type "help" for available commands']);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = async (cmd: string) => {
    const newOutput = [...output];
    newOutput.push(`$ ${cmd}`);

    try {
      if (cmd.toLowerCase().startsWith('settoken ')) {
        const address = cmd.split(' ')[1];
        if (!address) {
          newOutput.push('Error: Please provide a token address');
        } else {
          const result = await onTokenAddressChange(address);
          newOutput.push(result);
        }
      } else {
        switch (cmd.toLowerCase()) {
          case 'help':
            newOutput.push(
              'Available commands:',
              '  help     - Show this help message',
              '  clear    - Clear terminal',
              '  play     - Play current transaction melody',
              '  stop     - Stop playing melody',
              '  theme    - Toggle color theme',
              '  history  - Show command history',
              '  settoken <address> - Set token contract address'
            );
            break;
          
          case 'clear':
            setOutput([]);
            return;
          
          case 'history':
            newOutput.push(...history);
            break;
          
          case 'quantum':
            try {
              if (cmd.toLowerCase().startsWith('quantum ')) {
                const signature = cmd.split(' ')[1];
                if (!signature) {
                  newOutput.push('Error: Please provide a transaction signature');
                } else {
                  const transaction = await blockchainService.getTransaction(signature);
                  if (transaction) {
                    newOutput.push(
                      'Generating quantum harmonics...',
                      'Amplitude: ' + Math.round((transaction.fee || 0) * 100) + '%',
                      'Phase: ' + Math.round(Date.parse(transaction.timestamp) % 360) + '°',
                      'Entanglement: Computing...'
                    );
                    await musicGenerator.playQuantumHarmonics(transaction);
                  }
                }
              } else {
                newOutput.push(
                  'Quantum Harmonics Commands:',
                  '  quantum <signature> - Play quantum harmonics for transaction',
                  '  quantum help       - Show this help message'
                );
              }
            } catch (error: unknown) {
              const errorMessage = error instanceof Error 
                ? error.message 
                : 'Unknown quantum harmonics error';
              newOutput.push('Error generating quantum harmonics:', errorMessage);
            }
            break;
          
          default:
            onCommand(cmd);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      newOutput.push(errorMessage);
    }
    
    setOutput(newOutput);
    setHistory([...history, cmd]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && command.trim()) {
      handleCommand(command.trim());
      setCommand('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const CurrentComponent = visualizers[currentVisualizer]?.component || WaveVisualizer;

  return (
    <div className="terminal-interface">
      {/* Header */}
      <div className="terminal-header">
        <h1 className="terminal-title">Welcome to SYMPH-AI v1.0</h1>
        <div className="terminal-address">{blockchainService.tokenAddress}</div>
        <div className="terminal-input-wrapper">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' for available commands"
            className="terminal-input"
          />
        </div>
      </div>

      {/* Transaction Details */}
      <div className="transaction-panel">
        <div className="transaction-field">
          <span>signature:</span>
          <span>{transaction.signature}</span>
        </div>
        <div className="transaction-field">
          <span>type:</span>
          <span>{transaction.type}</span>
        </div>
        <div className="transaction-field">
          <span>status:</span>
          <span>{transaction.status}</span>
        </div>
        <div className="transaction-field">
          <span>timestamp:</span>
          <span>{transaction.timestamp}</span>
        </div>
        <div className="transaction-field">
          <span>fee:</span>
          <span>{transaction.fee} SOL</span>
        </div>
      </div>

      {/* Visualizer */}
      <div className="visualizer-panel">
        <div className="visualizer-buttons">
          {visualizers.map((v, i) => (
            <button 
              key={v.name}
              className={`visualizer-btn ${currentVisualizer === i ? 'active' : ''}`}
              onClick={() => setCurrentVisualizer(i)}
            >
              {v.name}
            </button>
          ))}
        </div>
        <div className="visualizer-display">
          <CurrentComponent 
            isPlaying={isPlaying} 
            type={type} 
            transaction={transaction}
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-panel">
        <h2 className="panel-title">Recent Transactions</h2>
        <div className="transactions-list">
          {transactions.map(tx => (
            <div key={tx.signature} className="transaction-item">
              {tx.signature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 