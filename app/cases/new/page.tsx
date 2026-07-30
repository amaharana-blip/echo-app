"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { CheckCircle2 } from "lucide-react";

/* ── Types ── */
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface CategoryItem {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "WORKLOAD",      label: "Workload",               emoji: "📚", description: "Too much on your plate" },
  { id: "TEAM_CONFLICT", label: "Team Conflict",          emoji: "👥", description: "Issues with colleagues" },
  { id: "PROCESSES",     label: "Processes",              emoji: "🔄", description: "Broken workflows" },
  { id: "TOOLS_TECH",    label: "Tools & Tech",           emoji: "🛠️", description: "Tech or tool problems" },
  { id: "MANAGER",       label: "Manager",                emoji: "🧑‍💼", description: "Manager-related issues" },
  { id: "WELLBEING",     label: "Wellbeing",              emoji: "❤️", description: "Health or mental wellness" },
  { id: "DISCRIMINATION",label: "Discrimination/Harassment", emoji: "🚫", description: "Unfair treatment" },
  { id: "OTHER",         label: "Other",                  emoji: "💬", description: "Something else" },
];

const PRIORITIES: { id: Priority; label: string; color: string; bg: string; border: string }[] = [
  { id: "LOW",    label: "Low",    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { id: "MEDIUM", label: "Medium", color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  { id: "HIGH",   label: "High",   color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  { id: "URGENT", label: "Urgent", color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
];

function generateRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function NewCasePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseRef, setCaseRef] = useState("");

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setError("Please fill in the title and description.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
          isAnonymous,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setCaseRef(generateRef());
      setStep(3);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-[#F8F9FC]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar />

      <main className="ml-0 md:ml-60 pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Step indicator ── */}
          {step !== 3 && (
            <div className="flex items-center gap-2">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={[
                      "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold",
                      s <= step
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-400",
                    ].join(" ")}
                  >
                    {s}
                  </div>
                  {s < 2 && (
                    <div
                      className={[
                        "h-0.5 w-10 rounded-full",
                        step > s ? "bg-indigo-600" : "bg-gray-200",
                      ].join(" ")}
                    />
                  )}
                </div>
              ))}
              <span className="ml-2 text-xs text-gray-400">
                Step {step} of 2
              </span>
            </div>
          )}

          {/* ── STEP 1: Category ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  What&apos;s this about?
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Select the category that best describes your issue.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={[
                      "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                      category === cat.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {cat.emoji}
                    </span>
                    <span
                      className={[
                        "text-xs font-semibold leading-tight",
                        category === cat.id ? "text-indigo-700" : "text-gray-700",
                      ].join(" ")}
                    >
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">
                      {cat.description}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!category}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Tell us what happened
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  The more detail you share, the better we can help.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor="case-title">
                    Issue title
                  </label>
                  <input
                    id="case-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief summary of the issue"
                    maxLength={120}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor="case-desc">
                    Description
                  </label>
                  <textarea
                    id="case-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the situation in as much detail as you're comfortable sharing…"
                    rows={5}
                    maxLength={1000}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors resize-none"
                  />
                  <p className="text-xs text-right text-gray-400">
                    {description.length}/1000
                  </p>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Priority</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        className={[
                          "rounded-xl border-2 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                          priority === p.id
                            ? `${p.bg} ${p.border} ${p.color}`
                            : "border-gray-100 bg-white text-gray-500 hover:border-gray-200",
                        ].join(" ")}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anonymous toggle */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Submit anonymously
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Your name won&apos;t be shared with anyone
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isAnonymous}
                    onClick={() => setIsAnonymous((v) => !v)}
                    className={[
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      isAnonymous ? "bg-indigo-600" : "bg-gray-200",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out",
                        isAnonymous ? "translate-x-5" : "translate-x-0",
                      ].join(" ")}
                    />
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !title.trim() || !description.trim()}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Issue"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center py-16 space-y-5">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
                style={{ animation: "scale-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both" }}
              >
                <CheckCircle2 size={40} className="text-white" strokeWidth={2} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your issue has been logged
                </h2>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  A member of the team will review it confidentially.
                </p>
              </div>

              {/* Reference number */}
              <div className="bg-white border border-gray-100 rounded-2xl px-8 py-4 shadow-sm space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Reference number
                </p>
                <p className="text-2xl font-bold text-indigo-600 tracking-widest">
                  {caseRef}
                </p>
                <p className="text-xs text-gray-400">
                  Save this to track your case at{" "}
                  <Link href="/cases" className="text-indigo-500 hover:underline">
                    /cases
                  </Link>
                </p>
              </div>

              <Link
                href="/dashboard"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Back to dashboard
              </Link>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
