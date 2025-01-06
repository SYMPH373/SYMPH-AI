import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MusicGenerator } from '@/lib/music';

interface Props {
  transactions: any[];
  musicGenerator: MusicGenerator;
  onTransactionSelect: (signature: string) => void;
}

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  signature: string;
  type: string;
  originalSize: number;
}

export function ConstellationField({ transactions, musicGenerator, onTransactionSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rippleRef = useRef<Array<{ x: number; y: number; size: number; color: string }>>([]);

  const getDistance = (star1: Star, star2: Star) => {
    return Math.hypot(star1.x - star2.x, star1.y - star2.y);
  };

  const getColorComponents = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `${r}, ${g}, ${b}`;
  };

  const createRipple = (x: number, y: number, color: string) => {
    rippleRef.current.push({ x, y, size: 0, color });
  };

  const drawRipples = (ctx: CanvasRenderingContext2D) => {
    rippleRef.current = rippleRef.current.filter(ripple => {
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.size, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${getColorComponents(ripple.color)}, ${1 - ripple.size / 100})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ripple.size += 2;
      return ripple.size < 100;
    });
  };

  const drawStar = (ctx: CanvasRenderingContext2D, star: Star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = star.color;
    ctx.fill();
  };

  const drawConstellationLines = (ctx: CanvasRenderingContext2D, stars: Star[]) => {
    stars.forEach((star, i) => {
      const nextStar = stars[i + 1];
      if (nextStar && getDistance(star, nextStar) < 150) {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(nextStar.x, nextStar.y);
        ctx.strokeStyle = `rgba(${getColorComponents(star.color)}, 0.2)`;
        ctx.stroke();
      }
    });
  };

  const getTransactionColor = (type: string): string => {
    const colors: Record<string, string> = {
      mint: '#00ff00',
      burn: '#ff0000',
      swap: '#0000ff',
      transfer: '#ffff00',
      default: '#ffffff'
    };
    return colors[type as keyof typeof colors] || colors.default;
  };

  const handleStarClick = (star: Star) => {
    createRipple(star.x, star.y, star.color);
    musicGenerator.playQuantumHarmonics({ signature: star.signature });
    onTransactionSelect(star.signature);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    starsRef.current = transactions.map(tx => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.max(2, (tx.fee || 0) * 5),
      originalSize: Math.max(2, (tx.fee || 0) * 5),
      color: getTransactionColor(tx.type),
      speed: Math.random() * 0.5,
      signature: tx.signature,
      type: tx.type
    }));

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawConstellationLines(ctx, starsRef.current);
      drawRipples(ctx);
      
      starsRef.current.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        drawStar(ctx, star);
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [transactions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      starsRef.current.forEach(star => {
        const distance = Math.hypot(star.x - x, star.y - y);
        if (distance < 50) {
          star.size = star.originalSize * 1.5;
          star.x += (x - star.x) * 0.05;
          star.y += (y - star.y) * 0.05;
        } else {
          star.size = star.originalSize;
        }
      });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clickedStar = starsRef.current.find(star => 
        Math.hypot(star.x - x, star.y - y) < star.size
      );

      if (clickedStar) {
        handleStarClick(clickedStar);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
} 