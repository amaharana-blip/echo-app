"use client";

import Link from "next/link";
import { Check, Lock, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */
export type ModuleColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "purple"
  | "rose"
  | "blue";
export type ModuleStatus = "pending" | "completed" | "locked";

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: ModuleColor;
  status: ModuleStatus;
  timeEstimate: string;
  href: string;
  completedAt?: Date;
}

/* ── Color maps ── */
const solidGradient: Record<ModuleColor, string> = {
  indigo:  "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
  emerald: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
  amber:   "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
  purple:  "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
  rose:    "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
  blue:    "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
};

const softBg: Record<ModuleColor, string> = {
  indigo:  "#EEF2FF",
  emerald: "#ECFDF5",
  amber:   "#FFFBEB",
  purple:  "#F5F3FF",
  rose:    "#FFF1F2",
  blue:    "#EFF6FF",
};

const softBorder: Record<ModuleColor, string> = {
  indigo:  "#C7D2FE",
  emerald: "#A7F3D0",
  amber:   "#FDE68A",
  purple:  "#DDD6FE",
  rose:    "#FECDD3",
  blue:    "#BFDBFE",
};

const softIcon: Record<ModuleColor, string> = {
  indigo:  "#6366F1",
  emerald: "#059669",
  amber:   "#D97706",
  purple:  "#7C3AED",
  rose:    "#E11D48",
  blue:    "#2563EB",
};

const glowColor: Record<ModuleColor, string> = {
  indigo:  "rgba(99,102,241,0.25)",
  emerald: "rgba(16,185,129,0.2)",
  amber:   "rgba(245,158,11,0.2)",
  purple:  "rgba(168,85,247,0.2)",
  rose:    "rgba(244,63,94,0.2)",
  blue:    "rgba(59,130,246,0.2)",
};

/* ── Helpers ── */
function formatCompletedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/* ── Main component ── */
export default function ModuleCard({
  title,
  description,
  icon,
  color,
  status,
  timeEstimate,
  href,
  completedAt,
}: ModuleCardProps) {
  const isLocked = status === "locked";
  const isPending = status === "pending";
  const isDone = status === "completed";

  const boxShadow = isPending
    ? "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)"
    : "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)";

  const wrapperClass = cn(
    "group block rounded-2xl overflow-hidden transition-all duration-200 bg-white",
    !isLocked && "hover:-translate-y-0.5",
    isLocked && "cursor-not-allowed opacity-60",
  );

  const cardInner = (
    <>
      {/* ── Gradient header ── */}
      <div
        className="relative h-24 flex items-center justify-between px-5"
        style={{
          background: isLocked
            ? "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)"
            : isDone
            ? softBg[color]
            : solidGradient[color],
        }}
      >
        {/* Icon */}
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5 flex-shrink-0",
            isPending && "text-white",
          )}
          style={
            isDone
              ? { background: `${softBorder[color]}60`, color: softIcon[color] }
              : isLocked
              ? { background: "rgba(0,0,0,0.06)", color: "#9CA3AF" }
              : {
                  background: "rgba(255,255,255,0.2)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                }
          }
        >
          {icon}
        </div>

        {/* Right: status badge + time */}
        <div className="flex flex-col items-end gap-1.5">
          {isDone && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "#DCFCE7", color: "#15803D" }}
            >
              <Check size={9} strokeWidth={3} />
              Done
            </span>
          )}
          {isPending && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              Pending
            </span>
          )}
          {isLocked && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(0,0,0,0.06)", color: "#9CA3AF" }}
            >
              <Lock size={8} />
              Locked
            </span>
          )}

          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-medium",
              isPending ? "text-white/70" : isLocked ? "text-gray-400" : ""
            )}
            style={{ color: isDone ? softIcon[color] + "99" : undefined }}
          >
            <Clock size={9} />
            {timeEstimate}
          </span>
        </div>

        {/* Hover glow overlay for pending */}
        {isPending && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-t-2xl"
            style={{ background: `linear-gradient(135deg, transparent 50%, ${glowColor[color]})` }}
          />
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 flex flex-col gap-2">
        <h3
          className={cn(
            "text-sm font-bold leading-snug",
            isLocked ? "text-gray-400" : "text-gray-900"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-xs leading-relaxed",
            isLocked ? "text-gray-300" : "text-gray-500"
          )}
        >
          {description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          {isPending && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all group-hover:gap-2.5 duration-200"
              style={{ background: solidGradient[color] }}
            >
              Start check-in
              <ArrowRight size={11} />
            </span>
          )}
          {isDone && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <Check size={12} strokeWidth={2.5} />
              {completedAt ? formatCompletedAt(completedAt) : "Completed"}
            </span>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
              <Lock size={11} />
              Coming soon
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (isLocked) {
    return (
      <div className={wrapperClass} style={{ boxShadow }} aria-disabled="true">
        {cardInner}
      </div>
    );
  }

  return (
    <Link href={href} className={wrapperClass} style={{ boxShadow }}>
      {cardInner}
    </Link>
  );
}
