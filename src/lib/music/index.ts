export interface IMusicGenerator {
  audioContext: AudioContext;
  playTrack(signature: string, notes: number[], tempo: number): Promise<void>;
  setTrackVolume(signature: string, volume: number): void;
  createTrack(signature: string, effects: { reverb: number; delay: number; tempo: number }): Promise<void>;
  setVolume(volume: number): void;
  hashToNotes(hash: string): number[];
  playSequence(notes: number[]): Promise<void>;
}

export class MusicGenerator implements IMusicGenerator {
  audioContext: AudioContext;
  private tracks: Map<string, GainNode>;

  constructor() {
    this.audioContext = new AudioContext();
    this.tracks = new Map();
  }

  hashToNotes(hash: string): number[] {
    return hash.split('').map(char => 
      220 * Math.pow(2, parseInt(char, 16) / 12)
    );
  }

  async playSequence(notes: number[]): Promise<void> {
    const duration = 0.2;
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.value = freq;
      oscillator.connect(this.audioContext.destination);
      oscillator.start(i * duration);
      oscillator.stop((i + 1) * duration);
    });
  }

  setVolume(volume: number): void {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(this.audioContext.destination);
  }

  setTrackVolume(signature: string, volume: number): void {
    const track = this.tracks.get(signature);
    if (track) {
      track.gain.value = volume;
    }
  }

  async createTrack(signature: string, effects: { reverb: number; delay: number; tempo: number }): Promise<void> {
    const notes = this.hashToNotes(signature);
    // Apply effects and create track
    // Implementation details here
  }

  async playTrack(signature: string, notes: number[], tempo: number): Promise<void> {
    const duration = 0.2 / tempo;
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.value = freq;
      oscillator.connect(this.audioContext.destination);
      oscillator.start(i * duration);
      oscillator.stop((i + 1) * duration);
    });
  }
} 