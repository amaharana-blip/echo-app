"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ModuleSurveyEngine from "@/components/ModuleSurveyEngine";
import type { Module, ModuleInsights } from "@/lib/modules";

const SATISFACTION_MODULE: Module = {
  id: "satisfaction",
  slug: "satisfaction",
  title: "Work Satisfaction",
  description: "How fulfilled are you at work?",
  icon: "😊",
  color: "emerald",
  gradient: "from-emerald-500 to-teal-500",
  timeEstimate: "3 min",
  dimensions: [
    { id: "growth", label: "Growth & Development", description: "Career growth opportunities", riskThreshold: 2, color: "emerald" },
    { id: "belonging", label: "Belonging", description: "Sense of inclusion and fit", riskThreshold: 2, color: "blue" },
    { id: "purpose", label: "Purpose", description: "Meaning and mission alignment", riskThreshold: 2, color: "purple" },
    { id: "recognition_s", label: "Recognition", description: "Feeling valued", riskThreshold: 2, color: "amber" },
  ],
  questions: [
    {
      id: "s1",
      text: "My role gives me opportunities to grow",
      type: "CARD_SINGLE",
      dimension: "growth",
      required: true,
      cards: [
        { id: "strongly_agree", label: "Strongly agree", emoji: "🚀", color: "emerald" },
        { id: "agree", label: "Agree", emoji: "👍", color: "blue" },
        {
          id: "disagree", label: "Disagree", emoji: "😐", color: "amber",
          drillDown: {
            question: "What's holding back your growth?",
            type: "CARD_MULTI",
            dimension: "growth",
            cards: [
              { id: "no_mentor", label: "No mentorship", emoji: "🧑‍🏫" },
              { id: "no_budget", label: "No learning budget", emoji: "💰" },
              { id: "no_time", label: "No time to learn", emoji: "⏰" },
              { id: "wrong_role", label: "Wrong role for my goals", emoji: "🎯" },
              { id: "no_feedback", label: "No growth feedback", emoji: "💬" },
            ],
          },
        },
        { id: "strongly_disagree", label: "Strongly disagree", emoji: "❌", color: "red" },
      ],
    },
    {
      id: "s2",
      text: "I feel a sense of belonging on this team",
      type: "CARD_SINGLE",
      dimension: "belonging",
      required: true,
      cards: [
        { id: "def_yes", label: "Definitely yes", emoji: "🤝", color: "emerald" },
        { id: "mostly_yes", label: "Mostly yes", emoji: "😊", color: "blue" },
        {
          id: "not_sure", label: "Not sure", emoji: "🤷", color: "amber",
          drillDown: {
            question: "What makes belonging hard?",
            type: "CARD_MULTI",
            dimension: "belonging",
            cards: [
              { id: "excluded", label: "Often excluded", emoji: "🚪" },
              { id: "different", label: "Feel different from team", emoji: "🌍" },
              { id: "new", label: "Still finding my place", emoji: "🌱" },
              { id: "remote_b", label: "Remote isolation", emoji: "🏠" },
              { id: "cliques", label: "Cliques exist", emoji: "👥" },
            ],
          },
        },
        { id: "no", label: "Not really", emoji: "😔", color: "red" },
      ],
    },
    {
      id: "s3",
      text: "I find my work meaningful",
      type: "CARD_SINGLE",
      dimension: "purpose",
      required: true,
      cards: [
        { id: "very_meaningful", label: "Very meaningful", emoji: "🌟", color: "emerald" },
        { id: "somewhat", label: "Somewhat", emoji: "🙂", color: "blue" },
        { id: "neutral_p", label: "Neutral", emoji: "😐", color: "amber" },
        {
          id: "not_meaningful", label: "Not meaningful", emoji: "😔", color: "red",
          drillDown: {
            question: "What would make it more meaningful?",
            type: "CARD_MULTI",
            dimension: "purpose",
            cards: [
              { id: "impact", label: "More visible impact", emoji: "📈" },
              { id: "variety", label: "More varied work", emoji: "🎨" },
              { id: "autonomy", label: "More autonomy", emoji: "🔑" },
              { id: "mission_s", label: "Stronger company mission", emoji: "🧭" },
              { id: "people", label: "Better team culture", emoji: "🤝" },
            ],
          },
        },
      ],
    },
    {
      id: "s4",
      text: "I feel valued and recognized here",
      type: "CARD_SINGLE",
      dimension: "recognition_s",
      required: true,
      cards: [
        { id: "always_v", label: "Consistently", emoji: "🏆", color: "emerald" },
        { id: "often_v", label: "Often", emoji: "👏", color: "blue" },
        { id: "rarely_v", label: "Rarely", emoji: "😐", color: "amber" },
        { id: "never_v", label: "Never", emoji: "💔", color: "red" },
      ],
    },
  ],
};

export default function SatisfactionPage() {
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
          surveyId: SATISFACTION_MODULE.id,
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

  if (posting && !insights) {
    return (
      <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <main className="ml-0 md:ml-60 flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </main>
      </div>
    );
  }

  if (insights) {
    return (
      <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <main className="ml-0 md:ml-60 flex items-center justify-center min-h-screen pb-20 md:pb-0 px-4">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                className="text-white">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Satisfaction check complete!</h2>
              <p className="text-sm text-gray-500">Your response helps us improve your work experience.</p>
            </div>
            <Link
              href="/dashboard?success=satisfaction"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <main className="ml-0 md:ml-60">
        <ModuleSurveyEngine module={SATISFACTION_MODULE} onComplete={handleComplete} />
      </main>
    </div>
  );
}
