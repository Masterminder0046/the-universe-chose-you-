import React, { useState } from "react";
import { soundEngine } from "../audio/soundEngine";
import confetti from "canvas-confetti";
import { Sparkles, Star, Flame, X, Gift, CheckCircle2 } from "lucide-react";

interface MiniGamesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniGamesModal: React.FC<MiniGamesProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"stars" | "fountain" | "lanterns">("stars");

  // Game 1: Star Catching
  const [caughtCount, setCaughtCount] = useState(0);
  const [starPositions, setStarPositions] = useState<{ id: number; x: number; y: number }[]>(
    Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
    }))
  );
  const [starMessageUnlocked, setStarMessageUnlocked] = useState(false);

  const handleCatchStar = (id: number) => {
    soundEngine.playStarChime();
    const nextCount = caughtCount + 1;
    setCaughtCount(nextCount);

    if (nextCount >= 7 && !starMessageUnlocked) {
      setStarMessageUnlocked(true);
      soundEngine.playFireworkBurst();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    }

    // Respawn star
    setStarPositions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 } : s))
    );
  };

  // Game 2: Wish Fountain
  const [userWish, setUserWish] = useState("");
  const [wishesFlipped, setWishesFlipped] = useState<string[]>([]);
  const [fountainFlipping, setFountainFlipping] = useState(false);

  const handleFlipCoin = () => {
    if (!userWish.trim()) return;
    setFountainFlipping(true);
    soundEngine.playStarChime();

    setTimeout(() => {
      setWishesFlipped((prev) => [userWish.trim(), ...prev]);
      setUserWish("");
      setFountainFlipping(false);
      confetti({ particleCount: 50, spread: 60 });
    }, 1000);
  };

  // Game 3: Lantern Illuminator
  const [litLanterns, setLitLanterns] = useState<boolean[]>([false, false, false, false, false, false, false]);

  const handleToggleLantern = (idx: number) => {
    soundEngine.playStarChime();
    const updated = [...litLanterns];
    updated[idx] = !updated[idx];
    setLitLanterns(updated);

    if (updated.every(Boolean)) {
      soundEngine.playFireworkBurst();
      confetti({ particleCount: 100, spread: 90 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Wonders</span>
          </div>
          <h2 className="font-serif-classic text-2xl md:text-3xl font-bold text-amber-100">
            Magical Mini-Games & Wishes
          </h2>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-1.5 rounded-2xl mb-6 text-sm">
          <button
            onClick={() => setActiveTab("stars")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "stars"
                ? "bg-amber-500/30 text-amber-200 font-semibold border border-amber-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Catch Stars</span>
          </button>

          <button
            onClick={() => setActiveTab("fountain")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "fountain"
                ? "bg-amber-500/30 text-amber-200 font-semibold border border-amber-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Wish Fountain</span>
          </button>

          <button
            onClick={() => setActiveTab("lanterns")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "lanterns"
                ? "bg-amber-500/30 text-amber-200 font-semibold border border-amber-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Light Lanterns</span>
          </button>
        </div>

        {/* Tab 1: Star Catching */}
        {activeTab === "stars" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Click or tap glowing stars as they float across the sky!</span>
              <span className="font-semibold text-amber-300">Caught: {caughtCount} / 7</span>
            </div>

            <div className="relative h-60 bg-slate-950/80 rounded-2xl border border-white/10 overflow-hidden">
              {starPositions.map((star) => (
                <button
                  key={star.id}
                  onClick={() => handleCatchStar(star.id)}
                  className="absolute p-2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                  style={{ left: `${star.x}%`, top: `${star.y}%` }}
                >
                  <Star className="w-6 h-6 text-amber-300 fill-amber-400 animate-pulse drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                </button>
              ))}
            </div>

            {starMessageUnlocked && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-center animate-in fade-in">
                <Gift className="w-6 h-6 mx-auto mb-1 text-amber-300" />
                <div className="font-serif-classic text-lg font-bold">Secret Message Unlocked!</div>
                <p className="text-xs text-slate-300 mt-1">
                  "Every star you caught is a reminder that the world is brighter because you are in it."
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wish Fountain */}
        {activeTab === "fountain" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 text-center">
              Write a secret wish for Bhuvi or for the year ahead and toss a golden coin into the fountain.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a wish..."
                value={userWish}
                onChange={(e) => setUserWish(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFlipCoin()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/20 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleFlipCoin}
                disabled={fountainFlipping || !userWish.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-slate-950 text-sm disabled:opacity-50 hover:brightness-110 transition-all flex items-center gap-1.5"
              >
                <span>Toss Coin</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {/* Wishes Display */}
            <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
              {wishesFlipped.map((w, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl glass-panel text-xs text-amber-200 border border-amber-500/20 flex items-center justify-between"
                >
                  <span>"{w}"</span>
                  <span className="text-[10px] text-amber-400/70 font-semibold">Wish Cast ✨</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Lanterns */}
        {activeTab === "lanterns" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 text-center">
              Tap each lantern to ignite its flame and illuminate the sky for Bhuvi!
            </p>

            <div className="grid grid-cols-7 gap-2 py-4">
              {litLanterns.map((isLit, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleLantern(idx)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                    isLit
                      ? "bg-amber-500/20 border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.4)] text-amber-300 scale-105"
                      : "bg-slate-900/60 border-white/10 text-slate-600 hover:text-slate-400"
                  }`}
                >
                  <Flame className={`w-8 h-8 ${isLit ? "text-amber-400 fill-amber-400 animate-pulse" : ""}`} />
                  <span className="text-[10px] font-semibold mt-1">#{idx + 1}</span>
                </button>
              ))}
            </div>

            {litLanterns.every(Boolean) && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 text-center text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All 7 Lanterns Lit! The sky is overflowing with warmth and blessings!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
