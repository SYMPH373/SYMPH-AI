'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export const DJAnimation = () => {
  return (
    <motion.div
      className="fixed bottom-0 right-0 w-[300px] h-[400px] z-10 pointer-events-none"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full h-full">
        <Image
          src="/dj-girl.gif"
          alt="DJ Animation"
          fill
          style={{ objectFit: 'contain' }}
          className="opacity-90"
        />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff69b4]/20 to-transparent" />
      </div>
    </motion.div>
  );
}; 