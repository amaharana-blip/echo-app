"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ModuleSurveyEngine from "@/components/ModuleSurveyEngine";
import { PULSE_MODULE, type ModuleInsights } from "@/lib/modules";

export default function PulsePage() {
  const router = useRouter();
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState(false);

  async function handleComplete(
    answers: Record<string, string[]>,
    _insights: ModuleInsights
  ) {
    setPosting(true);
    try {
      await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: PULSE_MODULE.id,
          isAnonymous: false,
          answers: Object.entries(answers).map(([qId, vals]) => ({
            questionId: qId,
            value: JSON.stringify(vals),
          })),
        }),
      });
      setToast(true);
      setTimeout(() => {
        router.push("/dashboard?success=pulse");
      }, 1200);
    } catch {
      setPosting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <main className="ml-0 md:ml-60">
        {posting ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          </div>
        ) : (
          <ModuleSurveyEngine module={PULSE_MODULE} onComplete={handleComplete} />
        )}
      </main>

      {/* Success toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-fade-in"
          style={{ animation: "slide-up 0.3s ease-out both" }}
        >
          <span className="text-emerald-400">✓</span>
          Pulse submitted — thanks for checking in!
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
