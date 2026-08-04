"use client";

import { useEffect, useState, type ReactNode } from "react";
import LoginForm from "@/components/admin/LoginForm";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUsername(data?.username ?? null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-ivory/40 text-sm">
        Ачааллаж байна…
      </div>
    );
  }

  if (!username) {
    return <LoginForm onSuccess={(u) => setUsername(u)} />;
  }

  return <AdminShell username={username} onLoggedOut={() => setUsername(null)}>{children}</AdminShell>;
}
