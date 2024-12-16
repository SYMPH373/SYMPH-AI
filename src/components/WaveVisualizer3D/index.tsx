'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaveVisualizer3DProps {
  isPlaying: boolean;
  type?: string;
}

export const WaveVisualizer3D = ({ isPlaying, type = 'TRANSFER' }: WaveVisualizer3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const layers = 5;
    const points = 32;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / canvas.width) * 2 - 1,
        y: ((e.clientY - rect.top) / canvas.height) * 2 - 1
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const getColors = () => {
      switch (type) {
        case 'TRANSFER':
          return ['rgba(255,0,255,', 'rgba(0,255,255,'];
        case 'SWAP':
          return ['rgba(255,51,102,', 'rgba(51,255,255,'];
        case 'NFT':
          return ['rgba(153,51,255,', 'rgba(51,255,153,'];
        default:
          return ['rgba(0,255,255,', 'rgba(255,0,255,'];
      }
    };

    const colors = getColors();
    const waves: number[][] = Array(layers).fill(0).map(() => Array(points).fill(0));

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,33,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rotateX = mouseRef.current.y * Math.PI / 8;
      const rotateY = mouseRef.current.x * Math.PI / 8;

      // Update and draw each layer
      for (let l = 0; l < layers; l++) {
        for (let i = 0; i < points; i++) {
          if (isPlaying) {
            waves[l][i] = Math.sin(i * 0.2 + l * 0.5 + Date.now() * 0.001) * 30;
          } else {
            waves[l][i] *= 0.95;
          }
        }

        // Draw 3D layer
        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const x = (i / points) * canvas.width;
          const y = canvas.height / 2 + waves[l][i];
          const z = l * 20 - layers * 10;

          // Apply 3D rotation
          const rotatedY = y * Math.cos(rotateX) - z * Math.sin(rotateX);
          const rotatedZ = y * Math.sin(rotateX) + z * Math.cos(rotateX);
          const rotatedX = x * Math.cos(rotateY) + rotatedZ * Math.sin(rotateY);

          if (i === 0) {
            ctx.moveTo(rotatedX, rotatedY);
          } else {
            ctx.lineTo(rotatedX, rotatedY);
          }
        }

        // Style with gradient
        ctx.strokeStyle = colors[l % 2] + (1 - l / layers) + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying, type]);

  return (
    <motion.div
      className="terminal-window w-full max-w-3xl mx-auto mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center p-2 border-b border-[var(--primary)]/20">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-[var(--primary)]">3D Visualization</span>
      </div>

      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full bg-[rgba(0,0,33,0.95)] rounded cursor-move"
        />
      </div>
    </motion.div>
  );
}; 