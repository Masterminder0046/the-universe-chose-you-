import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { GALAXY_STARS, StarMessage } from "../config";
import { soundEngine } from "../audio/soundEngine";
import { Sparkles, Star, ArrowRight, Compass, X, Check, Send, Wand2 } from "lucide-react";

interface Chapter2Props {
  onNext: () => void;
}

interface FloatingWish {
  id: string;
  text: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  targetStarTitle?: string;
}

// Custom Typewriter Component
const TypewriterText: React.FC<{ text: string; onComplete?: () => void; speed?: number }> = ({ text, onComplete, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className="relative inline-block">
      {displayedText}
      <span className="animate-pulse text-amber-300">_</span>
    </span>
  );
};

export const Chapter2Galaxy: React.FC<Chapter2Props> = ({ onNext }) => {
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([]);
  const [activeStar, setActiveStar] = useState<StarMessage | null>(null);

  // Legendary Event State
  const [legendaryState, setLegendaryState] = useState<"idle" | "typing" | "butterfly">("idle");
  const continueBtnRef = useRef<HTMLButtonElement>(null);
  const butterflyRef = useRef<HTMLDivElement>(null);

  // Wish Fountain state
  const [showWishFountain, setShowWishFountain] = useState(false);
  const [activeOrigin, setActiveOrigin] = useState<{
    name: string;
    x: number;
    y: number;
    targetX?: number;
    targetY?: number;
    starTitle?: string;
  }>({
    name: "Celestial Wish Fountain",
    x: 50,
    y: 90,
  });

  const [wishInput, setWishInput] = useState("");
  const [floatingWishes, setFloatingWishes] = useState<FloatingWish[]>([]);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const animatedWishIdsRef = useRef<Set<string>>(new Set());

  const handleStarClick = (star: StarMessage) => {
    soundEngine.playStarChime();
    setActiveStar(star);
    if (!discoveredIds.includes(star.id)) {
      setDiscoveredIds((prev) => [...prev, star.id]);
    }
  };

  const handleLegendaryClick = () => {
    soundEngine.playFireworkBurst();
    setLegendaryState("typing");
    
    // Golden particles gather
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff"]
    });
  };

  const handleLegendaryTypingComplete = () => {
    // Wait a moment then transform to butterfly
    setTimeout(() => {
      setLegendaryState("butterfly");
    }, 2000);
  };

  // Animate Butterfly to Continue Button
  useEffect(() => {
    if (legendaryState === "butterfly" && butterflyRef.current && continueBtnRef.current) {
      const butterflyRect = butterflyRef.current.getBoundingClientRect();
      const btnRect = continueBtnRef.current.getBoundingClientRect();
      
      const deltaX = btnRect.left + btnRect.width / 2 - (butterflyRect.left + butterflyRect.width / 2);
      const deltaY = btnRect.top + btnRect.height / 2 - (butterflyRect.top + butterflyRect.height / 2);

      gsap.to(butterflyRef.current, {
        x: deltaX,
        y: deltaY,
        scale: 0.5,
        opacity: 0,
        duration: 2.5,
        ease: "power2.inOut",
        onComplete: () => {
          onNext(); // Auto-advance once it reaches the button
        }
      });
    }
  }, [legendaryState, onNext]);

  const handleOpenFountainForStar = (star: StarMessage) => {
    setActiveStar(null);
    soundEngine.playStarChime();
    setActiveOrigin({
      name: `Star: ${star.title}`,
      x: 50,
      y: 90,
      targetX: star.x,
      targetY: star.y,
      starTitle: star.title,
    });
    setShowWishFountain(true);
  };

  const handleOpenGeneralFountain = (name: string, x: number = 50, y: number = 90, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playStarChime();
    setActiveOrigin({ name, x, y });
    setShowWishFountain(true);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    soundEngine.playStarChime();
    setActiveOrigin({
      name: `Space Position (${clickX}%, ${clickY}%)`,
      x: clickX,
      y: clickY,
      targetX: clickX,
      targetY: clickY,
    });
    setShowWishFountain(true);
  };

  const animateParticleWithGsap = (el: HTMLDivElement | null, wish: FloatingWish) => {
    if (!el || animatedWishIdsRef.current.has(wish.id)) return;
    animatedWishIdsRef.current.add(wish.id);

    gsap.fromTo(
      el,
      {
        scale: 0.2,
        opacity: 0,
        filter: "drop-shadow(0 0 5px rgba(251, 191, 36, 0.3))",
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.8)",
        onComplete: () => {
          gsap.to(el, {
            filter: "drop-shadow(0 0 25px rgba(251, 191, 36, 1))",
            yoyo: true,
            repeat: -1,
            duration: 1.5,
            ease: "sine.inOut",
          });
        },
      }
    );
  };

  const handleCastWish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!wishInput.trim()) return;

    soundEngine.playFireworkBurst();
    soundEngine.playStarChime();

    let destX = activeOrigin.targetX;
    let destY = activeOrigin.targetY;
    let starName = activeOrigin.starTitle;

    if (destX === undefined || destY === undefined) {
      const assignedStar = GALAXY_STARS[floatingWishes.length % GALAXY_STARS.length];
      destX = assignedStar.x;
      destY = assignedStar.y;
      starName = assignedStar.title;
    }

    const newWish: FloatingWish = {
      id: Math.random().toString(36).substring(2, 9),
      text: wishInput.trim(),
      startX: activeOrigin.x,
      startY: activeOrigin.y,
      targetX: destX,
      targetY: destY,
      targetStarTitle: starName,
    };

    setFloatingWishes((prev) => [...prev, newWish]);
    setWishInput("");
    setShowWishFountain(false);
  };

  const isCompleted = discoveredIds.length >= 5;
  const showLegendaryStar = discoveredIds.length >= 5;

  const presetWishes = [
    "May your smile shine brighter every day ✨",
    "Wishing you endless happiness, peace & love 💖",
    "May all your secret dreams come true this year 🌟",
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 text-center z-10 select-none">
      
      {/* Legendary Star Fullscreen Overlay */}
      {legendaryState !== "idle" && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
          
          {legendaryState === "typing" && (
            <div className="max-w-2xl text-center space-y-6">
              <Star className="w-16 h-16 text-amber-400 fill-amber-400 mx-auto animate-pulse shadow-[0_0_50px_#fbbf24] rounded-full" />
              <p className="font-serif-classic text-2xl md:text-3xl text-amber-100 leading-relaxed italic text-glow-gold">
                <TypewriterText 
                  text={"Indha Legendary Star ellarukkum theriyadhu... explore panna dhaan kidaikkum.✨\nUn smile-um appadi dhaan... paakra ellarum marakka mudiyadhu.\nHappy Birthday, Bhuvi. 💛"} 
                  onComplete={handleLegendaryTypingComplete}
                  speed={60}
                />
              </p>
            </div>
          )}

          {legendaryState === "butterfly" && (
            <div className="max-w-2xl text-center" ref={butterflyRef}>
              <span className="text-6xl drop-shadow-[0_0_30px_#fbbf24] animate-bounce">🦋</span>
            </div>
          )}
        </div>
      )}

      {/* Top Header */}
      <div className="pt-8 sm:pt-12 flex flex-col items-center gap-2 max-w-xl w-full px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chapter 2 • The Galaxy of Stars</span>
        </div>
        <h2 className="font-serif-classic text-lg sm:text-2xl md:text-3xl text-slate-100 font-light px-2">
          Touch stars to reveal their secrets...
        </h2>
        <div className="text-xs text-amber-300/80 font-medium flex flex-wrap items-center justify-center gap-2 mt-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Discovered Stars: {discoveredIds.length} / {GALAXY_STARS.length}</span>
          <button
            onClick={() => handleOpenGeneralFountain("Wish Fountain Portal")}
            className="ml-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/30 via-amber-500/30 to-purple-500/30 border border-amber-400/50 text-amber-200 text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Cast a Wish</span>
          </button>
        </div>
      </div>

      {/* Galaxy Canvas Area */}
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="relative w-full max-w-5xl h-[420px] sm:h-[480px] md:h-[520px] my-3 sm:my-4 rounded-2xl sm:rounded-3xl glass-panel border border-cyan-500/20 overflow-hidden shadow-2xl cursor-crosshair touch-none"
      >
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-purple-600/15 blur-[70px] sm:blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-cyan-600/15 blur-[70px] sm:blur-[90px] pointer-events-none" />

        {/* Floating Interactive Stars */}
        {GALAXY_STARS.map((star) => {
          const isDiscovered = discoveredIds.includes(star.id);
          const hasWish = floatingWishes.some((w) => w.targetX === star.x && w.targetY === star.y);

          return (
            <button
              key={star.id}
              onClick={(e) => {
                e.stopPropagation();
                handleStarClick(star);
              }}
              className={`absolute group p-3.5 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-150 z-30 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer ${
                isDiscovered ? "scale-110 opacity-100" : "opacity-75 hover:opacity-100"
              }`}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              title={star.title}
            >
              <div className="relative flex items-center justify-center">
                <Star
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                    hasWish
                      ? "text-amber-200 fill-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,1)] animate-pulse"
                      : isDiscovered
                      ? "text-amber-300 fill-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse"
                      : "text-cyan-200 fill-cyan-400/30 group-hover:text-amber-200"
                  }`}
                />
                {isDiscovered && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
                )}
              </div>
            </button>
          );
        })}

        {/* The Rare Legendary Star */}
        {showLegendaryStar && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLegendaryClick();
            }}
            className="absolute group p-3.5 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 hover:scale-150 z-40 min-w-[50px] min-h-[50px] flex items-center justify-center cursor-pointer scale-125 animate-in zoom-in fade-in"
            style={{ left: `50%`, top: `50%` }}
            title="Legendary Star"
          >
            <div className="relative flex items-center justify-center animate-spin-slow">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-400 drop-shadow-[0_0_25px_rgba(253,224,71,1)]" />
              <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse" />
            </div>
          </button>
        )}

        {/* Floating Wishes Animated Particles */}
        {floatingWishes.map((wish) => (
          <div
            key={wish.id}
            ref={(el) => animateParticleWithGsap(el, wish)}
            className="absolute pointer-events-none flex flex-col items-center gap-1 z-35 animate-wish-float"
            style={{
              ["--start-x" as string]: `${wish.startX}%`,
              ["--start-y" as string]: `${wish.startY}%`,
              ["--target-x" as string]: `${wish.targetX}%`,
              ["--target-y" as string]: `${wish.targetY}%`,
            }}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400/40 border border-amber-300 shadow-[0_0_20px_rgba(251,191,36,1)] flex items-center justify-center animate-spin">
              <Sparkles className="w-3 h-3 text-amber-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Active Star Modal Popup */}
      {activeStar && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-amber-400/40 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveStar(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-4">
              <Star className="w-3.5 h-3.5 fill-amber-300 animate-pulse" />
              <span>{activeStar.title}</span>
            </div>

            <p className="font-serif-classic text-xl sm:text-2xl text-slate-100 italic leading-relaxed my-2 whitespace-pre-wrap">
              <TypewriterText text={activeStar.text} speed={50} />
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => setActiveStar(null)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Keep Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wish Fountain Modal */}
      {showWishFountain && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[88vh] overflow-y-auto border border-purple-400/50 shadow-2xl relative animate-in zoom-in-95 duration-200 text-left space-y-4">
            <button onClick={() => setShowWishFountain(false)} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white rounded-full bg-white/10">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Wand2 className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif-classic text-xl font-bold text-amber-100 truncate">The Celestial Wish Fountain</h3>
              </div>
            </div>
            <form onSubmit={handleCastWish} className="space-y-4">
              <textarea
                rows={2}
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                placeholder="Type your wish here..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/90 border border-white/20 text-slate-100 text-sm focus:border-amber-400 shadow-inner resize-none"
              />
              <div className="flex justify-end gap-3">
                <button type="submit" disabled={!wishInput.trim()} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-amber-600 font-bold text-slate-950 text-sm shadow-lg disabled:opacity-40">
                  Cast Wish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Continuation Controls */}
      <div className="pb-8 flex flex-col items-center gap-3 relative z-10">
        {isCompleted ? (
          <div className="space-y-2 animate-in fade-in duration-500 flex flex-col items-center">
            <p className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Constellation Unlocked</span>
            </p>
            <button
              ref={continueBtnRef}
              onClick={onNext}
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-amber-500/20 to-cyan-500/20 border border-amber-400/50 text-amber-100 font-semibold shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <span>Ascend to the Heart</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
