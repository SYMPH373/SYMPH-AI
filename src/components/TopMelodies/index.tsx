'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaHeart } from 'react-icons/fa';

interface Melody {
  signature: string;
  plays: number;
  likes: number;
  timestamp: string;
}

export const TopMelodies = ({ onSelect }: { onSelect: (signature: string) => void }) => {
  const [melodies, setMelodies] = useState<Melody[]>([
    // Placeholder data - will be replaced with real data
    {
      signature: '4ryh8y1iV7qdbAH31R88wojgH2REjrjU54eKNjzaAZ1BtbvD6nxUt781ZgQegjDNRVK92UupVhJEHZn3pr',
      plays: 420,
      likes: 69,
      timestamp: '2024-01-15'
    },
    // Add more placeholder melodies...
  ]);

  const [sortBy, setSortBy] = useState<'plays' | 'likes'>('plays');

  const handlePlay = (signature: string) => {
    onSelect(signature);
    // Update plays count
    setMelodies(prev => 
      prev.map(m => 
        m.signature === signature 
          ? { ...m, plays: m.plays + 1 }
          : m
      )
    );
  };

  const handleLike = (signature: string) => {
    setMelodies(prev => 
      prev.map(m => 
        m.signature === signature 
          ? { ...m, likes: m.likes + 1 }
          : m
      )
    );
  };

  return (
    <motion.div 
      className="terminal-window w-full max-w-3xl mx-auto mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-neon-blue/20">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-[#00ff00]">Top Melodies</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setSortBy('plays')}
            className={`px-4 py-2 border ${
              sortBy === 'plays' ? 'border-[#00ff00]' : 'border-neon-blue'
            } text-[#00ff00] hover:bg-neon-blue/10`}
          >
            $ sort_by_plays
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-4 py-2 border ${
              sortBy === 'likes' ? 'border-[#00ff00]' : 'border-neon-blue'
            } text-[#00ff00] hover:bg-neon-blue/10`}
          >
            $ sort_by_likes
          </button>
        </div>
      </div>

      <div className="p-4">
        {melodies
          .sort((a, b) => b[sortBy] - a[sortBy])
          .map((melody, index) => (
            <motion.div
              key={melody.signature}
              className="flex items-center justify-between p-4 border border-neon-blue/20 mb-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-[#00ff00]">#{index + 1}</span>
                <span className="text-[#00ff00] font-mono">
                  {melody.signature.slice(0, 8)}...{melody.signature.slice(-8)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-[#00ff00]">{melody.plays} plays</span>
                <span className="text-[#00ff00]">{melody.likes} likes</span>
                
                <button
                  onClick={() => handlePlay(melody.signature)}
                  className="p-2 border border-neon-blue text-[#00ff00] hover:bg-neon-blue/10"
                >
                  <FaPlay />
                </button>
                
                <button
                  onClick={() => handleLike(melody.signature)}
                  className="p-2 border border-neon-blue text-[#00ff00] hover:bg-neon-blue/10"
                >
                  <FaHeart />
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}; 