export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: "song";
  sfxVolume: number;
  customSongUrl?: string;
}

export interface AppSettings {
  particleDensity: "low" | "medium" | "high";
  speedMode: boolean;
  showCursorTrail: boolean;
  reducedMotion: boolean;
}

export interface EasterEggState {
  konamiUnlocked: boolean;
  moonClicks: number;
  meteorShowerActive: boolean;
  heartsActive: boolean;
  balloonsActive: boolean;
  lanternsLitCount: number;
  discoveredStarsCount: number;
  unlockedEnvelopes: number[];
}
