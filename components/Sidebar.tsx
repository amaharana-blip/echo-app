"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Heart,
  Activity,
  MessageSquare,
  Star,
  AlertTriangle,
  User,
  LogOut,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

/* ── Types ── */
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  managerOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

/* ── Nav structure ── */
const NAV_SECTIONS: NavSection[] = [
  {
    title: "MY EXPERIENCE",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/pulse", label: "Daily Check-in", icon: Heart },
      { href: "/burnout", label: "Burnout Check", icon: Activity },
      { href: "/feedback/new", label: "Give Feedback", icon: MessageSquare },
    ],
  },
  {
    title: "GIVE FEEDBACK",
    items: [
      { href: "/manager-review", label: "Manager Review", icon: Star },
      { href: "/cases/new", label: "Report Issue", icon: AlertTriangle },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { href: "/profile", label: "Profile", icon: User },
    ],
  },
];

const MANAGER_NAV_ITEMS: NavItem[] = [
  { href: "/manager/insights", label: "Team Insights", icon: Brain, managerOnly: true },
];

/* ── Mobile bottom nav (5 fixed icons) ── */
const MOBILE_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/pulse", label: "Check-in", icon: Heart },
  { href: "/burnout", label: "Burnout", icon: Activity },
  { href: "/feedback/new", label: "Feedback", icon: MessageSquare },
  { href: "/manager/insights", label: "Insights", icon: Brain },
];

/* ── Helpers ── */
function useIsManager(): boolean {
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    try {
      const role = localStorage.getItem("role");
      setIsManager(role === "MANAGER");
    } catch {
      setIsManager(false);
    }
  }, []);

  return isManager;
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname.startsWith(href);
}

/* ── Logo ── */
function PulseLogo() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white text-base font-bold shadow-sm"
        style={{ background: "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)" }}
        aria-hidden="true"
      >
        E
      </div>
      <span className="text-lg font-bold tracking-tight text-gray-900">
        ECHO 1.0
      </span>
    </div>
  );
}

/* ── Desktop nav item ── */
function DesktopNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        size={17}
        className={cn(
          "flex-shrink-0 transition-colors",
          active ? "text-white" : "text-gray-400"
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

/* ── User footer ── */
function UserFooter({
  user,
}: {
  user:
    | { name?: string | null; email?: string | null; picture?: string | null }
    | undefined;
}) {
  if (!user) return null;

  const displayName = user.name ?? user.email ?? "User";
  const initials = getInitials(displayName);

  return (
    <div className="border-t border-gray-100 pt-3">
      {/* User row */}
      <div className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2">
        {user.picture ? (
          <img
            src={user.picture}
            alt={displayName}
            className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-indigo-100"
          />
        ) : (
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)" }}
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {displayName}
          </p>
          {user.email && (
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          )}
        </div>
      </div>

      {/* Logout */}
      <Link
        href="/api/auth/logout"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-150 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={16} className="flex-shrink-0" />
        <span>Sign out</span>
      </Link>
    </div>
  );
}

/* ── Mobile bottom nav item ── */
function MobileNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors duration-150",
        active ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
      )}
      aria-current={active ? "page" : undefined}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150",
          active ? "bg-indigo-50" : "bg-transparent"
        )}
      >
        <Icon
          size={18}
          className={cn(active ? "text-indigo-600" : "text-gray-500")}
        />
      </div>
      <span>{item.label}</span>
    </Link>
  );
}

/* ── Main component ── */
interface SidebarProps {
  activeModule?: string;
}

export default function Sidebar({ activeModule: _activeModule }: SidebarProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const isManager = useIsManager();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-gray-100 bg-white md:flex"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-100 px-5">
          <PulseLogo />
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-5">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <DesktopNavItem
                      key={item.href}
                      item={item}
                      pathname={pathname}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Manager section — conditional */}
            {isManager && (
              <div>
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  MANAGER
                </p>
                <div className="space-y-0.5">
                  {MANAGER_NAV_ITEMS.map((item) => (
                    <DesktopNavItem key={item.href} item={item} pathname={pathname} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User footer */}
        <div className="flex-shrink-0 px-3 pb-4">
          <UserFooter user={user} />
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-stretch border-t border-gray-200 bg-white shadow-lg md:hidden"
        aria-label="Mobile navigation"
      >
        {MOBILE_NAV_ITEMS.filter(
          (item) => item.href !== "/manager" || isManager
        ).map((item) => (
          <MobileNavItem key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
    </>
  );
}
