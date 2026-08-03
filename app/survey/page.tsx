"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import EngagementSurveyEngine from "@/components/EngagementSurveyEngine";
import ToolFeedbackWidget from "@/components/ToolFeedbackWidget";

export default function SurveyPage() {
  const { user, isLoading } = useUser();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/api/auth/login?returnTo=/survey";
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#F4F5F9" }}>
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

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

  return (
    <>
      <EngagementSurveyEngine onComplete={handleComplete} />
      <ToolFeedbackWidget />
    </>
  );
}
