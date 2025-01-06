'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface VolumeControlProps {
  onChange: (volume: number) => void;
  className?: string;
}

export function VolumeControl({ onChange, className = '' }: VolumeControlProps) {
  const [volume, setVolume] = useState(0.5);
  const [isOpen, setIsOpen] = useState(false);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onChange(newVolume);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors duration-300"
      >
        $ volume: {Math.round(volume * 100)}%
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 w-48 terminal-window p-4"
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-[var(--primary)] bg-[var(--primary)]/20"
          />
          <div className="flex justify-between text-xs text-[var(--primary)]/50 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </motion.div>
      )}
    </div>
  );
} 