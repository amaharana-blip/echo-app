"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ModuleSurveyEngine from "@/components/ModuleSurveyEngine";
import { BURNOUT_MODULE, type ModuleInsights } from "@/lib/modules";

export default function BurnoutPage() {
  const router = useRouter();
  const [posting, setPosting] = useState(false);
  const [insights, setInsights] = useState<ModuleInsights | null>(null);

  async function handleComplete(
    answers: Record<string, string[]>,
    moduleInsights: ModuleInsights
  ) {
    setPosting(true);
    try {
      await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: BURNOUT_MODULE.id,
          isAnonymous: false,
          answers: Object.entries(answers).map(([qId, vals]) => ({
            questionId: qId,
            value: JSON.stringify(vals),
          })),
        }),
      });
      setInsights(moduleInsights);
    } catch {
      setPosting(false);
    }
  }

  /* ── Loading / posting ── */
  if (posting && !insights) {
    return (
      <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <main className="ml-0 md:ml-60 flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </main>
      </div>
    );
  }

  /* ── Post-submit: compassionate message if high risk ── */
  if (insights) {
    const isHighRisk = insights.overallRiskPercent > 60;

    return (
      <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <main className="ml-0 md:ml-60 flex items-center justify-center min-h-screen pb-20 md:pb-0 px-4">
          <div className="w-full max-w-sm text-center space-y-6">
            {/* Check icon */}
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 shadow-lg"
              style={{ animation: "scale-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={40}
                height={40}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Burnout check complete</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Thank you for being honest with yourself. It takes courage.
              </p>
            </div>

            {/* Compassionate card for high-risk results */}
            {isHighRisk && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left space-y-3">
                <p className="text-amber-800 font-semibold text-sm">We hear you.</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Your responses suggest you may be carrying a heavy load right now.
                  Consider reaching out to your manager or HR — you don&apos;t have to
                  work through this alone.
                </p>
                <Link
                  href="/cases/new"
                  className="inline-block mt-1 text-sm font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
                >
                  Raise a confidential case &rarr;
                </Link>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              {!isHighRisk && (
                <Link
                  href="/cases/new"
                  className="inline-block border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
                  Report an issue anonymously
                </Link>
              )}
              <Link
                href="/dashboard?success=burnout"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                Back to dashboard
              </Link>
            </div>
          </div>

          <style>{`
            @keyframes scale-in {
              from { opacity: 0; transform: scale(0.5); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </main>
      </div>
    );
  }

  /* ── Survey ── */
  return (
    <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <main className="ml-0 md:ml-60">
        <ModuleSurveyEngine module={BURNOUT_MODULE} onComplete={handleComplete} />
      </main>
    </div>
  );
}
