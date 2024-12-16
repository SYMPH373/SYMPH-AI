interface TrackNodes {
  gain: GainNode;
  delay: DelayNode;
  reverb: ConvolverNode;
}

export class MusicGenerator {
  private audioContext: AudioContext | null = null;
  private tracks: Map<string, TrackNodes> = new Map();

  private notes = {
    TRANSFER: ['C4', 'E4', 'G4', 'C5'],
    SWAP: ['D4', 'F4', 'A4', 'D5'],
    MINT: ['E4', 'G4', 'B4', 'E5'],
    BURN: ['G4', 'B4', 'D5', 'G5'],
    NFT: ['A4', 'C5', 'E5', 'A5'],
    DEFI: ['F4', 'A4', 'C5', 'F5']
  };

  hashToNotes(hash: string, type: string): string[] {
    const baseNotes = this.notes[type as keyof typeof this.notes] || this.notes.TRANSFER;
    const melody: string[] = [];
    
    for (let i = 0; i < hash.length; i += 2) {
      const byte = parseInt(hash.slice(i, i + 2), 16);
      const noteIndex = byte % baseNotes.length;
      melody.push(baseNotes[noteIndex]);
    }
    
    return melody;
  }

  private noteToFrequency(note: string): number {
    const noteMap: { [key: string]: number } = {
      'C4': 261.63,
      'D4': 293.66,
      'E4': 329.63,
      'F4': 349.23,
      'G4': 392.00,
      'A4': 440.00,
      'B4': 493.88,
      'C5': 523.25
    };
    return noteMap[note] || 440;
  }

  private initAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  async playTrack(signature: string, notes: string[], tempo: number): Promise<void> {
    const ctx = this.initAudioContext();
    const nodes = this.tracks.get(signature);
    if (!nodes) return;

    const { gain: gainNode } = nodes;
    
    for (const note of notes) {
      const oscillators = [
        ctx.createOscillator(),
        ctx.createOscillator(),
        ctx.createOscillator(),
        ctx.createOscillator()
      ];
      
      oscillators.forEach((osc, i) => {
        osc.type = 'sine';
        const freq = this.noteToFrequency(note);
        osc.frequency.value = freq * (i === 0 ? 1 : i === 1 ? 2 : i === 2 ? 1.5 : 1.25);
        
        const oscGain = ctx.createGain();
        oscGain.gain.value = i === 0 ? 0.5 : 0.15;
        
        osc.connect(oscGain);
        oscGain.connect(gainNode);
      });
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      
      oscillators.forEach(osc => {
        osc.start();
        osc.stop(ctx.currentTime + 2);
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000 / tempo));
    }
  }

  async playSequence(notes: string[]): Promise<void> {
    const ctx = this.initAudioContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    
    for (const note of notes) {
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = this.noteToFrequency(note);
      
      oscillator.connect(gainNode);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
} 