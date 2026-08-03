"use client";

import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      window.location.href = "/api/auth/login?returnTo=/dashboard";
      return;
    }
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.role === "ADMIN" || data?.role === "MANAGER") {
          window.location.replace("/manager/insights");
        } else {
          window.location.replace("/survey");
        }
      })
      .catch(() => window.location.replace("/survey"));
  }, [user, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#F4F5F9" }}>
      <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );
}
