"use client";

import { useState, useEffect } from "react";
import { PULSE_QUESTIONS, RATING_OPTIONS } from "@/lib/engagementSurvey";
import { ChevronRight, Check, Sparkles, Shield } from "lucide-react";

type Ratings = Record<string, number>;
type Whys = Record<string, string[]>;

interface Props {
  onComplete: (ratings: Ratings, whys: Whys, comment: string) => void;
}

function getWhysForPulse(q: typeof PULSE_QUESTIONS[number], rating: number) {
  if (rating >= 4) return q.positiveWhys;
  if (rating === 3) return q.neutralWhys;
  return q.negativeWhys;
}

/* ─── Why chips ─── */
function WhyChips({
  whys,
  selected,
  onToggle,
}: {
  whys: { id: string; label: string; emoji: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-xl p-3.5 mt-3" style={{ background: "#F8F8FC", border: "1px solid rgba(79,70,229,0.12)" }}>
      <p className="text-[11px] font-bold mb-2.5 flex items-center gap-1.5" style={{ color: "#6366F1" }}>
        <span>💡</span> What&apos;s behind this?
        <span className="font-normal text-gray-400">(optional)</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {whys.map((w) => {
          const active = selected.includes(w.id);
          return (
            <button
              key={w.id}
              onClick={() => onToggle(w.id)}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-150"
              style={{
                background: active ? "#4F46E5" : "#fff",
                borderColor: active ? "#4F46E5" : "#E5E7EB",
                color: active ? "#fff" : "#6B7280",
                boxShadow: active ? "0 2px 8px rgba(79,70,229,0.35)" : "none",
                transform: active ? "scale(1.03)" : "scale(1)",
              }}
            >
              <span>{w.emoji}</span>
              {w.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Welcome ─── */
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0F0C29 0%, #1E1B4B 50%, #24243e 100%)" }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[
          [8,12,1.8,0.7,"3.1s","0.4s"],[15,28,1.2,0.4,"2.5s","1.2s"],[22,7,2.2,0.8,"3.8s","0.1s"],
          [31,45,1.0,0.3,"2.2s","2.1s"],[38,19,1.6,0.6,"3.4s","0.8s"],[45,63,2.0,0.7,"2.8s","1.5s"],
          [52,8,1.4,0.5,"3.0s","0.3s"],[59,35,1.8,0.8,"2.6s","1.8s"],[66,51,1.2,0.4,"3.5s","0.6s"],
          [73,22,2.4,0.9,"2.3s","2.4s"],[80,68,1.0,0.3,"3.2s","1.1s"],[87,14,1.6,0.6,"2.9s","0.7s"],
          [93,42,2.0,0.7,"3.7s","1.9s"],[5,55,1.4,0.5,"2.4s","0.2s"],[28,80,1.8,0.6,"3.1s","1.4s"],
          [42,91,1.2,0.4,"2.7s","2.0s"],[57,76,2.2,0.8,"3.3s","0.5s"],[71,88,1.6,0.5,"2.5s","1.7s"],
          [85,33,1.0,0.3,"3.6s","0.9s"],[96,59,1.8,0.7,"2.2s","2.3s"],
        ].map(([l,t,size,op,dur,del], i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ left:`${l}%`, top:`${t}%`, width:size as number, height:size as number,
              opacity:op as number, animation:`twinkle ${dur} ease-in-out infinite`, animationDelay:del as string }} />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", animation: "floatOrb 10s ease-in-out infinite" }} />
      <div className="absolute bottom-[-80px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)", animation: "floatOrb 14s ease-in-out infinite", animationDelay: "3s" }} />

      <div
        className="relative z-10 text-center max-w-lg w-full transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative h-24 w-24 rounded-[28px] flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10B981 60%, #34D399 100%)", boxShadow: "0 0 60px rgba(16,185,129,0.5), 0 20px 40px rgba(0,0,0,0.4)" }}>
            <span className="text-5xl">⚡</span>
            <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full flex items-center justify-center"
              style={{ background: "#4F46E5", boxShadow: "0 0 12px rgba(99,102,241,0.6)" }}>
              <Sparkles size={12} className="text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-black text-white mb-1 leading-tight" style={{ letterSpacing: "-0.03em" }}>Welcome to</h1>
        <h1 className="text-5xl font-black mb-2 leading-tight"
          style={{ letterSpacing: "-0.03em", background: "linear-gradient(90deg, #34D399, #10B981, #059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ECHO 2.0
        </h1>
        <p className="text-sm font-semibold tracking-widest uppercase mb-5" style={{ color: "rgba(110,231,183,0.5)" }}>
          Engage · Connect · Hear · Own
        </p>

        <p className="text-base leading-relaxed mb-2" style={{ color: "rgba(199,210,254,0.8)" }}>
          Great teams don&apos;t guess — they listen. ECHO 2.0 is a quick pulse across every area — one honest answer per section.
        </p>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(165,180,252,0.5)" }}>
          Responses go directly to your manager as <strong style={{ color: "rgba(165,180,252,0.8)" }}>aggregated, anonymous insights</strong> — your identity is never revealed.
        </p>

        {/* Stats — badge moved here from top */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#6EE7B7" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            9 questions · 2 minutes
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: "🔒", label: "Fully anonymous" },
            { icon: "⏱️", label: "Under 2 min" },
            { icon: "📊", label: "9 areas covered" },
          ].map((item) => (
            <div key={item.label} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#6EE7B7" }}>
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onStart}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #059669 0%, #10B981 100%)", boxShadow: "0 8px 32px rgba(16,185,129,0.4), 0 0 0 1px rgba(255,255,255,0.08)" }}>
          Start Survey
          <ChevronRight size={18} />
        </button>
        <p className="text-[11px] mt-4" style={{ color: "rgba(165,180,252,0.35)" }}>No login required · fully encrypted at rest</p>
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.8;transform:scale(1.3)} }
        @keyframes floatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
      `}</style>
    </div>
  );
}

/* ─── Done ─── */
function DoneScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0F0C29 0%, #1E1B4B 50%, #24243e 100%)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(16,185,129,0.18) 0%, transparent 60%)" }} />
      <div className="relative z-10 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}>
        <div className="h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          style={{ background: "linear-gradient(135deg, #059669, #10B981)", boxShadow: "0 0 60px rgba(16,185,129,0.4), 0 20px 40px rgba(0,0,0,0.4)" }}>
          <Check size={40} className="text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Pulse sent! 🎉</h2>
        <p className="text-base max-w-sm mx-auto mb-8 leading-relaxed" style={{ color: "rgba(199,210,254,0.7)" }}>
          Your response has been recorded anonymously. It joins the team&apos;s aggregated score — thanks for being honest.
        </p>
        <button onClick={() => window.location.href = "/dashboard"}
          className="px-8 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #059669, #10B981)", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

/* ─── Main engine ─── */
export default function PulseSurveyEngine({ onComplete }: Props) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [ratings, setRatings] = useState<Ratings>({});
  const [whys, setWhys] = useState<Whys>({});
  const [comment, setComment] = useState("");

  const answeredCount = Object.keys(ratings).length;
  const allAnswered = answeredCount === PULSE_QUESTIONS.length;

  function setRating(qId: string, val: number) {
    setRatings((p) => ({ ...p, [qId]: val }));
    // clear whys if rating bucket changes
    setWhys((p) => ({ ...p, [qId]: [] }));
  }

  function toggleWhy(qId: string, wId: string) {
    setWhys((p) => {
      const cur = p[qId] ?? [];
      return { ...p, [qId]: cur.includes(wId) ? cur.filter((x) => x !== wId) : [...cur, wId] };
    });
  }

  function submit() {
    onComplete(ratings, whys, comment);
    setDone(true);
  }

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;
  if (done) return <DoneScreen />;

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Hero header */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0F0C29 0%, #1a1740 50%, #064e3b 100%)" }}>
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)", filter: "blur(20px)" }} />

        <div className="relative max-w-2xl mx-auto px-4 pt-7 pb-6">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / PULSE_QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, #059669, #10B981)" }} />
            </div>
            <span className="text-xs font-bold flex-shrink-0" style={{ color: allAnswered ? "#6EE7B7" : "rgba(255,255,255,0.4)" }}>
              {answeredCount}/{PULSE_QUESTIONS.length}
              {allAnswered && <span className="ml-1">✓</span>}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-xl"
              style={{ background: "linear-gradient(135deg, #059669, #10B981)", boxShadow: "0 0 32px rgba(16,185,129,0.5)" }}>
              ⚡
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#6EE7B7" }}>ECHO 2.0</p>
              <h2 className="text-2xl font-black text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
                Rate each area
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div style={{ background: "#F5F5F7" }}>
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-3">
          {PULSE_QUESTIONS.map((q) => {
            const rating = ratings[q.id];
            const answered = rating !== undefined;
            const wyChips = answered ? getWhysForPulse(q, rating) : [];

            return (
              <div key={q.id} className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  border: `1px solid ${answered ? "#4F46E555" : "#EBEBED"}`,
                  boxShadow: answered ? "0 4px 20px rgba(79,70,229,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}>
                <div className="h-[3px] w-full" style={{ background: answered ? "linear-gradient(90deg, #4F46E5, #7C3AED)" : "transparent" }} />
                <div className="px-5 pt-4 pb-5">
                  {/* Question text — no section header */}
                  <p className="text-sm font-semibold mb-4 leading-snug" style={{ color: "#1A1A2E" }}>
                    {q.icon} {q.text}
                    {answered && (
                      <span className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full align-middle"
                        style={{ background: "#4F46E5", verticalAlign: "middle" }}>
                        <Check size={8} className="text-white" strokeWidth={3} />
                      </span>
                    )}
                  </p>

                  {/* Rating pills */}
                  <div className="flex gap-2 flex-wrap">
                    {RATING_OPTIONS.map((opt) => {
                      const sel = rating === opt.value;
                      return (
                        <button key={opt.value} onClick={() => setRating(q.id, opt.value)}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-200 select-none"
                          style={{
                            background: sel ? "#4F46E5" : "#F9FAFB",
                            borderColor: sel ? "#4F46E5" : "#E5E7EB",
                            color: sel ? "#fff" : "#6B7280",
                            boxShadow: sel ? "0 4px 14px rgba(79,70,229,0.4)" : "none",
                            transform: sel ? "scale(1.07) translateY(-1px)" : "scale(1)",
                          }}>
                          <span className="text-[15px] leading-none">{opt.emoji}</span>
                          <span className="hidden sm:inline">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Why chips — appear once rating is chosen */}
                  {answered && wyChips.length > 0 && (
                    <WhyChips
                      whys={wyChips}
                      selected={whys[q.id] ?? []}
                      onToggle={(wId) => toggleWhy(q.id, wId)}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Optional comment */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #EBEBED", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #4F46E5, #7C3AED, #10B981)" }} />
            <div className="px-5 pt-4 pb-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} style={{ color: "#6B7280" }} />
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Optional comment</p>
              </div>
              <p className="text-sm text-gray-500 mb-3">Anything else on your mind? Fully anonymous.</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any thoughts here…"
                rows={3}
                className="w-full rounded-xl border text-sm text-gray-700 placeholder-gray-300 p-4 resize-none focus:outline-none transition-all"
                style={{ borderColor: "#E5E7EB" }}
                onFocus={(e) => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <p className="text-xs text-gray-400">
              {allAnswered ? "All done — ready to submit." : `${PULSE_QUESTIONS.length - answeredCount} question${PULSE_QUESTIONS.length - answeredCount !== 1 ? "s" : ""} remaining`}
            </p>
            <button
              onClick={submit}
              disabled={!allAnswered}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition-all"
              style={{
                background: allAnswered ? "linear-gradient(135deg, #059669, #10B981)" : "#E5E7EB",
                color: allAnswered ? "#fff" : "#9CA3AF",
                cursor: allAnswered ? "pointer" : "not-allowed",
                boxShadow: allAnswered ? "0 4px 20px rgba(16,185,129,0.45)" : "none",
              }}
            >
              <Check size={15} />
              Submit pulse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
