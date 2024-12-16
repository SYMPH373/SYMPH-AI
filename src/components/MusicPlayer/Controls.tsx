'use client';

import { useState } from 'react';
import * as Tone from 'tone';

interface MusicPlayerProps {
  onStop: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onStop }) => {
  return (
    <button onClick={onStop} className="bg-blue-500 text-white px-4 py-2 rounded">
      Stop
    </button>
  );
};
