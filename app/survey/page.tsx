"use client";

import { useState } from "react";
import EngagementSurveyEngine from "@/components/EngagementSurveyEngine";

export default function SurveyPage() {
  const [submitting, setSubmitting] = useState(false);

  async function handleComplete(
    ratings: Record<string, number>,
    whys: Record<string, string[]>,
    comments: Record<string, string>
  ) {
    setSubmitting(true);
    try {
      await fetch("/api/engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratings, whys, comments }),
      });
    } catch {
      // done screen already shown
    } finally {
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#F4F5F9" }}>
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <EngagementSurveyEngine onComplete={handleComplete} />;
}
