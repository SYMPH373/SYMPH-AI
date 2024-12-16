export const SCALES = {
  major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  minor: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  pentatonic: ['C', 'D', 'E', 'G', 'A']
};

export const OCTAVES = [2, 3, 4, 5];

export const generateScale = (scale: string[], octave: number) => {
  return scale.map(note => `${note}${octave}`);
};
