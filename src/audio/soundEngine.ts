/**
 * Web Audio Procedural Sound Engine
 * Generates rich ambient music, pads, chimes, heartbeats, and sound effects locally.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.5; // 50% background volume
  private sfxVolume: number = 0.8;
  private currentTrack: "song" = "song";
  private bgSongElement: HTMLAudioElement | null = null;
  private songUrl: string = "/Bae Don Tamil 320 Kbps.mp3";
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setCustomSongUrl(url: string) {
    if (url) {
      this.songUrl = url;
      if (this.bgSongElement) {
        this.bgSongElement.src = url;
        if (this.isPlaying) {
          this.bgSongElement.play().catch(() => {});
        }
      }
    }
  }

  public getCustomSongUrl(): string {
    return this.songUrl;
  }

  public startMusicIfPaused(): boolean {
    this.ensureContext();
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startAmbientMusic();
      return true;
    }
    return this.isPlaying;
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public async ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  public togglePlay(): boolean {
    this.ensureContext();
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
    return this.isPlaying;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.1);
    }
    if (this.bgSongElement) {
      this.bgSongElement.muted = muted;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
    if (this.bgSongElement) {
      this.bgSongElement.volume = this.volume;
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.1);
    }
  }

  public setTrack(track: "song") {
    this.currentTrack = track;
    if (this.isPlaying) {
      this.stopAmbientMusic();
      this.startAmbientMusic();
    }
  }

  private startAmbientMusic() {
    this.stopAmbientMusic();
    this.playBackgroundSong();
  }

  private playBackgroundSong() {
    if (!this.bgSongElement) {
      this.bgSongElement = new Audio(this.songUrl);
      this.bgSongElement.loop = true;
      this.bgSongElement.crossOrigin = "anonymous";
    }
    this.bgSongElement.volume = this.volume;
    this.bgSongElement.muted = this.isMuted;
    this.bgSongElement.play().catch((err) => {
      console.warn("Background audio play interrupted or restricted:", err);
    });
  }

  private stopAmbientMusic() {
    if (this.bgSongElement) {
      this.bgSongElement.pause();
    }
  }

  public playStarChime() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const note = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(note, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  public playHeartbeat(speedMultiplier = 1.0) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(60 * speedMultiplier, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    gain1.gain.setValueAtTime(0.6, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc1.connect(gain1);
    gain1.connect(this.sfxGain);

    osc1.start(now);
    osc1.stop(now + 0.15);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(50 * speedMultiplier, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(25, now + 0.28);

    gain2.gain.setValueAtTime(0.4, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc2.connect(gain2);
    gain2.connect(this.sfxGain);

    osc2.start(now + 0.15);
    osc2.stop(now + 0.3);
  }

  public playDoorOpenSound() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 1.8);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  public playCrystalShatterSound() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200 + Math.random() * 2000, now + i * 0.05);

      gain.gain.setValueAtTime(0.3, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.6);
    }
  }

  public playPaperSound() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playFireworkBurst() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = "sine";
    boomOsc.frequency.setValueAtTime(150, now);
    boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    boomGain.gain.setValueAtTime(0.5, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);

    boomOsc.start(now);
    boomOsc.stop(now + 0.5);

    for (let i = 0; i < 8; i++) {
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      const delay = 0.1 + Math.random() * 0.3;
      chime.type = "sine";
      chime.frequency.value = 1500 + Math.random() * 2500;

      chimeGain.gain.setValueAtTime(0.2, now + delay);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);

      chime.connect(chimeGain);
      chimeGain.connect(this.sfxGain);

      chime.start(now + delay);
      chime.stop(now + delay + 0.15);
    }
  }

  public playGearClick() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(300, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  public playCameraClick() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Click 1 (Shutter open)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "square";
    osc1.frequency.setValueAtTime(300, now);
    osc1.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(now);
    osc1.stop(now + 0.05);

    // Click 2 (Shutter close)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(150, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(50, now + 0.12);
    gain2.gain.setValueAtTime(0.3, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.12);
  }

  public playCameraFlash() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    
    // High-pitched capacitor whine
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(4000, now);
    osc.frequency.linearRampToValueAtTime(6000, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.8);

    // Flash pop
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = "sawtooth";
    popOsc.frequency.setValueAtTime(800, now);
    popOsc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    popGain.gain.setValueAtTime(0.4, now);
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    popOsc.connect(popGain);
    popGain.connect(this.sfxGain);
    popOsc.start(now);
    popOsc.stop(now + 0.1);
  }
}

export const soundEngine = new SoundEngine();
