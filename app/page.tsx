import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getSession();
  if (session?.user) {
    const user = await getCurrentUser();
    if (user?.role === "ADMIN" || user?.role === "MANAGER") {
      redirect("/manager/insights");
    } else {
      redirect("/survey");
    }
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#0B0F1A",
      }}
    >
      {/* ── Grid overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Radial glow ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(79,70,229,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* ── Nav ── */}
        <nav
          className="flex items-center justify-between px-6 sm:px-16 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            >
              P
            </div>
            <span className="text-base font-bold tracking-tight">Pulse</span>
            <span
              className="hidden sm:inline-flex items-center ml-2 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded"
              style={{ background: "rgba(79,70,229,0.15)", color: "#818CF8", border: "1px solid rgba(79,70,229,0.3)" }}
            >
              Enterprise
            </span>
          </div>
          <Link
            href="/api/auth/login"
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-150 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Sign in
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </nav>

        {/* ── Hero ── */}
        <section className="max-w-5xl mx-auto px-6 sm:px-16 pt-24 pb-20 text-center">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-10 tracking-wide"
            style={{
              background: "rgba(79,70,229,0.1)",
              border: "1px solid rgba(79,70,229,0.3)",
              color: "#A5B4FC",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Employee Experience Intelligence Platform
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            Surface what your{" "}
            <br className="hidden sm:block" />
            <span
              style={{
                background: "linear-gradient(90deg, #818CF8 0%, #C084FC 50%, #F472B6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              team won&apos;t say out loud.
            </span>
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Pulse captures anonymous employee sentiment — burnout, engagement, manager trust, tool friction — through card-based check-ins. Managers see aggregated signals. HR sees trends. No one sees names.
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/api/auth/login"
              className="inline-flex items-center gap-2.5 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                boxShadow: "0 0 32px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign in with Salesforce SSO
            </Link>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              No setup · Works in 2 minutes
            </span>
          </div>

          {/* Trust row */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {["SOC 2 Compliant", "Anonymous by Default", "Salesforce Native", "GDPR Ready"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* ── Module Showcase ── */}
        <section
          className="py-20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="max-w-5xl mx-auto px-6 sm:px-16">
            <div className="text-center mb-12">
              <p
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                Pulse Modules
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ letterSpacing: "-0.02em" }}>
                Six lenses on employee experience
              </h2>
              <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                Each module takes under 4 minutes. Drill-downs capture the <em>why</em>, not just the signal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: "❤️", label: "Daily Pulse", sub: "Mood, energy, and team vibe — captured in 90 seconds.",
                  color: "#F43F5E", tag: "Daily",
                },
                {
                  icon: "🔋", label: "Burnout Check", sub: "Workload, exhaustion, and retention risk signals — before they escalate.",
                  color: "#F59E0B", tag: "Weekly",
                },
                {
                  icon: "⭐", label: "Manager Review", sub: "Anonymous upward feedback on communication, support, and safety.",
                  color: "#A855F7", tag: "Monthly",
                },
                {
                  icon: "😊", label: "Work Satisfaction", sub: "Growth, autonomy, purpose, and team dynamics.",
                  color: "#10B981", tag: "Monthly",
                },
                {
                  icon: "⚡", label: "AI & Tools", sub: "Tech sentiment, tool friction, and AI adoption readiness.",
                  color: "#3B82F6", tag: "Quarterly",
                },
                {
                  icon: "📊", label: "eNPS", sub: "Employee Net Promoter Score with drill-down reasons.",
                  color: "#6366F1", tag: "Quarterly",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="relative rounded-2xl p-5 transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Left accent */}
                  <div
                    className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                    style={{ background: m.color }}
                  />
                  <div className="flex items-start gap-4">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mt-0.5"
                      style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
                    >
                      {m.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white/90">{m.label}</p>
                        <span
                          className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
                          style={{ background: `${m.color}20`, color: m.color }}
                        >
                          {m.tag}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {m.sub}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature trio ── */}
        <section
          className="py-20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}
        >
          <div className="max-w-5xl mx-auto px-6 sm:px-16">
            <div className="text-center mb-14">
              <p
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                How it works
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ letterSpacing: "-0.02em" }}>
                Signal → Insight → Action
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  n: "01",
                  color: "#4F46E5",
                  title: "Employees tap cards",
                  desc: "Card-based check-ins with no text boxes. Tap the card that fits — done in under 3 minutes. No login friction.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  ),
                },
                {
                  n: "02",
                  color: "#7C3AED",
                  title: "Drill-downs capture why",
                  desc: "When a risk signal appears, intelligent follow-up cards ask the reason. No free-text required. 100% anonymous.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
                    </svg>
                  ),
                },
                {
                  n: "03",
                  color: "#C026D3",
                  title: "Managers see patterns",
                  desc: "Aggregated, dimension-level risk signals — no names, no individual data. Act before disengagement becomes attrition.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  ),
                },
              ].map((s) => (
                <div key={s.n} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${s.color}18`, border: `1px solid ${s.color}30`, color: s.color }}
                    >
                      {s.icon}
                    </div>
                    <span
                      className="text-xs font-black tracking-widest"
                      style={{ color: `${s.color}60` }}
                    >
                      {s.n}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white/90">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Manager Intelligence preview ── */}
        <section
          className="py-20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="max-w-5xl mx-auto px-6 sm:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p
                  className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  For Managers & HR
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-5 leading-snug"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Intelligence that protects your team — without compromising privacy.
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.38)" }}>
                  The manager intelligence dashboard surfaces dimension-level risk — workload pressure, exhaustion, retention risk — aggregated anonymously. Minimum 3 responses required before any signal is shown.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Risk signals by dimension, not individual", color: "#4F46E5" },
                    { label: "Positive driver insights — what's working and why", color: "#10B981" },
                    { label: "Anonymous case escalation with HR visibility", color: "#F59E0B" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <p className="text-sm font-medium text-white/70">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock dashboard preview */}
              <div
                className="rounded-2xl p-5 space-y-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
                }}
              >
                {/* Mock header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-bold text-white/90">Burnout Check</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>14 respondents · last 30 days</div>
                  </div>
                  <div
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    67% at risk
                  </div>
                </div>

                {/* Mock dimension bars */}
                {[
                  { label: "Workload Pressure", pct: 72, color: "#F87171" },
                  { label: "Emotional Exhaustion", pct: 58, color: "#FBBF24" },
                  { label: "Retention Risk", pct: 41, color: "#FBBF24" },
                  { label: "Team Connection", pct: 22, color: "#34D399" },
                  { label: "Clarity Deficit", pct: 18, color: "#34D399" },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{d.label}</span>
                      <span className="text-[11px] font-bold" style={{ color: d.color }}>{d.pct}%</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${d.pct}%`, background: d.color }}
                      />
                    </div>
                  </div>
                ))}

                {/* Mock alert */}
                <div
                  className="mt-4 rounded-xl px-3 py-2.5 flex items-center gap-2"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <p className="text-[11px] font-medium" style={{ color: "#FCD34D" }}>
                    Top signal: <strong>Unrealistic deadlines</strong> — 8 of 14
                  </p>
                </div>

                <p
                  className="text-[10px] text-center mt-3 pt-3"
                  style={{ color: "rgba(255,255,255,0.15)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  🔒 Individual identities never shown
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section
          className="py-20 text-center px-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}
        >
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl font-black mb-4"
              style={{ letterSpacing: "-0.03em" }}
            >
              Know before it&apos;s too late.
            </h2>
            <p className="text-sm mb-10" style={{ color: "rgba(255,255,255,0.35)" }}>
              The average manager finds out about burnout 6 weeks after the team already knew. Pulse closes that gap.
            </p>
            <Link
              href="/api/auth/login"
              className="inline-flex items-center gap-2 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                boxShadow: "0 0 40px rgba(79,70,229,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              Get started with Salesforce SSO →
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="py-6 px-6 sm:px-16 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded flex items-center justify-center text-white font-black text-[10px]"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            >
              P
            </div>
            <span className="text-xs font-semibold text-white/30">Pulse</span>
          </div>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            Built for Salesforce · All responses anonymous · Zero individual data to managers
          </p>
        </footer>
      </div>
    </div>
  );
}
