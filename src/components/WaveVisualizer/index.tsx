'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaveVisualizerProps {
  isPlaying: boolean;
  type?: string;
}

export const WaveVisualizer = ({ isPlaying, type = 'TRANSFER' }: WaveVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const bars = 32;
    const particles: Particle[] = [];
    let animationId: number;

    // Particle system
    class Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      color: string;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 2 + 1;
        this.size = Math.random() * 3 + 1;
        this.color = color;
      }

      update() {
        if (!canvas) return;
        
        this.y -= this.speed;
        if (this.y < 0) {
          this.y = canvas.height;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Color schemes based on transaction type
    const getColors = () => {
      switch (type) {
        case 'TRANSFER':
          return {
            primary: 'rgba(255, 0, 255, 0.8)',
            secondary: 'rgba(0, 255, 255, 0.8)',
            particle: '#FF00FF'
          };
        case 'SWAP':
          return {
            primary: 'rgba(255, 51, 102, 0.8)',
            secondary: 'rgba(51, 255, 255, 0.8)',
            particle: '#FF3366'
          };
        case 'NFT':
          return {
            primary: 'rgba(153, 51, 255, 0.8)',
            secondary: 'rgba(51, 255, 153, 0.8)',
            particle: '#9933FF'
          };
        default:
          return {
            primary: 'rgba(0, 255, 255, 0.8)',
            secondary: 'rgba(255, 0, 255, 0.8)',
            particle: '#00FFFF'
          };
      }
    };

    const colors = getColors();

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          colors.particle
        )
      );
    }

    const barWidth = canvas.width / bars;
    const previousHeights = new Array(bars).fill(canvas.height * 0.2);
    const targetHeights = new Array(bars).fill(canvas.height * 0.2);

    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 33, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Update visualization
      for (let i = 0; i < bars; i++) {
        if (isPlaying) {
          targetHeights[i] = Math.random() * canvas.height * 0.8;
        } else {
          targetHeights[i] = canvas.height * 0.2;
        }

        // Smooth transition
        previousHeights[i] += (targetHeights[i] - previousHeights[i]) * 0.15;

        const height = previousHeights[i];
        const x = i * barWidth;

        // Create gradient
        const gradient = ctx.createLinearGradient(x, canvas.height, x, canvas.height - height);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(1, colors.secondary);

        // Draw bar with effects
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x + barWidth / 2, canvas.height - height);
        ctx.lineTo(x + barWidth, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors.primary;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

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
        <span className="ml-4 text-[var(--primary)]">Sound Visualization</span>
      </div>

      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full bg-[rgba(0,0,33,0.95)] rounded"
        />
      </div>
    </motion.div>
  );
}; 