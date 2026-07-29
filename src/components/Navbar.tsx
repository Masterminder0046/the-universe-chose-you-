import React, { useState } from "react";

import { soundEngine } from "../audio/soundEngine";
import { CHAPTER_LIST, RECIPIENT_CONFIG } from "../config";
import { AppSettings, AudioState } from "../types";
import {
  Volume2,
  VolumeX,
  Music,
  CloudRain,
  Compass,
  Settings,
  Sparkles,
  ChevronRight,
  Maximize2,
} from "lucide-react";

interface NavbarProps {
  currentChapter: number;
  onSelectChapter: (id: number) => void;
  audioState: AudioState;
  setAudioState: React.Dispatch<React.SetStateAction<AudioState>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onOpenMiniGames: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentChapter,
  onSelectChapter,
  audioState,
  setAudioState,
  settings,
  setSettings,
  onOpenMiniGames,
}) => {
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  const handleTogglePlay = () => {
    const playing = soundEngine.togglePlay();
    setAudioState((prev) => ({ ...prev, isPlaying: playing }));
  };

  const handleToggleMute = () => {
    const nextMuted = !audioState.isMuted;
    soundEngine.setMute(nextMuted);
    setAudioState((prev) => ({ ...prev, isMuted: nextMuted }));
  };

  const handleVolumeChange = (val: number) => {
    soundEngine.setVolume(val);
    setAudioState((prev) => ({ ...prev, volume: val }));
  };



  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <>
      {/* Top Navbar Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between pointer-events-none">
        {/* Left: Branding & Chapter Title */}
        <div className="pointer-events-auto flex items-center gap-3 glass-panel px-3.5 py-1.5 rounded-full border border-amber-500/20 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
            <span className="font-serif-classic text-amber-200 font-semibold tracking-wide text-sm hidden sm:inline">
              {RECIPIENT_CONFIG.tagline}
            </span>
            <span className="text-slate-500 text-xs hidden sm:inline">•</span>
            <button
              onClick={() => setShowChapterMenu(!showChapterMenu)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-amber-300 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{CHAPTER_LIST[currentChapter]?.label}</span>
              <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${showChapterMenu ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>

        {/* Right Controls: Audio, MiniGames, Settings */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Mini Games Button */}
          <button
            onClick={onOpenMiniGames}
            className="glass-panel px-3 py-1.5 rounded-full text-xs font-medium text-amber-200 hover:text-amber-100 hover:border-amber-400/40 transition-all flex items-center gap-1.5 shadow-lg group"
            title="Open Magical Wonders & Wishes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">Wonders & Games</span>
          </button>

          {/* Audio Track Selector & Play */}
          <div className="relative glass-panel rounded-full p-1 flex items-center gap-1 border border-white/10 shadow-lg">
            <button
              onClick={handleTogglePlay}
              className={`p-1.5 rounded-full transition-all ${
                audioState.isPlaying
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title={audioState.isPlaying ? "Pause Music" : "Play Music"}
            >
              <Music className={`w-4 h-4 ${audioState.isPlaying ? "animate-bounce" : ""}`} />
            </button>


            {/* Mute/Volume Popup */}
            <div className="relative">
              <button
                onClick={() => setShowVolumePopup(!showVolumePopup)}
                onMouseEnter={() => setShowVolumePopup(true)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
                title={audioState.isMuted ? "Unmute" : "Mute/Volume"}
              >
                {audioState.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Volume Slider Popup */}
              {showVolumePopup && (
                <div
                  onMouseLeave={() => setShowVolumePopup(false)}
                  className="absolute right-0 top-full mt-2 p-3 glass-panel rounded-xl shadow-xl flex flex-col gap-2 min-w-[150px] z-50 border border-white/10 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span>Music Volume</span>
                    <span className="text-amber-300">{Math.round(audioState.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioState.volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pt-1.5 border-t border-white/10 flex items-center justify-center">
                    <button
                      onClick={handleToggleMute}
                      className="text-[10px] text-amber-300 hover:underline capitalize"
                    >
                      {audioState.isMuted ? "Unmute" : "Mute"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="glass-panel p-2 rounded-full text-slate-400 hover:text-slate-200 transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="glass-panel p-2 rounded-full text-slate-400 hover:text-amber-300 transition-colors"
            title="Settings & Controls"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chapter Dropdown Drawer */}
      {showChapterMenu && (
        <div
          onClick={() => setShowChapterMenu(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-start p-4 pt-16"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel p-5 rounded-2xl max-w-sm w-full shadow-2xl border border-amber-500/30 animate-in fade-in slide-in-from-top-4 duration-200"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="font-serif-classic text-amber-200 text-lg font-semibold">Story Chapters</h3>
              <span className="text-xs text-slate-400">{currentChapter} / {CHAPTER_LIST.length - 1} Completed</span>
            </div>
            <div className="flex flex-col gap-2">
              {CHAPTER_LIST.map((chap) => {
                const isActive = currentChapter === chap.id;
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      onSelectChapter(chap.id);
                      setShowChapterMenu(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-amber-500/20 border border-amber-400/40 text-amber-200 font-medium"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isActive ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {chap.id}
                      </span>
                      <div>
                        <div className="text-xs text-slate-400">{chap.title}</div>
                        <div className="text-sm font-serif-classic">{chap.label}</div>
                      </div>
                    </div>
                    {isActive && <span className="text-amber-400 text-xs font-semibold">Current</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal Drawer */}
      {showSettingsMenu && (
        <div
          onClick={() => setShowSettingsMenu(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-end p-4 pt-16"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel p-5 rounded-2xl max-w-sm w-full shadow-2xl border border-amber-500/30 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-serif-classic text-amber-200 text-lg font-semibold">Preferences</h3>
              <button
                onClick={() => setShowSettingsMenu(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
              >
                Done
              </button>
            </div>

            {/* Particle Density */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Particle Density</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-lg text-xs">
                {(["low", "medium", "high"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSettings((prev) => ({ ...prev, particleDensity: d }))}
                    className={`py-1 rounded capitalize transition-all ${
                      settings.particleDensity === d
                        ? "bg-amber-500/30 text-amber-200 font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Mode Toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-300">Fast Animations Mode</span>
              <button
                onClick={() => setSettings((prev) => ({ ...prev, speedMode: !prev.speedMode }))}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  settings.speedMode ? "bg-amber-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.speedMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Cursor Trail Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Stardust Cursor Trail</span>
              <button
                onClick={() => setSettings((prev) => ({ ...prev, showCursorTrail: !prev.showCursorTrail }))}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  settings.showCursorTrail ? "bg-amber-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.showCursorTrail ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Easter Egg Hints */}
            <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-amber-300/90 mb-1">✨ Hidden Easter Keys</div>
              <div>• Press <kbd className="px-1 bg-white/10 rounded text-amber-200">H</kbd> for Floating Hearts</div>
              <div>• Press <kbd className="px-1 bg-white/10 rounded text-amber-200">B</kbd> for Birthday Balloons</div>
              <div>• Click Moon 5 times for Meteor Shower</div>
              <div>• Konami Code unlocks Rainbow Cosmos</div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
