import React, { useEffect, useRef } from "react";

interface AuroraProps {
  density?: "low" | "medium" | "high";
  rainbowMode?: boolean;
  meteorActive?: boolean;
}

export const AuroraBackground: React.FC<AuroraProps> = ({
  density = "medium",
  rainbowMode = false,
  meteorActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle count according to density setting
    const particleCount = density === "low" ? 70 : density === "high" ? 220 : 130;
    const fireflyCount = density === "low" ? 15 : density === "high" ? 45 : 25;

    // Stars
    interface Star {
      x: number;
      y: number;
      radius: number;
      baseAlpha: number;
      twinkleSpeed: number;
      phase: number;
      color: string;
    }

    const stars: Star[] = [];
    const colors = ["#ffffff", "#fef08a", "#bae6fd", "#fbcfe8", "#e9d5ff"];
    for (let i = 0; i < particleCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Fireflies
    interface Firefly {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      pulseSpeed: number;
      hue: number;
    }

    const fireflies: Firefly[] = [];
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        hue: Math.random() * 60 + 40, // Warm amber/greenish-gold
      });
    }

    // Shooting stars / meteors
    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      thickness: number;
    }

    let meteors: Meteor[] = [];

    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 60,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 1,
        thickness: Math.random() * 2 + 1,
      });
    };

    let meteorTimer = 0;
    let step = 0;

    // Render loop
    const render = () => {
      step += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Space Gradient
      const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (rainbowMode) {
        const h1 = (step * 50) % 360;
        const h2 = (h1 + 60) % 360;
        spaceGrad.addColorStop(0, `hsla(${h1}, 70%, 10%, 1)`);
        spaceGrad.addColorStop(1, `hsla(${h2}, 80%, 5%, 1)`);
      } else {
        spaceGrad.addColorStop(0, "#030712");
        spaceGrad.addColorStop(0.5, "#0b0f19");
        spaceGrad.addColorStop(1, "#02040a");
      }
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Aurora Wave Curtains
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const waveY = height * 0.35 + w * 60;
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 20) {
          const sin1 = Math.sin(x * 0.002 + step * 0.8 + w) * 50;
          const sin2 = Math.cos(x * 0.005 - step * 0.5) * 30;
          ctx.lineTo(x, waveY + sin1 + sin2);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const auroraGrad = ctx.createLinearGradient(0, waveY - 100, 0, height);
        if (rainbowMode) {
          const hue = (step * 40 + w * 80) % 360;
          auroraGrad.addColorStop(0, `hsla(${hue}, 90%, 50%, 0.18)`);
          auroraGrad.addColorStop(0.5, `hsla(${(hue + 40) % 360}, 80%, 40%, 0.08)`);
          auroraGrad.addColorStop(1, "transparent");
        } else {
          if (w === 0) {
            auroraGrad.addColorStop(0, "rgba(251, 191, 36, 0.08)"); // Gold
            auroraGrad.addColorStop(0.5, "rgba(217, 70, 239, 0.05)"); // Magenta
            auroraGrad.addColorStop(1, "transparent");
          } else if (w === 1) {
            auroraGrad.addColorStop(0, "rgba(56, 189, 248, 0.07)"); // Cyan
            auroraGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.04)"); // Violet
            auroraGrad.addColorStop(1, "transparent");
          } else {
            auroraGrad.addColorStop(0, "rgba(16, 185, 129, 0.06)"); // Emerald
            auroraGrad.addColorStop(0.5, "rgba(14, 165, 233, 0.03)"); // Sky
            auroraGrad.addColorStop(1, "transparent");
          }
        }

        ctx.fillStyle = auroraGrad;
        ctx.fill();
      }

      // 3. Render Stars
      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const currentAlpha = Math.max(0.1, star.baseAlpha + Math.sin(star.phase) * 0.35);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();

        // Subtle star glow
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = currentAlpha * 0.25;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // 4. Render Fireflies
      fireflies.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;

        f.alpha += Math.sin(step * 5 + f.x) * f.pulseSpeed;
        const boundedAlpha = Math.min(0.9, Math.max(0.1, f.alpha));

        const fireflyGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 3.5);
        const hue = rainbowMode ? (step * 80 + f.x) % 360 : f.hue;
        fireflyGrad.addColorStop(0, `hsla(${hue}, 95%, 70%, ${boundedAlpha})`);
        fireflyGrad.addColorStop(0.5, `hsla(${hue}, 90%, 50%, ${boundedAlpha * 0.4})`);
        fireflyGrad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = fireflyGrad;
        ctx.fill();
      });

      // 5. Meteors
      meteorTimer++;
      if (meteorActive || meteorTimer % 350 === 0) {
        if (Math.random() < 0.3 || meteorActive) {
          spawnMeteor();
        }
      }

      meteors.forEach((m, idx) => {
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.012;

        if (m.alpha <= 0) {
          meteors.splice(idx, 1);
          return;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const mGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        mGrad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        mGrad.addColorStop(0.3, `rgba(251, 191, 36, ${m.alpha * 0.8})`);
        mGrad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = mGrad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, rainbowMode, meteorActive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
