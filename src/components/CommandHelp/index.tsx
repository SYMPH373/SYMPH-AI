'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 px-4 py-2 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors duration-300"
      >
        $ help
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="terminal-window w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center p-2 border-b border-[var(--primary)]/20">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-[var(--primary)]">Available Commands</span>
              </div>

              <div className="p-6 space-y-4 font-mono">
                <div>
                  <div className="text-[var(--primary)]">$ visualizers</div>
                  <div className="pl-4 text-[var(--secondary)]/80">
                    wave_2d    - 2D wave visualization
                    wave_3d    - 3D wave visualization
                    circular   - Circular orbit visualization
                    matrix     - Matrix rain visualization
                    frequency  - Frequency spectrum visualization
                  </div>
                </div>

                <div>
                  <div className="text-[var(--primary)]">$ commands</div>
                  <div className="pl-4 text-[var(--secondary)]/80">
                    play      - Play current transaction melody
                    share     - Share current melody
                    copy      - Copy share link
                    help      - Show this help menu
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors duration-300"
                >
                  $ close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 