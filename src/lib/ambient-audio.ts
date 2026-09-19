/**
 * Ambient spiritual soundscape: loops the user's own "om sound" recording
 * through the Web Audio API with a soft fade-in/out and gentle low-pass
 * warmth so it sits quietly behind the site.
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
      this.el = new Audio("/audio/om.mp3");
      this.el.loop = true;
      this.el.preload = "auto";
      this.el.crossOrigin = "anonymous";
    }
    if (!this.src) {
      this.src = this.ctx.createMediaElementSource(this.el);
      const warm = this.ctx.createBiquadFilter();
      warm.type = "lowpass";
      warm.frequency.value = 4200;
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.src.connect(warm);
      warm.connect(this.master);
      this.master.connect(this.ctx.destination);
    }

    try {
      await this.el.play();
    } catch {
      return false;
    }
    const t = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(t);
    this.master!.gain.setValueAtTime(this.master!.gain.value, t);
    this.master!.gain.linearRampToValueAtTime(0.35, t + 2);
    this.running = true;
    return true;
  }

  async stop() {
    if (!this.ctx || !this.master || !this.el) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 1.2);
    window.setTimeout(() => {
      this.el?.pause();
    }, 1300);
    this.running = false;
  }
}
