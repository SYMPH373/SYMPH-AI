'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onCommand: (command: string) => void;
  onTokenAddressChange: (address: string) => Promise<string>;
}

export function InteractiveTerminal({ onCommand, onTokenAddressChange }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      try {
        if (input.startsWith('set-token ')) {
          const address = input.replace('set-token ', '');
          const result = await onTokenAddressChange(address);
          setOutput(prev => [...prev, `> ${input}`, result]);
        } else {
          onCommand(input);
          setOutput(prev => [...prev, `> ${input}`]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setOutput(prev => [...prev, `> ${input}`, errorMessage]);
      }
      setInput('');
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-output">
        {output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="terminal-input"
        placeholder="Enter command..."
      />
    </div>
  );
} 