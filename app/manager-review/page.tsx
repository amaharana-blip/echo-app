"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ModuleSurveyEngine from "@/components/ModuleSurveyEngine";
import { MANAGER_MODULE, type ModuleInsights } from "@/lib/modules";

export default function ManagerReviewPage() {
  const router = useRouter();
  const [posting, setPosting] = useState(false);

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
          surveyId: MANAGER_MODULE.id,
          isAnonymous: false,
          answers: Object.entries(answers).map(([qId, vals]) => ({
            questionId: qId,
            value: JSON.stringify(vals),
          })),
        }),
      });
      router.push("/dashboard?success=manager-review");
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
            <div className="h-8 w-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
          </div>
        ) : (
          <ModuleSurveyEngine module={MANAGER_MODULE} onComplete={handleComplete} />
        )}
      </main>
    </div>
  );
}
