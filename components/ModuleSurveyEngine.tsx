"use client";

import { useState } from "react";
import CardQuestion from "@/components/CardQuestion";
import { computeInsights, type Module, type Card, type ModuleInsights } from "@/lib/modules";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronRight, Check } from "lucide-react";
import InsightsScreen from "@/components/InsightsScreen";

interface Props {
  module: Module;
  onComplete: (answers: Record<string, string[]>, insights: ModuleInsights) => void;
}

export default function ModuleSurveyEngine({ module, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [drillDownCard, setDrillDownCard] = useState<Card | null>(null);
  const [drillDownAnswers, setDrillDownAnswers] = useState<Record<string, string[]>>({});
  const [showInsights, setShowInsights] = useState(false);

  const total = module.questions.length;
  const currentQuestion = module.questions[step];
  const currentAnswer = answers[currentQuestion?.id] ?? [];
  const hasAnswer = currentAnswer.length > 0;

  const handleAnswer = (v: string[]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: v }));
  };

  const handleDrillDown = (card: Card) => {
    if (card.drillDown) {
      setDrillDownCard(card);
    } else {
      setDrillDownCard(null);
    }
  };

  const handleDrillDownAnswer = (v: string[]) => {
    if (!drillDownCard) return;
    setDrillDownAnswers((prev) => ({ ...prev, [drillDownCard.id]: v }));
  };

  const handleNext = () => {
    if (step < total - 1) {
      setStep((s) => s + 1);
      setDrillDownCard(null);
    } else {
      const insights = computeInsights(module, answers);
      setShowInsights(true);
      // insights will be used in onDone
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      setDrillDownCard(null);
    }
  };

  const handleDone = () => {
    const insights = computeInsights(module, answers);
    onComplete(answers, insights);
  };

  if (showInsights) {
    const insights = computeInsights(module, answers);
    const gradientColors: Record<string, string> = {
      "from-amber-500 to-orange-500": "linear-gradient(to right, #f59e0b, #f97316)",
      "from-purple-500 to-indigo-500": "linear-gradient(to right, #a855f7, #6366f1)",
      "from-rose-500 to-pink-500": "linear-gradient(to right, #f43f5e, #ec4899)",
      "from-blue-500 to-cyan-500": "linear-gradient(to right, #3b82f6, #06b6d4)",
      "from-emerald-500 to-teal-500": "linear-gradient(to right, #10b981, #14b8a6)",
      "from-indigo-500 to-violet-500": "linear-gradient(to right, #6366f1, #8b5cf6)",
    };
    const gradient = gradientColors[module.gradient] ?? "linear-gradient(to right, #6366f1, #8b5cf6)";
    return (
      <InsightsScreen
        insights={insights}
        moduleGradient={gradient}
        onDone={handleDone}
      />
    );
  }

  const progressPercent = Math.round(((step + 1) / total) * 100);

  // Determine if the currently selected card has a drillDown and matches drillDownCard
  const activeDrillDown =
    drillDownCard &&
    currentAnswer.includes(drillDownCard.id) &&
    drillDownCard.drillDown
      ? drillDownCard.drillDown
      : null;

  const drillDownQuestionObj = activeDrillDown
    ? {
        id: `${drillDownCard!.id}_drill`,
        text: activeDrillDown.question,
        subtext: activeDrillDown.subtext,
        type: activeDrillDown.type,
        dimension: activeDrillDown.dimension ?? currentQuestion.dimension,
        cards: activeDrillDown.cards,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Progress bar */}
      <div className="w-full bg-gray-100">
        <div
          className="h-1 bg-indigo-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step label */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-400 font-medium">
            Step {step + 1} of {total}
          </span>
          {/* Module badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white",
              `bg-gradient-to-r ${module.gradient}`
            )}
          >
            <span>{module.icon}</span>
            <span>{module.title}</span>
          </span>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.text}</h2>
          {currentQuestion.subtext && (
            <p className="text-gray-500 text-sm mt-1 mb-6">{currentQuestion.subtext}</p>
          )}
          {!currentQuestion.subtext && <div className="mb-6" />}

          <CardQuestion
            question={currentQuestion}
            value={currentAnswer}
            onChange={handleAnswer}
            onDrillDown={handleDrillDown}
          />

          {/* Drill-down expansion */}
          {activeDrillDown && drillDownQuestionObj && (
            <div
              className={cn(
                "border-l-2 border-indigo-200 ml-4 pl-4 mt-4",
                "transition-all duration-300"
              )}
            >
              <p className="text-xs font-semibold text-indigo-500 mb-3">
                ↳ Tell us more:
              </p>
              <CardQuestion
                question={drillDownQuestionObj as any}
                value={drillDownAnswers[drillDownCard!.id] ?? []}
                onChange={handleDrillDownAnswer}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              step === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
              hasAnswer
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {step < total - 1 ? (
              <>
                Next
                <ChevronRight size={16} />
              </>
            ) : (
              <>
                <Check size={16} />
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
