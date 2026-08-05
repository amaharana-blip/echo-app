"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  TrendingDown,
  Users,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Zap,
  Award,
  Activity,
  RefreshCw,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Target,
  CheckCircle2,
  Circle,
  LogOut,
  Eye,
  EyeOff,
  Lock,
  X,
  ShieldAlert,
} from "lucide-react";
import ToolFeedbackWidget from "@/components/ToolFeedbackWidget";
import { ENGAGEMENT_SECTIONS } from "@/lib/engagementSurvey";

/* ─── Types ─────────────────────────────────────────────────── */
interface ManagerAction {
  id: string;
  sectionId: string;
  commitment: string;
  targetDate: string | null;
  resolved: boolean;
  resolvedAt: string | null;
  createdAt: string;
}

interface QuestionInsight {
  questionId: string;
  questionText: string;
  favorablePercent: number;
  neutralPercent: number;
  unfavorablePercent: number;
  responseCount: number;
  moduleId: string;
  moduleTitle: string;
  dimensionId: string;
  dimensionLabel: string;
}

interface ModuleInsight {
  moduleId: string;
  moduleTitle: string;
  icon: string;
  gradient: string;
  responseCount: number;
  overallFavorablePercent: number;
  overallNeutralPercent: number;
  overallUnfavorablePercent: number;
  questions: QuestionInsight[];
}

interface DimensionSummary {
  id: string;
  label: string;
  moduleId: string;
  moduleTitle: string;
  favorablePercent: number;
  neutralPercent: number;
  unfavorablePercent: number;
  responseCount: number;
  color: string;
}

interface TeamVoiceComment {
  sectionId: string;
  text: string;
}

interface InsightsData {
  uniqueRespondents: number;
  openCases: number;
  dimensionSummaries: DimensionSummary[];
  topQuestions: QuestionInsight[];
  bottomQuestions: QuestionInsight[];
  moduleInsights: ModuleInsight[];
  teamVoiceComments: TeamVoiceComment[];
  generatedAt: string;
}

interface IndividualResponse {
  responseId: string;
  submittedAt: string;
  user: { name: string; email: string } | null;
  overallAvg: number | null;
  sectionScores: Record<string, { avg: number; ratings: number[] }>;
  comments: Record<string, string>;
}

/* ─── Heat map color scale ───────────────────────────────────── */
function heatCell(pct: number): { bg: string; text: string; border: string } {
  if (pct >= 80) return { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" };
  if (pct >= 65) return { bg: "#DCFCE7", text: "#15803D", border: "#86EFAC" };
  if (pct >= 50) return { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" };
  if (pct >= 35) return { bg: "#FFEDD5", text: "#9A3412", border: "#FDBA74" };
  if (pct >= 20) return { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" };
  return { bg: "#FECACA", text: "#7F1D1D", border: "#F87171" };
}

/* ─── Score color ────────────────────────────────────────────── */
function scoreColor(pct: number) {
  if (pct >= 70) return "#2E844A";
  if (pct >= 45) return "#DD7A01";
  return "#BA0517";
}

/* ─── Donut SVG ──────────────────────────────────────────────── */
function DonutRing({
  favorable,
  neutral,
  size = 80,
  stroke = 10,
}: {
  favorable: number;
  neutral: number;
  unfavorable: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;

  const unfavorable = Math.max(0, 100 - favorable - neutral);
  const favDash = (favorable / 100) * circ;
  const neuDash = (neutral / 100) * circ;
  const unfDash = (unfavorable / 100) * circ;
  const sc = scoreColor(favorable);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#F3F2F2" strokeWidth={stroke} />
        {unfDash > 0.5 && (
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#BA0517" strokeWidth={stroke}
            strokeDasharray={`${unfDash} ${circ - unfDash}`} strokeDashoffset={0} strokeLinecap="butt" />
        )}
        {neuDash > 0.5 && (
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#DD7A01" strokeWidth={stroke}
            strokeDasharray={`${neuDash} ${circ - neuDash}`} strokeDashoffset={-unfDash} strokeLinecap="butt" />
        )}
        {favDash > 0.5 && (
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#2E844A" strokeWidth={stroke}
            strokeDasharray={`${favDash} ${circ - favDash}`} strokeDashoffset={-(unfDash + neuDash)} strokeLinecap="butt" />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black leading-none" style={{ color: sc }}>{favorable}</span>
        <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#939393" }}>fav%</span>
      </div>
    </div>
  );
}

/* ─── Stacked bar ────────────────────────────────────────────── */
function StackedBar({
  favorable,
  neutral,
  height = 8,
  showLabels = false,
}: {
  favorable: number;
  neutral: number;
  unfavorable: number;
  height?: number;
  showLabels?: boolean;
}) {
  const unf = Math.max(0, 100 - favorable - neutral);
  return (
    <div>
      <div className="flex w-full overflow-hidden rounded-full" style={{ height }}>
        {favorable > 0 && (
          <div className="transition-all duration-700" style={{ width: `${favorable}%`, background: "#2E844A" }} />
        )}
        {neutral > 0 && (
          <div className="transition-all duration-700" style={{ width: `${neutral}%`, background: "#DD7A01" }} />
        )}
        {unf > 0 && (
          <div className="transition-all duration-700" style={{ width: `${unf}%`, background: "#BA0517" }} />
        )}
      </div>
      {showLabels && (
        <div className="flex justify-between mt-1.5 text-[10px] font-semibold">
          <span style={{ color: "#2E844A" }}>{favorable}% Favorable</span>
          <span style={{ color: "#DD7A01" }}>{neutral}% Neutral</span>
          <span style={{ color: "#BA0517" }}>{unf}% Unfavorable</span>
        </div>
      )}
    </div>
  );
}

/* ─── Question row ───────────────────────────────────────────── */
function QuestionRow({ q, rank }: { q: QuestionInsight; rank?: number }) {
  const unf = Math.max(0, 100 - q.favorablePercent - q.neutralPercent);
  return (
    <div className="py-3 border-b last:border-0" style={{ borderColor: "#F3F2F2" }}>
      <div className="flex items-start gap-3">
        {rank !== undefined && (
          <span className="flex-shrink-0 h-5 w-5 rounded-full text-[10px] font-black flex items-center justify-center mt-0.5"
            style={{ background: "#E8F4FD", color: "#0176D3" }}>
            {rank}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 leading-snug mb-2">{q.questionText}</p>
          <StackedBar favorable={q.favorablePercent} neutral={q.neutralPercent} unfavorable={unf} height={7} />
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] font-semibold" style={{ color: "#2E844A" }}>{q.favorablePercent}% fav</span>
            <span className="text-[10px]" style={{ color: "#DD7A01" }}>{q.neutralPercent}% neu</span>
            <span className="text-[10px]" style={{ color: "#BA0517" }}>{unf}% unf</span>
            <span className="ml-auto text-[10px] text-gray-400">{q.responseCount} responses</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden group cursor-default"
      style={{
        background: "#fff",
        border: `1px solid ${accent}28`,
        boxShadow: `0 2px 12px ${accent}10, 0 1px 3px rgba(0,0,0,0.04)`,
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${accent}22, 0 2px 8px rgba(0,0,0,0.06)`; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 12px ${accent}10, 0 1px 3px rgba(0,0,0,0.04)`; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${accent}08 0%, transparent 60%)` }} />
      <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full pointer-events-none opacity-50"
        style={{ background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)` }} />
      <div className="flex items-center justify-between mb-4 relative">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5"
          style={{ background: `${accent}15`, color: accent }}>
          {icon}
        </div>
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
      </div>
      <p className="text-3xl font-black leading-none relative" style={{ color: "#0F0C29", letterSpacing: "-0.03em" }}>{value}</p>
      <p className="text-xs font-bold text-gray-500 mt-2 relative">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5 relative">{sub}</p>}
    </div>
  );
}

const MODULE_GRADIENTS: Record<string, string> = {
  echo: "linear-gradient(135deg,#4F46E5,#7C3AED)",
  wellbeing: "linear-gradient(135deg,#DC2626,#F97316)",
  burnout: "linear-gradient(135deg,#D97706,#F59E0B)",
  manager: "linear-gradient(135deg,#7C3AED,#A855F7)",
  "ai-tools": "linear-gradient(135deg,#0176D3,#1B96FF)",
};
const MODULE_GLOWS: Record<string, string> = {
  echo: "#4F46E5", wellbeing: "#DC2626", burnout: "#D97706", manager: "#7C3AED", "ai-tools": "#0176D3",
};

/* ─── Module accordion ───────────────────────────────────────── */
function ModuleAccordionRow({ mod }: { mod: ModuleInsight }) {
  const [open, setOpen] = useState(false);
  const unf = Math.max(0, 100 - mod.overallFavorablePercent - mod.overallNeutralPercent);
  const sc = scoreColor(mod.overallFavorablePercent);
  const grad = MODULE_GRADIENTS[mod.moduleId] ?? MODULE_GRADIENTS.echo;
  const glow = MODULE_GLOWS[mod.moduleId] ?? "#4F46E5";

  return (
    <div className="rounded-2xl overflow-hidden bg-white transition-all duration-200"
      style={{
        border: `1px solid ${open ? glow + "30" : "#EBEBED"}`,
        boxShadow: open ? `0 4px 20px ${glow}12` : "0 1px 4px rgba(0,0,0,0.04)",
      }}>
      <button className="w-full text-left" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-center gap-4 p-4">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: grad, boxShadow: `0 4px 12px ${glow}40` }}>
            {mod.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">{mod.moduleTitle}</p>
            <p className="text-[11px] text-gray-400">{mod.responseCount} responses</p>
          </div>
          <div className="flex-1 max-w-[180px] hidden sm:block">
            <StackedBar favorable={mod.overallFavorablePercent} neutral={mod.overallNeutralPercent} unfavorable={unf} height={6} />
          </div>
          <span className="text-lg font-black flex-shrink-0 w-12 text-right" style={{ color: sc, letterSpacing: "-0.02em" }}>
            {mod.overallFavorablePercent}%
          </span>
          <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: open ? glow + "18" : "#F5F5F7", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
            <ChevronDown size={14} style={{ color: open ? glow : "#9CA3AF" }} />
          </div>
        </div>
        <div className="px-4 pb-3 sm:hidden">
          <StackedBar favorable={mod.overallFavorablePercent} neutral={mod.overallNeutralPercent} unfavorable={unf} height={6} showLabels />
        </div>
      </button>
      {open && (
        <div className="px-4 py-2" style={{ borderTop: `1px solid ${glow}18` }}>
          {mod.questions.length === 0
            ? <p className="text-xs text-gray-400 py-4 text-center">No question data yet</p>
            : mod.questions.map((q) => <QuestionRow key={q.questionId} q={q} />)
          }
        </div>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function ManagerInsightsPage() {
  useUser();
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap" | "modules" | "voice">("overview");

  const [briefing, setBriefing] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  const [actions, setActions] = useState<ManagerAction[]>([]);
  const [newAction, setNewAction] = useState({ sectionId: "", commitment: "", targetDate: "" });
  const [actionPanel, setActionPanel] = useState(false);

  // Secret individual view
  const [secretGate, setSecretGate] = useState<"hidden" | "confirm" | "open">("hidden");
  const [individualData, setIndividualData] = useState<IndividualResponse[] | null>(null);
  const [individualLoading, setIndividualLoading] = useState(false);
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/manager/insights")
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
    fetch("/api/actions")
      .then((r) => r.ok ? r.json() : [])
      .then((a) => setActions(a));
  }, []);

  async function loadIndividual() {
    setIndividualLoading(true);
    try {
      const r = await fetch("/api/manager/individual");
      if (r.ok) setIndividualData(await r.json());
    } finally {
      setIndividualLoading(false);
    }
  }

  async function loadBriefing() {
    setBriefingLoading(true);
    setBriefing(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const r = await fetch("/api/briefing", { signal: controller.signal });
      clearTimeout(timeout);
      const j = await r.json();
      if (!r.ok) {
        setBriefing(`Error ${r.status}: ${j.error ?? "Could not generate briefing."}`);
      } else {
        setBriefing(j.briefing ?? "No briefing returned.");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setBriefing(msg.includes("abort") ? "Request timed out — try again." : `Failed: ${msg}`);
    } finally {
      setBriefingLoading(false);
    }
  }

  async function submitAction() {
    if (!newAction.sectionId || !newAction.commitment.trim()) return;
    const r = await fetch("/api/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAction),
    });
    if (r.ok) {
      const created = await r.json();
      setActions((prev) => [created, ...prev]);
      setNewAction({ sectionId: "", commitment: "", targetDate: "" });
      setActionPanel(false);
    }
  }

  async function markActionDone(id: string) {
    await fetch("/api/actions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, resolved: true }),
    });
    setActions((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));
  }

  const MOCK: InsightsData = {
    uniqueRespondents: 14,
    openCases: 3,
    generatedAt: new Date().toISOString(),
    dimensionSummaries: [
      { id: "pulse-connection", label: "Team Connection", moduleId: "pulse", moduleTitle: "Daily Pulse", favorablePercent: 82, neutralPercent: 12, unfavorablePercent: 6, responseCount: 14, color: "rose" },
      { id: "echo-leadership", label: "Leadership Trust", moduleId: "echo", moduleTitle: "Engagement", favorablePercent: 76, neutralPercent: 16, unfavorablePercent: 8, responseCount: 14, color: "indigo" },
      { id: "echo-growth", label: "Growth & Career", moduleId: "echo", moduleTitle: "Engagement", favorablePercent: 58, neutralPercent: 22, unfavorablePercent: 20, responseCount: 14, color: "indigo" },
      { id: "echo-purpose", label: "Purpose & Alignment", moduleId: "echo", moduleTitle: "Engagement", favorablePercent: 71, neutralPercent: 18, unfavorablePercent: 11, responseCount: 14, color: "indigo" },
      { id: "echo-team", label: "Team Relationships", moduleId: "echo", moduleTitle: "Engagement", favorablePercent: 80, neutralPercent: 13, unfavorablePercent: 7, responseCount: 14, color: "indigo" },
      { id: "echo-culture", label: "Culture & Values", moduleId: "echo", moduleTitle: "Engagement", favorablePercent: 63, neutralPercent: 21, unfavorablePercent: 16, responseCount: 14, color: "indigo" },
      { id: "echo-wellbeing-workload", label: "Workload Sustainability", moduleId: "wellbeing", moduleTitle: "Wellbeing", favorablePercent: 52, neutralPercent: 24, unfavorablePercent: 24, responseCount: 14, color: "red" },
      { id: "echo-wellbeing-disconnect", label: "Ability to Disconnect", moduleId: "wellbeing", moduleTitle: "Wellbeing", favorablePercent: 44, neutralPercent: 20, unfavorablePercent: 36, responseCount: 14, color: "red" },
      { id: "echo-wellbeing-energy", label: "Energy & Motivation", moduleId: "wellbeing", moduleTitle: "Wellbeing", favorablePercent: 47, neutralPercent: 22, unfavorablePercent: 31, responseCount: 14, color: "red" },
      { id: "echo-wellbeing-mental", label: "Mental Health Support", moduleId: "wellbeing", moduleTitle: "Wellbeing", favorablePercent: 55, neutralPercent: 25, unfavorablePercent: 20, responseCount: 14, color: "red" },
      { id: "echo-recognition", label: "Recognition & Feedback", moduleId: "echo", moduleTitle: "Engagement", favorablePercent: 61, neutralPercent: 22, unfavorablePercent: 17, responseCount: 14, color: "indigo" },
      { id: "echo-enablement", label: "Tools & Enablement", moduleId: "echo", moduleTitle: "Engagement", favorablePercent: 67, neutralPercent: 20, unfavorablePercent: 13, responseCount: 14, color: "indigo" },
      { id: "manager-support", label: "Manager Support", moduleId: "manager", moduleTitle: "Manager Review", favorablePercent: 69, neutralPercent: 19, unfavorablePercent: 12, responseCount: 12, color: "purple" },
      { id: "aitools-adoption", label: "AI Adoption", moduleId: "ai-tools", moduleTitle: "AI & Tools", favorablePercent: 48, neutralPercent: 28, unfavorablePercent: 24, responseCount: 10, color: "blue" },
    ],
    topQuestions: [
      { questionId: "q1", questionText: "My team collaborates effectively and genuinely supports one another", favorablePercent: 88, neutralPercent: 8, unfavorablePercent: 4, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "team", dimensionLabel: "Team Relationships" },
      { questionId: "q2", questionText: "I feel a strong sense of belonging within my team", favorablePercent: 84, neutralPercent: 10, unfavorablePercent: 6, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "team", dimensionLabel: "Team Relationships" },
      { questionId: "q3", questionText: "Senior leaders communicate direction clearly and honestly", favorablePercent: 78, neutralPercent: 14, unfavorablePercent: 8, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "leadership", dimensionLabel: "Leadership Trust" },
    ],
    bottomQuestions: [
      { questionId: "q4", questionText: "I am able to genuinely disconnect from work outside of working hours", favorablePercent: 38, neutralPercent: 20, unfavorablePercent: 42, responseCount: 14, moduleId: "echo", moduleTitle: "Wellbeing", dimensionId: "wellbeing", dimensionLabel: "Wellbeing" },
      { questionId: "q5", questionText: "I feel energized and motivated most days rather than depleted", favorablePercent: 41, neutralPercent: 22, unfavorablePercent: 37, responseCount: 14, moduleId: "echo", moduleTitle: "Wellbeing", dimensionId: "wellbeing", dimensionLabel: "Wellbeing" },
      { questionId: "q6", questionText: "I have clear opportunities to grow my skills and advance my career here", favorablePercent: 45, neutralPercent: 24, unfavorablePercent: 31, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "growth", dimensionLabel: "Growth & Career" },
    ],
    moduleInsights: [
      {
        moduleId: "echo", moduleTitle: "Engagement", icon: "💬", gradient: "from-indigo-600 to-purple-500",
        responseCount: 14, overallFavorablePercent: 68, overallNeutralPercent: 19, overallUnfavorablePercent: 13,
        questions: [
          { questionId: "l1", questionText: "Senior leaders communicate direction clearly and honestly", favorablePercent: 78, neutralPercent: 14, unfavorablePercent: 8, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "leadership", dimensionLabel: "Leadership" },
          { questionId: "l2", questionText: "I trust that leadership makes decisions with the team's best interests in mind", favorablePercent: 74, neutralPercent: 18, unfavorablePercent: 8, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "leadership", dimensionLabel: "Leadership" },
          { questionId: "g1", questionText: "I have clear opportunities to grow my skills and advance my career here", favorablePercent: 45, neutralPercent: 24, unfavorablePercent: 31, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "growth", dimensionLabel: "Growth" },
          { questionId: "t1", questionText: "My team collaborates effectively and genuinely supports one another", favorablePercent: 88, neutralPercent: 8, unfavorablePercent: 4, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "team", dimensionLabel: "Team" },
          { questionId: "r1", questionText: "My contributions are recognized in ways that feel meaningful and genuine", favorablePercent: 60, neutralPercent: 23, unfavorablePercent: 17, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "recognition", dimensionLabel: "Recognition" },
          { questionId: "e1", questionText: "I have the tools and technology I need to do my job effectively", favorablePercent: 70, neutralPercent: 18, unfavorablePercent: 12, responseCount: 14, moduleId: "echo", moduleTitle: "Engagement", dimensionId: "enablement", dimensionLabel: "Enablement" },
        ],
      },
      {
        moduleId: "wellbeing", moduleTitle: "Wellbeing", icon: "💚", gradient: "from-red-500 to-orange-400",
        responseCount: 14, overallFavorablePercent: 49, overallNeutralPercent: 23, overallUnfavorablePercent: 28,
        questions: [
          { questionId: "w1", questionText: "My overall workload is sustainable over the long term", favorablePercent: 52, neutralPercent: 24, unfavorablePercent: 24, responseCount: 14, moduleId: "wellbeing", moduleTitle: "Wellbeing", dimensionId: "workload", dimensionLabel: "Workload" },
          { questionId: "w2", questionText: "I am able to genuinely disconnect from work outside of working hours", favorablePercent: 38, neutralPercent: 20, unfavorablePercent: 42, responseCount: 14, moduleId: "wellbeing", moduleTitle: "Wellbeing", dimensionId: "disconnect", dimensionLabel: "Disconnect" },
          { questionId: "w4", questionText: "This organization genuinely cares about my mental health and overall wellbeing", favorablePercent: 55, neutralPercent: 25, unfavorablePercent: 20, responseCount: 14, moduleId: "wellbeing", moduleTitle: "Wellbeing", dimensionId: "mental", dimensionLabel: "Mental Health" },
          { questionId: "w5", questionText: "I feel energized and motivated most days rather than depleted", favorablePercent: 41, neutralPercent: 22, unfavorablePercent: 37, responseCount: 14, moduleId: "wellbeing", moduleTitle: "Wellbeing", dimensionId: "energy", dimensionLabel: "Energy" },
        ],
      },
      {
        moduleId: "burnout", moduleTitle: "Burnout Check", icon: "🔋", gradient: "from-amber-500 to-orange-500",
        responseCount: 14, overallFavorablePercent: 62, overallNeutralPercent: 20, overallUnfavorablePercent: 18,
        questions: [
          { questionId: "b1", questionText: "My case queue volume is manageable right now", favorablePercent: 71, neutralPercent: 18, unfavorablePercent: 11, responseCount: 14, moduleId: "burnout", moduleTitle: "Burnout Check", dimensionId: "workload", dimensionLabel: "Workload" },
          { questionId: "b2", questionText: "My energy after back-to-back Sev 2 bridge calls feels sustainable", favorablePercent: 43, neutralPercent: 22, unfavorablePercent: 35, responseCount: 14, moduleId: "burnout", moduleTitle: "Burnout Check", dimensionId: "exhaustion", dimensionLabel: "Exhaustion" },
          { questionId: "b3", questionText: "On-call rotations are fairly distributed across the team", favorablePercent: 68, neutralPercent: 20, unfavorablePercent: 12, responseCount: 14, moduleId: "burnout", moduleTitle: "Burnout Check", dimensionId: "workload", dimensionLabel: "Workload" },
        ],
      },
      {
        moduleId: "manager", moduleTitle: "Manager Review", icon: "⭐", gradient: "from-purple-600 to-purple-400",
        responseCount: 12, overallFavorablePercent: 66, overallNeutralPercent: 21, overallUnfavorablePercent: 13,
        questions: [
          { questionId: "m1", questionText: "My manager advocates for the team during escalations", favorablePercent: 75, neutralPercent: 18, unfavorablePercent: 7, responseCount: 12, moduleId: "manager", moduleTitle: "Manager Review", dimensionId: "support", dimensionLabel: "Support" },
          { questionId: "m2", questionText: "Career growth conversations happen regularly and meaningfully", favorablePercent: 45, neutralPercent: 24, unfavorablePercent: 31, responseCount: 12, moduleId: "manager", moduleTitle: "Manager Review", dimensionId: "growth", dimensionLabel: "Growth" },
          { questionId: "m3", questionText: "My contributions are recognized in a way that feels genuine", favorablePercent: 78, neutralPercent: 14, unfavorablePercent: 8, responseCount: 12, moduleId: "manager", moduleTitle: "Manager Review", dimensionId: "recognition", dimensionLabel: "Recognition" },
        ],
      },
      {
        moduleId: "ai-tools", moduleTitle: "AI & Tools", icon: "⚡", gradient: "from-blue-500 to-blue-400",
        responseCount: 10, overallFavorablePercent: 48, overallNeutralPercent: 27, overallUnfavorablePercent: 25,
        questions: [
          { questionId: "ai1", questionText: "AI tools reduce the time I spend on repetitive case tasks", favorablePercent: 34, neutralPercent: 28, unfavorablePercent: 38, responseCount: 10, moduleId: "ai-tools", moduleTitle: "AI & Tools", dimensionId: "adoption", dimensionLabel: "AI Adoption" },
          { questionId: "ai2", questionText: "I feel confident using AI features in my daily case work", favorablePercent: 56, neutralPercent: 26, unfavorablePercent: 18, responseCount: 10, moduleId: "ai-tools", moduleTitle: "AI & Tools", dimensionId: "confidence", dimensionLabel: "Confidence" },
        ],
      },
    ],
    teamVoiceComments: [],
  };

  const d = data ?? MOCK;
  const isMock = !data;

  const overallFav = d.moduleInsights.length
    ? Math.round(d.moduleInsights.reduce((s, m) => s + m.overallFavorablePercent, 0) / d.moduleInsights.length)
    : 0;
  const atRiskCount = d.dimensionSummaries.filter((ds) => ds.favorablePercent < 50).length;

  const tabs: { key: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview",    icon: <BarChart3 size={14} /> },
    { key: "heatmap",  label: "Heat Map",    icon: <Activity size={14} /> },
    { key: "modules",  label: "Modules",     icon: <Zap size={14} /> },
    { key: "voice",    label: "Team Voice",  icon: <MessageSquare size={14} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F3F2F2", fontFamily: "'Inter', sans-serif" }}>
      <main>

        {/* ── Header ── */}
        <div className="sticky top-0 z-20 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0F0C29 0%, #1E1B4B 40%, #1e3a8a 100%)" }}>
          {/* animated grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }} />
          {/* glow */}
          <div className="absolute -top-10 left-1/4 w-64 h-32 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)", filter: "blur(20px)" }} />
          <div className="absolute -top-6 right-1/3 w-48 h-24 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(1,118,211,0.3) 0%, transparent 70%)", filter: "blur(16px)" }} />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
                  <span className="text-xl">💬</span>
                  <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full flex items-center justify-center"
                    style={{ background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.7)" }}>
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(99,102,241,0.25)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,0.4)" }}>
                      Manager View
                    </span>
                    {isMock && (
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(251,191,36,0.15)", color: "#FCD34D", border: "1px solid rgba(251,191,36,0.3)" }}>
                        Preview Data
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
                    ECHO Insights
                  </h1>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(165,180,252,0.5)" }}>
                    Rolling 30-day window · {d.uniqueRespondents} respondents
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Secret individual view — unlabelled on purpose */}
                <button
                  onClick={() => {
                    if (secretGate === "hidden") setSecretGate("confirm");
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
                  onClick={() => { window.location.href = "/api/auth/logout"; }}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(199,210,254,0.7)" }}
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 pb-3">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={
                    activeTab === t.key
                      ? { background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }
                      : { color: "rgba(165,180,252,0.55)", border: "1px solid transparent" }
                  }
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

          {loading && (
            <div className="flex items-center justify-center h-40">
              <RefreshCw size={20} className="animate-spin" style={{ color: "#0176D3" }} />
            </div>
          )}
          {error && !loading && (
            <div className="flex items-center gap-3 rounded-xl px-5 py-4" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">Could not load live data ({error}). Showing preview data.</p>
            </div>
          )}

          {/* ══ OVERVIEW ══ */}
          {activeTab === "overview" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users />} label="Respondents" value={d.uniqueRespondents} sub="Last 30 days" accent="#0176D3" />
                <StatCard icon={<TrendingUp />} label="Overall Favorable" value={`${overallFav}%`} sub="Across all modules" accent="#2E844A" />
                <StatCard icon={<AlertTriangle />} label="Needs Attention" value={atRiskCount} sub="Dimensions below 50%" accent="#BA0517" />
                <StatCard icon={<Activity />} label="Open Cases" value={d.openCases} sub="Not yet resolved" accent="#DD7A01" />
              </div>

              {/* AI Briefing */}
              <div className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0F0C29 0%, #1E1B4B 60%, #1e3a8a 100%)", border: "1px solid rgba(99,102,241,0.3)" }}>
                <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                  style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                <div className="relative flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-wide" style={{ letterSpacing: "0.06em" }}>TEAM INSIGHTS</h2>
                    </div>
                  </div>
                  {!briefing && (
                    <button onClick={loadBriefing} disabled={briefingLoading}
                      className="text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50 hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", color: "#fff", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
                      {briefingLoading ? "Generating…" : "✦ Generate briefing"}
                    </button>
                  )}
                  {briefing && (
                    <button onClick={() => setBriefing(null)} className="text-xs font-semibold" style={{ color: "#A5B4FC" }}>Refresh</button>
                  )}
                </div>
                {briefingLoading && (
                  <div className="relative flex items-center gap-2 text-xs" style={{ color: "#A5B4FC" }}>
                    <div className="h-4 w-4 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(165,180,252,0.3)", borderTopColor: "#A5B4FC" }} />
                    Reading your team&apos;s data…
                  </div>
                )}
                {briefing && !briefingLoading && (
                  <p className="relative text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(199,210,254,0.85)" }}>{briefing}</p>
                )}
                {!briefing && !briefingLoading && (
                  <p className="relative text-xs" style={{ color: "rgba(165,180,252,0.5)" }}>Click &quot;Generate briefing&quot; to get a plain-English summary of your team&apos;s pulse.</p>
                )}
              </div>

              {/* Manager Actions */}
              <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #EBEBED", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F3F2F2" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", boxShadow: "0 4px 12px rgba(79,70,229,0.35)" }}>
                      <Target size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Your commitments</p>
                      <h2 className="text-sm font-black" style={{ color: "#0F0C29", letterSpacing: "-0.01em" }}>What you&apos;ve committed to</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setActionPanel((p) => !p)}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
                    style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", boxShadow: "0 4px 12px rgba(79,70,229,0.3)" }}
                  >
                    + Add commitment
                  </button>
                </div>

                <div className="px-5 py-4 space-y-3">
                  {actionPanel && (
                    <div className="p-4 rounded-xl" style={{ background: "#F8F8FC", border: "1px solid rgba(79,70,229,0.15)" }}>
                      <div className="space-y-3">
                        <select
                          value={newAction.sectionId}
                          onChange={(e) => setNewAction((p) => ({ ...p, sectionId: e.target.value }))}
                          className="w-full text-sm px-3 py-2.5 rounded-xl border bg-white focus:outline-none transition-all"
                          style={{ borderColor: "#E5E5E5", color: "#0F0C29" }}
                        >
                          <option value="">Select topic area…</option>
                          {ENGAGEMENT_SECTIONS.map((s) => (
                            <option key={s.id} value={s.id}>{s.icon} {s.title}</option>
                          ))}
                        </select>
                        <textarea
                          value={newAction.commitment}
                          onChange={(e) => setNewAction((p) => ({ ...p, commitment: e.target.value }))}
                          placeholder="What will you do? e.g. Share career ladder doc by end of month"
                          rows={2}
                          className="w-full text-sm px-3 py-2.5 rounded-xl border bg-white focus:outline-none resize-none transition-all"
                          style={{ borderColor: "#E5E5E5", color: "#0F0C29" }}
                        />
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={newAction.targetDate}
                            onChange={(e) => setNewAction((p) => ({ ...p, targetDate: e.target.value }))}
                            className="text-sm px-3 py-2.5 rounded-xl border bg-white focus:outline-none transition-all"
                            style={{ borderColor: "#E5E5E5", color: "#0F0C29" }}
                          />
                          <button
                            onClick={submitAction}
                            disabled={!newAction.sectionId || !newAction.commitment.trim()}
                            className="flex-1 text-sm font-bold py-2.5 rounded-xl disabled:opacity-40 transition-all"
                            style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff" }}
                          >
                            Save commitment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {actions.length === 0 && !actionPanel && (
                    <div className="py-6 flex flex-col items-center text-center">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: "#F5F5F7", border: "1px solid #EBEBED" }}>
                        <Target size={16} className="text-gray-300" />
                      </div>
                      <p className="text-sm font-semibold text-gray-500">No commitments yet</p>
                      <p className="text-xs text-gray-400 mt-0.5">Add one after reviewing your team&apos;s scores</p>
                    </div>
                  )}

                  {actions.map((a) => {
                    const section = ENGAGEMENT_SECTIONS.find((s) => s.id === a.sectionId);
                    return (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 p-3.5 rounded-xl transition-all"
                        style={{
                          background: a.resolved ? "#F0FBF4" : "#FAFAFA",
                          border: `1px solid ${a.resolved ? "#A8D5B2" : "#EBEBED"}`,
                          opacity: a.resolved ? 0.7 : 1,
                        }}
                      >
                        <button
                          onClick={() => !a.resolved && markActionDone(a.id)}
                          className="mt-0.5 flex-shrink-0 transition-all hover:scale-110"
                        >
                          {a.resolved
                            ? <CheckCircle2 size={17} style={{ color: "#2E844A" }} />
                            : <Circle size={17} className="text-gray-300 hover:text-gray-500" />
                          }
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-gray-400 mb-0.5">
                            {section ? `${section.icon} ${section.title}` : a.sectionId}
                            {a.targetDate && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{ background: "#FEF3C7", color: "#92400E" }}>
                                due {new Date(a.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </p>
                          <p className={`text-sm font-medium text-gray-700 ${a.resolved ? "line-through text-gray-400" : ""}`}>{a.commitment}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Module donuts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Favorability by module</p>
                    <h2 className="text-base font-black" style={{ color: "#0F0C29", letterSpacing: "-0.02em" }}>Module Overview</h2>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-400">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "#2E844A" }} />Favorable</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "#DD7A01" }} />Neutral</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "#BA0517" }} />Unfav.</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {d.moduleInsights.map((mod) => {
                    const unf = Math.max(0, 100 - mod.overallFavorablePercent - mod.overallNeutralPercent);
                    const sc = scoreColor(mod.overallFavorablePercent);
                    const grad = MODULE_GRADIENTS[mod.moduleId] ?? MODULE_GRADIENTS.echo;
                    const glowColor = MODULE_GLOWS[mod.moduleId] ?? "#4F46E5";
                    return (
                      <div key={mod.moduleId} className="bg-white rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
                        style={{ border: `1px solid ${glowColor}18`, boxShadow: `0 4px 20px ${glowColor}10, 0 1px 4px rgba(0,0,0,0.04)` }}>
                        <div className="absolute bottom-0 right-0 w-28 h-28 rounded-full pointer-events-none"
                          style={{ background: `radial-gradient(circle, ${glowColor}15 0%, transparent 70%)`, transform: "translate(30%, 30%)" }} />
                        <DonutRing favorable={mod.overallFavorablePercent} neutral={mod.overallNeutralPercent} unfavorable={unf} size={72} stroke={9} />
                        <div className="flex-1 min-w-0 relative">
                          <div className="flex items-center gap-2 mb-2.5">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                              style={{ background: grad, boxShadow: `0 4px 12px ${glowColor}40` }}>
                              {mod.icon}
                            </div>
                            <p className="text-sm font-bold truncate" style={{ color: "#0F0C29" }}>{mod.moduleTitle}</p>
                          </div>
                          <StackedBar favorable={mod.overallFavorablePercent} neutral={mod.overallNeutralPercent} unfavorable={unf} height={7} />
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-[10px] text-gray-400">{mod.responseCount} responses</p>
                            <p className="text-sm font-black" style={{ color: sc, letterSpacing: "-0.02em" }}>{mod.overallFavorablePercent}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top 3 / Bottom 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(46,132,74,0.2)", boxShadow: "0 4px 20px rgba(46,132,74,0.07)" }}>
                  <div className="flex items-center gap-3 px-5 py-3.5 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #052E16 0%, #14532D 100%)" }}>
                    <div className="absolute inset-0 opacity-[0.08]"
                      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className="relative h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <Award size={15} className="text-emerald-300" />
                    </div>
                    <h3 className="relative text-sm font-black text-white">Top 3 Signals</h3>
                    <span className="relative ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.25)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.3)" }}>Strengths</span>
                  </div>
                  <div className="px-5 py-1">
                    {d.topQuestions.map((q, i) => <QuestionRow key={q.questionId} q={q} rank={i + 1} />)}
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(186,5,23,0.2)", boxShadow: "0 4px 20px rgba(186,5,23,0.07)" }}>
                  <div className="flex items-center gap-3 px-5 py-3.5 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%)" }}>
                    <div className="absolute inset-0 opacity-[0.08]"
                      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className="relative h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <TrendingDown size={15} className="text-red-300" />
                    </div>
                    <h3 className="relative text-sm font-black text-white">Bottom 3 Signals</h3>
                    <span className="relative ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.25)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}>Needs focus</span>
                  </div>
                  <div className="px-5 py-1">
                    {d.bottomQuestions.map((q, i) => <QuestionRow key={q.questionId} q={q} rank={i + 1} />)}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ HEAT MAP ══ */}
          {activeTab === "heatmap" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Favorability by dimension</p>
                  <h2 className="text-sm font-bold" style={{ color: "#032D60" }}>Dimension Heat Map</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Cell color = favorability score. Red = needs attention, green = strong.</p>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  {[
                    { label: "80%+", bg: "#D1FAE5", text: "#065F46" },
                    { label: "65–79%", bg: "#DCFCE7", text: "#15803D" },
                    { label: "50–64%", bg: "#FEF9C3", text: "#854D0E" },
                    { label: "35–49%", bg: "#FFEDD5", text: "#9A3412" },
                    { label: "<35%", bg: "#FEE2E2", text: "#991B1B" },
                  ].map((s) => (
                    <span key={s.label} className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.text }}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E5E5E5", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div
                  className="grid px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide"
                  style={{ gridTemplateColumns: "1fr 88px 72px 72px", borderBottom: "1px solid #F3F2F2", background: "#F3F2F2" }}
                >
                  <span>Dimension</span>
                  <span className="text-center" style={{ color: "#2E844A" }}>Favorable</span>
                  <span className="text-center" style={{ color: "#DD7A01" }}>Neutral</span>
                  <span className="text-center" style={{ color: "#BA0517" }}>Unf.</span>
                </div>

                {Object.entries(
                  d.dimensionSummaries.reduce<Record<string, DimensionSummary[]>>((acc, ds) => {
                    if (!acc[ds.moduleTitle]) acc[ds.moduleTitle] = [];
                    acc[ds.moduleTitle].push(ds);
                    return acc;
                  }, {})
                ).map(([modTitle, dims]) => {
                  const modId = dims[0]?.moduleId ?? "echo";
                  const grad = MODULE_GRADIENTS[modId] ?? MODULE_GRADIENTS.echo;
                  return (
                    <div key={modTitle}>
                      <div
                        className="px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={{ background: "#F3F2F2", borderTop: "1px solid #E5E5E5", borderBottom: "1px solid #E5E5E5", color: "#4B5563" }}
                      >
                        <div className="h-2.5 w-2.5 rounded-sm flex-shrink-0" style={{ background: grad }} />
                        {modTitle}
                      </div>
                      {dims.map((ds, i) => {
                        const fCell = heatCell(ds.favorablePercent);
                        const unf = Math.max(0, 100 - ds.favorablePercent - ds.neutralPercent);
                        return (
                          <div
                            key={ds.id}
                            className="grid items-center px-5 py-3.5"
                            style={{
                              gridTemplateColumns: "1fr 88px 72px 72px",
                              borderBottom: i < dims.length - 1 ? "1px solid #F3F2F2" : undefined,
                            }}
                          >
                            <div className="pr-4">
                              <p className="text-xs font-semibold mb-1.5" style={{ color: "#032D60" }}>{ds.label}</p>
                              <div className="w-full max-w-[220px]">
                                <StackedBar favorable={ds.favorablePercent} neutral={ds.neutralPercent} unfavorable={unf} height={5} />
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <span className="text-xs font-black px-2.5 py-1 rounded-lg"
                                style={{ background: fCell.bg, color: fCell.text, border: `1px solid ${fCell.border}`, minWidth: 48, textAlign: "center", display: "block" }}>
                                {ds.favorablePercent}%
                              </span>
                            </div>
                            <div className="flex justify-center">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                                style={{ background: "#F3F2F2", color: "#6B7280", border: "1px solid #E5E5E5", minWidth: 40, textAlign: "center", display: "block" }}>
                                {ds.neutralPercent}%
                              </span>
                            </div>
                            <div className="flex justify-center">
                              {unf > 0 ? (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                                  style={{
                                    background: unf >= 30 ? "#FEE2E2" : unf >= 15 ? "#FFEDD5" : "#F3F2F2",
                                    color: unf >= 30 ? "#991B1B" : unf >= 15 ? "#9A3412" : "#9CA3AF",
                                    border: `1px solid ${unf >= 30 ? "#FCA5A5" : unf >= 15 ? "#FDBA74" : "#E5E5E5"}`,
                                    minWidth: 40, textAlign: "center", display: "block",
                                  }}>
                                  {unf}%
                                </span>
                              ) : (
                                <span className="text-xs text-gray-300 text-center block" style={{ minWidth: 40 }}>—</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ MODULES ══ */}
          {activeTab === "modules" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Expand each to see questions</p>
                  <h2 className="text-sm font-bold" style={{ color: "#032D60" }}>Question Breakdown</h2>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#2E844A" }} />Favorable</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#DD7A01" }} />Neutral</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#BA0517" }} />Unfavorable</span>
                </div>
              </div>
              {d.moduleInsights.map((mod) => (
                <ModuleAccordionRow key={mod.moduleId} mod={mod} />
              ))}
            </div>
          )}

          {/* ══ TEAM VOICE ══ */}
          {activeTab === "voice" && (
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Open-text responses</p>
                <h2 className="text-base font-black" style={{ color: "#0F0C29", letterSpacing: "-0.02em" }}>Team Voice</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Anonymous open-text responses from the ECHO survey.
                </p>
              </div>

              {d.teamVoiceComments && d.teamVoiceComments.length > 0 ? (
                <div className="space-y-3">
                  {d.teamVoiceComments.map((c, i) => {
                    const sec = ENGAGEMENT_SECTIONS.find((s) => s.id === c.sectionId);
                    return (
                      <div key={i} className="bg-white rounded-2xl overflow-hidden"
                        style={{ border: `1px solid ${sec?.color ?? "#0176D3"}22`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <div className="h-1 w-full" style={{ background: sec?.gradient ?? "linear-gradient(135deg,#4F46E5,#7C3AED)" }} />
                        <div className="p-5">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5"
                            style={{ color: sec?.color ?? "#0176D3" }}>
                            {sec?.icon} {(sec?.title ?? c.sectionId).replace(/_/g, " ")}
                          </p>
                          <div className="flex items-start gap-2.5">
                            <span className="text-3xl leading-none flex-shrink-0 -mt-1" style={{ color: sec?.color ?? "#0176D3", opacity: 0.3 }}>&ldquo;</span>
                            <p className="text-sm text-gray-700 leading-relaxed italic">{c.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden relative"
                  style={{ background: "linear-gradient(135deg, #0F0C29 0%, #1E1B4B 100%)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="relative p-12 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-2xl"
                      style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}>
                      💬
                    </div>
                    <p className="text-base font-black text-white mb-1" style={{ letterSpacing: "-0.02em" }}>No comments yet</p>
                    <p className="text-sm max-w-xs leading-relaxed" style={{ color: "rgba(165,180,252,0.6)" }}>
                      Comments appear here once team members submit the open-text section. The comment box is optional — not everyone fills it in.
                    </p>
                  </div>
                </div>
              )}

              {/* Privacy note */}
              <div className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: "rgba(79,70,229,0.06)", border: "1px solid rgba(79,70,229,0.15)" }}>
                <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(79,70,229,0.15)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#4338CA" }}>
                  <strong>Anonymity protected.</strong> Comments are shown verbatim but no name, timestamp, or identity is ever attached or displayed.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Confirmation gate modal ── */}
      {secretGate === "confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "#0F0C29", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative p-6 text-center">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg,#DC2626,#EF4444)", boxShadow: "0 0 32px rgba(239,68,68,0.4)" }}>
                <ShieldAlert size={24} className="text-white" />
              </div>
              <h2 className="text-lg font-black text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
                Individual responses
              </h2>
              <p className="text-sm leading-relaxed mb-1" style={{ color: "rgba(199,210,254,0.7)" }}>
                This view reveals <strong className="text-white">who said what</strong>. The survey was shown as anonymous to respondents.
              </p>
              <p className="text-xs mb-6" style={{ color: "rgba(165,180,252,0.45)" }}>
                Access is logged. Use only for legitimate people management purposes.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSecretGate("hidden")}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(199,210,254,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setSecretGate("open"); loadIndividual(); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#DC2626,#EF4444)", boxShadow: "0 4px 16px rgba(239,68,68,0.4)" }}
                >
                  I understand — reveal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Individual responses panel (slide-in from bottom) ── */}
      {secretGate === "open" && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col"
          style={{ top: "60px" }}>
          <div className="flex-1 overflow-y-auto"
            style={{ background: "#0A0820", borderTop: "2px solid rgba(239,68,68,0.4)" }}>
            {/* Panel header */}
            <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#1a0808,#2d1515)", borderBottom: "1px solid rgba(239,68,68,0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#DC2626,#EF4444)", boxShadow: "0 4px 12px rgba(239,68,68,0.4)" }}>
                  <Lock size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(252,165,165,0.6)" }}>Confidential</p>
                  <h3 className="text-sm font-black text-white" style={{ letterSpacing: "-0.01em" }}>Individual Responses</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}>
                  {individualData?.length ?? "—"} respondents
                </span>
              </div>
              <button onClick={() => { setSecretGate("hidden"); setIndividualData(null); }}
                className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(165,180,252,0.6)" }}>
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-3 max-w-4xl mx-auto">
              {individualLoading && (
                <div className="flex items-center justify-center py-16">
                  <div className="h-5 w-5 rounded-full border-2 animate-spin mr-3"
                    style={{ borderColor: "rgba(252,165,165,0.2)", borderTopColor: "#FCA5A5" }} />
                  <span className="text-sm" style={{ color: "rgba(199,210,254,0.5)" }}>Loading responses…</span>
                </div>
              )}

              {!individualLoading && individualData?.map((resp) => {
                const isExpanded = expandedResponse === resp.responseId;
                const avgColor = resp.overallAvg
                  ? resp.overallAvg >= 4 ? "#4ADE80" : resp.overallAvg >= 3 ? "#FCD34D" : "#F87171"
                  : "#6B7280";

                return (
                  <div key={resp.responseId} className="rounded-2xl overflow-hidden transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Row header */}
                    <button className="w-full text-left px-5 py-4 flex items-center gap-4"
                      onClick={() => setExpandedResponse(isExpanded ? null : resp.responseId)}>
                      {/* Avatar */}
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: "rgba(99,102,241,0.25)", color: "#A5B4FC" }}>
                        {resp.user?.name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{resp.user?.name ?? "Unknown"}</p>
                        <p className="text-[11px]" style={{ color: "rgba(165,180,252,0.5)" }}>
                          {resp.user?.email ?? "—"} · {new Date(resp.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      {/* Overall avg */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-lg font-black" style={{ color: avgColor, letterSpacing: "-0.03em" }}>
                          {resp.overallAvg?.toFixed(1) ?? "—"}
                        </span>
                        <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>/5</span>
                        <ChevronDown size={14} className="transition-transform ml-1"
                          style={{ color: "rgba(165,180,252,0.4)", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
                      </div>
                    </button>

                    {/* Expanded section breakdown */}
                    {isExpanded && (
                      <div className="px-5 pb-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        {/* Section scores grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3">
                          {ENGAGEMENT_SECTIONS.map((sec) => {
                            const score = resp.sectionScores[sec.id];
                            if (!score) return null;
                            const col = score.avg >= 4 ? "#4ADE80" : score.avg >= 3 ? "#FCD34D" : "#F87171";
                            return (
                              <div key={sec.id} className="rounded-xl px-3 py-2.5"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-sm">{sec.icon}</span>
                                  <span className="text-[11px] font-semibold truncate" style={{ color: "rgba(165,180,252,0.6)" }}>{sec.title}</span>
                                </div>
                                <span className="text-xl font-black" style={{ color: col, letterSpacing: "-0.03em" }}>{score.avg}</span>
                                <span className="text-[10px] ml-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>/5</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Comments */}
                        {Object.entries(resp.comments).length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(165,180,252,0.4)" }}>Comments</p>
                            {Object.entries(resp.comments).map(([sectionId, text]) => {
                              const sec = ENGAGEMENT_SECTIONS.find((s) => s.id === sectionId);
                              return (
                                <div key={sectionId} className="rounded-xl px-3.5 py-3"
                                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                  <p className="text-[10px] font-bold mb-1" style={{ color: sec?.color ?? "#A5B4FC" }}>
                                    {sec?.icon} {sec?.title ?? sectionId}
                                  </p>
                                  <p className="text-xs leading-relaxed italic" style={{ color: "rgba(199,210,254,0.7)" }}>&ldquo;{text}&rdquo;</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {!individualLoading && individualData?.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-sm font-semibold" style={{ color: "rgba(165,180,252,0.5)" }}>No responses in the last 30 days</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ToolFeedbackWidget />
      <div className="fixed bottom-2 right-4 pointer-events-none" style={{ zIndex: 30 }}>
        <p className="text-[10px] font-medium" style={{ color: "rgba(0,0,0,0.2)" }}>Powered by Claude</p>
      </div>
    </div>
  );
}
