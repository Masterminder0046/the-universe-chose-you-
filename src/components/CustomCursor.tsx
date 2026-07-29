import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  color: string;
}

export const CustomCursor: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const posRef = React.useRef({ x: -100, y: -100 });
  const [follower, setFollower] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });

      // Spawn trail particle
      if (Math.random() < 0.6) {
        const colors = ["#fbbf24", "#f43f5e", "#38bdf8", "#e879f9", "#ffffff"];
        const newP: Particle = {
          id: Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          alpha: 1,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setParticles((prev) => [...prev.slice(-25), newP]);
      }

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.closest("button") ||
          target.classList.contains("interactive"))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Smooth follower interpolation loop
    const updateFollower = () => {
      setFollower((prev) => ({
        x: prev.x + (posRef.current.x - prev.x) * 0.4,
        y: prev.y + (posRef.current.y - prev.y) * 0.4,
      }));

      // Fade particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.035,
            size: Math.max(0, p.size - 0.08),
          }))
          .filter((p) => p.alpha > 0)
      );

      animId = requestAnimationFrame(updateFollower);
    };

    animId = requestAnimationFrame(updateFollower);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Particles trail */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 blur-[0.5px]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.alpha,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}

      {/* Main cursor dot */}
      <div
        className={`absolute rounded-full bg-amber-300 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 shadow-[0_0_12px_rgba(251,191,36,0.9)] ${
          isMouseDown ? "scale-75" : isHovering ? "scale-150 bg-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.9)]" : "scale-100"
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: "8px",
          height: "8px",
        }}
      />

      {/* Follower ring */}
      <div
        className={`absolute rounded-full border pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isHovering
            ? "border-amber-400/80 bg-amber-400/10 scale-150 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
            : isMouseDown
            ? "border-rose-400/90 scale-90"
            : "border-white/30 scale-100"
        }`}
        style={{
          left: `${follower.x}px`,
          top: `${follower.y}px`,
          width: "36px",
          height: "36px",
        }}
      />
    </div>
  );
};
