import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { soundEngine } from "../audio/soundEngine";
import { Sparkles, DoorClosed, Lock, Gift } from "lucide-react";

interface Chapter1Props {
  onNext: () => void;
}

export const Chapter1Door: React.FC<Chapter1Props> = ({ onNext }) => {
  const [sequenceState, setSequenceState] = useState<
    "idle" | "opening" | "presenting" | "waiting" | "dissolving"
  >("idle");
  const [hoveringDoor, setHoveringDoor] = useState(false);

  const doorOpened = sequenceState !== "idle";

  const handleOpenDoor = () => {
    if (doorOpened) return;
    soundEngine.playDoorOpenSound();
    soundEngine.playStarChime();
    setSequenceState("opening");
  };

  const handleAcceptSurprise = () => {
    setSequenceState("dissolving");
    soundEngine.playFireworkBurst();
    
    // Golden particle burst
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff"]
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  useEffect(() => {
    if (sequenceState === "opening") {
      // Wait for door to open ~70% (1.5 seconds)
      const t1 = setTimeout(() => setSequenceState("presenting"), 1500);
      return () => clearTimeout(t1);
    }
    if (sequenceState === "presenting") {
      // 3 second pause after cake is fully presented
      const t2 = setTimeout(() => setSequenceState("waiting"), 3000);
      return () => clearTimeout(t2);
    }
    if (sequenceState === "dissolving") {
      // Transition to next chapter after dissolve
      const t3 = setTimeout(() => onNext(), 2500);
      return () => clearTimeout(t3);
    }
  }, [sequenceState, onNext]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 select-none overflow-hidden">
      {/* Chapter Badge */}
      <div 
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6 transition-opacity duration-1000 ${
          doorOpened ? "opacity-0" : "opacity-100"
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Chapter 1 • The Door Nobody Opens</span>
      </div>

      <div className="max-w-3xl w-full flex flex-col items-center relative h-[600px] justify-center">
        
        {/* Interactive Magical Door Layer */}
        <div
          onClick={handleOpenDoor}
          onMouseEnter={() => setHoveringDoor(true)}
          onMouseLeave={() => setHoveringDoor(false)}
          className={`absolute inset-0 flex justify-center items-center cursor-pointer transition-all duration-700 group z-20 ${
            doorOpened ? "scale-105 pointer-events-none" : "hover:scale-102"
          }`}
        >
          {/* Ambient Glow */}
          <div
            className={`absolute w-72 h-[400px] bg-amber-500/20 rounded-3xl blur-3xl transition-opacity duration-700 ${
              hoveringDoor || doorOpened ? "opacity-100" : "opacity-40"
            }`}
          />

          {/* Door Frame */}
          <div className="relative w-72 h-[450px] bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 rounded-t-full p-3 border-2 border-amber-500/40 shadow-[0_0_50px_rgba(251,191,36,0.2)] flex flex-col items-center justify-end overflow-hidden">
            
            {/* Dark Room Inside */}
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-1000 flex flex-col items-center justify-center ${
                doorOpened ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Warm Golden Glow inside */}
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/30 via-transparent to-transparent animate-pulse opacity-60" />
            </div>

            {/* Door Panel */}
            <div
              className={`w-full h-full bg-gradient-to-b from-amber-950/90 via-amber-900/80 to-slate-900 rounded-t-full border border-amber-500/30 p-4 flex flex-col items-center justify-between transform origin-left transition-transform duration-[2000ms] ease-in-out ${
                doorOpened ? "-rotate-y-80 shadow-2xl" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1200px",
              }}
            >
              {/* Wood engravings */}
              <div className="w-full h-32 border border-amber-500/20 rounded-t-full mt-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400/60" />
              </div>

              {/* Glowing Door Knob */}
              <div className="w-full flex justify-end pr-4 mb-12">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 shadow-[0_0_15px_#fbbf24] border border-amber-200 flex items-center justify-center">
                  {!doorOpened ? (
                    <Lock className="w-3.5 h-3.5 text-slate-950" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-spin" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {!doorOpened && (
            <p className="absolute bottom-0 text-xs text-amber-300/80 font-medium mt-6 animate-pulse">
              [ Tap or click the door to open ]
            </p>
          )}
        </div>

        {/* Hand and Cake Presentation Layer (Inside Room) */}
        {(sequenceState === "presenting" || sequenceState === "waiting" || sequenceState === "dissolving") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
            
            {/* The Cake Image */}
            <div 
              className={`relative transition-all duration-[3000ms] ease-out flex flex-col items-center justify-center ${
                sequenceState === "presenting" ? "scale-90 translate-y-10 opacity-0" : 
                sequenceState === "dissolving" ? "scale-110 opacity-0 blur-md" : 
                "scale-100 translate-y-0 opacity-100"
              }`}
              ref={(el) => {
                // Force transition to trigger after mount
                if (el && sequenceState === "presenting") {
                  setTimeout(() => {
                    el.classList.remove("scale-90", "translate-y-10", "opacity-0");
                    el.classList.add("scale-100", "translate-y-0", "opacity-100");
                  }, 50);
                }
              }}
            >
              {/* Golden Dust Particles around Cake */}
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full animate-float shadow-[0_0_8px_#fbbf24]"
                    style={{
                      left: `${30 + Math.random() * 40}%`,
                      top: `${30 + Math.random() * 40}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 4}s`,
                    }}
                  />
                ))}
              </div>

              <img 
                src="./assets/cake_hand_transparent.png" 
                alt="A beautiful cake presented" 
                className="w-[450px] max-w-full relative z-10 drop-shadow-[0_0_40px_rgba(251,191,36,0.2)]" 
                style={{
                  WebkitMaskImage: sequenceState === "dissolving" ? "radial-gradient(circle, transparent 50%, black 100%)" : "none",
                  maskImage: sequenceState === "dissolving" ? "radial-gradient(circle, transparent 50%, black 100%)" : "none"
                }}
              />
              
              {/* Overlay Topper since AI images struggle with text */}
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-20 text-center w-full animate-pulse drop-shadow-[0_0_15px_#fbbf24]">
                <span className="font-serif-classic text-xl sm:text-2xl font-bold text-amber-200 text-glow-gold tracking-wider whitespace-nowrap">
                  🎉 Happy Birthday Bhuvi 🎉
                </span>
              </div>
            </div>
            
          </div>
        )}

        {/* Accept Button Layer */}
        {(sequenceState === "waiting" || sequenceState === "dissolving") && (
          <div className={`absolute bottom-4 z-40 transition-all duration-1000 ${
            sequenceState === "dissolving" ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0 animate-in fade-in slide-in-from-bottom-10"
          }`}>
            <button
              onClick={handleAcceptSurprise}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-lg shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Gift className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              <span>Accept the Surprise ✨</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
