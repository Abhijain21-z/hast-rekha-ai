/**
 * Ambient spiritual soundscape: a gentle low-volume synth drone (om-like
 * tanpura warmth) built from Web Audio oscillators — no external file,
 * calm by design.
 */
export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  running = false;

  get supported() {
    return typeof window !== "undefined" && ("AudioContext" in window || "webkitAudioContext" in window);
  }

  async start() {
    if (!this.supported) return false;
    if (!this.ctx) {
      const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
      this.ctx = new AC();
    }
    try {
      await this.ctx.resume();
    } catch {
      return false;
    }
    if (this.ctx.state !== "running") return false;

    if (!this.master) {
      const ctx = this.ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0;

      // warm lowpass so nothing harsh escapes
      const warm = ctx.createBiquadFilter();
      warm.type = "lowpass";
      warm.frequency.value = 1400;
      warm.Q.value = 0.4;
      this.master.connect(warm);
      warm.connect(ctx.destination);

      // om-like drone: 136.1 Hz (om tuning) + octave + fifth, gently detuned
      const freqs: [number, OscillatorType, number][] = [
        [136.1, "sine", 0.5],
        [136.5, "sine", 0.35],
        [272.2, "sine", 0.22],
        [204.15, "triangle", 0.12],
        [68.05, "sine", 0.4],
      ];
      this.oscs = freqs.map(([f, type, g]) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        const gain = ctx.createGain();
        gain.gain.value = g;
        o.connect(gain);
        gain.connect(this.master!);
        o.start();
        return o;
      });

      // slow breathing LFO on the drone volume
      this.lfo = ctx.createOscillator();
      this.lfo.frequency.value = 0.08; // ~12s cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.06;
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.master.gain);
      this.lfo.start();
    }

    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0.12, t + 2.5);
    this.running = true;
    return true;
  }

  async stop() {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 1.2);
    this.running = false;
  }
}
