'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveVisualizer } from '../WaveVisualizer';
import { CircularVisualizer } from '../CircularVisualizer';
import { MatrixVisualizer } from '../MatrixVisualizer';
import { FrequencyVisualizer } from '../FrequencyVisualizer';
import { WaveVisualizer3D } from '../WaveVisualizer3D';

interface VisualizerSelectorProps {
  isPlaying: boolean;
  type: string;
  transaction?: string;
}

export const VisualizerSelector = ({ isPlaying, type, transaction }: VisualizerSelectorProps) => {
  const [currentVisualizer, setCurrentVisualizer] = useState(0);
  
  const visualizers = [
    { name: '$ wave_2d', component: WaveVisualizer },
    { name: '$ wave_3d', component: WaveVisualizer3D },
    { name: '$ circular', component: CircularVisualizer },
    { name: '$ matrix', component: MatrixVisualizer },
    { name: '$ frequency', component: FrequencyVisualizer },
  ];

  const CurrentComponent = visualizers[currentVisualizer].component;

  return (
    <div className="space-y-4">
      <div className="terminal-window p-2 flex justify-center gap-2">
        {visualizers.map((visualizer, index) => (
          <button
            key={visualizer.name}
            onClick={() => setCurrentVisualizer(index)}
            className={`px-4 py-2 border ${
              currentVisualizer === index
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-[var(--primary)]/30 text-[var(--primary)]/50'
            } hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors duration-300`}
          >
            {visualizer.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentVisualizer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentComponent 
            isPlaying={isPlaying} 
            type={type} 
            transaction={transaction}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 