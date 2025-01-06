import { DNASequence, Mutation } from '../blockchain/TransactionDNA';

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

  async playDNASequence(dna: DNASequence) {
    const baseNotes = this.patternToNotes(dna.pattern);
    let finalNotes = [...baseNotes];

    // Apply mutations
    dna.mutations.forEach(mutation => {
      switch (mutation.type) {
        case 'amplify':
          finalNotes = this.amplifyNotes(finalNotes, mutation);
          break;
        case 'cascade':
          finalNotes = this.cascadeNotes(finalNotes, mutation);
          break;
        // ... other mutations
      }
    });

    // Adjust playback based on DNA properties
    const tempo = 80 + (dna.energy * 60);
    const volume = 0.5 + (dna.rarity * 0.5);

    // Create unique effects based on DNA
    const effects = {
      reverb: dna.energy * 0.5,
      delay: dna.rarity * 0.3,
      distortion: Math.max(0, dna.energy - 0.7)
    };

    await this.playSequenceWithEffects(finalNotes, tempo, volume, effects);
  }

  private patternToNotes(pattern: number[]): number[] {
    const baseFreq = 220; // A3
    return pattern.map(n => baseFreq * Math.pow(2, n / 12));
  }

  private amplifyNotes(notes: number[], mutation: Mutation): number[] {
    return notes.map((note, i) => 
      i === mutation.position ? note * (1 + mutation.intensity) : note
    );
  }

  private cascadeNotes(notes: number[], mutation: Mutation): number[] {
    return notes.map((note, i) => 
      note * (1 + (mutation.intensity * (i / notes.length)))
    );
  }

  private async playSequenceWithEffects(notes: number[], tempo: number, volume: number, effects: { reverb: number; delay: number; distortion: number }) {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(this.audioContext.destination);

    const duration = 0.2 / tempo;
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.value = freq;
      oscillator.connect(gainNode);
      oscillator.start(i * duration);
      oscillator.stop((i + 1) * duration);
    });
  }
} 