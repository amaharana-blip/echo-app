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

/* ─── Heat map color scale ───────────────────────────────────── */
function heatCell(pct: number): { bg: string; text: string; border: string } {
  if (pct >= 80) return { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" };
  if (pct >= 65) return { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" };
  if (pct >= 50) return { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" };
  if (pct >= 35) return { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" };
  if (pct >= 20) return { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" };
  return { bg: "#FECACA", text: "#7F1D1D", border: "#F87171" };
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

  const scoreColor = favorable >= 70 ? "#10B981" : favorable >= 45 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
        {unfDash > 0.5 && (
          <circle
            cx={cx} cy={cx} r={r} fill="none"
            stroke="#EF4444" strokeWidth={stroke}
            strokeDasharray={`${unfDash} ${circ - unfDash}`}
            strokeDashoffset={-(circ - unfDash) * 0}
            strokeLinecap="butt"
          />
        )}
        {neuDash > 0.5 && (
          <circle
            cx={cx} cy={cx} r={r} fill="none"
            stroke="#F59E0B" strokeWidth={stroke}
            strokeDasharray={`${neuDash} ${circ - neuDash}`}
            strokeDashoffset={-unfDash}
            strokeLinecap="butt"
          />
        )}
        {favDash > 0.5 && (
          <circle
            cx={cx} cy={cx} r={r} fill="none"
            stroke="#10B981" strokeWidth={stroke}
            strokeDasharray={`${favDash} ${circ - favDash}`}
            strokeDashoffset={-(unfDash + neuDash)}
            strokeLinecap="butt"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black leading-none" style={{ color: scoreColor }}>
          {favorable}
        </span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">fav%</span>
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
          <div className="transition-all duration-700" style={{ width: `${favorable}%`, background: "#10B981" }} />
        )}
        {neutral > 0 && (
          <div className="transition-all duration-700" style={{ width: `${neutral}%`, background: "#F59E0B" }} />
        )}
        {unf > 0 && (
          <div className="transition-all duration-700" style={{ width: `${unf}%`, background: "#EF4444" }} />
        )}
      </div>
      {showLabels && (
        <div className="flex justify-between mt-1.5 text-[10px] font-semibold">
          <span style={{ color: "#10B981" }}>{favorable}% Favorable</span>
          <span style={{ color: "#F59E0B" }}>{neutral}% Neutral</span>
          <span style={{ color: "#EF4444" }}>{unf}% Unfavorable</span>
        </div>
      )}
    </div>
  );
}

/* ─── Question row ───────────────────────────────────────────── */
function QuestionRow({ q, rank }: { q: QuestionInsight; rank?: number }) {
  const unf = Math.max(0, 100 - q.favorablePercent - q.neutralPercent);
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-start gap-3">
        {rank !== undefined && (
          <span
            className="flex-shrink-0 h-5 w-5 rounded-full text-[10px] font-black flex items-center justify-center mt-0.5"
            style={{ background: "#F3F4F6", color: "#6B7280" }}
          >
            {rank}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 leading-snug mb-2">{q.questionText}</p>
          <StackedBar favorable={q.favorablePercent} neutral={q.neutralPercent} unfavorable={unf} height={7} />
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] font-semibold" style={{ color: "#10B981" }}>{q.favorablePercent}% fav</span>
            <span className="text-[10px]" style={{ color: "#F59E0B" }}>{q.neutralPercent}% neu</span>
            <span className="text-[10px]" style={{ color: "#EF4444" }}>{unf}% unf</span>
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
    <div
      className="rounded-2xl p-5 bg-white"
      style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4"
          style={{ background: `${accent}18`, color: accent }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ─── Module accordion ───────────────────────────────────────── */
const MODULE_GRADIENT: Record<string, string> = {
  burnout:           "linear-gradient(135deg, #D97706, #F59E0B)",
  pulse:             "linear-gradient(135deg, #E11D48, #F43F5E)",
  manager:           "linear-gradient(135deg, #7C3AED, #A855F7)",
  "ai-tools":        "linear-gradient(135deg, #2563EB, #3B82F6)",
  satisfaction:      "linear-gradient(135deg, #059669, #10B981)",
  enps:              "linear-gradient(135deg, #4F46E5, #6366F1)",
  echo:              "linear-gradient(135deg, #4F46E5, #7C3AED)",
  "echo-wellbeing":  "linear-gradient(135deg, #DC2626, #F97316)",
};

function ModuleAccordionRow({ mod }: { mod: ModuleInsight }) {
  const [open, setOpen] = useState(false);
  const gradient = MODULE_GRADIENT[mod.moduleId] ?? "linear-gradient(135deg,#6366F1,#818CF8)";
  const unf = Math.max(0, 100 - mod.overallFavorablePercent - mod.overallNeutralPercent);
  const scoreColor =
    mod.overallFavorablePercent >= 70 ? "#10B981"
    : mod.overallFavorablePercent >= 45 ? "#F59E0B"
    : "#EF4444";

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <button className="w-full text-left" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-center gap-4 p-4">
          <div className="h-10 w-1.5 rounded-full flex-shrink-0" style={{ background: gradient }} />
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-xl leading-none">{mod.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">{mod.moduleTitle}</p>
              <p className="text-[11px] text-gray-400">{mod.responseCount} responses</p>
            </div>
          </div>
          <div className="flex-1 max-w-[180px] hidden sm:block">
            <StackedBar
              favorable={mod.overallFavorablePercent}
              neutral={mod.overallNeutralPercent}
              unfavorable={unf}
              height={6}
            />
          </div>
          <span className="text-base font-black flex-shrink-0 w-10 text-right" style={{ color: scoreColor }}>
            {mod.overallFavorablePercent}%
          </span>
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ background: open ? "#EEF2FF" : "#F9FAFB" }}
          >
            {open
              ? <ChevronDown size={14} className="text-indigo-600" />
              : <ChevronRight size={14} className="text-gray-400" />
            }
          </div>
        </div>
        <div className="px-4 pb-3 sm:hidden">
          <StackedBar
            favorable={mod.overallFavorablePercent}
            neutral={mod.overallNeutralPercent}
            unfavorable={unf}
            height={6}
            showLabels
          />
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-50 px-4 py-2">
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

  // AI Briefing
  const [briefing, setBriefing] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  // Manager Actions
  const [actions, setActions] = useState<ManagerAction[]>([]);
  const [newAction, setNewAction] = useState({ sectionId: "", commitment: "", targetDate: "" });
  const [actionPanel, setActionPanel] = useState(false);

  useEffect(() => {
    fetch("/api/manager/insights")
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
    fetch("/api/actions")
      .then((r) => r.ok ? r.json() : [])
      .then((a) => setActions(a));
  }, []);

  async function loadBriefing() {
    setBriefingLoading(true);
    try {
      const r = await fetch("/api/briefing");
      const j = await r.json();
      setBriefing(j.briefing ?? j.error ?? "Could not generate briefing.");
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

  /* ── Mock for visual preview when no live data ── */
  const MOCK: InsightsData = {
    uniqueRespondents: 14,
    openCases: 3,
    generatedAt: new Date().toISOString(),
    dimensionSummaries: [
      { id: "pulse-connection", label: "Team Connection", moduleId: "pulse", moduleTitle: "Daily Pulse", favorablePercent: 82, neutralPercent: 12, unfavorablePercent: 6, responseCount: 14, color: "rose" },
      { id: "echo-leadership", label: "Leadership Trust", moduleId: "echo", moduleTitle: "ECHO 1.0 — Engagement", favorablePercent: 76, neutralPercent: 16, unfavorablePercent: 8, responseCount: 14, color: "indigo" },
      { id: "echo-growth", label: "Growth & Career", moduleId: "echo", moduleTitle: "ECHO 1.0 — Engagement", favorablePercent: 58, neutralPercent: 22, unfavorablePercent: 20, responseCount: 14, color: "indigo" },
      { id: "echo-purpose", label: "Purpose & Alignment", moduleId: "echo", moduleTitle: "ECHO 1.0 — Engagement", favorablePercent: 71, neutralPercent: 18, unfavorablePercent: 11, responseCount: 14, color: "indigo" },
      { id: "echo-team", label: "Team Relationships", moduleId: "echo", moduleTitle: "ECHO 1.0 — Engagement", favorablePercent: 80, neutralPercent: 13, unfavorablePercent: 7, responseCount: 14, color: "indigo" },
      { id: "echo-culture", label: "Culture & Values", moduleId: "echo", moduleTitle: "ECHO 1.0 — Engagement", favorablePercent: 63, neutralPercent: 21, unfavorablePercent: 16, responseCount: 14, color: "indigo" },
      { id: "echo-wellbeing-workload", label: "Workload Sustainability", moduleId: "echo", moduleTitle: "ECHO 1.0 — Wellbeing", favorablePercent: 52, neutralPercent: 24, unfavorablePercent: 24, responseCount: 14, color: "red" },
      { id: "echo-wellbeing-disconnect", label: "Ability to Disconnect", moduleId: "echo", moduleTitle: "ECHO 1.0 — Wellbeing", favorablePercent: 44, neutralPercent: 20, unfavorablePercent: 36, responseCount: 14, color: "red" },
      { id: "echo-wellbeing-energy", label: "Energy & Motivation", moduleId: "echo", moduleTitle: "ECHO 1.0 — Wellbeing", favorablePercent: 47, neutralPercent: 22, unfavorablePercent: 31, responseCount: 14, color: "red" },
      { id: "echo-wellbeing-mental", label: "Mental Health Support", moduleId: "echo", moduleTitle: "ECHO 1.0 — Wellbeing", favorablePercent: 55, neutralPercent: 25, unfavorablePercent: 20, responseCount: 14, color: "red" },
      { id: "echo-recognition", label: "Recognition & Feedback", moduleId: "echo", moduleTitle: "ECHO 1.0 — Engagement", favorablePercent: 61, neutralPercent: 22, unfavorablePercent: 17, responseCount: 14, color: "indigo" },
      { id: "echo-enablement", label: "Tools & Enablement", moduleId: "echo", moduleTitle: "ECHO 1.0 — Engagement", favorablePercent: 67, neutralPercent: 20, unfavorablePercent: 13, responseCount: 14, color: "indigo" },
      { id: "manager-support", label: "Manager Support", moduleId: "manager", moduleTitle: "Manager Review", favorablePercent: 69, neutralPercent: 19, unfavorablePercent: 12, responseCount: 12, color: "purple" },
      { id: "aitools-adoption", label: "AI Adoption", moduleId: "ai-tools", moduleTitle: "AI & Tools", favorablePercent: 48, neutralPercent: 28, unfavorablePercent: 24, responseCount: 10, color: "blue" },
    ],
    topQuestions: [
      { questionId: "q1", questionText: "My team collaborates effectively and genuinely supports one another", favorablePercent: 88, neutralPercent: 8, unfavorablePercent: 4, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "team", dimensionLabel: "Team Relationships" },
      { questionId: "q2", questionText: "I feel a strong sense of belonging within my team", favorablePercent: 84, neutralPercent: 10, unfavorablePercent: 6, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "team", dimensionLabel: "Team Relationships" },
      { questionId: "q3", questionText: "Senior leaders communicate direction clearly and honestly", favorablePercent: 78, neutralPercent: 14, unfavorablePercent: 8, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "leadership", dimensionLabel: "Leadership Trust" },
    ],
    bottomQuestions: [
      { questionId: "q4", questionText: "I am able to genuinely disconnect from work outside of working hours", favorablePercent: 38, neutralPercent: 20, unfavorablePercent: 42, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "wellbeing", dimensionLabel: "Wellbeing" },
      { questionId: "q5", questionText: "I feel energized and motivated most days rather than depleted", favorablePercent: 41, neutralPercent: 22, unfavorablePercent: 37, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "wellbeing", dimensionLabel: "Wellbeing" },
      { questionId: "q6", questionText: "I have clear opportunities to grow my skills and advance my career here", favorablePercent: 45, neutralPercent: 24, unfavorablePercent: 31, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "growth", dimensionLabel: "Growth & Career" },
    ],
    moduleInsights: [
      {
        moduleId: "echo", moduleTitle: "ECHO 1.0 — Engagement", icon: "💬", gradient: "from-indigo-600 to-purple-500",
        responseCount: 14, overallFavorablePercent: 68, overallNeutralPercent: 19, overallUnfavorablePercent: 13,
        questions: [
          { questionId: "l1", questionText: "Senior leaders communicate direction clearly and honestly", favorablePercent: 78, neutralPercent: 14, unfavorablePercent: 8, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "leadership", dimensionLabel: "Leadership" },
          { questionId: "l2", questionText: "I trust that leadership makes decisions with the team's best interests in mind", favorablePercent: 74, neutralPercent: 18, unfavorablePercent: 8, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "leadership", dimensionLabel: "Leadership" },
          { questionId: "g1", questionText: "I have clear opportunities to grow my skills and advance my career here", favorablePercent: 45, neutralPercent: 24, unfavorablePercent: 31, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "growth", dimensionLabel: "Growth" },
          { questionId: "g2", questionText: "My manager provides useful and timely feedback that helps me improve", favorablePercent: 62, neutralPercent: 22, unfavorablePercent: 16, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "growth", dimensionLabel: "Growth" },
          { questionId: "t1", questionText: "My team collaborates effectively and genuinely supports one another", favorablePercent: 88, neutralPercent: 8, unfavorablePercent: 4, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "team", dimensionLabel: "Team" },
          { questionId: "t2", questionText: "I feel a strong sense of belonging within my team", favorablePercent: 84, neutralPercent: 10, unfavorablePercent: 6, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "team", dimensionLabel: "Team" },
          { questionId: "c1", questionText: "I feel safe speaking up about concerns or ideas without fear", favorablePercent: 65, neutralPercent: 20, unfavorablePercent: 15, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "culture", dimensionLabel: "Culture" },
          { questionId: "r1", questionText: "My contributions are recognized in ways that feel meaningful and genuine", favorablePercent: 60, neutralPercent: 23, unfavorablePercent: 17, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "recognition", dimensionLabel: "Recognition" },
          { questionId: "e1", questionText: "I have the tools and technology I need to do my job effectively", favorablePercent: 70, neutralPercent: 18, unfavorablePercent: 12, responseCount: 14, moduleId: "echo", moduleTitle: "ECHO 1.0", dimensionId: "enablement", dimensionLabel: "Enablement" },
        ],
      },
      {
        moduleId: "echo-wellbeing", moduleTitle: "ECHO 1.0 — Wellbeing", icon: "💚", gradient: "from-red-500 to-orange-400",
        responseCount: 14, overallFavorablePercent: 49, overallNeutralPercent: 23, overallUnfavorablePercent: 28,
        questions: [
          { questionId: "w1", questionText: "My overall workload is sustainable over the long term", favorablePercent: 52, neutralPercent: 24, unfavorablePercent: 24, responseCount: 14, moduleId: "echo-wellbeing", moduleTitle: "ECHO 1.0 — Wellbeing", dimensionId: "workload", dimensionLabel: "Workload" },
          { questionId: "w2", questionText: "I am able to genuinely disconnect from work outside of working hours", favorablePercent: 38, neutralPercent: 20, unfavorablePercent: 42, responseCount: 14, moduleId: "echo-wellbeing", moduleTitle: "ECHO 1.0 — Wellbeing", dimensionId: "disconnect", dimensionLabel: "Disconnect" },
          { questionId: "w3", questionText: "My manager and team respect the boundaries I set around my personal time", favorablePercent: 58, neutralPercent: 24, unfavorablePercent: 18, responseCount: 14, moduleId: "echo-wellbeing", moduleTitle: "ECHO 1.0 — Wellbeing", dimensionId: "boundaries", dimensionLabel: "Boundaries" },
          { questionId: "w4", questionText: "This organization genuinely cares about my mental health and overall wellbeing", favorablePercent: 55, neutralPercent: 25, unfavorablePercent: 20, responseCount: 14, moduleId: "echo-wellbeing", moduleTitle: "ECHO 1.0 — Wellbeing", dimensionId: "mental", dimensionLabel: "Mental Health" },
          { questionId: "w5", questionText: "I feel energized and motivated most days rather than depleted", favorablePercent: 41, neutralPercent: 22, unfavorablePercent: 37, responseCount: 14, moduleId: "echo-wellbeing", moduleTitle: "ECHO 1.0 — Wellbeing", dimensionId: "energy", dimensionLabel: "Energy" },
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
    <div className="min-h-screen" style={{ background: "#F4F5F9", fontFamily: "'Inter', sans-serif" }}>
      <main>

        {/* ── Header ── */}
        <div
          className="sticky top-0 z-20"
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #1E40AF 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(165,180,252,0.15)", color: "#A5B4FC" }}
                  >
                    Manager View
                  </span>
                  {isMock && (
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(251,191,36,0.2)", color: "#FCD34D" }}
                    >
                      Preview Data
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
                  ECHO 1.0 Insights
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "rgba(199,210,254,0.55)" }}>
                  Rolling 30-day window · {d.uniqueRespondents} respondents
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { window.location.href = "/api/auth/logout"; }}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(199,210,254,0.7)" }}
                >
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
                      ? { background: "rgba(255,255,255,0.12)", color: "#fff" }
                      : { color: "rgba(165,180,252,0.6)" }
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

          {loading && (
            <div className="flex items-center justify-center h-40">
              <RefreshCw size={20} className="text-indigo-400 animate-spin" />
            </div>
          )}
          {error && !loading && (
            <div className="flex items-center gap-3 rounded-2xl px-5 py-4" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">Could not load live data ({error}). Showing preview data.</p>
            </div>
          )}

          {/* ══ OVERVIEW ══ */}
          {activeTab === "overview" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users />} label="Respondents" value={d.uniqueRespondents} sub="Last 30 days" accent="#6366F1" />
                <StatCard icon={<TrendingUp />} label="Overall Favorable" value={`${overallFav}%`} sub="Across all modules" accent="#10B981" />
                <StatCard icon={<AlertTriangle />} label="Needs Attention" value={atRiskCount} sub="Dimensions below 50%" accent="#EF4444" />
                <StatCard icon={<Activity />} label="Open Cases" value={d.openCases} sub="Not yet resolved" accent="#F59E0B" />
              </div>

              {/* AI Briefing */}
              <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", border: "1px solid #C7D2FE" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">AI Briefing</p>
                    <h2 className="text-sm font-black text-indigo-900 mt-0.5">What does the data say?</h2>
                  </div>
                  {!briefing && (
                    <button
                      onClick={loadBriefing}
                      disabled={briefingLoading}
                      className="text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff" }}
                    >
                      {briefingLoading ? "Generating…" : "Generate briefing"}
                    </button>
                  )}
                  {briefing && (
                    <button onClick={() => setBriefing(null)} className="text-xs text-indigo-400 hover:text-indigo-700">Refresh</button>
                  )}
                </div>
                {briefingLoading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400">
                    <div className="h-4 w-4 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
                    Reading your team&apos;s data…
                  </div>
                )}
                {briefing && !briefingLoading && (
                  <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">{briefing}</p>
                )}
                {!briefing && !briefingLoading && (
                  <p className="text-xs text-indigo-400">Click &quot;Generate briefing&quot; to get a plain-English summary of your team&apos;s pulse.</p>
                )}
              </div>

              {/* Manager Actions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Commitments</p>
                    <h2 className="text-sm font-black text-gray-800 mt-0.5">What you&apos;ve committed to</h2>
                  </div>
                  <button
                    onClick={() => setActionPanel((p) => !p)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                    style={{ background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}
                  >
                    + Add commitment
                  </button>
                </div>

                {actionPanel && (
                  <div className="mb-3 p-4 rounded-2xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                    <div className="space-y-3">
                      <select
                        value={newAction.sectionId}
                        onChange={(e) => setNewAction((p) => ({ ...p, sectionId: e.target.value }))}
                        className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        <option value="">Select area…</option>
                        {ENGAGEMENT_SECTIONS.map((s) => (
                          <option key={s.id} value={s.id}>{s.icon} {s.title}</option>
                        ))}
                      </select>
                      <textarea
                        value={newAction.commitment}
                        onChange={(e) => setNewAction((p) => ({ ...p, commitment: e.target.value }))}
                        placeholder="What will you do? e.g. Share career ladder doc by end of month"
                        rows={2}
                        className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={newAction.targetDate}
                          onChange={(e) => setNewAction((p) => ({ ...p, targetDate: e.target.value }))}
                          className="text-sm px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <button
                          onClick={submitAction}
                          disabled={!newAction.sectionId || !newAction.commitment.trim()}
                          className="flex-1 text-sm font-bold py-2 rounded-xl disabled:opacity-40 transition-all"
                          style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff" }}
                        >
                          Save commitment
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {actions.length === 0 && !actionPanel && (
                  <p className="text-xs text-gray-400">No commitments yet. Add one after reviewing your team&apos;s scores.</p>
                )}

                <div className="space-y-2">
                  {actions.map((a) => {
                    const section = ENGAGEMENT_SECTIONS.find((s) => s.id === a.sectionId);
                    return (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 p-3 rounded-xl transition-all"
                        style={{
                          background: a.resolved ? "#F0FDF4" : "#FAFAFA",
                          border: `1px solid ${a.resolved ? "#BBF7D0" : "#E5E7EB"}`,
                          opacity: a.resolved ? 0.7 : 1,
                        }}
                      >
                        <button
                          onClick={() => !a.resolved && markActionDone(a.id)}
                          className="mt-0.5 h-4 w-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            border: `2px solid ${a.resolved ? "#10B981" : "#D1D5DB"}`,
                            background: a.resolved ? "#10B981" : "transparent",
                          }}
                        >
                          {a.resolved && <span className="text-white text-[9px]">✓</span>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-gray-400 mb-0.5">
                            {section ? `${section.icon} ${section.title}` : a.sectionId}
                            {a.targetDate && ` · due ${new Date(a.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                          </p>
                          <p className={`text-sm text-gray-700 ${a.resolved ? "line-through" : ""}`}>{a.commitment}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Module donuts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-800">Module Favorability</h2>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-500">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full inline-block" style={{ background: "#10B981" }} />Favorable</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full inline-block" style={{ background: "#F59E0B" }} />Neutral</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full inline-block" style={{ background: "#EF4444" }} />Unfavorable</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {d.moduleInsights.map((mod) => {
                    const unf = Math.max(0, 100 - mod.overallFavorablePercent - mod.overallNeutralPercent);
                    const gradient = MODULE_GRADIENT[mod.moduleId] ?? "linear-gradient(135deg,#6366F1,#818CF8)";
                    return (
                      <div
                        key={mod.moduleId}
                        className="bg-white rounded-2xl p-4 flex items-center gap-4"
                        style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                      >
                        <DonutRing
                          favorable={mod.overallFavorablePercent}
                          neutral={mod.overallNeutralPercent}
                          unfavorable={unf}
                          size={72}
                          stroke={9}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: gradient }} />
                            <p className="text-xs font-bold text-gray-800 truncate">{mod.moduleTitle}</p>
                          </div>
                          <StackedBar
                            favorable={mod.overallFavorablePercent}
                            neutral={mod.overallNeutralPercent}
                            unfavorable={unf}
                            height={6}
                          />
                          <p className="text-[10px] text-gray-400 mt-1.5">{mod.responseCount} responses</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top 3 / Bottom 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <Award size={16} className="text-emerald-500" />
                    <h3 className="text-sm font-bold text-gray-800">Top 3 Signals</h3>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#DCFCE7", color: "#15803D" }}>Strengths</span>
                  </div>
                  <div className="px-5 py-1">
                    {d.topQuestions.map((q, i) => <QuestionRow key={q.questionId} q={q} rank={i + 1} />)}
                  </div>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <TrendingDown size={16} className="text-red-500" />
                    <h3 className="text-sm font-bold text-gray-800">Bottom 3 Signals</h3>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FEE2E2", color: "#991B1B" }}>Needs focus</span>
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
                  <h2 className="text-sm font-bold text-gray-800">Dimension Heat Map</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Cell color = favorability score. Red = needs attention, Green = strong.</p>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  {[
                    { label: "80%+", bg: "#D1FAE5", text: "#065F46" },
                    { label: "65–79%", bg: "#ECFDF5", text: "#047857" },
                    { label: "50–64%", bg: "#FEF9C3", text: "#854D0E" },
                    { label: "35–49%", bg: "#FEF3C7", text: "#92400E" },
                    { label: "<35%", bg: "#FEE2E2", text: "#991B1B" },
                  ].map((s) => (
                    <span key={s.label} className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.text }}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {/* Column headers */}
                <div
                  className="grid px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide"
                  style={{ gridTemplateColumns: "1fr 88px 72px 72px", borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}
                >
                  <span>Dimension</span>
                  <span className="text-center" style={{ color: "#10B981" }}>Favorable</span>
                  <span className="text-center" style={{ color: "#F59E0B" }}>Neutral</span>
                  <span className="text-center" style={{ color: "#EF4444" }}>Unf.</span>
                </div>

                {Object.entries(
                  d.dimensionSummaries.reduce<Record<string, DimensionSummary[]>>((acc, ds) => {
                    if (!acc[ds.moduleTitle]) acc[ds.moduleTitle] = [];
                    acc[ds.moduleTitle].push(ds);
                    return acc;
                  }, {})
                ).map(([modTitle, dims]) => (
                  <div key={modTitle}>
                    <div
                      className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400"
                      style={{ background: "#F9FAFB", borderBottom: "1px solid #F3F4F6", borderTop: "1px solid #F3F4F6" }}
                    >
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
                            borderBottom: i < dims.length - 1 ? "1px solid #F9FAFB" : undefined,
                          }}
                        >
                          <div className="pr-4">
                            <p className="text-xs font-semibold text-gray-800 mb-1.5">{ds.label}</p>
                            <div className="w-full max-w-[220px]">
                              <StackedBar
                                favorable={ds.favorablePercent}
                                neutral={ds.neutralPercent}
                                unfavorable={unf}
                                height={5}
                              />
                            </div>
                          </div>
                          {/* Favorable */}
                          <div className="flex justify-center">
                            <span
                              className="text-xs font-black px-2.5 py-1 rounded-lg"
                              style={{ background: fCell.bg, color: fCell.text, border: `1px solid ${fCell.border}`, minWidth: 48, textAlign: "center", display: "block" }}
                            >
                              {ds.favorablePercent}%
                            </span>
                          </div>
                          {/* Neutral */}
                          <div className="flex justify-center">
                            <span
                              className="text-xs font-bold px-2.5 py-1 rounded-lg"
                              style={{ background: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB", minWidth: 40, textAlign: "center", display: "block" }}
                            >
                              {ds.neutralPercent}%
                            </span>
                          </div>
                          {/* Unfavorable */}
                          <div className="flex justify-center">
                            {unf > 0 ? (
                              <span
                                className="text-xs font-bold px-2.5 py-1 rounded-lg"
                                style={{
                                  background: unf >= 30 ? "#FEE2E2" : unf >= 15 ? "#FEF3C7" : "#F9FAFB",
                                  color: unf >= 30 ? "#991B1B" : unf >= 15 ? "#92400E" : "#9CA3AF",
                                  border: `1px solid ${unf >= 30 ? "#FCA5A5" : unf >= 15 ? "#FCD34D" : "#E5E7EB"}`,
                                  minWidth: 40,
                                  textAlign: "center",
                                  display: "block",
                                }}
                              >
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
                ))}
              </div>
            </div>
          )}

          {/* ══ MODULES ══ */}
          {activeTab === "modules" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Question Breakdown</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Expand each module to see individual question distributions</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#10B981" }} />Favorable</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#F59E0B" }} />Neutral</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "#EF4444" }} />Unfavorable</span>
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
                <h2 className="text-sm font-bold text-gray-800">Team Voice</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Open-text comments submitted with the ECHO survey. Shown as-is — anonymised by design.
                </p>
              </div>

              {d.teamVoiceComments && d.teamVoiceComments.length > 0 ? (
                <div className="space-y-3">
                  {d.teamVoiceComments.map((c, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-5"
                      style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
                        {c.sectionId.replace(/_/g, " ")}
                      </p>
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl leading-none flex-shrink-0 text-indigo-200">&ldquo;</span>
                        <p className="text-sm text-gray-700 leading-relaxed italic">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl p-12 flex flex-col items-center text-center bg-white"
                  style={{ border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                >
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl mb-4">💬</div>
                  <p className="text-sm font-bold text-gray-700 mb-1">No comments yet</p>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    Comments appear here once team members submit open-text responses in the ECHO survey. The comment box is optional, so not everyone fills it in.
                  </p>
                </div>
              )}

              {/* Privacy note */}
              <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  <strong>Anonymity protected.</strong> Comments are shown verbatim but no name, timestamp, or identity is ever attached or displayed.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
      <ToolFeedbackWidget />
    </div>
  );
}
