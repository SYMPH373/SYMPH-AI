'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InteractiveTerminalProps {
  onCommand?: (command: string) => void;
}

export const InteractiveTerminal = ({ onCommand }: InteractiveTerminalProps) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>(['Welcome to Blockchain Symphony v1.0', 'Type "help" for available commands']);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (cmd: string) => {
    const newOutput = [...output, `$ ${cmd}`];
    
    switch (cmd.toLowerCase()) {
      case 'help':
        newOutput.push(
          'Available commands:',
          '  help     - Show this help message',
          '  clear    - Clear terminal',
          '  play     - Play current transaction melody',
          '  stop     - Stop playing melody',
          '  theme    - Toggle color theme',
          '  history  - Show command history'
        );
        break;
      
      case 'clear':
        setOutput([]);
        return;
      
      case 'history':
        newOutput.push(...history);
        break;
      
      case 'theme':
        newOutput.push('Theme toggled');
        break;
      
      default:
        if (onCommand) {
          onCommand(cmd);
        } else {
          newOutput.push(`Command not found: ${cmd}`);
        }
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
    <motion.div
      className="terminal-window w-full max-w-3xl mx-auto mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center p-2 border-b border-neon-blue/20">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-[#00ff00]">Terminal</span>
      </div>

      <div className="p-4 font-mono text-sm">
        {output.map((line, i) => (
          <div key={i} className="text-[#00ff00] whitespace-pre-wrap">{line}</div>
        ))}
        <div className="flex items-center">
          <span className="text-[#00ff00] mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[#00ff00] focus:ring-0"
            autoFocus
          />
        </div>
      </div>
    </motion.div>
  );
}; 