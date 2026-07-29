import React, { useState } from "react";
import { soundEngine } from "../audio/soundEngine";
import confetti from "canvas-confetti";
import { Sparkles, Heart, ArrowRight } from "lucide-react";

interface Chapter3Props {
  onNext: () => void;
}

export const Chapter3Heart: React.FC<Chapter3Props> = ({ onNext }) => {
  const [power, setPower] = useState(0);
  const [shattered, setShattered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const steps = [0, 1, 5, 12, 40, 70, 99, 100];

  const handlePulseHeart = () => {
    if (shattered) return;

    // Advance power
    const currentIdx = steps.indexOf(power);
    const nextVal = currentIdx < steps.length - 1 ? steps[currentIdx + 1] : 100;
    setPower(nextVal);

    // Audio & Screen Vibration
    const speed = 1.0 + (nextVal / 100) * 0.8;
    soundEngine.playHeartbeat(speed);

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 200);

    // Small particle burst on tap
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.5 },
      colors: ["#f43f5e", "#fbbf24", "#e879f9"],
    });

    // At 100%, trigger shatter sequence!
    if (nextVal === 100) {
      setTimeout(() => {
        setShattered(true);
        soundEngine.playCrystalShatterSound();
        confetti({
          particleCount: 180,
          spread: 120,
          origin: { y: 0.5 },
          colors: ["#f43f5e", "#fbbf24", "#38bdf8", "#e879f9", "#ffffff"],
        });
      }, 300);
    }
  };

  const handleForceShatter = () => {
    setPower(100);
    setShattered(true);
    soundEngine.playCrystalShatterSound();
    confetti({
      particleCount: 180,
      spread: 120,
      origin: { y: 0.5 },
      colors: ["#f43f5e", "#fbbf24", "#38bdf8", "#e879f9", "#ffffff"],
    });
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center z-10 select-none transition-transform duration-75 ${
        isShaking ? "translate-x-1 -translate-y-1 scale-[1.005]" : "translate-x-0 translate-y-0"
      }`}
    >
      {/* Chapter Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Chapter 3 • The Heart Machine</span>
      </div>

      <div className="max-w-md w-full flex flex-col items-center">
        {/* Crystal Heart Display */}
        <div className="relative my-6 group cursor-pointer touch-none" onClick={handlePulseHeart}>
          {/* Pulsing Backlight */}
          <div
            className={`absolute -inset-8 sm:-inset-10 rounded-full blur-3xl transition-all duration-300 pointer-events-none ${
              shattered
                ? "bg-amber-400/30"
                : "bg-rose-500/20 group-hover:bg-rose-500/40"
            }`}
            style={{
              transform: `scale(${1 + power / 100})`,
            }}
          />

          {!shattered ? (
            <div className="relative flex flex-col items-center">
              <div
                className="transition-transform duration-150 py-2"
                style={{
                  transform: `scale(${1 + (power / 100) * 0.35})`,
                }}
              >
                <Heart className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 text-rose-500 fill-rose-500/80 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] animate-pulse" />
              </div>

              {/* Heart Power Meter */}
              <div className="mt-6 glass-panel px-6 py-2.5 rounded-full border border-rose-400/30 shadow-lg flex items-center gap-3">
                <span className="text-xs text-rose-200 uppercase font-semibold tracking-wider">Heartbeat Intensity</span>
                <span className="font-serif-classic text-xl font-bold text-amber-300">{power}%</span>
              </div>
              <p className="text-xs text-rose-300/80 mt-2 font-medium">
                [ Tap heart repeatedly to power the engine ]
              </p>
            </div>
          ) : (
            /* Butterflies Burst After Shatter */
            <div className="relative flex flex-col items-center animate-in zoom-in-50 duration-700">
              <div className="flex gap-4 items-center justify-center py-4">
                <span className="text-4xl animate-bounce">🦋</span>
                <span className="text-5xl animate-bounce delay-100">✨</span>
                <span className="text-4xl animate-bounce delay-200">🦋</span>
              </div>
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-400/40 space-y-4 shadow-2xl">
                <p className="font-serif-classic text-xl sm:text-2xl md:text-3xl text-amber-200 leading-relaxed italic font-light">
                  "There are some feelings impossible to measure."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Continuation Controls */}
        {shattered ? (
          <button
            onClick={onNext}
            className="mt-6 group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500/30 via-amber-500/30 to-rose-500/30 border border-amber-400/60 text-amber-100 font-semibold shadow-[0_0_25px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer min-h-[48px]"
          >
            <span>Step Through Time</span>
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : null}
      </div>
    </div>
  );
};
