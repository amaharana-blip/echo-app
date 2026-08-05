"use client";

import { useState, useEffect } from "react";
import {
  ENGAGEMENT_SECTIONS,
  RATING_OPTIONS,
  type EngQuestion,
} from "@/lib/engagementSurvey";
import { ChevronRight, ArrowLeft, Check, MessageSquare, Sparkles, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Ratings = Record<string, number>;
type Whys = Record<string, string[]>;
type Comments = Record<string, string>;

interface Props {
  onComplete: (ratings: Ratings, whys: Whys, comments: Comments) => void;
}

type Screen =
  | { type: "welcome" }
  | { type: "section"; sectionIdx: number }
  | { type: "comment"; sectionIdx: number }
  | { type: "done" };

function getWhysForQuestion(question: EngQuestion, rating: number) {
  if (rating >= 4) return question.positiveWhys;
  if (rating === 3) return question.neutralWhys;
  return question.negativeWhys;
}

function totalQuestions() {
  return ENGAGEMENT_SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);
}
function questionsBefore(si: number) {
  return ENGAGEMENT_SECTIONS.slice(0, si).reduce((s, sec) => s + sec.questions.length, 0);
}
function progressPercent(screen: Screen): number {
  if (screen.type === "welcome") return 0;
  if (screen.type === "done") return 100;
  const total = totalQuestions();
  const before = questionsBefore(screen.sectionIdx);
  if (screen.type === "comment") {
    return Math.round(((before + ENGAGEMENT_SECTIONS[screen.sectionIdx].questions.length) / total) * 100);
  }
  return Math.round((before / total) * 100);
}

/* ─── animated number ─── */
function AnimatedCount({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const dur = 600;
    function tick(now: number) {
      const t = Math.min((now - start) / dur, 1);
      setVal(Math.round(t * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <>{val}</>;
}

/* ─── Welcome screen ─── */
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
          [85,33,1.0,0.3,"3.6s","0.9s"],[96,59,1.8,0.7,"2.2s","2.3s"],[12,67,2.0,0.8,"3.0s","1.3s"],
          [25,3,1.4,0.5,"2.8s","0.0s"],[48,48,1.2,0.4,"3.4s","1.6s"],[63,15,2.4,0.9,"2.6s","2.2s"],
          [77,72,1.6,0.6,"3.8s","0.4s"],[90,26,1.0,0.3,"2.3s","1.0s"],[3,38,1.8,0.7,"3.2s","1.8s"],
          [18,84,2.0,0.6,"2.9s","0.6s"],[35,61,1.4,0.5,"3.5s","2.5s"],[50,30,1.2,0.4,"2.4s","1.2s"],
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
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)", animation: "floatOrb 14s ease-in-out infinite", animationDelay: "3s" }} />
      {/* Salesforce blue accent orb */}
      <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(1,118,211,0.15) 0%, transparent 70%)", animation: "floatOrb 18s ease-in-out infinite", animationDelay: "6s" }} />

      <div
        className="relative z-10 text-center max-w-lg w-full transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative h-24 w-24 rounded-[28px] flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #A855F7 100%)", boxShadow: "0 0 60px rgba(99,102,241,0.5), 0 20px 40px rgba(0,0,0,0.4)" }}>
            <span className="text-5xl">💬</span>
            <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full flex items-center justify-center"
              style={{ background: "#10B981", boxShadow: "0 0 12px rgba(16,185,129,0.6)" }}>
              <Sparkles size={12} className="text-white" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
          style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", color: "#A5B4FC" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Engage · Connect · Hear · Own
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-white mb-2 leading-tight" style={{ letterSpacing: "-0.03em" }}>Welcome to</h1>
        <h1 className="text-5xl font-black mb-2 leading-tight"
          style={{ letterSpacing: "-0.03em", background: "linear-gradient(90deg, #818CF8, #A78BFA, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ECHO
        </h1>
        <p className="text-sm font-semibold tracking-widest uppercase mb-5" style={{ color: "rgba(165,180,252,0.5)" }}>
          Engage · Connect · Hear · Own
        </p>

        <p className="text-base leading-relaxed mb-2" style={{ color: "rgba(199,210,254,0.8)" }}>
          Great teams don&apos;t guess — they listen. ECHO is how this team stays honest with itself, one voice at a time.
        </p>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(165,180,252,0.5)" }}>
          Responses go directly to leadership as <strong style={{ color: "rgba(165,180,252,0.8)" }}>aggregated, anonymous insights</strong> — your identity is never revealed.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "🔒", num: null, label: "Fully anonymous" },
            { icon: "⏱️", num: 8, label: "minutes" },
            { icon: "📅", num: 1, label: "time per month" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-2xl py-4 px-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-2xl">{item.icon}</span>
              {item.num !== null && <span className="text-xl font-black text-white">~<AnimatedCount target={item.num} /></span>}
              <span className="text-[11px] font-semibold text-center" style={{ color: "rgba(165,180,252,0.7)" }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Topics */}
        <div className="rounded-2xl p-5 mb-8 text-left"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(165,180,252,0.5)" }}>
            {ENGAGEMENT_SECTIONS.length} topics covered
          </p>
          <div className="flex flex-wrap gap-2">
            {ENGAGEMENT_SECTIONS.map((s) => (
              <span key={s.id} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#A5B4FC" }}>
                <span>{s.icon}</span>{s.title}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button onClick={onStart}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", boxShadow: "0 8px 32px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.08)" }}>
          Start the survey
          <ChevronRight size={18} />
        </button>
        <p className="text-[11px] mt-4" style={{ color: "rgba(165,180,252,0.35)" }}>No login required · responses are fully encrypted at rest</p>
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.8;transform:scale(1.3)} }
        @keyframes floatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
      `}</style>
    </div>
  );
}

/* ─── Rating pills ─── */
function RatingPills({
  questionId,
  currentRating,
  onRate,
  sectionColor,
}: {
  questionId: string;
  currentRating: number | undefined;
  onRate: (id: string, val: number) => void;
  sectionColor: string;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {RATING_OPTIONS.map((opt) => {
        const sel = currentRating === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onRate(questionId, opt.value)}
            title={opt.label}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer select-none"
            style={{
              background: sel ? sectionColor : "#F9FAFB",
              borderColor: sel ? sectionColor : "#E5E7EB",
              color: sel ? "#fff" : "#6B7280",
              boxShadow: sel ? `0 4px 14px ${sectionColor}50` : "none",
              transform: sel ? "scale(1.07) translateY(-1px)" : "scale(1)",
            }}
          >
            <span className="text-[15px] leading-none">{opt.emoji}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Why chips ─── */
function WhyChips({
  whys,
  selected,
  onToggle,
  sectionColor,
}: {
  whys: { id: string; label: string; emoji: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  sectionColor: string;
}) {
  return (
    <div className="rounded-xl p-3.5 mt-3" style={{ background: "#F8F8FC", border: `1px solid ${sectionColor}22` }}>
      <p className="text-[11px] font-bold mb-2.5 flex items-center gap-1.5" style={{ color: sectionColor }}>
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
                background: active ? sectionColor : "#fff",
                borderColor: active ? sectionColor : "#E5E7EB",
                color: active ? "#fff" : "#6B7280",
                boxShadow: active ? `0 2px 8px ${sectionColor}40` : "none",
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

/* ─── Question row (within a section page) ─── */
function QuestionRow({
  question,
  number,
  rating,
  selectedWhys,
  onRate,
  onToggleWhy,
  sectionColor,
  sectionGradient,
}: {
  question: EngQuestion;
  number: number;
  rating: number | undefined;
  selectedWhys: string[];
  onRate: (id: string, val: number) => void;
  onToggleWhy: (qId: string, wId: string) => void;
  sectionColor: string;
  sectionGradient: string;
}) {
  const whys = rating !== undefined ? getWhysForQuestion(question, rating) : [];
  const answered = rating !== undefined;

  return (
    <div className="rounded-2xl bg-white overflow-hidden transition-all duration-300"
      style={{
        border: `1px solid ${answered ? sectionColor + "55" : "#EBEBED"}`,
        boxShadow: answered
          ? `0 0 0 1px ${sectionColor}20, 0 4px 20px ${sectionColor}14`
          : "0 1px 4px rgba(0,0,0,0.05)",
      }}>
      {/* Colored top accent bar when answered */}
      <div className="h-[3px] w-full transition-all duration-500"
        style={{ background: answered ? sectionGradient : "transparent" }} />

      <div className="px-5 pt-4 pb-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="flex-shrink-0 h-6 w-6 rounded-full text-[11px] font-black flex items-center justify-center mt-0.5 flex-none"
            style={{
              background: answered ? sectionColor : "#F0F0F2",
              color: answered ? "#fff" : "#9CA3AF",
            }}>
            {answered ? <Check size={11} strokeWidth={3} /> : number}
          </span>
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <span className="text-xl leading-none flex-shrink-0 mt-0.5">{question.icon}</span>
            <p className="text-sm font-semibold leading-snug" style={{ color: "#1A1A2E" }}>{question.text}</p>
          </div>
        </div>

        <RatingPills questionId={question.id} currentRating={rating} onRate={onRate} sectionColor={sectionColor} />

        {answered && whys.length > 0 && (
          <WhyChips
            whys={whys}
            selected={selectedWhys}
            onToggle={(wId) => onToggleWhy(question.id, wId)}
            sectionColor={sectionColor}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Comment screen ─── */
function CommentScreen({
  section,
  value,
  onChange,
  onNext,
  onBack,
  isLast,
}: {
  section: (typeof ENGAGEMENT_SECTIONS)[0];
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLast: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 w-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: `1px solid ${section.color}30` }}>
        {/* Section color header stripe */}
        <div className="h-1.5 w-full" style={{ background: section.gradient }} />
        <div className="p-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: section.color + "18", border: `1px solid ${section.color}30` }}>
              {section.icon}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: section.color }}>Optional comment</p>
              <p className="text-base font-black text-gray-900">{section.title}</p>
            </div>
            <div className="ml-auto h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "#F5F5F7" }}>
              <MessageSquare size={16} className="text-gray-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Anything else on your mind about <strong style={{ color: "#1A1A2E" }}>{section.title.toLowerCase()}</strong>? Completely optional — and fully anonymous.
          </p>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Share your thoughts here…"
            rows={4}
            className="w-full rounded-xl border text-sm text-gray-700 placeholder-gray-300 p-4 resize-none focus:outline-none transition-all"
            style={{ borderColor: "#E5E7EB" }}
            onFocus={(e) => { e.target.style.borderColor = section.color; e.target.style.boxShadow = `0 0 0 3px ${section.color}20`; }}
            onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
          />
          <p className="text-[11px] text-gray-400 mt-2.5 flex items-center gap-1.5">
            <Shield size={11} />
            Comments are grouped by theme. Your name is never attached.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 transition-all">
          <ArrowLeft size={15} />Back
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: section.gradient, boxShadow: `0 4px 16px ${section.color}40` }}>
          {isLast ? <><Check size={15} />Submit survey</> : <>Next section<ChevronRight size={15} /></>}
        </button>
      </div>
    </div>
  );
}

/* ─── Done screen ─── */
function DoneScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0F0C29 0%, #1E1B4B 50%, #24243e 100%)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 60%)" }} />
      <div className="relative z-10 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}>
        <div className="h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          style={{ background: "linear-gradient(135deg, #059669, #10B981)", boxShadow: "0 0 60px rgba(16,185,129,0.4), 0 20px 40px rgba(0,0,0,0.4)" }}>
          <Check size={40} className="text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: "-0.02em" }}>You&apos;re done! 🎉</h2>
        <p className="text-base max-w-sm mx-auto mb-8 leading-relaxed" style={{ color: "rgba(199,210,254,0.7)" }}>
          Your ECHO response has been recorded. Your honesty makes this place better for everyone on the team.
        </p>
        <button onClick={() => window.location.href = "/dashboard"}
          className="px-8 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

/* ─── Progress bar ─── */
function ProgressBar({ pct, gradient }: { pct: number; gradient: string }) {
  return (
    <div className="w-full h-1" style={{ background: "#EBEBED" }}>
      <div className="h-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%`, background: gradient }} />
    </div>
  );
}

/* ─── Section dots ─── */
function SectionDots({ current, total, sectionColors }: { current: number; total: number; sectionColors: string[] }) {
  return (
    <div className="w-full flex items-center justify-center gap-2 py-3 bg-white border-b border-gray-100">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="rounded-full transition-all duration-300 flex items-center justify-center"
            style={{
              width: active ? 24 : done ? 8 : 6,
              height: active ? 8 : done ? 8 : 6,
              background: done ? sectionColors[i] : active ? sectionColors[i] : "#E5E7EB",
              opacity: done ? 0.6 : 1,
            }} />
        );
      })}
    </div>
  );
}

/* ─── MAIN ENGINE ─── */
export default function EngagementSurveyEngine({ onComplete }: Props) {
  const [screen, setScreen] = useState<Screen>({ type: "welcome" });
  const [ratings, setRatings] = useState<Ratings>({});
  const [whys, setWhys] = useState<Whys>({});
  const [comments, setComments] = useState<Comments>({});

  const pct = progressPercent(screen);

  const setRating = (questionId: string, value: number) =>
    setRatings((p) => ({ ...p, [questionId]: value }));

  const toggleWhy = (questionId: string, whyId: string) => {
    setWhys((p) => {
      const cur = p[questionId] ?? [];
      return { ...p, [questionId]: cur.includes(whyId) ? cur.filter((x) => x !== whyId) : [...cur, whyId] };
    });
  };

  const setComment = (sectionId: string, value: string) =>
    setComments((p) => ({ ...p, [sectionId]: value }));

  function goNext() {
    if (screen.type === "welcome") { setScreen({ type: "section", sectionIdx: 0 }); return; }
    if (screen.type === "section") {
      setScreen({ type: "comment", sectionIdx: screen.sectionIdx });
      return;
    }
    if (screen.type === "comment") {
      const { sectionIdx } = screen;
      if (sectionIdx < ENGAGEMENT_SECTIONS.length - 1) {
        setScreen({ type: "section", sectionIdx: sectionIdx + 1 });
      } else {
        onComplete(ratings, whys, comments);
        setScreen({ type: "done" });
      }
    }
  }

  function goBack() {
    if (screen.type === "section") {
      const { sectionIdx } = screen;
      if (sectionIdx > 0) {
        setScreen({ type: "comment", sectionIdx: sectionIdx - 1 });
      } else {
        setScreen({ type: "welcome" });
      }
      return;
    }
    if (screen.type === "comment") {
      setScreen({ type: "section", sectionIdx: screen.sectionIdx });
    }
  }

  if (screen.type === "welcome") return <WelcomeScreen onStart={goNext} />;
  if (screen.type === "done") return <DoneScreen />;

  const { sectionIdx } = screen;
  const section = ENGAGEMENT_SECTIONS[sectionIdx];

  const sectionColors = ENGAGEMENT_SECTIONS.map((s) => s.color);

  if (screen.type === "comment") {
    return (
      <div className="min-h-screen" style={{ background: "#F5F5F7" }}>
        <ProgressBar pct={pct} gradient={section.gradient} />
        <SectionDots current={sectionIdx} total={ENGAGEMENT_SECTIONS.length} sectionColors={sectionColors} />
        <CommentScreen
          section={section}
          value={comments[section.id] ?? ""}
          onChange={(v) => setComment(section.id, v)}
          onNext={goNext}
          onBack={goBack}
          isLast={sectionIdx === ENGAGEMENT_SECTIONS.length - 1}
        />
      </div>
    );
  }

  /* ─── Section page: all questions ─── */
  const sectionQuestions = section.questions;
  const allAnswered = sectionQuestions.every((q) => ratings[q.id] !== undefined);
  const answeredCount = sectionQuestions.filter((q) => ratings[q.id] !== undefined).length;
  const globalStart = questionsBefore(sectionIdx) + 1;
  const globalEnd = globalStart + sectionQuestions.length - 1;

  return (
    <div className="min-h-screen pb-10" style={{ background: "#F5F5F7", fontFamily: "'Inter', sans-serif" }}>
      <ProgressBar pct={pct} gradient={section.gradient} />
      <SectionDots current={sectionIdx} total={ENGAGEMENT_SECTIONS.length} sectionColors={sectionColors} />

      {/* Section header */}
      <div className="sticky top-0 z-10 overflow-hidden" style={{ background: "#0F0C29" }}>
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* section color glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(90deg, ${section.color}22 0%, transparent 60%)` }} />

        <div className="relative max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: section.color + "30", border: `1px solid ${section.color}50` }}>
              {section.icon}
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight tracking-tight">
                {section.title}
                <span className="ml-2 text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Q{globalStart}–{globalEnd}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px]" style={{ color: section.color + "cc" }}>
                  {answeredCount}/{sectionQuestions.length} answered
                </span>
                {answeredCount === sectionQuestions.length && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: section.color + "30", color: section.color }}>
                    <Check size={9} strokeWidth={3} /> Done
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-black text-white">{sectionIdx + 1}<span className="font-medium opacity-40">/{ENGAGEMENT_SECTIONS.length}</span></span>
            <span className="text-[10px] font-medium opacity-40 text-white">sections</span>
          </div>
        </div>

        {/* Section-colored mini progress */}
        <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full transition-all duration-300"
            style={{ width: `${(answeredCount / sectionQuestions.length) * 100}%`, background: section.gradient }} />
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {sectionQuestions.map((q, i) => (
          <QuestionRow
            key={q.id}
            question={q}
            number={globalStart + i}
            rating={ratings[q.id]}
            selectedWhys={whys[q.id] ?? []}
            onRate={setRating}
            onToggleWhy={toggleWhy}
            sectionColor={section.color}
            sectionGradient={section.gradient}
          />
        ))}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button onClick={goBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 transition-all">
            <ArrowLeft size={15} />Back
          </button>

          <div className="flex items-center gap-3">
            {!allAnswered && (
              <span className="text-xs text-gray-400">
                {sectionQuestions.length - answeredCount} left
              </span>
            )}
            <button
              onClick={goNext}
              disabled={!allAnswered}
              className={cn("flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all")}
              style={{
                background: allAnswered ? section.gradient : "#E5E7EB",
                color: allAnswered ? "#fff" : "#9CA3AF",
                cursor: allAnswered ? "pointer" : "not-allowed",
                boxShadow: allAnswered ? `0 4px 16px ${section.color}40` : "none",
                transform: allAnswered ? "scale(1)" : "scale(1)",
              }}
            >
              {allAnswered ? (
                <>Continue<ChevronRight size={15} /></>
              ) : (
                <>Answer all to continue</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
