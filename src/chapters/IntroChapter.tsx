import React, { useState, useEffect } from "react";
import { soundEngine } from "../audio/soundEngine";
import { RECIPIENT_CONFIG } from "../config";
import { Sparkles, ArrowRight } from "lucide-react";

interface IntroProps {
  onStartStory: () => void;
  speedMode?: boolean;
}

export const IntroChapter: React.FC<IntroProps> = ({ onStartStory, speedMode = false }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (speedMode) {
      setStep(3);
      return;
    }

    const t1 = setTimeout(() => setStep(1), 2200);
    const t2 = setTimeout(() => setStep(2), 5000);
    const t3 = setTimeout(() => setStep(3), 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [speedMode]);

  const handleOpenStory = () => {
    soundEngine.playStarChime();
    soundEngine.togglePlay();
    onStartStory();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 select-none">
      {/* Glow orb background */}
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Step 0 */}
        {step >= 0 && (
          <div
            className={`transition-all duration-1000 transform ${
              step >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-serif-classic text-2xl md:text-4xl text-slate-300 font-light tracking-wide italic">
              "I found something hidden..."
            </p>
          </div>
        )}

        {/* Step 1 */}
        {step >= 1 && (
          <div
            className={`transition-all duration-1000 delay-300 transform ${
              step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-serif-classic text-2xl md:text-4xl text-amber-200/90 font-light tracking-wide">
              "It belongs to someone special."
            </p>
          </div>
        )}

        {/* Step 2 */}
        {step >= 2 && (
          <div
            className={`transition-all duration-1000 delay-300 transform ${
              step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-cinzel text-3xl md:text-5xl text-glow-gold text-amber-300 font-bold tracking-wider my-4">
              If your name is {RECIPIENT_CONFIG.name}...
            </p>
          </div>
        )}

        {/* Step 3 */}
        {step >= 3 && (
          <div
            className={`transition-all duration-1000 delay-500 transform ${
              step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-serif-classic text-xl md:text-2xl text-slate-400 italic mb-8">
              "Continue only if your heart is ready."
            </p>

            <button
              onClick={handleOpenStory}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-600/20 border border-amber-400/60 text-amber-100 font-semibold text-lg shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Open Story</span>
              <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
