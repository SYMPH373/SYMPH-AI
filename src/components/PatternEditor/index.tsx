'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PatternEditorProps {
  notes: string[];
  onPatternChange?: (pattern: string[]) => void;
}

export const PatternEditor = ({ notes, onPatternChange }: PatternEditorProps) => {
  const [pattern, setPattern] = useState<string[]>(notes);
  const [currentNote, setCurrentNote] = useState<number>(-1);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPattern(notes);
  }, [notes]);

  const handleNoteClick = (index: number) => {
    const newPattern = [...pattern];
    // Cycle through octaves (2-6)
    const currentOctave = parseInt(pattern[index].slice(-1));
    const nextOctave = currentOctave >= 6 ? 2 : currentOctave + 1;
    newPattern[index] = pattern[index].slice(0, -1) + nextOctave;
    
    setPattern(newPattern);
    onPatternChange?.(newPattern);
  };

  const handleNoteHover = (index: number) => {
    if (isEditing) {
      setCurrentNote(index);
    }
  };

  const renderPattern = () => {
    return pattern.map((note, index) => {
      const isPlaying = index === currentNote;
      const height = Math.max(2, parseInt(note.slice(-1))) * 2;

      return (
        <motion.div 
          key={index} 
          className="inline-block px-1 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => handleNoteClick(index)}
          onMouseEnter={() => handleNoteHover(index)}
        >
          <div className="flex flex-col items-center">
            <div className="text-[#00ff00] font-mono">
              {isPlaying ? '▼' : ' '}
            </div>
            <div 
              className={`w-4 ${isPlaying ? 'bg-[#00ff00]' : 'bg-[#00ff00]/50'}`}
              style={{ height: `${height}rem` }}
            />
            <div className="text-[#00ff00] font-mono mt-2">
              {note}
            </div>
          </div>
        </motion.div>
      );
    });
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
          <span className="ml-4 text-[#00ff00]">Pattern Editor</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 border border-neon-blue text-[#00ff00] hover:bg-neon-blue/10"
        >
          $ {isEditing ? 'exit_edit' : 'edit_pattern'}
        </button>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto whitespace-nowrap pb-4">
          {renderPattern()}
        </div>

        <div className="mt-4 font-mono text-[#00ff00]">
          <div className="mb-2">$ pattern_code:</div>
          <pre className="bg-[#0a0a0a] p-4 rounded">
            {`[${pattern.join(', ')}]`}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}; 