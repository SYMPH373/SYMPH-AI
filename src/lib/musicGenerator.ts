export class MusicGenerator {
  private audioContext: AudioContext;
  private gainNode: GainNode;
  // ... other properties

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = 0.5; // Default volume
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  // When creating oscillators, connect through gain node
  private createOscillator(frequency: number, startTime: number, duration: number) {
    const oscillator = this.audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.connect(this.gainNode); // Connect to gain node instead of destination
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  // ... rest of the class implementation
} 