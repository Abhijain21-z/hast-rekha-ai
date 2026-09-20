/**
 * Ambient spiritual soundscape: a soft looping ambient track
 * (public/audio/ambient.mp3) played through Web Audio with gentle
 * fade-in/out — calm by design.
 */
export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private el: HTMLAudioElement | null = null;
  private src: MediaElementAudioSourceNode | null = null;
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

    if (!this.el) {
      const el = new Audio("/audio/ambient.mp3");
      el.loop = true;
      el.preload = "auto";
      this.el = el;
      if (!this.master) {
        this.master = this.ctx.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.ctx.destination);
      }
      const master = this.master;
      const ctx = this.ctx;
      this.src = ctx.createMediaElementSource(el);
      this.src.connect(master);
    }

    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return false;

    try {
      await this.el.play();
    } catch {
      return false;
    }

    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.35, t + 2.5);
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
    window.setTimeout(() => this.el?.pause(), 1300);
  }
}
