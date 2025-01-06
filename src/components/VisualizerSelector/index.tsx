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
    <div className="visualizer-controls">
      <div className="visualizer-buttons">
        <button className={`visualizer-btn ${currentVisualizer === 0 ? 'active' : ''}`}>
          $ wave_2d
        </button>
        <button className={`visualizer-btn ${currentVisualizer === 1 ? 'active' : ''}`}>
          $ wave_3d
        </button>
        <button className={`visualizer-btn ${currentVisualizer === 2 ? 'active' : ''}`}>
          $ circular
        </button>
        <button className={`visualizer-btn ${currentVisualizer === 3 ? 'active' : ''}`}>
          $ matrix
        </button>
        <button className={`visualizer-btn ${currentVisualizer === 4 ? 'active' : ''}`}>
          $ frequency
        </button>
      </div>
      <div className="sound-visualization">
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
    </div>
  );
}; 