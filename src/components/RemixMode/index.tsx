'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MusicGenerator } from '@/lib/music';

const musicGenerator = new MusicGenerator();

interface Track {
  signature: string;
  volume: number;
  effects: {
    reverb: number;
    delay: number;
    tempo: number;
  };
  isPlaying: boolean;
}

export const RemixMode = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isRemixing, setIsRemixing] = useState(false);

  const addTrack = async (signature: string) => {
    const newTrack = {
      signature,
      volume: 0.8,
      effects: {
        reverb: 0.3,
        delay: 0.2,
        tempo: 1.0
      },
      isPlaying: false
    };

    setTracks(prev => [...prev, newTrack]);
    await musicGenerator.createTrack(signature, newTrack.effects);
  };

  const updateTrackVolume = (index: number, volume: number) => {
    const track = tracks[index];
    musicGenerator.setTrackVolume(track.signature, volume);
    
    setTracks(prev => prev.map((t, i) => 
      i === index ? { ...t, volume } : t
    ));
  };

  const updateTrackEffects = async (index: number, effects: Partial<Track['effects']>) => {
    const track = tracks[index];
    const newEffects = { ...track.effects, ...effects };
    
    setTracks(prev => prev.map((t, i) => 
      i === index ? { ...t, effects: newEffects } : t
    ));

    await musicGenerator.createTrack(track.signature, newEffects);
  };

  const toggleRemix = async () => {
    setIsRemixing(!isRemixing);
    if (!isRemixing) {
      // Start playing all tracks
      for (const track of tracks) {
        const notes = musicGenerator.hashToNotes(track.signature);
        await musicGenerator.playTrack(track.signature, notes, track.effects.tempo);
      }
    }
  };

  return (
    <motion.div
      className="terminal-window w-full max-w-3xl mx-auto mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center p-4 border-b border-neon-blue/20">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-[#00ff00]">Remix Console</span>
      </div>

      <div className="p-4 space-y-4">
        {tracks.map((track, index) => (
          <div key={index} className="flex items-center space-x-4 p-2 border border-neon-blue/20">
            <span className="text-[#00ff00]">$ track_{index}</span>
            
            <div className="flex items-center space-x-2">
              <span className="text-[#00ff00]">vol:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={track.volume}
                onChange={(e) => updateTrackVolume(index, parseFloat(e.target.value))}
                className="accent-[#00ff00]"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-[#00ff00]">rev:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={track.effects.reverb}
                  onChange={(e) => updateTrackEffects(index, { 
                    reverb: parseFloat(e.target.value) 
                  })}
                  className="accent-[#00ff00]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-[#00ff00]">tmp:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={track.effects.tempo}
                  onChange={(e) => updateTrackEffects(index, { 
                    tempo: parseFloat(e.target.value) 
                  })}
                  className="accent-[#00ff00]"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => addTrack('new_signature')}
          className="px-4 py-2 border border-neon-blue text-[#00ff00] hover:bg-neon-blue/10"
        >
          $ add_track
        </button>

        <div className="flex justify-end space-x-4">
          <button
            onClick={toggleRemix}
            className="px-4 py-2 border border-neon-blue text-[#00ff00] hover:bg-neon-blue/10"
          >
            $ {isRemixing ? 'stop_remix' : 'start_remix'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 