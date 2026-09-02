"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PulseSurveyEngine from "@/components/PulseSurveyEngine";

function PulseSurveyInner() {
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("t") ?? undefined;

  async function handleComplete(
    ratings: Record<string, number>,
    whys: Record<string, string[]>,
    comment: string
  ) {
    setSubmitting(true);
    try {
      await fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratings, whys, comment, token }),
      });
    } catch {
      // done screen already shown by engine
    } finally {
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "linear-gradient(160deg, #0F0C29 0%, #1E1B4B 50%, #24243e 100%)" }}
      >
        <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <PulseSurveyEngine onComplete={handleComplete} />;
}

export default function PulseSurveyPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ background: "linear-gradient(160deg, #0F0C29 0%, #1E1B4B 50%, #24243e 100%)" }}
        >
          <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <PulseSurveyInner />
    </Suspense>
  );
}
