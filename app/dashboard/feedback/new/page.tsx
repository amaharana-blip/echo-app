"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

const CATEGORIES = [
  { value: "general",       label: "General" },
  { value: "recognition",   label: "Recognition" },
  { value: "improvement",   label: "Improvement" },
  { value: "collaboration", label: "Collaboration" },
];

const MAX_CHARS = 500;

export default function NewFeedbackPage() {
  const router = useRouter();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users/team")
      .then((r) => r.json())
      .then((data) => setTeam(data?.members ?? []))
      .catch(() => setTeam([]));
  }, []);

  const handleSubmit = async () => {
    if (!receiverId || !message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, message, category, isAnonymous }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const charsLeft = MAX_CHARS - message.length;
  const isValid = !!receiverId && message.trim().length > 0 && message.length <= MAX_CHARS;

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-60 flex items-center justify-center p-6 pb-20 md:pb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
            {/* Green checkmark */}
            <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Feedback sent!</h2>
            <p className="text-sm text-gray-500 mb-8">
              {isAnonymous
                ? "Your anonymous feedback has been delivered."
                : "Your feedback has been delivered to your colleague."}
            </p>
            <Link
              href="/dashboard"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors duration-150"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-60 pb-20 md:pb-0">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">

          {/* ── Header ── */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="h-9 w-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:shadow-md transition-all duration-150"
              aria-label="Go back"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Give Feedback</h1>
              <p className="text-sm text-gray-500">Share recognition or a thought with a colleague</p>
            </div>
          </div>

          {/* ── Form card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

            {/* Recipient */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="recipient">
                To <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="recipient"
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
                >
                  <option value="">Select a team member…</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Category chips */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={[
                      "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
                      category === cat.value
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600",
                    ].join(" ")}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="message">
                  Message <span className="text-red-400">*</span>
                </label>
                <span className={["text-xs tabular-nums", charsLeft < 50 ? "text-red-400 font-medium" : "text-gray-400"].join(" ")}>
                  {charsLeft} / {MAX_CHARS}
                </span>
              </div>
              <textarea
                id="message"
                rows={5}
                maxLength={MAX_CHARS}
                placeholder="Write your feedback — be specific and constructive…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
              />
              {/* Progress bar */}
              <div className="mt-1.5 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={["h-full rounded-full transition-all duration-200", message.length > MAX_CHARS * 0.9 ? "bg-red-400" : "bg-indigo-400"].join(" ")}
                  style={{ width: `${Math.min((message.length / MAX_CHARS) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Anonymous toggle */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-semibold text-gray-700">Send anonymously</p>
                <p className="text-xs text-gray-400 mt-0.5">The recipient won&apos;t see your name</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer" htmlFor="anonymous-toggle">
                <input
                  id="anonymous-toggle"
                  type="checkbox"
                  className="sr-only peer"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all after:duration-200 peer-checked:after:translate-x-5" />
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !isValid}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Feedback"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
