"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import LoginForm from "@/components/admin/LoginForm";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-ivory/40 text-sm">
        Ачааллаж байна…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <LoginForm />;
  }

  return <AdminShell>{children}</AdminShell>;
}
