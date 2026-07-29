import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { soundEngine } from "../audio/soundEngine";
import { RECIPIENT_CONFIG } from "../config";
import { Heart, Send, RefreshCw, Camera, Star, Sparkles } from "lucide-react";

interface FinalProps {
  onRestartStory: () => void;
}

type SequenceStage = 
  | "IDLE"
  | "CAMERA_DROP"
  | "FOCUSING"
  | "FLASH_AND_PRINT"
  | "POLAROID_DEVELOP"
  | "POLAROID_ASCEND"
  | "FAREWELL_STAR"
  | "FAREWELL_HEART"
  | "SHATTER_AND_BLACK"
  | "FINAL_EPILOGUE"
  | "SECRET_STAR"
  | "SECRET_MESSAGE";

export const FinalChapterUniverse: React.FC<FinalProps> = ({ onRestartStory }) => {
  const [stage, setStage] = useState<SequenceStage>("IDLE");
  const [flashActive, setFlashActive] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (stage === "IDLE") {
      soundEngine.playFireworkBurst();
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ["#fbbf24", "#f43f5e", "#38bdf8", "#e879f9", "#ffffff", "#34d399"],
        });
      }, 400);

      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleStartSequence = async () => {
    soundEngine.setVolume(0.15); // Quieter music for sequence
    setStage("CAMERA_DROP");
  };

  const handleCapture = async () => {
    setStage("FOCUSING");
    
    // Lens sound + 3,2,1 countdown
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      soundEngine.playStarChime(); // Beep
      await sleep(1000);
    }
    setCountdown(null);
    
    soundEngine.playCameraClick();
    setStage("FLASH_AND_PRINT");
    
    // Flash
    soundEngine.playCameraFlash();
    setFlashActive(true);
    await sleep(100);
    setFlashActive(false);
    
    // Print and wait
    await sleep(2500); 
    setStage("POLAROID_DEVELOP");
    
    await sleep(5000); // Read text on polaroid
    setStage("POLAROID_ASCEND");
    
    await sleep(3500); // Ascend away
    setStage("FAREWELL_STAR");
    
    // Typing first farewell
    const text1 = "See you next birthday...";
    for (let i = 0; i <= text1.length; i++) {
      setTypedText(text1.substring(0, i));
      if (i < text1.length && text1[i] !== " ") soundEngine.playStarChime();
      await sleep(100);
    }
    
    await sleep(3000);
    setStage("FAREWELL_HEART");
    
    const text2 = "Good Night, Bhuvi 🌙";
    for (let i = 0; i <= text2.length; i++) {
      setTypedText(text2.substring(0, i));
      if (i < text2.length && text2[i] !== " ") soundEngine.playStarChime();
      await sleep(100);
    }
    
    await sleep(3000);
    soundEngine.playCrystalShatterSound();
    setStage("SHATTER_AND_BLACK");
    soundEngine.setVolume(0);
    
    await sleep(3000); // Wait in blackness
    setStage("FINAL_EPILOGUE");
    
    await sleep(5000); // Read final text
    setStage("SECRET_STAR");
  };

  // --------------------------------------------------------
  // Render branches
  // --------------------------------------------------------

  if (stage !== "IDLE") {
    // Generate star field for background
    const stars = Array.from({ length: 150 }).map((_, i) => ({
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      animationDelay: Math.random() * 3 + "s",
      size: Math.random() * 2 + 1 + "px",
    }));

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-colors duration-3000 ${
        ["SHATTER_AND_BLACK", "FINAL_EPILOGUE", "SECRET_STAR", "SECRET_MESSAGE"].includes(stage) 
          ? "bg-black" 
          : "bg-slate-950"
      }`}>
        {/* Ambient Stars */}
        {["CAMERA_DROP", "FOCUSING", "FLASH_AND_PRINT", "POLAROID_DEVELOP", "POLAROID_ASCEND", "FAREWELL_STAR", "FAREWELL_HEART"].includes(stage) && (
          <div className="absolute inset-0 transition-opacity duration-3000 opacity-100">
            {stars.map((s, i) => (
              <div 
                key={i} 
                className="absolute bg-white rounded-full opacity-60 animate-twinkle"
                style={{ 
                  left: s.left, 
                  top: s.top, 
                  width: s.size, 
                  height: s.size, 
                  animationDelay: s.animationDelay 
                }}
              />
            ))}
          </div>
        )}

        {/* Flash Overlay */}
        <div className={`absolute inset-0 bg-white z-[60] pointer-events-none transition-opacity ${flashActive ? "opacity-100 duration-75" : "opacity-0 duration-1000"}`} />

        {/* --- STAGE: CAMERA --- */}
        {["CAMERA_DROP", "FOCUSING", "FLASH_AND_PRINT"].includes(stage) && (
          <div className="flex flex-col items-center justify-center z-20 animate-in slide-in-from-top-[100%] duration-[2000ms] ease-out-bounce">
            <div className={`relative w-64 h-64 sm:w-80 sm:h-80 mb-8 drop-shadow-2xl transition-all duration-700 group ${
              stage === "FOCUSING" ? "animate-pulse" : ""
            }`}>
              <img src="./assets/images/camera.png" alt="Vintage Camera" className="w-full h-full object-contain" />
              {/* Blinking recording light */}
              <div className={`absolute top-[28%] right-[22%] w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red] transition-opacity duration-300 ${
                ["FOCUSING", "FLASH_AND_PRINT"].includes(stage) ? "animate-ping opacity-100" : "opacity-0"
              }`} />
              
              {/* Polaroid Ejecting */}
              <div className={`absolute left-1/2 -bottom-16 -translate-x-1/2 w-48 bg-[#fdfaf5] h-56 rounded border-b-[16px] border-[#ece6d8] shadow-xl overflow-hidden transition-all duration-[2000ms] ease-out ${
                stage === "FLASH_AND_PRINT" && !flashActive ? "translate-y-[20%] opacity-100" : "translate-y-[-80%] opacity-0"
              } z-[-1]`}>
                 <div className="w-[calc(100%-16px)] h-40 bg-zinc-800 m-2 mt-2" />
              </div>
            </div>

            {stage === "CAMERA_DROP" && (
              <button 
                onClick={handleCapture}
                className="animate-in fade-in duration-1000 delay-1000 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-serif-classic text-xl flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
              >
                <Camera className="w-6 h-6 text-amber-200" />
                📸 Capture This Moment
              </button>
            )}
          </div>
        )}

        {/* --- STAGE: FOCUSING VIEWFINDER --- */}
        {stage === "FOCUSING" && (
          <div className="absolute inset-0 z-[40] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-500">
            {/* Viewfinder frame */}
            <div className="relative w-[90%] max-w-3xl aspect-video border-2 border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black/50">
              {/* Corner brackets */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-white/50" />
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-white/50" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-white/50" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-white/50" />
              
              {/* Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/30 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full animate-ping" />
              
              {/* The Photo (Being Focused) */}
              <img 
                src="./assets/images/bhuvi_photo.jpg" 
                alt="Focusing" 
                className="w-full h-full object-contain transition-all duration-[1000ms] ease-out opacity-80" 
                style={{ 
                  filter: countdown === 3 ? "blur(12px) brightness(0.5)" : countdown === 2 ? "blur(6px) brightness(0.8)" : "blur(0px) brightness(1.1)",
                  transform: countdown === 3 ? "scale(1.1)" : countdown === 2 ? "scale(1.05)" : "scale(1)"
                }} 
              />
            </div>

            {/* Countdown text */}
            <div className="absolute bottom-12 flex items-center justify-center gap-8 font-serif-classic text-5xl sm:text-7xl drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
              <span className={`transition-all duration-300 ${countdown === 3 ? "scale-125 text-amber-300" : "opacity-30 text-amber-500/50"}`}>3...</span>
              <span className={`transition-all duration-300 ${countdown === 2 ? "scale-125 text-amber-300" : "opacity-30 text-amber-500/50"}`}>2...</span>
              <span className={`transition-all duration-300 ${countdown === 1 ? "scale-125 text-amber-300" : "opacity-30 text-amber-500/50"}`}>1...</span>
            </div>
          </div>
        )}

        {/* --- STAGE: POLAROID DEVELOP --- */}
        {["POLAROID_DEVELOP", "POLAROID_ASCEND"].includes(stage) && (
          <div 
            className={`z-30 transition-all duration-[3000ms] ease-in-out ${
              stage === "POLAROID_ASCEND" ? "-translate-y-[150vh] scale-75 opacity-0" : "translate-y-0 scale-100 opacity-100"
            }`}
            style={{ animation: stage === 'POLAROID_DEVELOP' ? 'swing 4s ease-in-out infinite alternate' : '' }}
          >
            <div className="w-72 sm:w-80 bg-[#fdfaf5] p-4 pb-6 rounded-sm shadow-2xl relative border border-black/5">
              <div className="w-full h-64 sm:h-72 bg-slate-200 overflow-hidden relative shadow-inner">
                {/* Photo contents fading in (Developing Effect) */}
                <div className={`absolute inset-0 transition-all duration-[5000ms] ease-in ${
                  stage === "POLAROID_DEVELOP" ? "opacity-100 delay-500 blur-none sepia-0" : "opacity-0 blur-sm sepia-[0.5]"
                }`}>
                   <img src="./assets/images/bhuvi_photo.jpg" alt="Captured Moment" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="mt-4 flex flex-col items-center justify-center text-slate-800" style={{ fontFamily: "Caveat, cursive" }}>
                <p className="font-bold text-2xl sm:text-3xl text-slate-900 mb-1">Captured With Love <span className="text-red-500">❤️</span></p>
                <p className="text-lg sm:text-xl text-slate-700 leading-snug">Happy Birthday, Bhuvi</p>
                <p className="text-base sm:text-lg text-slate-600 leading-snug">10 August</p>
              </div>
            </div>
            
            {/* Sparkles and Butterflies around photo */}
            {stage === "POLAROID_DEVELOP" && (
              <div className="absolute inset-0 pointer-events-none">
                <Star className="absolute -top-12 -left-8 w-10 h-10 text-amber-300 fill-amber-300 animate-pulse-glow" />
                <Star className="absolute bottom-16 -right-12 w-12 h-12 text-amber-200 fill-amber-200 animate-ping" />
                <Star className="absolute -top-4 right-1/4 w-6 h-6 text-yellow-100 fill-yellow-100 animate-pulse" />
                
                {/* SVG Butterflies */}
                <svg className="absolute top-1/4 -right-16 w-12 h-12 text-amber-300 animate-float-slow opacity-80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c-.5 0-1 .5-1 1v6c-1.5-2-4-3-6-3-2.5 0-4 1.5-4 4 0 1.5 1 3 2.5 4-1.5 1-2.5 2.5-2.5 4 0 2.5 1.5 4 4 4 2 0 4.5-1 6-3v6c0 .5.5 1 1 1s1-.5 1-1v-6c1.5 2 4 3 6 3 2.5 0 4-1.5 4-4 0-1.5-1-3-2.5-4 1.5-1 2.5-2.5 2.5-4 0-2.5-1.5-4-4-4-2 0-4.5 1-6 3V3c0-.5-.5-1-1-1z" />
                </svg>
                <svg className="absolute bottom-1/4 -left-12 w-8 h-8 text-rose-300 animate-float-slow opacity-60" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '1s', animationDuration: '4s' }}>
                  <path d="M12 2c-.5 0-1 .5-1 1v6c-1.5-2-4-3-6-3-2.5 0-4 1.5-4 4 0 1.5 1 3 2.5 4-1.5 1-2.5 2.5-2.5 4 0 2.5 1.5 4 4 4 2 0 4.5-1 6-3v6c0 .5.5 1 1 1s1-.5 1-1v-6c1.5 2 4 3 6 3 2.5 0 4-1.5 4-4 0-1.5-1-3-2.5-4 1.5-1 2.5-2.5 2.5-4 0-2.5-1.5-4-4-4-2 0-4.5 1-6 3V3c0-.5-.5-1-1-1z" />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* --- STAGE: FAREWELL STAR/HEART --- */}
        {["FAREWELL_STAR", "FAREWELL_HEART", "SHATTER_AND_BLACK"].includes(stage) && (
          <div className="z-20 flex flex-col items-center justify-center gap-8">
            <div className={`transition-all duration-1000 ${stage === "SHATTER_AND_BLACK" ? "opacity-0 scale-[3]" : "opacity-100 scale-100"}`}>
              {stage === "FAREWELL_STAR" && (
                <Star className="w-16 h-16 text-amber-300 fill-amber-300 animate-pulse-glow mx-auto" />
              )}
              {stage === "FAREWELL_HEART" && (
                <Heart className="w-16 h-16 text-rose-500 fill-rose-500 animate-pulse-glow mx-auto" />
              )}
            </div>
            
            <p className={`font-serif-classic text-3xl sm:text-4xl text-amber-100 font-medium h-12 transition-opacity duration-1000 ${
              stage === "SHATTER_AND_BLACK" ? "opacity-0" : "opacity-100"
            }`}>
              {typedText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        )}
        
        {/* Shatter Particles */}
        {stage === "SHATTER_AND_BLACK" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-10 flex items-center justify-center">
             <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping shadow-[0_0_50px_red]" style={{ animationDuration: "1s", animationIterationCount: 1 }} />
          </div>
        )}

        {/* --- STAGE: FINAL EPILOGUE --- */}
        {stage === "FINAL_EPILOGUE" && (
          <div className="z-30 text-center animate-in fade-in duration-[3000ms]">
            <p className="font-serif-classic text-3xl sm:text-4xl text-amber-200 font-light leading-relaxed mb-6">
              Thank you for completing this journey.
            </p>
            <p className="font-serif-classic text-2xl sm:text-3xl text-slate-300 font-light">
              Your smile was the destination. <span className="text-rose-500 inline-block animate-bounce ml-2">❤️</span>
            </p>
          </div>
        )}

        {/* --- STAGE: SECRET STAR --- */}
        {stage === "SECRET_STAR" && (
          <button 
            onClick={() => setStage("SECRET_MESSAGE")}
            className="absolute top-8 right-8 z-40 p-4 animate-in fade-in duration-[2000ms] group"
          >
            <Star className="w-6 h-6 text-amber-100/20 fill-amber-100/20 group-hover:text-amber-300 group-hover:fill-amber-300 transition-all duration-700 animate-pulse" />
          </button>
        )}

        {/* --- STAGE: SECRET MESSAGE --- */}
        {stage === "SECRET_MESSAGE" && (
          <div className="z-30 text-center animate-in fade-in zoom-in duration-[3000ms]">
            <p className="font-serif-classic text-2xl sm:text-4xl text-amber-200/90 font-light italic leading-relaxed" style={{ fontFamily: "Caveat, cursive" }}>
              "Some birthdays end... <br className="sm:hidden" />
              but beautiful memories never do."
            </p>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------
  // IDLE STAGE (The standard birthday card)
  // --------------------------------------------------------
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 select-none py-16">
      <div className="absolute w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center gap-12">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center animate-spin-slow">
            <Sparkles className="w-12 h-12 text-amber-400" />
          </div>
          <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full animate-pulse-glow" />
        </div>

        <div className="space-y-8 glass-panel p-8 sm:p-16 rounded-3xl border border-amber-400/20 shadow-2xl relative overflow-hidden w-full">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
          
          <h1 className="font-serif-classic text-5xl sm:text-7xl font-bold text-glow-gold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 mb-6">
            The Journey Begins Now
          </h1>

          <p className="font-serif-classic text-2xl sm:text-3xl text-slate-100 leading-relaxed font-light">
         Keep Smile always Babe ❤️.
          </p>

          <p className="font-serif-classic text-2xl sm:text-3xl text-amber-300 font-medium leading-relaxed">
            I will always be there for you in every ups and downs of ur life.
          </p>

          <div className="pt-6 border-t border-amber-500/30 space-y-4">
            <p className="font-serif-classic text-xl sm:text-2xl text-slate-300 font-light leading-relaxed">
            Unaku ena kastam iruuthalum i will be there for you always ❤️‍🩹.   
            </p>

            <div className="flex items-center justify-center gap-2 pt-2 text-rose-400">
              <Heart className="w-6 h-6 fill-rose-500 animate-pulse" />
              <span className="font-serif-classic text-2xl font-bold text-amber-200">
                Happy Birthday, {RECIPIENT_CONFIG.name}.
              </span>
              <Heart className="w-6 h-6 fill-rose-500 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleStartSequence}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 font-bold text-slate-950 text-base shadow-[0_0_35px_rgba(251,191,36,0.6)] hover:shadow-[0_0_50px_rgba(251,191,36,0.9)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Send className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>One Last Thing...</span>
          </button>
        </div>
      </div>
    </div>
  );
};
