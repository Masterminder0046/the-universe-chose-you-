import React, { useState } from "react";
import { VAULT_ENVELOPES, VaultEnvelope, RECIPIENT_CONFIG } from "../config";
import { soundEngine } from "../audio/soundEngine";
import { Sparkles, Key, Lock, Unlock, Mail, ArrowRight, X, HelpCircle } from "lucide-react";

interface Chapter5Props {
  onNext: () => void;
}

export const Chapter5Vault: React.FC<Chapter5Props> = ({ onNext }) => {
  const [passwordInput, setPasswordInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [wrongAttemptMsg, setWrongAttemptMsg] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [activeEnvelope, setActiveEnvelope] = useState<VaultEnvelope | null>(null);
  const [openedEnvelopeIds, setOpenedEnvelopeIds] = useState<number[]>([]);

  const handleUnlockVault = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput.trim().toLowerCase() === RECIPIENT_CONFIG.secretPassword.toLowerCase()) {
      soundEngine.playDoorOpenSound();
      soundEngine.playStarChime();
      setUnlocked(true);
      setWrongAttemptMsg(null);
    } else {
      soundEngine.playGearClick();
      const funnyMsgs = [
        "Denied! Access granted only to the owner of the brightest smile.",
        "Incorrect key! Hint: It's 5 letters and starts with 'B'!",
        "Nice try, intruder! Try typing 'Bhuvi'!",
        "Security alarm ringing! Just kidding, type 'Bhuvi' to enter!",
      ];
      setWrongAttemptMsg(funnyMsgs[Math.floor(Math.random() * funnyMsgs.length)]);
    }
  };

  const handleOpenEnvelope = (env: VaultEnvelope) => {
    soundEngine.playPaperSound();
    setActiveEnvelope(env);
    if (!openedEnvelopeIds.includes(env.id)) {
      setOpenedEnvelopeIds((prev) => [...prev, env.id]);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 select-none">
      {/* Chapter Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-semibold uppercase tracking-widest mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Chapter 5 • The Secret Vault</span>
      </div>

      <div className="max-w-2xl w-full flex flex-col items-center">
        {!unlocked ? (
          /* Lock Screen */
          <div className="glass-panel p-8 rounded-3xl w-full max-w-md border border-amber-500/30 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif-classic text-2xl font-bold text-amber-100">
                Security Passcode Required
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the secret passcode to unlock the vault.
              </p>
            </div>

            <form onSubmit={handleUnlockVault} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter passcode..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/20 text-amber-200 text-center font-semibold text-lg focus:outline-none focus:border-amber-400 shadow-inner"
                />
                <Key className="w-5 h-5 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {wrongAttemptMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs animate-shake">
                  {wrongAttemptMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-slate-950 text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Unlock Vault
              </button>
            </form>

            {/* Hint Button */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 hover:text-amber-300 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need a hint?</span>
              </button>
              <button
                type="button"
                onClick={() => setPasswordInput(RECIPIENT_CONFIG.secretPassword)}
                className="hover:text-amber-300 transition-colors"
              >
                Auto-fill Passcode
              </button>
            </div>

            {showHint && (
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-200 text-xs italic">
                Hint: The 5-letter name of the birthday star ({RECIPIENT_CONFIG.name}).
              </div>
            )}
          </div>
        ) : (
          /* Vault Unlocked - Floating Envelopes */
          <div className="w-full space-y-6 animate-in fade-in duration-700">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold">
                <Unlock className="w-3.5 h-3.5" />
                <span>Vault Unlocked!</span>
              </div>
              <h3 className="font-serif-classic text-3xl font-bold text-amber-100">
                Floating Secret Envelopes
              </h3>
              <p className="text-xs text-slate-400">
                Tap on envelopes to open compliments, jokes, and hidden thoughts.
              </p>
            </div>

            {/* Envelopes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              {VAULT_ENVELOPES.map((env) => {
                const isOpened = openedEnvelopeIds.includes(env.id);
                return (
                  <button
                    key={env.id}
                    onClick={() => handleOpenEnvelope(env)}
                    className={`p-5 rounded-2xl bg-gradient-to-br ${env.color} border glass-panel flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 text-left group ${
                      isOpened ? "ring-2 ring-amber-400/50" : ""
                    }`}
                  >
                    <Mail className="w-8 h-8 text-amber-300 group-hover:rotate-12 transition-transform" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{env.title}</div>
                      <div className="text-[10px] text-amber-300/80 mt-0.5 capitalize">{env.type}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continuation Button */}
            <div className="pt-4">
              <button
                onClick={onNext}
                className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-400/60 text-amber-100 font-semibold shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Step Into The Universe (Final Chapter)</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Envelope Reader Modal */}
      {activeEnvelope && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-amber-400/40 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveEnvelope(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-4">
              <Mail className="w-3.5 h-3.5" />
              <span>{activeEnvelope.title}</span>
            </div>

            <p className="font-serif-classic text-2xl text-slate-100 leading-relaxed italic my-3">
              "{activeEnvelope.content}"
            </p>

            <button
              onClick={() => setActiveEnvelope(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-sm font-semibold transition-colors"
            >
              Close Envelope
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
