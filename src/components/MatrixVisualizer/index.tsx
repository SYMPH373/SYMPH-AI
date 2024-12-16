'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MatrixVisualizerProps {
  isPlaying: boolean;
  type?: string;
  transaction?: string;
}

export const MatrixVisualizer = ({ isPlaying, type = 'TRANSFER', transaction = '' }: MatrixVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let animationId: number;

    class Symbol {
      x: number;
      y: number;
      value: string;
      speed: number;
      color: string;
      isTransaction: boolean;

      constructor(x: number, y: number, speed: number, color: string, isTransaction = false) {
        this.x = x;
        this.y = y;
        this.value = '';
        this.speed = speed;
        this.color = color;
        this.isTransaction = isTransaction;
        this.setRandomSymbol();
      }

      setRandomSymbol() {
        if (this.isTransaction) {
          this.value = transaction[Math.floor(Math.random() * transaction.length)] || '0';
        } else {
          this.value = Math.random() > 0.5 ? '0' : '1';
        }
      }

      rain() {
        if (!canvas) return;
        
        if (this.y >= canvas.height) {
          this.y = 0;
        } else {
          this.y += this.speed;
        }
        this.setRandomSymbol();
      }
    }

    class Column {
      symbols: Symbol[] = [];
      constructor(x: number, color: string) {
        if (!canvas) return;
        
        const symbolCount = Math.floor(canvas.height / 20);
        for (let i = 0; i < symbolCount; i++) {
          const isTransaction = Math.random() < 0.3;
          const speed = isTransaction ? 2 : Math.random() * 3 + 1;
          this.symbols.push(
            new Symbol(x, i * 20, speed, color, isTransaction)
          );
        }
      }

      draw() {
        this.symbols.forEach((symbol) => {
          if (symbol.isTransaction) {
            ctx.font = 'bold 14px monospace';
            ctx.fillStyle = symbol.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = symbol.color;
          } else {
            ctx.font = '12px monospace';
            ctx.fillStyle = `rgba(${symbol.color}, 0.5)`;
            ctx.shadowBlur = 0;
          }
          
          ctx.fillText(symbol.value, symbol.x, symbol.y);
          symbol.rain();
        });
      }
    }

    const getColor = () => {
      switch (type) {
        case 'TRANSFER': return '255, 0, 255';
        case 'SWAP': return '255, 51, 102';
        case 'NFT': return '153, 51, 255';
        default: return '0, 255, 255';
      }
    };

    const columns: Column[] = [];
    const columnCount = Math.floor(canvas.width / 20);
    const color = getColor();

    for (let i = 0; i < columnCount; i++) {
      columns.push(new Column(i * 20, color));
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 33, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        columns.forEach(column => column.draw());
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, type, transaction]);

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
        <span className="ml-4 text-[var(--primary)]">Matrix Visualization</span>
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