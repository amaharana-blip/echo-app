"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CardQuestion from "@/components/CardQuestion";
import type { Question } from "@/lib/modules";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */
interface RawQuestion {
  id: string;
  text: string;
  subtext?: string;
  type: string;
  cards: string;
  order: number;
}

interface Survey {
  id: string;
  title: string;
  module: string;
  questions: RawQuestion[];
}

/* ── eNPS score band ── */
function scoreBand(score: number): "detractor" | "passive" | "promoter" {
  if (score <= 6) return "detractor";
  if (score <= 8) return "passive";
  return "promoter";
}

const FOLLOW_UP_QUESTIONS: Record<"detractor" | "passive" | "promoter", Question> = {
  detractor: {
    id: "followup-detractor",
    text: "What would make the biggest difference?",
    subtext: "Select all that apply.",
    type: "CARD_MULTI",
    dimension: "enps",
    cards: [
      { id: "1", label: "Better management",        color: "red" },
      { id: "2", label: "Less burnout",             color: "red" },
      { id: "3", label: "Growth opportunities",     color: "amber" },
      { id: "4", label: "Better pay",               color: "amber" },
      { id: "5", label: "Clearer direction",        color: "amber" },
      { id: "6", label: "Team improvements",        color: "blue" },
      { id: "7", label: "Work-life balance",        color: "blue" },
      { id: "8", label: "Better tools",             color: "blue" },
    ],
  },
  passive: {
    id: "followup-passive",
    text: "What's one thing we could improve?",
    subtext: "Select all that apply.",
    type: "CARD_MULTI",
    dimension: "enps",
    cards: [
      { id: "1", label: "Career growth",            color: "amber" },
      { id: "2", label: "Recognition",              color: "amber" },
      { id: "3", label: "Team collaboration",       color: "blue" },
      { id: "4", label: "Management effectiveness", color: "blue" },
      { id: "5", label: "Company direction",        color: "blue" },
      { id: "6", label: "Flexibility / remote",     color: "amber" },
      { id: "7", label: "Compensation",             color: "amber" },
      { id: "8", label: "Communication",            color: "blue" },
    ],
  },
  promoter: {
    id: "followup-promoter",
    text: "What do you love most?",
    subtext: "Select all that apply.",
    type: "CARD_MULTI",
    dimension: "enps",
    cards: [
      { id: "1", label: "Great culture",            color: "emerald" },
      { id: "2", label: "Strong leadership",        color: "emerald" },
      { id: "3", label: "Exciting mission",         color: "emerald" },
      { id: "4", label: "Amazing teammates",        color: "emerald" },
      { id: "5", label: "Growth & learning",        color: "emerald" },
      { id: "6", label: "Work-life balance",        color: "emerald" },
      { id: "7", label: "Compensation",             color: "blue" },
      { id: "8", label: "Flexibility",              color: "blue" },
    ],
  },
};

const SUCCESS_MESSAGES: Record<"detractor" | "passive" | "promoter", { title: string; subtitle: string }> = {
  detractor: {
    title: "Thank you for your honesty",
    subtitle: "Your candid feedback helps us make meaningful changes. We hear you.",
  },
  passive: {
    title: "Thanks for sharing!",
    subtitle: "Your input helps us understand what to improve. We're listening.",
  },
  promoter: {
    title: "Love to hear it!",
    subtitle: "Thanks for being an advocate. Your enthusiasm makes the team stronger.",
  },
};

/* ── eNPS score button colours ── */
function enpsButtonClass(score: number, selected: boolean): string {
  if (selected) {
    if (score <= 6) return "bg-red-500 text-white border-red-500 scale-110 shadow-md";
    if (score <= 8) return "bg-amber-500 text-white border-amber-500 scale-110 shadow-md";
    return "bg-green-500 text-white border-green-500 scale-110 shadow-md";
  }
  if (score <= 6)
    return "border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300";
  if (score <= 8)
    return "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:border-amber-300";
  return "border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-300";
}

export default function ENPSPage() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [enpsQuestionId, setEnpsQuestionId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Step: "nps" | "followup" | "success"
  const [step, setStep] = useState<"nps" | "followup" | "success">("nps");
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [followupAnswer, setFollowupAnswer] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/surveys")
      .then((r) => r.json())
      .then((data: Survey[]) => {
        const s = Array.isArray(data)
          ? data.find((sv) => sv.module === "ENPS") ?? null
          : null;
        if (s) {
          setSurvey(s);
          const enpsQ = s.questions.find((q) => q.type === "ENPS");
          if (enpsQ) setEnpsQuestionId(enpsQ.id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const band = selectedScore !== null ? scoreBand(selectedScore) : null;
  const followupQuestion = band ? FOLLOW_UP_QUESTIONS[band] : null;

  function handleScoreSelect(score: number) {
    setSelectedScore(score);
    setStep("followup");
  }

  async function handleSubmit() {
    if (!survey || selectedScore === null) return;
    setSubmitting(true);
    setError(null);

    try {
      // Build answers: eNPS score + follow-up
      const answers = [
        {
          questionId: enpsQuestionId,
          value: String(selectedScore),
        },
      ];

      // Find the CARD_MULTI question for follow-up
      const followupQ = survey.questions.find((q) => q.type === "CARD_MULTI");
      if (followupQ && followupAnswer.length > 0) {
        answers.push({
          questionId: followupQ.id,
          value: followupAnswer.join(","),
        });
      }

      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: survey.id,
          answers,
          isAnonymous: true,
        }),
      });

      if (!res.ok && res.status !== 409) {
        throw new Error("Submission failed");
      }
      setStep("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <main className="ml-0 md:ml-60 flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </main>
      </div>
    );
  }

  /* ── Success state ── */
  if (step === "success" && band) {
    const msg = SUCCESS_MESSAGES[band];
    const iconBg =
      band === "promoter"
        ? "bg-green-500"
        : band === "passive"
        ? "bg-amber-500"
        : "bg-indigo-600";

    return (
      <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <main className="ml-0 md:ml-60 flex items-center justify-center min-h-screen pb-20 md:pb-0 px-4">
          <div className="text-center space-y-5">
            <div
              className={cn(
                "mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-lg",
                iconBg
              )}
              style={{ animation: "scale-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both" }}
            >
              <CheckCircle2 size={40} className="text-white" strokeWidth={2} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{msg.title}</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">{msg.subtitle}</p>
            </div>

            <Link
              href="/dashboard"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
        <style>{`
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.5); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main className="ml-0 md:ml-60 flex flex-col items-center justify-center min-h-screen pb-24 md:pb-0 px-4">
        <div className="w-full max-w-xl space-y-8">

          {/* ── Step: NPS score ── */}
          {step === "nps" && (
            <>
              <div className="text-center space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                  eNPS
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  How likely are you to recommend working here?
                </h1>
                <p className="text-sm text-gray-500">
                  On a scale of 0 (not at all) to 10 (extremely likely)
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="grid grid-cols-5 md:grid-cols-11 gap-2">
                  {Array.from({ length: 11 }, (_, i) => i).map((score) => (
                    <button
                      key={score}
                      type="button"
                      aria-label={`Score ${score}`}
                      onClick={() => handleScoreSelect(score)}
                      className={cn(
                        "aspect-square flex items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                        enpsButtonClass(score, false)
                      )}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 px-0.5">
                  <span>Not likely</span>
                  <span>Extremely likely</span>
                </div>
              </div>
            </>
          )}

          {/* ── Step: Follow-up ── */}
          {step === "followup" && followupQuestion && band && (
            <>
              {/* Show selected score */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setStep("nps"); setFollowupAnswer([]); }}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  ← Change score
                </button>
                <span
                  className={cn(
                    "text-sm font-semibold px-3 py-1 rounded-full",
                    band === "promoter"
                      ? "bg-green-100 text-green-700"
                      : band === "passive"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  Score: {selectedScore}
                </span>
              </div>

              {/* Follow-up card */}
              <div
                className={cn(
                  "bg-white rounded-2xl shadow-sm border-2 p-6",
                  band === "promoter"
                    ? "border-green-200"
                    : band === "passive"
                    ? "border-amber-200"
                    : "border-red-200"
                )}
              >
                <CardQuestion
                  question={followupQuestion}
                  value={followupAnswer}
                  onChange={setFollowupAnswer}
                  disabled={submitting}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
