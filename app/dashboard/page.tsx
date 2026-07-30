"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import ModuleCard from "@/components/ModuleCard";
import {
  Heart,
  Activity,
  Star,
  Smile,
  Zap,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */
interface Survey {
  id: string;
  title: string;
  module: string;
  description?: string;
  closesAt: string | null;
  _count: { responses: number };
}

interface Case {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface RecentActivity {
  id: string;
  label: string;
  subLabel: string;
  submittedAt: string;
  dotColor: string;
}

/* ── Helpers ── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const MODULE_LABEL: Record<string, string> = {
  PULSE: "Daily Pulse",
  BURNOUT: "Burnout Check",
  MANAGER: "Manager Review",
  SATISFACTION: "Work Satisfaction",
  AI_TOOLS: "AI & Tools",
  ENPS: "eNPS",
};

/* ── Module grid config ── */
const MODULES = [
  {
    title: "Daily Pulse",
    description: "Quick daily check-in on mood, energy, and case load.",
    icon: <Heart />,
    color: "rose" as const,
    href: "/pulse",
    timeEstimate: "2 min",
    module: "PULSE",
  },
  {
    title: "Burnout Check",
    description: "Monthly: workload, exhaustion, and retention risk.",
    icon: <Activity />,
    color: "amber" as const,
    href: "/burnout",
    timeEstimate: "4 min",
    module: "BURNOUT",
  },
  {
    title: "Manager Review",
    description: "Anonymous monthly upward feedback for your manager.",
    icon: <Star />,
    color: "purple" as const,
    href: "/manager-review",
    timeEstimate: "3 min",
    module: "MANAGER",
  },
  {
    title: "Work Satisfaction",
    description: "Monthly: growth, autonomy, purpose, and team dynamics.",
    icon: <Smile />,
    color: "emerald" as const,
    href: "/satisfaction",
    timeEstimate: "3 min",
    module: "SATISFACTION",
  },
  {
    title: "AI & Tools",
    description: "AI adoption and tool friction in your case work.",
    icon: <Zap />,
    color: "blue" as const,
    href: "/ai-tools",
    timeEstimate: "3 min",
    module: "AI_TOOLS",
  },
  {
    title: "eNPS",
    description: "Would you recommend this team to a colleague?",
    icon: <TrendingUp />,
    color: "indigo" as const,
    href: "/enps",
    timeEstimate: "1 min",
    module: "ENPS",
  },
];

/* ── Stat chip ── */
function StatChip({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3.5 flex-1"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0"
        style={{ background: `${color}22`, color }}
      >
        {value}
      </div>
      <p className="text-xs font-medium text-white/60 leading-tight">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [surveysLoading, setSurveysLoading] = useState(true);

  const firstName =
    user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  useEffect(() => {
    fetch("/api/surveys")
      .then((r) => r.json())
      .then((data) => {
        setSurveys(Array.isArray(data) ? data : []);
        setSurveysLoading(false);
      })
      .catch(() => setSurveysLoading(false));

    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => {
        const cases: Case[] = Array.isArray(data) ? data : [];
        const caseItems: RecentActivity[] = cases.slice(0, 5).map((c) => ({
          id: c.id,
          label: c.title,
          subLabel: `${MODULE_LABEL[c.category] ?? c.category} · Case reported`,
          submittedAt: c.createdAt,
          dotColor: "#F87171",
        }));
        setRecentActivity((prev) => [...prev, ...caseItems]);
      })
      .catch(() => {});
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F0F2F8]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-xs text-gray-400 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  const activeModules = new Set(surveys.map((s) => s.module));
  const completedCount = MODULES.filter((m) => !activeModules.has(m.module)).length;
  const pendingCount = MODULES.filter((m) => activeModules.has(m.module)).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ background: "#F0F2F8", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main className="ml-0 md:ml-[240px] pb-24 md:pb-8">

        {/* ── Hero banner ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4C1D95 100%)",
          }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Right glow */}
          <div
            className="absolute right-0 top-0 h-full w-1/2 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.2) 0%, transparent 70%)" }}
          />

          <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(165,180,252,0.6)" }}>
                  {today}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
                  {getGreeting()}, {firstName}.
                </h1>
                <p className="text-sm mt-1.5" style={{ color: "rgba(199,210,254,0.6)" }}>
                  Your responses are anonymous. Take 2 minutes to check in.
                </p>
              </div>

              {/* Stat chips row */}
              <div className="flex gap-2 sm:gap-3">
                <StatChip value={completedCount} label="Completed" color="#34D399" />
                <StatChip value={pendingCount} label="Pending" color="#818CF8" />
              </div>
            </div>

            {/* Progress bar */}
            {MODULES.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-white/40">Weekly progress</span>
                  <span className="text-[11px] font-bold text-white/60">
                    {completedCount} / {MODULES.length} modules
                  </span>
                </div>
                <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(completedCount / MODULES.length) * 100}%`,
                      background: "linear-gradient(90deg, #818CF8, #C084FC)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">

          {/* ── Monthly Engagement Survey banner ── */}
          <Link
            href="/survey"
            className="block rounded-2xl overflow-hidden group transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "0 2px 12px rgba(79,70,229,0.15)" }}
          >
            <div
              className="relative flex items-center justify-between px-6 py-5"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #6D28D9 100%)" }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  💬
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                    >
                      ECHO 1.0 · July 2026
                    </span>
                  </div>
                  <p className="text-base font-black text-white leading-tight">ECHO 1.0 — Engage · Connect · Hear · Own</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(199,210,254,0.8)" }}>
                    9 topics · ~8 minutes · fully anonymous · your voice shapes the team
                  </p>
                </div>
              </div>
              <div
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-700 flex-shrink-0 group-hover:shadow-md transition-all"
                style={{ background: "#fff" }}
              >
                Start survey
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          {/* ── Module grid ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-gray-900">Your Check-ins</h2>
                <p className="text-xs text-gray-400 mt-0.5">All responses are anonymous</p>
              </div>
              {completedCount === MODULES.length && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={14} />
                  All done this week
                </span>
              )}
            </div>

            {surveysLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-[220px] bg-white rounded-2xl shadow-sm animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MODULES.map((mod) => (
                  <ModuleCard
                    key={mod.module}
                    title={mod.title}
                    description={mod.description}
                    icon={mod.icon}
                    color={mod.color}
                    status={activeModules.has(mod.module) ? "pending" : "completed"}
                    timeEstimate={mod.timeEstimate}
                    href={mod.href}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Bottom row: activity + report issue ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Recent Activity */}
            <section className="lg:col-span-3">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <div
                  className="rounded-2xl border border-gray-100 bg-white py-12 flex flex-col items-center text-center px-6 shadow-sm"
                >
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                    <Clock size={20} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No activity yet</p>
                  <p className="text-xs text-gray-400 mt-1">Complete a check-in to get started.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  {recentActivity.slice(0, 5).map((item, i) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4",
                        i > 0 && "border-t border-gray-50"
                      )}
                    >
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ background: item.dotColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.subLabel}</p>
                      </div>
                      <span className="text-[11px] text-gray-400 flex-shrink-0">
                        {timeAgo(item.submittedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Report issue card */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Report Issue */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-4"
                style={{
                  background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    <AlertTriangle size={18} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Report an Issue</h3>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(199,210,254,0.55)" }}>
                      Anonymous · HR visible only
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(199,210,254,0.5)" }}>
                  Something not right? Raise it anonymously — your identity is protected. Cases go to HR, not your direct manager.
                </p>
                <Link
                  href="/cases/new"
                  className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl transition-all hover:opacity-90"
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}
                >
                  Raise a case
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* Privacy note */}
              <div
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{
                  background: "rgba(79,70,229,0.05)",
                  border: "1px solid rgba(79,70,229,0.12)",
                }}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="flex-shrink-0 mt-0.5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <div>
                  <p className="text-[11px] font-bold text-indigo-700 mb-1">Your anonymity</p>
                  <p className="text-[11px] text-indigo-500 leading-relaxed">
                    Managers see only aggregated patterns — no individual responses, names, or timestamps are ever shown.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
