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
      style={{ background: "linear-gradient(160deg, #032D60 0%, #0176D3 60%, #1B96FF 100%)" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-[-80px] right-[-60px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(27,150,255,0.35) 0%, transparent 70%)", animation: "sfOrb 12s ease-in-out infinite" }} />
      <div className="absolute bottom-[-60px] left-[-40px] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(1,118,211,0.3) 0%, transparent 70%)", animation: "sfOrb 16s ease-in-out infinite", animationDelay: "4s" }} />

      <div
        className="relative z-10 text-center max-w-lg w-full transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)" }}
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div className="relative h-20 w-20 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
            }}>
            <span className="text-4xl">💬</span>
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center"
              style={{ background: "#2E844A", boxShadow: "0 0 12px rgba(46,132,74,0.6)", border: "2px solid rgba(255,255,255,0.3)" }}>
              <Sparkles size={11} className="text-white" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Engage · Connect · Hear · Own
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-white mb-1 leading-tight" style={{ letterSpacing: "-0.03em" }}>
          ECHO
        </h1>
        <p className="text-lg font-semibold mb-6" style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.12em" }}>
          EMPLOYEE PULSE SURVEY
        </p>

        <p className="text-base leading-relaxed mb-2 text-white" style={{ opacity: 0.88 }}>
          Great teams don't guess — they listen. ECHO is how this team stays honest with itself, one voice at a time.
        </p>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
          Responses go directly to leadership as <strong style={{ color: "rgba(255,255,255,0.85)" }}>aggregated, anonymous insights</strong> — your identity is never revealed.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <Shield size={18} className="text-white" />, num: null, label: "Fully anonymous" },
            { icon: <span className="text-xl">⏱️</span>, num: 8, label: "minutes" },
            { icon: <span className="text-xl">📅</span>, num: 1, label: "time per month" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 rounded-xl py-4 px-3"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
              {item.icon}
              {item.num !== null && <span className="text-xl font-black text-white">~<AnimatedCount target={item.num} /></span>}
              <span className="text-[11px] font-semibold text-center text-white opacity-80">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Topics */}
        <div className="rounded-xl p-5 mb-8 text-left"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
            {ENGAGEMENT_SECTIONS.length} topics covered
          </p>
          <div className="flex flex-wrap gap-2">
            {ENGAGEMENT_SECTIONS.map((s) => (
              <span key={s.id} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}>
                <span>{s.icon}</span>{s.title}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button onClick={onStart}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "#FFFFFF",
            color: "#032D60",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)",
          }}>
          Start the survey
          <ChevronRight size={18} />
        </button>
        <p className="text-[11px] mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          No login required · responses are fully encrypted at rest
        </p>
      </div>

      <style>{`
        @keyframes sfOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
      `}</style>
    </div>
  );
}

/* ─── Compact rating pills ─── */
function RatingPills({
  questionId,
  currentRating,
  onRate,
}: {
  questionId: string;
  currentRating: number | undefined;
  onRate: (id: string, val: number) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {RATING_OPTIONS.map((opt) => {
        const sel = currentRating === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onRate(questionId, opt.value)}
            title={opt.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer"
            style={{
              background: sel ? "#E8F4FD" : "#F9FAFB",
              borderColor: sel ? "#0176D3" : "#E5E7EB",
              color: sel ? "#014486" : "#6B7280",
              boxShadow: sel ? "0 0 0 2px rgba(1,118,211,0.2)" : "none",
              transform: sel ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span className="text-base leading-none">{opt.emoji}</span>
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
}: {
  whys: { id: string; label: string; emoji: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-lg p-3 mt-2" style={{ background: "#F3F2F2", border: "1px solid #E5E5E5" }}>
      <p className="text-[11px] font-bold text-gray-400 mb-2 flex items-center gap-1">
        <span>💡</span> What&apos;s behind this? <span className="font-normal">(optional — pick all that apply)</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {whys.map((w) => {
          const active = selected.includes(w.id);
          return (
            <button
              key={w.id}
              onClick={() => onToggle(w.id)}
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-100"
              style={{
                background: active ? "#E8F4FD" : "#fff",
                borderColor: active ? "#0176D3" : "#E5E7EB",
                color: active ? "#014486" : "#6B7280",
                transform: active ? "scale(1.02)" : "scale(1)",
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
}: {
  question: EngQuestion;
  number: number;
  rating: number | undefined;
  selectedWhys: string[];
  onRate: (id: string, val: number) => void;
  onToggleWhy: (qId: string, wId: string) => void;
}) {
  const whys = rating !== undefined ? getWhysForQuestion(question, rating) : [];

  return (
    <div className="rounded-xl bg-white border overflow-hidden transition-all duration-200"
      style={{
        borderColor: rating !== undefined ? "#0176D3" : "#E5E7EB",
        boxShadow: rating !== undefined ? "0 0 0 1px rgba(1,118,211,0.15), 0 2px 8px rgba(1,118,211,0.08)" : "0 1px 3px rgba(0,0,0,0.06)",
      }}>
      <div className="px-5 pt-5 pb-4">
        {/* Question header */}
        <div className="flex items-start gap-3 mb-4">
          <span className="flex-shrink-0 h-6 w-6 rounded-full text-[11px] font-black flex items-center justify-center mt-0.5"
            style={{ background: "#E8F4FD", color: "#0176D3" }}>
            {number}
          </span>
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="text-xl leading-none flex-shrink-0 mt-0.5">{question.icon}</span>
            <p className="text-sm font-semibold text-gray-800 leading-snug">{question.text}</p>
          </div>
        </div>

        {/* Rating pills */}
        <RatingPills questionId={question.id} currentRating={rating} onRate={onRate} />

        {/* Why chips — appear after rating */}
        {rating !== undefined && whys.length > 0 && (
          <WhyChips
            whys={whys}
            selected={selectedWhys}
            onToggle={(wId) => onToggleWhy(question.id, wId)}
          />
        )}
      </div>

      {/* Selected indicator strip */}
      {rating !== undefined && (
        <div className="h-1 w-full" style={{ background: "#0176D3", opacity: 0.7 }} />
      )}
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
      <div className="bg-white rounded-xl p-7 shadow-sm" style={{ border: "1px solid #E5E7EB" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "#E8F4FD", border: "1px solid #C9E4F8" }}>
            {section.icon}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#0176D3" }}>Optional comment</p>
            <p className="text-sm font-bold text-gray-800">{section.title}</p>
          </div>
          <div className="ml-auto"><MessageSquare size={18} className="text-gray-300" /></div>
        </div>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Anything else on your mind about this topic? Completely optional — and fully anonymous.
        </p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Share your thoughts here…"
          rows={4}
          className="w-full rounded-lg border text-sm text-gray-700 placeholder-gray-300 p-4 resize-none focus:outline-none transition-all"
          style={{ borderColor: "#E5E7EB", boxShadow: "none" }}
          onFocus={(e) => { e.target.style.borderColor = "#0176D3"; e.target.style.boxShadow = "0 0 0 3px rgba(1,118,211,0.1)"; }}
          onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
        />
        <p className="text-[11px] text-gray-400 mt-2">
          Comments are grouped by theme before being shared with leadership. Your name is never attached.
        </p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 transition-all">
          <ArrowLeft size={15} />Back
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
          style={{ background: "#0176D3" }}>
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
      style={{ background: "linear-gradient(160deg, #032D60 0%, #0176D3 60%, #1B96FF 100%)" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}>
        <div className="h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 0 60px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.2)",
          }}>
          <Check size={40} style={{ color: "#2E844A" }} strokeWidth={2.5} />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
          <span className="text-xs font-bold text-white tracking-wide">Response recorded</span>
        </div>
        <h2 className="text-4xl font-black text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Thank you!</h2>
        <p className="text-base max-w-sm mx-auto mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
          Your ECHO response has been recorded. Your honesty makes this place better for everyone on the team.
        </p>
        <button onClick={() => window.location.href = "/dashboard"}
          className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
          style={{ background: "#FFFFFF", color: "#032D60", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

/* ─── Progress bar ─── */
function ProgressBar({ pct }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1" style={{ background: "#E8F4FD" }}>
      <div className="h-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%`, background: "#0176D3" }} />
    </div>
  );
}

/* ─── Section dots ─── */
function SectionDots({ current, total }: { current: number; total: number; color: string }) {
  return (
    <div className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-white border-b border-gray-100">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            background: i < current ? "#0176D3" : i === current ? "#032D60" : "#D8EDFC",
          }} />
      ))}
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

  if (screen.type === "comment") {
    return (
      <div className="min-h-screen" style={{ background: "#F3F2F2" }}>
        <ProgressBar pct={pct} color={section.color} />
        <SectionDots current={sectionIdx} total={ENGAGEMENT_SECTIONS.length} color={section.color} />
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
    <div className="min-h-screen pb-10" style={{ background: "#F3F2F2", fontFamily: "'Inter', sans-serif" }}>
      <ProgressBar pct={pct} color={section.color} />
      <SectionDots current={sectionIdx} total={ENGAGEMENT_SECTIONS.length} color={section.color} />

      {/* Section header — Salesforce navy */}
      <div className="sticky top-0 z-10" style={{ background: "#032D60", borderBottom: "2px solid #0176D3" }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              {section.icon}
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">
                Q{globalStart}–{globalEnd}
                <span className="ml-2 text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {section.title}
                </span>
              </p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                {answeredCount}/{sectionQuestions.length} answered
              </p>
            </div>
          </div>
          {/* Progress pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span className="text-[11px] font-bold text-white">
              {sectionIdx + 1} / {ENGAGEMENT_SECTIONS.length}
            </span>
          </div>
        </div>

        {/* Mini progress within section */}
        <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="h-full transition-all duration-300"
            style={{ width: `${(answeredCount / sectionQuestions.length) * 100}%`, background: "#1B96FF" }} />
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
          />
        ))}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button onClick={goBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 transition-all">
            <ArrowLeft size={15} />Back
          </button>

          <div className="flex items-center gap-3">
            {!allAnswered && (
              <span className="text-xs text-gray-400">
                {sectionQuestions.length - answeredCount} remaining
              </span>
            )}
            <button
              onClick={goNext}
              disabled={!allAnswered}
              className={cn("flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-bold text-white transition-all")}
              style={{
                background: allAnswered ? "#0176D3" : "#E5E7EB",
                color: allAnswered ? "#fff" : "#9CA3AF",
                cursor: allAnswered ? "pointer" : "not-allowed",
                boxShadow: allAnswered ? "0 4px 12px rgba(1,118,211,0.3)" : "none",
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
