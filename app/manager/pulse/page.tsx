"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { RefreshCw, Zap, AlertTriangle, LogOut, ChevronRight } from "lucide-react";
import { ENGAGEMENT_SECTIONS } from "@/lib/engagementSurvey";

interface PulseInsight {
  sectionId: string;
  sectionTitle: string;
  sectionIcon: string;
  sectionColor: string;
  sectionGradient: string;
  questionText: string;
  favorablePercent: number;
  neutralPercent: number;
  unfavorablePercent: number;
  responseCount: number;
  topWhys: { label: string; count: number }[];
}

interface PulseData {
  pulseInsights: PulseInsight[];
  pulseRespondents: number;
  generatedAt: string;
}

function scoreColor(pct: number) {
  if (pct >= 70) return "#2E844A";
  if (pct >= 45) return "#DD7A01";
  return "#BA0517";
}

function ScoreBar({ fav, neu, unf }: { fav: number; neu: number; unf: number }) {
  return (
    <div className="h-2 w-full rounded-full overflow-hidden flex" style={{ background: "#F3F2F2" }}>
      <div style={{ width: `${fav}%`, background: "#2E844A", transition: "width 0.6s ease" }} />
      <div style={{ width: `${neu}%`, background: "#DD7A01", transition: "width 0.6s ease" }} />
      <div style={{ width: `${unf}%`, background: "#BA0517", transition: "width 0.6s ease" }} />
    </div>
  );
}

export default function PulseDashboard() {
  useUser();
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sort, setSort] = useState<"section" | "score">("score");

  useEffect(() => {
    fetch("/api/manager/insights")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) { setError(json.error); return; }
        setData({
          pulseInsights: json.pulseInsights ?? [],
          pulseRespondents: json.pulseRespondents ?? 0,
          generatedAt: json.generatedAt,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/pulse-survey`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const pi = data?.pulseInsights ?? [];
  const pulseResp = data?.pulseRespondents ?? 0;
  const overallFav = pi.length
    ? Math.round(pi.reduce((s, x) => s + x.favorablePercent, 0) / pi.length)
    : 0;
  const atRisk = pi.filter((x) => x.favorablePercent < 50).length;

  const sorted = [...pi].sort((a, b) =>
    sort === "score"
      ? b.favorablePercent - a.favorablePercent
      : a.sectionTitle.localeCompare(b.sectionTitle)
  );

  return (
    <div className="min-h-screen" style={{ background: "#F3F2F2", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F0C29 0%, #064e3b 60%, #0F0C29 100%)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-[-60px] left-[-40px] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(16,185,129,0.2) 0%,transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg,#059669,#10B981)", boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#6EE7B7" }}>Manager Dashboard</p>
                <h1 className="text-lg font-black text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
                  Pulse-Check
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={copyLink}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-[1.03]"
                style={copied
                  ? { background: "rgba(16,185,129,0.25)", border: "1px solid rgba(16,185,129,0.5)", color: "#6EE7B7" }
                  : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(199,210,254,0.8)" }
                }>
                <Zap size={13} />
                {copied ? "Link copied!" : "Send pulse"}
              </button>
              <a href="/manager/insights"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(199,210,254,0.7)" }}>
                ECHO Insights
                <ChevronRight size={13} />
              </a>
              <button onClick={() => { window.location.href = "/api/auth/logout"; }}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(199,210,254,0.7)" }}>
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {loading && (
          <div className="flex items-center justify-center h-48">
            <RefreshCw size={20} className="animate-spin" style={{ color: "#059669" }} />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 rounded-xl px-5 py-4" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">Could not load data ({error}).</p>
          </div>
        )}

        {!loading && (
          <>
            {/* ── Stat strip ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: "⚡", label: "Respondents", value: String(pulseResp),
                  sub: "Pulse submissions", color: "#059669", bg: "#ECFDF5", border: "#6EE7B7",
                },
                {
                  icon: "📊", label: "Overall Favorable", value: pulseResp > 0 ? `${overallFav}%` : "—",
                  sub: "Across 9 areas", color: scoreColor(overallFav), bg: "#F0FDF4", border: "#86EFAC",
                },
                {
                  icon: "⚠️", label: "Needs Attention", value: String(atRisk),
                  sub: "Areas below 50%",
                  color: atRisk > 0 ? "#BA0517" : "#2E844A",
                  bg: atRisk > 0 ? "#FEF2F2" : "#F0FDF4",
                  border: atRisk > 0 ? "#FCA5A5" : "#86EFAC",
                },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-4 flex items-start gap-3"
                  style={{ border: `1px solid ${s.border}55`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-black leading-none mb-0.5" style={{ color: "#0F0C29" }}>{s.value}</p>
                    <p className="text-xs font-semibold" style={{ color: "#374151" }}>{s.label}</p>
                    <p className="text-[10px] text-gray-400">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Section grid ── */}
            {pi.length === 0 ? (
              <div className="rounded-2xl overflow-hidden relative"
                style={{ background: "linear-gradient(135deg,#0F0C29 0%,#064e3b 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
                <div className="relative p-14 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-2xl"
                    style={{ background: "linear-gradient(135deg,#059669,#10B981)", boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}>
                    ⚡
                  </div>
                  <p className="text-base font-black text-white mb-1" style={{ letterSpacing: "-0.02em" }}>No pulse data yet</p>
                  <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: "rgba(110,231,183,0.6)" }}>
                    Share the link with your team. Results appear here as soon as anyone responds.
                  </p>
                  <button onClick={copyLink}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg,#059669,#10B981)", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
                    <Zap size={14} />
                    {copied ? "Copied!" : "Copy pulse survey link"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Sort control */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{pi.length} areas · sorted by {sort === "score" ? "score" : "section name"}</p>
                  <div className="flex gap-1 p-0.5 rounded-xl" style={{ background: "#E5E7EB" }}>
                    {(["score", "section"] as const).map((s) => (
                      <button key={s} onClick={() => setSort(s)}
                        className="text-[11px] font-semibold px-3 py-1 rounded-lg transition-all capitalize"
                        style={sort === s
                          ? { background: "#fff", color: "#0F0C29", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                          : { color: "#6B7280" }
                        }>
                        {s === "score" ? "By score" : "By area"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sorted.map((item) => {
                    const section = ENGAGEMENT_SECTIONS.find((s) => s.id === item.sectionId);
                    const sc = scoreColor(item.favorablePercent);

                    return (
                      <div key={item.sectionId} className="bg-white rounded-2xl overflow-hidden transition-all hover:shadow-md"
                        style={{ border: `1px solid ${item.sectionColor}30`, boxShadow: `0 2px 8px ${item.sectionColor}0d` }}>
                        <div className="h-1 w-full" style={{ background: item.sectionGradient }} />
                        <div className="p-4">

                          {/* Header row */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                style={{ background: section?.gradient ?? item.sectionGradient, boxShadow: `0 4px 10px ${item.sectionColor}40` }}>
                                {item.sectionIcon}
                              </div>
                              <span className="text-xs font-bold" style={{ color: item.sectionColor }}>
                                {item.sectionTitle}
                              </span>
                            </div>
                            <span className="text-2xl font-black" style={{ color: sc }}>{item.favorablePercent}%</span>
                          </div>

                          {/* Question */}
                          <p className="text-[11px] text-gray-400 leading-snug mb-3 italic">&ldquo;{item.questionText}&rdquo;</p>

                          {/* Bar */}
                          <ScoreBar fav={item.favorablePercent} neu={item.neutralPercent} unf={item.unfavorablePercent} />
                          <div className="flex gap-3 text-[10px] font-semibold mt-1.5 mb-3" style={{ color: "#9CA3AF" }}>
                            <span style={{ color: "#2E844A" }}>{item.favorablePercent}% fav</span>
                            <span style={{ color: "#DD7A01" }}>{item.neutralPercent}% neu</span>
                            <span style={{ color: "#BA0517" }}>{item.unfavorablePercent}% unf</span>
                            <span className="ml-auto">{item.responseCount} resp.</span>
                          </div>

                          {/* Why chips */}
                          {item.topWhys.length > 0 && (
                            <div className="rounded-xl p-2.5" style={{ background: "#F8F8FC" }}>
                              <p className="text-[10px] font-bold mb-1.5" style={{ color: "#6366F1" }}>💡 Top reasons</p>
                              <div className="flex flex-wrap gap-1">
                                {item.topWhys.map((w) => (
                                  <span key={w.label}
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                                    style={{ background: `${item.sectionColor}18`, color: item.sectionColor, border: `1px solid ${item.sectionColor}30` }}>
                                    {w.label} ×{w.count}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {data?.generatedAt && (
              <p className="text-[10px] text-center text-gray-400 pb-4">
                Last updated {new Date(data.generatedAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
