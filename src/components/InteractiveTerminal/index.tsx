'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlockchainService } from '@/lib/blockchain';
import { MusicGenerator } from '@/lib/music';

interface Props {
  onCommand: (command: string) => void;
  onTokenAddressChange: (address: string) => Promise<string>;
  blockchainService: BlockchainService;
  musicGenerator: MusicGenerator;
}

export function InteractiveTerminal({ 
  onCommand, 
  onTokenAddressChange, 
  blockchainService,
  musicGenerator 
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

  return (
    <div className="terminal-welcome">
      <div className="terminal-welcome-title">
        Welcome to SYMPH-AI v1.0
      </div>
      <div className="terminal-welcome-address">
        {blockchainService.tokenAddress}
      </div>
      <div className="terminal-input-container">
        <div className="terminal-input">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' for available commands"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
} 