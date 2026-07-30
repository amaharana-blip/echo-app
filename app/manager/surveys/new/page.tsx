"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, GripVertical, Plus, X, PlusCircle } from "lucide-react";

interface Question {
  text: string;
  type: string;
  options: string[];
  required: boolean;
  order: number;
}

const SURVEY_TYPES = [
  { value: "PULSE", label: "Pulse", desc: "Quick team check-in" },
  { value: "ANONYMOUS", label: "Anonymous", desc: "No identity revealed" },
  { value: "PEER_REVIEW", label: "Peer Review", desc: "Colleague feedback" },
  { value: "ONE_ON_ONE", label: "1:1 Check-in", desc: "Manager–report" },
];

const QUESTION_TYPES = [
  { value: "RATING", label: "Rating (1–5)" },
  { value: "NPS", label: "NPS (0–10)" },
  { value: "TEXT", label: "Free text" },
  { value: "YES_NO", label: "Yes / No" },
  { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
];

/* ── Preview renderers ── */
function PreviewRating() {
  return (
    <div className="flex gap-2 mt-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="h-8 w-8 rounded-full border-2 border-indigo-200 flex items-center justify-center text-xs font-semibold text-indigo-400"
        >
          {n}
        </div>
      ))}
    </div>
  );
}

function PreviewText() {
  return (
    <div className="mt-2 w-full h-16 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center px-3">
      <span className="text-xs text-gray-300">Write your answer…</span>
    </div>
  );
}

function PreviewYesNo() {
  return (
    <div className="flex gap-2 mt-2">
      <div className="px-5 py-1.5 rounded-full border-2 border-gray-200 text-xs font-medium text-gray-400">Yes</div>
      <div className="px-5 py-1.5 rounded-full border-2 border-gray-200 text-xs font-medium text-gray-400">No</div>
    </div>
  );
}

function PreviewNPS() {
  return (
    <div className="flex gap-1 mt-2 flex-wrap">
      {[...Array(11)].map((_, i) => (
        <div
          key={i}
          className="h-7 w-7 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400"
        >
          {i}
        </div>
      ))}
    </div>
  );
}

function PreviewMultipleChoice({ options }: { options: string[] }) {
  const items = options.length > 0 ? options : ["Option A", "Option B", "Option C"];
  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {items.map((o, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
          <span className="text-xs text-gray-500">{o}</span>
        </div>
      ))}
    </div>
  );
}

function QuestionPreview({ question, index }: { question: Question; index: number }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs font-semibold text-gray-700 mb-0.5">
        {index + 1}. {question.text || <span className="text-gray-300 font-normal">Question text…</span>}
      </p>
      {question.type === "RATING" && <PreviewRating />}
      {question.type === "TEXT" && <PreviewText />}
      {question.type === "YES_NO" && <PreviewYesNo />}
      {question.type === "NPS" && <PreviewNPS />}
      {question.type === "MULTIPLE_CHOICE" && <PreviewMultipleChoice options={question.options} />}
    </div>
  );
}

export default function NewSurveyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("PULSE");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", type: "RATING", options: [], required: true, order: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { text: "", type: "TEXT", options: [], required: true, order: prev.length },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) =>
      prev.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i }))
    );
  };

  const handleSubmit = async () => {
    if (!title || questions.some((q) => !q.text)) return;
    setSubmitting(true);
    const res = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        type,
        isAnonymous,
        questions,
        status: "ACTIVE",
      }),
    });
    setSubmitting(false);
    if (res.ok) router.push("/manager");
  };

  const canSubmit = !!title && questions.every((q) => !!q.text);

  return (
    <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <div className="ml-0 md:ml-[240px] min-h-screen flex flex-col pb-20 md:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Create Survey</h1>
            <p className="text-xs text-gray-400">Build and activate a new team survey</p>
          </div>
        </header>

        {/* Two-column layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 p-6 max-w-6xl w-full mx-auto">
          {/* ── LEFT: Settings ── */}
          <div className="space-y-5">
            {/* Survey details card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Survey Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Survey Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-300 transition"
                    placeholder="e.g. Weekly Pulse Check"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Description <span className="text-gray-300 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-300 transition"
                    placeholder="Brief description of this survey…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Survey type card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Survey Type</h2>
              <div className="grid grid-cols-2 gap-2">
                {SURVEY_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${
                      type === t.value
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-semibold block text-xs">{t.label}</span>
                    <span className="text-xs opacity-70">{t.desc}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between py-3 px-3 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">Anonymous responses</p>
                  <p className="text-xs text-gray-400">Respondent identity will be hidden</p>
                </div>
                <button
                  role="switch"
                  aria-checked={isAnonymous}
                  onClick={() => setIsAnonymous((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                    isAnonymous ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      isAnonymous ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Questions card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Questions</h2>

              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {/* Drag handle (visual only) */}
                      <div className="flex-shrink-0 mt-2 cursor-grab text-gray-300">
                        <GripVertical size={16} />
                      </div>

                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex gap-2 items-start">
                          <input
                            type="text"
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-300 min-w-0 transition"
                            placeholder={`Question ${i + 1}`}
                            value={q.text}
                            onChange={(e) => updateQuestion(i, { text: e.target.value })}
                          />
                          <select
                            value={q.type}
                            onChange={(e) => updateQuestion(i, { type: e.target.value })}
                            className="flex-shrink-0 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          >
                            {QUESTION_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          {questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(i)}
                              className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              aria-label="Remove question"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        {q.type === "MULTIPLE_CHOICE" && (
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">
                              Options <span className="font-normal">(comma-separated)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-300 transition"
                              placeholder="Option A, Option B, Option C"
                              value={q.options.join(", ")}
                              onChange={(e) =>
                                updateQuestion(i, {
                                  options: e.target.value
                                    .split(",")
                                    .map((s: string) => s.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addQuestion}
                className="mt-3 flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                <Plus size={14} />
                Add Question
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !canSubmit}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              <PlusCircle size={16} />
              {submitting ? "Creating…" : "Create & Activate"}
            </button>
          </div>

          {/* ── RIGHT: Live Preview ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Preview chrome bar */}
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-2 text-xs font-medium text-gray-400">Survey Preview</span>
                </div>

                <div className="p-6">
                  {/* Survey header */}
                  <div className="mb-6 pb-5 border-b border-gray-100">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {title || <span className="text-gray-300">Survey title</span>}
                        </h3>
                        {description && (
                          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                            {SURVEY_TYPES.find((t) => t.value === type)?.label ?? type}
                          </span>
                          {isAnonymous && (
                            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                              Anonymous
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions */}
                  {questions.length === 0 ? (
                    <p className="text-xs text-gray-300 text-center py-8">
                      Add questions to see preview
                    </p>
                  ) : (
                    <div className="space-y-5">
                      {questions.map((q, i) => (
                        <QuestionPreview key={i} question={q} index={i} />
                      ))}
                    </div>
                  )}

                  {/* Submit placeholder */}
                  {questions.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <div className="w-full h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-semibold text-indigo-400">Submit Response</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
