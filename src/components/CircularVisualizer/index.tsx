'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CircularVisualizerProps {
  isPlaying: boolean;
  type?: string;
}

export const CircularVisualizer = ({ isPlaying, type = 'TRANSFER' }: CircularVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const particles: Particle[] = [];
    let rotation = 0;
    let animationId: number;

    class Particle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 50 + radius;
        this.speed = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 3 + 1;
        this.color = getColors().particle;
      }

      update() {
        this.angle += this.speed;
        if (isPlaying) {
          this.radius += (Math.sin(this.angle * 5) * 2);
        }
      }

      draw() {
        const x = centerX + Math.cos(this.angle) * this.radius;
        const y = centerY + Math.sin(this.angle) * this.radius;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const getColors = () => {
      switch (type) {
        case 'TRANSFER':
          return {
            primary: '#FF00FF',
            secondary: '#00FFFF',
            particle: 'rgba(255, 0, 255, 0.6)'
          };
        case 'SWAP':
          return {
            primary: '#FF3366',
            secondary: '#33FFFF',
            particle: 'rgba(255, 51, 102, 0.6)'
          };
        case 'NFT':
          return {
            primary: '#9933FF',
            secondary: '#33FF99',
            particle: 'rgba(153, 51, 255, 0.6)'
          };
        default:
          return {
            primary: '#00FFFF',
            secondary: '#FF00FF',
            particle: 'rgba(0, 255, 255, 0.6)'
          };
      }
    };

    // Initialize orbital particles
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,33,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw main circle
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      const segments = 32;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const nextAngle = ((i + 1) / segments) * Math.PI * 2;
        const amplitude = isPlaying ? 30 * Math.sin(Date.now() * 0.003 + i * 0.2) : 20;

        ctx.beginPath();
        ctx.moveTo(
          Math.cos(angle) * (radius - amplitude),
          Math.sin(angle) * (radius - amplitude)
        );
        ctx.lineTo(
          Math.cos(nextAngle) * (radius - amplitude),
          Math.sin(nextAngle) * (radius - amplitude)
        );
        ctx.strokeStyle = getColors().primary;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(
          Math.cos(angle) * (radius + amplitude),
          Math.sin(angle) * (radius + amplitude)
        );
        ctx.lineTo(
          Math.cos(nextAngle) * (radius + amplitude),
          Math.sin(nextAngle) * (radius + amplitude)
        );
        ctx.strokeStyle = getColors().secondary;
        ctx.stroke();
      }

      ctx.restore();

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      rotation += isPlaying ? 0.005 : 0.001;
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
        <span className="ml-4 text-[var(--primary)]">Circular Visualization</span>
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