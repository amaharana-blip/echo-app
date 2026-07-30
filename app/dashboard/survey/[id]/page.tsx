"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[] | string;
  required: boolean;
  order: number;
}

function parseOptions(options: string[] | string): string[] {
  if (Array.isArray(options)) return options;
  try { return JSON.parse(options); } catch { return []; }
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  type: string;
  isAnonymous: boolean;
  questions: Question[];
}

export default function SurveyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/surveys/${params.id}`)
      .then((r) => r.json())
      .then(setSurvey);
  }, [params.id]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!survey) return;
    setSubmitting(true);
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surveyId: survey.id,
        isAnonymous: survey.isAnonymous,
        answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value })),
      }),
    });
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
  };

  if (!survey) return <div className="flex items-center justify-center h-screen text-muted-foreground">Loading survey...</div>;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-4xl">✓</div>
        <h2 className="text-xl font-semibold">Thanks for your feedback!</h2>
        <p className="text-muted-foreground">Your response has been recorded.</p>
        <button onClick={() => router.push("/dashboard")} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:underline mb-6 block">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>
        {survey.description && <p className="text-muted-foreground mb-6">{survey.description}</p>}
        {survey.isAnonymous && (
          <div className="text-xs bg-muted text-muted-foreground rounded-md px-3 py-2 mb-6">
            This survey is anonymous — your identity will not be recorded.
          </div>
        )}

        <div className="space-y-8">
          {survey.questions.map((q) => (
            <div key={q.id} className="border rounded-lg p-5 bg-card">
              <p className="font-medium mb-3">
                {q.text}
                {q.required && <span className="text-destructive ml-1">*</span>}
              </p>

              {q.type === "RATING" && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleAnswer(q.id, String(n))}
                      className={`w-10 h-10 rounded-full border text-sm font-medium transition-colors ${
                        answers[q.id] === String(n)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "NPS" && (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                    <button
                      key={n}
                      onClick={() => handleAnswer(q.id, String(n))}
                      className={`w-10 h-10 rounded border text-sm font-medium transition-colors ${
                        answers[q.id] === String(n)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "TEXT" && (
                <textarea
                  rows={4}
                  className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your answer..."
                  value={answers[q.id] ?? ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                />
              )}

              {q.type === "YES_NO" && (
                <div className="flex gap-3">
                  {["Yes", "No"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      className={`px-5 py-2 rounded border text-sm font-medium ${
                        answers[q.id] === opt
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-2">
                  {parseOptions(q.options).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      className={`w-full text-left px-4 py-2 rounded border text-sm ${
                        answers[q.id] === opt
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-8 w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Response"}
        </button>
      </div>
    </div>
  );
}
