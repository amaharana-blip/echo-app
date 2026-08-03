"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const CATEGORIES = ["Survey experience", "Missing question", "UI / design", "Bug", "Other"];

const STARS = [1, 2, 3, 4, 5];

export default function ToolFeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit() {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      await fetch("/api/tool-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, category, message }),
      });
      setStatus("done");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        setRating(0);
        setMessage("");
        setCategory(CATEGORIES[0]);
      }, 2000);
    } catch {
      setStatus("idle");
    }
  }

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Feedback
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:pr-6 sm:pb-6"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Panel */}
          <div
            className="w-full sm:w-[360px] rounded-t-3xl sm:rounded-2xl overflow-hidden"
            style={{ background: "#fff", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", border: "1px solid #E5E7EB" }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
            >
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-indigo-200">ECHO 1.0</p>
                <h3 className="text-sm font-black text-white mt-0.5">Share your feedback</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {status === "done" ? (
              <div className="px-5 py-12 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mb-3">✅</div>
                <p className="text-sm font-bold text-gray-800">Thanks for your feedback!</p>
                <p className="text-xs text-gray-400 mt-1">We'll use it to improve ECHO.</p>
              </div>
            ) : (
              <div className="px-5 py-5 space-y-4">
                {/* Star rating */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">How's your experience?</p>
                  <div className="flex gap-1.5">
                    {STARS.map((s) => (
                      <button
                        key={s}
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(s)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <span style={{ color: s <= (hovered || rating) ? "#F59E0B" : "#E5E7EB" }}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                        style={{
                          background: category === c ? "#EEF2FF" : "#F9FAFB",
                          color: category === c ? "#4F46E5" : "#6B7280",
                          border: `1px solid ${category === c ? "#C7D2FE" : "#E5E7EB"}`,
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Your thoughts</p>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What could be better? What's working well?"
                    rows={3}
                    className="w-full text-sm text-gray-700 placeholder-gray-300 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    style={{ border: "1px solid #E5E7EB", background: "#FAFAFA" }}
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || status === "sending"}
                  className="w-full text-sm font-bold py-3 rounded-xl transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    color: "#fff",
                  }}
                >
                  {status === "sending" ? "Sending…" : "Send feedback"}
                </button>

                <p className="text-[10px] text-center text-gray-300">Anonymous · goes directly to the team building ECHO</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
