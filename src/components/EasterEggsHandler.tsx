import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { soundEngine } from "../audio/soundEngine";
import { Heart, Sparkles } from "lucide-react";

interface EasterEggsProps {
  onKonamiTrigger: () => void;
  onMeteorTrigger: () => void;
  moonClicks: number;
  setMoonClicks: React.Dispatch<React.SetStateAction<number>>;
}

export const EasterEggsHandler: React.FC<EasterEggsProps> = ({
  onKonamiTrigger,
  onMeteorTrigger,
  moonClicks,
  setMoonClicks,
}) => {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [balloons, setBalloons] = useState<{ id: number; x: number; color: string }[]>([]);
  const [wishNotification, setWishNotification] = useState<string | null>(null);

  // Konami sequence buffer
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let keyBuffer: string[] = [];

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Easter Egg: Press 'H' for floating hearts
      if (key.toLowerCase() === "h") {
        spawnHeartCluster();
        soundEngine.playStarChime();
      }

      // Easter Egg: Press 'B' for birthday balloons
      if (key.toLowerCase() === "b" && keyBuffer[keyBuffer.length - 1] !== "b") {
        spawnBalloons();
        soundEngine.playStarChime();
      }

      // Check Konami
      keyBuffer.push(key);
      if (keyBuffer.length > konamiCode.length) {
        keyBuffer.shift();
      }

      if (JSON.stringify(keyBuffer.map((k) => k.toLowerCase())) === JSON.stringify(konamiCode.map((k) => k.toLowerCase()))) {
        onKonamiTrigger();
        soundEngine.playFireworkBurst();
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
        });
        showWish("✨ KONAMI UNLOCKED: Rainbow Cosmic Mode Activated!");
        keyBuffer = [];
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKonamiTrigger]);

  const spawnHeartCluster = () => {
    const newHearts = Array.from({ length: 8 }).map(() => ({
      id: Math.random(),
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: window.innerHeight - 50,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 4000);
  };

  const spawnBalloons = () => {
    const colors = ["#f43f5e", "#fbbf24", "#38bdf8", "#e879f9", "#34d399"];
    const newBalloons = Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      x: Math.random() * (window.innerWidth - 100) + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setBalloons((prev) => [...prev, ...newBalloons]);
    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => !newBalloons.includes(b)));
    }, 6000);
  };

  const showWish = (msg: string) => {
    setWishNotification(msg);
    setTimeout(() => setWishNotification(null), 3500);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {/* Wish Notification Toast */}
      {wishNotification && (
        <div className="pointer-events-auto fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full border border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-amber-200 font-serif-classic text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{wishNotification}</span>
          </div>
        </div>
      )}

      {/* Floating Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute text-rose-400 animate-float-up opacity-90 transition-all duration-4000"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            animation: "floatUp 4s ease-out forwards",
          }}
        >
          <Heart className="w-8 h-8 fill-rose-500/80 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
        </div>
      ))}

      {/* Floating Birthday Balloons */}
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0 flex flex-col items-center"
          style={{
            left: `${b.x}px`,
            animation: "balloonRise 6s ease-out forwards",
          }}
        >
          <div
            className="w-10 h-12 rounded-t-full rounded-b-xl shadow-lg border border-white/20"
            style={{ backgroundColor: b.color }}
          />
          <div className="w-0.5 h-16 bg-white/30" />
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.6); opacity: 1; }
          100% { transform: translateY(-800px) scale(1.4); opacity: 0; }
        }
        @keyframes balloonRise {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
          50% { transform: translateY(-50vh) rotate(5deg); }
          100% { transform: translateY(-110vh) rotate(-5deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
