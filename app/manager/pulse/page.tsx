"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { RefreshCw, Zap, AlertTriangle, LogOut, Link2, Eye, EyeOff, X } from "lucide-react";
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

interface IndividualSection {
  sectionId: string;
  sectionTitle: string;
  sectionIcon: string;
  sectionColor: string;
  rating: number;
  whys: string[];
}

interface IndividualResponse {
  responseId: string;
  submittedAt: string;
  user: { name: string; email: string } | null;
  overallAvg: number | null;
  sections: IndividualSection[];
  comment: string;
}

function scoreColor(pct: number) {
  if (pct >= 70) return "#2E844A";
  if (pct >= 45) return "#DD7A01";
  return "#BA0517";
}

function ratingColor(r: number) {
  if (r >= 4) return "#2E844A";
  if (r === 3) return "#DD7A01";
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
  const [sendState, setSendState] = useState<"idle" | "generating" | "copied">("idle");
  const [sort, setSort] = useState<"section" | "score">("score");

  // Secret individual view
  const [secretGate, setSecretGate] = useState<"hidden" | "confirm" | "open">("hidden");
  const [individualData, setIndividualData] = useState<IndividualResponse[] | null>(null);
  const [individualLoading, setIndividualLoading] = useState(false);
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pulse/insights?managerOnly=1")
      .then((r) => r.json())
      .then((json) => {
        if (json.error === "Unauthenticated") { window.location.href = "/api/auth/login"; return; }
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

  async function loadIndividual() {
    setIndividualLoading(true);
    try {
      const r = await fetch("/api/pulse/individual");
      if (r.ok) setIndividualData(await r.json());
    } finally {
      setIndividualLoading(false);
    }
  }

  async function sendPulse() {
    if (sendState !== "idle") return;
    setSendState("generating");
    try {
      const res = await fetch("/api/pulse/token", { method: "POST" });
      const { token } = await res.json();
      const url = `${window.location.origin}/pulse-survey?t=${token}`;
      await navigator.clipboard.writeText(url);
      setSendState("copied");
      setTimeout(() => setSendState("idle"), 3000);
    } catch {
      setSendState("idle");
    }
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

  const sendLabel =
    sendState === "generating" ? "Generating link…" :
    sendState === "copied" ? "Link copied!" :
    "Send pulse";

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
              {/* Hidden individual view — eye icon only */}
              <button
                onClick={() => {
                  if (secretGate === "hidden") { setSecretGate("confirm"); }
                  else { setSecretGate("hidden"); setIndividualData(null); }
                }}
                title="Individual responses"
                className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: secretGate !== "hidden" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)",
                  border: secretGate !== "hidden" ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.12)",
                  color: secretGate !== "hidden" ? "#FCA5A5" : "rgba(165,180,252,0.5)",
                }}
              >
                {secretGate !== "hidden" ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <button
                onClick={sendPulse}
                disabled={sendState !== "idle"}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-[1.03] disabled:opacity-70 disabled:cursor-not-allowed"
                style={sendState === "copied"
                  ? { background: "rgba(16,185,129,0.25)", border: "1px solid rgba(16,185,129,0.5)", color: "#6EE7B7" }
                  : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(199,210,254,0.8)" }
                }>
                {sendState === "generating"
                  ? <RefreshCw size={12} className="animate-spin" />
                  : <Link2 size={13} />
                }
                {sendLabel}
              </button>
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

        {/* ── Confirm gate ── */}
        {secretGate === "confirm" && (
          <div className="rounded-2xl p-5 flex items-start gap-4"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700 mb-1">View individual responses?</p>
              <p className="text-xs text-red-500">This shows who submitted what. Use responsibly.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { setSecretGate("open"); loadIndividual(); }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                style={{ background: "#DC2626" }}>
                Show
              </button>
              <button onClick={() => setSecretGate("hidden")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "#F3F4F6", color: "#374151" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Individual panel ── */}
        {secretGate === "open" && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="flex items-center justify-between px-5 py-3"
              style={{ background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.15)" }}>
              <p className="text-xs font-bold text-red-700">Individual Responses · {individualData?.length ?? 0} submissions</p>
              <button onClick={() => { setSecretGate("hidden"); setIndividualData(null); }}>
                <X size={14} className="text-red-400" />
              </button>
            </div>

            {individualLoading && (
              <div className="flex items-center justify-center h-24 bg-white">
                <RefreshCw size={16} className="animate-spin text-red-400" />
              </div>
            )}

            {!individualLoading && individualData && (
              <div className="divide-y divide-red-100 bg-white">
                {individualData.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">No submissions yet.</p>
                )}
                {individualData.map((resp) => {
                  const expanded = expandedResponse === resp.responseId;
                  return (
                    <div key={resp.responseId}>
                      <button
                        onClick={() => setExpandedResponse(expanded ? null : resp.responseId)}
                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-red-50 transition-colors text-left"
                      >
                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#DC2626,#EF4444)" }}>
                          {resp.user?.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {resp.user?.name ?? "Anonymous"}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {resp.user?.email ?? "—"} · {new Date(resp.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {resp.overallAvg !== null && (
                          <span className="text-sm font-black flex-shrink-0"
                            style={{ color: ratingColor(resp.overallAvg) }}>
                            {resp.overallAvg}/5
                          </span>
                        )}
                        <span className="text-gray-300 text-xs">{expanded ? "▲" : "▼"}</span>
                      </button>

                      {expanded && (
                        <div className="px-5 pb-4 bg-red-50">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                            {resp.sections.map((s) => (
                              <div key={s.sectionId} className="bg-white rounded-xl p-3"
                                style={{ border: `1px solid ${s.sectionColor}25` }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-base">{s.sectionIcon}</span>
                                  <span className="text-[11px] font-bold truncate" style={{ color: s.sectionColor }}>
                                    {s.sectionTitle}
                                  </span>
                                </div>
                                <p className="text-xl font-black" style={{ color: ratingColor(s.rating) }}>
                                  {s.rating}/5
                                </p>
                                {s.whys.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {s.whys.map((w) => (
                                      <span key={w} className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                                        style={{ background: `${s.sectionColor}15`, color: s.sectionColor }}>
                                        {w}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {resp.comment && (
                            <div className="mt-3 rounded-xl px-3 py-2.5"
                              style={{ background: "#FFF7F7", border: "1px solid #FEE2E2" }}>
                              <p className="text-[11px] font-bold text-red-400 mb-1">Comment</p>
                              <p className="text-xs text-gray-600 italic">&ldquo;{resp.comment}&rdquo;</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
                  sub: "Via your pulse link", color: "#059669", bg: "#ECFDF5", border: "#6EE7B7",
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
                    Share your unique pulse link with your team. Results appear here as soon as anyone responds.
                  </p>
                  <button
                    onClick={sendPulse}
                    disabled={sendState !== "idle"}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg,#059669,#10B981)", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
                    {sendState === "generating"
                      ? <RefreshCw size={14} className="animate-spin" />
                      : <Link2 size={14} />
                    }
                    {sendState === "copied" ? "Copied!" : sendState === "generating" ? "Generating…" : "Copy pulse survey link"}
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                          <p className="text-[11px] text-gray-400 leading-snug mb-3 italic">&ldquo;{item.questionText}&rdquo;</p>
                          <ScoreBar fav={item.favorablePercent} neu={item.neutralPercent} unf={item.unfavorablePercent} />
                          <div className="flex gap-3 text-[10px] font-semibold mt-1.5 mb-3" style={{ color: "#9CA3AF" }}>
                            <span style={{ color: "#2E844A" }}>{item.favorablePercent}% fav</span>
                            <span style={{ color: "#DD7A01" }}>{item.neutralPercent}% neu</span>
                            <span style={{ color: "#BA0517" }}>{item.unfavorablePercent}% unf</span>
                            <span className="ml-auto">{item.responseCount} resp.</span>
                          </div>
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
