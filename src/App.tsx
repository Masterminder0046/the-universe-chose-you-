import React, { useState, useEffect } from "react";
import { AppSettings, AudioState } from "./types";
import { soundEngine } from "./audio/soundEngine";
import { AuroraBackground } from "./components/AuroraBackground";
import { CustomCursor } from "./components/CustomCursor";
import { Navbar } from "./components/Navbar";
import { MiniGamesModal } from "./components/MiniGamesModal";
import { EasterEggsHandler } from "./components/EasterEggsHandler";

import { IntroChapter } from "./chapters/IntroChapter";
import { Chapter1Door } from "./chapters/Chapter1Door";
import { Chapter2Galaxy } from "./chapters/Chapter2Galaxy";
import { Chapter3Heart } from "./chapters/Chapter3Heart";
import { Chapter4Time } from "./chapters/Chapter4Time";
import { Chapter5Vault } from "./chapters/Chapter5Vault";
import { FinalChapterUniverse } from "./chapters/FinalChapterUniverse";

export default function App() {
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [showMiniGames, setShowMiniGames] = useState<boolean>(false);

  // Easter Eggs State
  const [rainbowMode, setRainbowMode] = useState<boolean>(false);
  const [meteorActive, setMeteorActive] = useState<boolean>(false);
  const [moonClicks, setMoonClicks] = useState<number>(0);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    particleDensity: "medium",
    speedMode: false,
    showCursorTrail: true,
    reducedMotion: false,
  });

  // Audio State
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isMuted: false,
    volume: 0.5, // 50% background volume
    currentTrack: "song",
    sfxVolume: 0.8,
  });

  // Start background music at 50% volume on first user gesture
  useEffect(() => {
    const handleFirstUserGesture = () => {
      soundEngine.ensureContext();
      if (!soundEngine.getIsPlaying()) {
        const started = soundEngine.startMusicIfPaused();
        if (started) {
          setAudioState((prev) => ({ ...prev, isPlaying: true }));
        }
      }
    };

    window.addEventListener("click", handleFirstUserGesture, { once: true });
    window.addEventListener("touchstart", handleFirstUserGesture, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserGesture);
      window.removeEventListener("touchstart", handleFirstUserGesture);
    };
  }, []);

  // Scroll to top on chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentChapter]);

  const handleSelectChapter = (chapterId: number) => {
    soundEngine.playStarChime();
    setCurrentChapter(chapterId);
  };

  const handleNextChapter = () => {
    soundEngine.playStarChime();
    setCurrentChapter((prev) => Math.min(prev + 1, 6));
  };

  const handleKonamiTrigger = () => {
    setRainbowMode((prev) => !prev);
  };

  const handleMeteorTrigger = () => {
    setMeteorActive(true);
    setTimeout(() => setMeteorActive(false), 5000);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans-clean overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200">
      {/* Background Aurora Canvas */}
      <AuroraBackground
        density={settings.particleDensity}
        rainbowMode={rainbowMode}
        meteorActive={meteorActive}
      />

      {/* Interactive Cursor Trail */}
      <CustomCursor enabled={settings.showCursorTrail} />

      {/* Global Easter Eggs Event Handler */}
      <EasterEggsHandler
        onKonamiTrigger={handleKonamiTrigger}
        onMeteorTrigger={handleMeteorTrigger}
        moonClicks={moonClicks}
        setMoonClicks={setMoonClicks}
      />

      {/* Top Navbar */}
      <Navbar
        currentChapter={currentChapter}
        onSelectChapter={handleSelectChapter}
        audioState={audioState}
        setAudioState={setAudioState}
        settings={settings}
        setSettings={setSettings}
        onOpenMiniGames={() => setShowMiniGames(true)}
      />

      {/* Main Chapter Content Switcher */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center">
        {currentChapter === 0 && (
          <IntroChapter
            onStartStory={handleNextChapter}
            speedMode={settings.speedMode}
          />
        )}

        {currentChapter === 1 && (
          <Chapter1Door onNext={handleNextChapter} />
        )}

        {currentChapter === 2 && (
          <Chapter2Galaxy onNext={handleNextChapter} />
        )}

        {currentChapter === 3 && (
          <Chapter3Heart onNext={handleNextChapter} />
        )}

        {currentChapter === 4 && (
          <Chapter4Time onNext={handleNextChapter} />
        )}

        {currentChapter === 5 && (
          <Chapter5Vault onNext={handleNextChapter} />
        )}

        {currentChapter === 6 && (
          <FinalChapterUniverse
            onRestartStory={() => setCurrentChapter(0)}
          />
        )}
      </main>

      {/* Mini-Games Modal */}
      <MiniGamesModal
        isOpen={showMiniGames}
        onClose={() => setShowMiniGames(false)}
      />
    </div>
  );
}

