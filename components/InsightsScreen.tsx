"use client";

import type { ModuleInsights } from "@/lib/modules";
import { cn } from "@/lib/utils";

interface Props {
  insights: ModuleInsights;
  moduleGradient: string;
  onDone: () => void;
}

function getRiskLabel(percent: number): string {
  if (percent < 30) return "Looking good 🟢";
  if (percent <= 60) return "Some signals ⚠️";
  return "Needs attention 🔴";
}

function getRiskPillClass(percent: number): string {
  if (percent < 30) return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (percent <= 60) return "bg-amber-100 text-amber-700 border border-amber-200";
  return "bg-red-100 text-red-700 border border-red-200";
}

function getBarColor(percent: number): string {
  if (percent < 30) return "bg-emerald-400";
  if (percent < 60) return "bg-amber-400";
  return "bg-red-500";
}

function getRiskNumberColor(percent: number): string {
  if (percent < 30) return "text-emerald-600";
  if (percent < 60) return "text-amber-600";
  return "text-red-600";
}

export default function InsightsScreen({ insights, moduleGradient, onDone }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-12">
      {/* Gradient header */}
      <div
        className="w-full px-4 py-10 text-white"
        style={{ background: moduleGradient }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">{insights.moduleTitle} Insights</h1>
          <p className="text-white/80 text-sm mt-1">Based on your responses</p>
          <div className="mt-4">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-sm font-semibold",
                getRiskPillClass(insights.overallRiskPercent)
              )}
            >
              {getRiskLabel(insights.overallRiskPercent)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Dimensions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Your Risk Profile</h2>
          <div className="space-y-5">
            {insights.dimensions.map((dim) => (
              <div key={dim.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-gray-800 text-sm">{dim.label}</span>
                  <span className={cn("text-sm font-bold", getRiskNumberColor(dim.riskPercent))}>
                    {dim.riskPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-2 rounded-full transition-all duration-700", getBarColor(dim.riskPercent))}
                    style={{ width: `${dim.riskPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {dim.atRisk
                    ? "Above threshold — worth exploring"
                    : "Within healthy range"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top reason callout */}
        {insights.topReason && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <p className="text-sm font-semibold text-amber-800">
              🔍 Primary signal: {insights.topReason}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              This dimension showed the highest risk signal in your responses.
            </p>
          </div>
        )}

        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">What happens next?</h2>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-0.5 text-indigo-400 flex-shrink-0">•</span>
              Your responses are anonymized
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-0.5 text-indigo-400 flex-shrink-0">•</span>
              Your manager sees team-level trends only
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-0.5 text-indigo-400 flex-shrink-0">•</span>
              You can update this check-in anytime
            </li>
          </ul>
        </div>

        {/* Done button */}
        <button
          onClick={onDone}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          Done
        </button>
      </div>
    </div>
  );
}
