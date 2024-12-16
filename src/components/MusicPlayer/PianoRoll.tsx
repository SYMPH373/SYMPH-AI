'use client';

import { useEffect, useRef } from 'react';

export const PianoRoll = ({ notes }: { notes: string[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      // Add piano roll visualization logic here
    }
  }, [notes]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-40 border rounded"
      width={800}
      height={160}
    />
  );
};
