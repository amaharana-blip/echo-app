"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Ghost, MessageSquare } from "lucide-react";

interface Answer {
  questionId: string;
  value: string;
  question: { text: string; type: string };
}

interface SurveyResponse {
  id: string;
  isAnonymous: boolean;
  submittedAt: string;
  user: { name: string; email: string } | null;
  answers: Answer[];
}

interface Survey {
  title: string;
  isAnonymous?: boolean;
}

function relativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    value > (max * 3.5) / 5
      ? "bg-emerald-500"
      : value > (max * 2.5) / 5
      ? "bg-amber-400"
      : "bg-red-400";
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
      <div
        className={`${color} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ScoreColor(value: number, max = 5): string {
  if (value > (max * 3.5) / 5) return "text-emerald-600";
  if (value > (max * 2.5) / 5) return "text-amber-500";
  return "text-red-500";
}

function AnswerDisplay({ answer }: { answer: Answer }) {
  const type = answer.question.type;
  const val = answer.value;

  if (type === "RATING") {
    const n = Number(val);
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`h-3 w-3 rounded-full ${
              dot <= n ? "bg-indigo-500" : "bg-gray-200"
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">{n}/5</span>
      </div>
    );
  }

  if (type === "YES_NO") {
    return (
      <span
        className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          val.toLowerCase() === "yes"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-600"
        }`}
      >
        {val}
      </span>
    );
  }

  if (type === "NPS") {
    const n = Number(val);
    const color = n >= 9 ? "text-emerald-600" : n >= 7 ? "text-amber-500" : "text-red-500";
    return (
      <span className={`text-sm font-bold ${color}`}>{val} / 10</span>
    );
  }

  return <span className="text-sm text-gray-700">{val}</span>;
}

export default function SurveyResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/surveys/${params.id}`).then((r) => r.json()),
      fetch(`/api/responses/${params.id}`).then((r) => r.json()),
    ]).then(([s, r]) => {
      setSurvey(s);
      setResponses(Array.isArray(r) ? r : []);
      setLoading(false);
    });
  }, [params.id]);

  /* ── Rating aggregation ── */
  const avgByQuestion: Record<string, { total: number; count: number; label: string }> = {};
  responses.forEach((r) => {
    r.answers
      .filter((a) => a.question.type === "RATING")
      .forEach((a) => {
        const key = a.question.text;
        if (!avgByQuestion[key]) avgByQuestion[key] = { total: 0, count: 0, label: key };
        avgByQuestion[key].total += Number(a.value);
        avgByQuestion[key].count++;
      });
  });

  const ratingEntries = Object.entries(avgByQuestion);

  return (
    <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <div className="ml-0 md:ml-[240px] min-h-screen flex flex-col pb-20 md:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">
                {loading ? "Loading…" : (survey?.title ?? "Survey Results")}
              </h1>
              <p className="text-xs text-gray-400">Survey results &amp; individual responses</p>
            </div>
            {!loading && (
              <span className="flex-shrink-0 flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100">
                <MessageSquare size={12} />
                {responses.length} response{responses.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 px-6 py-8 max-w-4xl w-full mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Rating score cards */}
              {ratingEntries.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3">Score Summary</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ratingEntries.map(([q, { total, count }]) => {
                      const avg = total / count;
                      return (
                        <div
                          key={q}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                        >
                          <p className="text-xs text-gray-400 truncate mb-1" title={q}>
                            {q}
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-bold leading-none ${ScoreColor(avg)}`}>
                              {avg.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-400 font-medium">/5</span>
                            <span className="ml-auto text-xs text-gray-400">{count} response{count !== 1 ? "s" : ""}</span>
                          </div>
                          <ScoreBar value={avg} max={5} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Response list */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Individual Responses
                  {responses.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      ({responses.length})
                    </span>
                  )}
                </h2>

                {responses.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                      <MessageSquare size={22} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">No responses yet</p>
                    <p className="text-xs text-gray-400">
                      Responses will appear here once team members submit the survey.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {responses.map((r) => {
                      const isAnon = r.isAnonymous || !r.user;
                      const displayName = isAnon ? "Anonymous" : (r.user?.name ?? "Unknown");
                      const initials = isAnon ? null : getInitials(displayName);

                      return (
                        <div
                          key={r.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-indigo-100 hover:shadow transition-all"
                        >
                          {/* Response header */}
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                              {isAnon ? (
                                <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Ghost size={16} className="text-gray-400" />
                                </div>
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                  {initials}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                                {!isAnon && r.user?.email && (
                                  <p className="text-xs text-gray-400">{r.user.email}</p>
                                )}
                                {isAnon && (
                                  <p className="text-xs text-gray-400">Identity hidden</p>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                              {relativeDate(r.submittedAt)}
                            </span>
                          </div>

                          {/* Answer pairs */}
                          <div className="space-y-3">
                            {r.answers.map((a) => (
                              <div key={a.questionId} className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-gray-500">
                                  {a.question.text}
                                </span>
                                <AnswerDisplay answer={a} />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
