import React, { useState } from "react";
import { soundEngine } from "../audio/soundEngine";
import { Sparkles, Clock, ArrowRight, Check } from "lucide-react";

interface Chapter4Props {
  onNext: () => void;
}

export const Chapter4Time: React.FC<Chapter4Props> = ({ onNext }) => {
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);

  const milestones = [
    {
      era: "Year -1000 • In Another Era",
      quote: "If I had met you in ancient times under a quiet moon...",
      thought: "I would still choose to know you.",
    },
    {
      era: "Year 0 • In a Distant City",
      quote: "If our paths crossed on a crowded cobblestone street...",
      thought: "I would still recognize your warmth.",
    },
    {
      era: "The Present • Across the Cosmos",
      quote: "If time asked me again to wait a hundred lifetimes...",
      thought: "I'd still wait without a second thought.",
    },
    {
      era: "Today • The Present Moment",
      quote: "Out of all the endless possibilities in the universe...",
      thought: "We exist at the exact same moment.",
    },
  ];

  const handleNextMilestone = () => {
    soundEngine.playGearClick();
    if (timelineIndex < milestones.length - 1) {
      setTimelineIndex(timelineIndex + 1);
    } else {
      setIsFrozen(true);
      soundEngine.playStarChime();
    }
  };

  const handleSelectMilestone = (idx: number) => {
    soundEngine.playGearClick();
    setTimelineIndex(idx);
    if (idx === milestones.length - 1) {
      setIsFrozen(true);
      soundEngine.playStarChime();
    }
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center z-10 select-none transition-all duration-700 ${
        isFrozen ? "grayscale-[20%] bg-slate-950/90" : ""
      }`}
    >
      {/* Chapter Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
        <Clock className={`w-3.5 h-3.5 ${!isFrozen ? "animate-spin" : ""}`} />
        <span>Chapter 4 • The Time Machine</span>
      </div>

      <div className="max-w-2xl w-full flex flex-col items-center space-y-6 sm:space-y-8">
        {/* Animated Gear Graphic */}
        <div
          onClick={handleNextMilestone}
          className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center cursor-pointer group"
          title="Click to turn clock gears"
        >
          <div
            className={`absolute inset-0 rounded-full border-4 border-dashed border-amber-500/30 transition-transform duration-1000 ${
              !isFrozen ? "animate-[spin_12s_linear_infinite] group-hover:border-amber-400" : "rotate-45"
            }`}
          />
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/50 flex items-center justify-center bg-amber-950/40 shadow-lg group-hover:scale-105 transition-all ${
              isFrozen ? "border-slate-500" : ""
            }`}
          >
            <Clock className={`w-8 h-8 sm:w-10 sm:h-10 ${isFrozen ? "text-slate-400" : "text-amber-300"}`} />
          </div>
        </div>



        {/* Milestone Card */}
        <div
          onClick={handleNextMilestone}
          className="w-full glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-4 shadow-2xl relative overflow-hidden cursor-pointer hover:border-amber-400/60 transition-all"
        >
          <div className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest flex items-center justify-center gap-2">
            <span>{milestones[timelineIndex].era}</span>
          </div>

          <p className="font-serif-classic text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
            "{milestones[timelineIndex].quote}"
          </p>

          <p className="font-serif-classic text-xl sm:text-2xl md:text-3xl text-amber-200 font-bold leading-relaxed italic text-glow-gold">
            "{milestones[timelineIndex].thought}"
          </p>
        </div>

        {/* Timeline Navigation Controls */}
        {!isFrozen ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleNextMilestone}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-100 font-semibold shadow-lg hover:bg-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-300 min-h-[48px] cursor-pointer"
            >
              <span>Turn Clock Gears ({timelineIndex + 1} / {milestones.length})</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          /* Freeze sequence at the end */
          <div className="space-y-4 animate-in fade-in duration-1000 w-full flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 max-w-md w-full">
              <p className="font-cinzel text-xl sm:text-2xl md:text-3xl text-glow-gold font-bold">
                Today matters.
              </p>
            </div>

            <button
              onClick={onNext}
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-500/40 to-amber-500/30 border border-amber-400/60 text-amber-100 font-semibold shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 min-h-[48px] cursor-pointer"
            >
              <span>Unlock the Vault (Chapter 5)</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
