'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FrequencyVisualizerProps {
  isPlaying: boolean;
  type?: string;
}

export const FrequencyVisualizer = ({ isPlaying, type = 'TRANSFER' }: FrequencyVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const frequencies = new Array(32).fill(0);
    let animationId: number;
    let hue = 0;

    const getColors = () => {
      switch (type) {
        case 'TRANSFER':
          return {
            primary: '#FF00FF',
            secondary: '#00FFFF',
            gradient: ['#FF00FF', '#00FFFF']
          };
        case 'SWAP':
          return {
            primary: '#FF3366',
            secondary: '#33FFFF',
            gradient: ['#FF3366', '#33FFFF']
          };
        case 'NFT':
          return {
            primary: '#9933FF',
            secondary: '#33FF99',
            gradient: ['#9933FF', '#33FF99']
          };
        default:
          return {
            primary: '#00FFFF',
            secondary: '#FF00FF',
            gradient: ['#00FFFF', '#FF00FF']
          };
      }
    };

    const drawButterfly = (x: number, y: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const gradient = ctx.createLinearGradient(-size, -size, size, size);
      const colors = getColors().gradient;
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        size * Math.cos(0), size * Math.sin(0),
        size * Math.cos(Math.PI/2), size * Math.sin(Math.PI/2),
        0, 0
      );
      ctx.bezierCurveTo(
        size * Math.cos(Math.PI), size * Math.sin(Math.PI),
        size * Math.cos(3*Math.PI/2), size * Math.sin(3*Math.PI/2),
        0, 0
      );

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,33,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Update frequencies
      frequencies.forEach((_, i) => {
        if (isPlaying) {
          frequencies[i] = Math.random() * 100;
        } else {
          frequencies[i] *= 0.95;
        }
      });

      // Draw frequency spectrum with butterflies
      frequencies.forEach((freq, i) => {
        const angle = (i / frequencies.length) * Math.PI * 2;
        const radius = freq + 50;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const rotation = angle + Date.now() * 0.001;
        const size = freq * 0.3;

        drawButterfly(x, y, size, rotation);
      });

      // Draw connecting lines
      ctx.beginPath();
      frequencies.forEach((freq, i) => {
        const angle = (i / frequencies.length) * Math.PI * 2;
        const radius = freq + 50;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = getColors().primary;
      ctx.lineWidth = 2;
      ctx.stroke();

      hue = (hue + 1) % 360;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
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
        <span className="ml-4 text-[var(--primary)]">Frequency Spectrum</span>
      </div>

      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full bg-[rgba(0,0,33,0.95)] rounded"
        />
      </div>
    </motion.div>
  );
}; 