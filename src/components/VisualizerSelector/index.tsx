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
        {visualizers.map((visualizer, index) => (
          <button
            key={visualizer.name}
            onClick={() => setCurrentVisualizer(index)}
            className={`visualizer-btn ${currentVisualizer === index ? 'active' : ''}`}
          >
            {visualizer.name}
          </button>
        ))}
      </div>
      <div className="sound-visualization">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVisualizer}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
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