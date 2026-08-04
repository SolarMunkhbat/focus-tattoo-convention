"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

export default function LoginForm({ onSuccess }: { onSuccess: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Нэвтрэх нэр эсвэл нууц үг буруу байна.");
        return;
      }
      onSuccess(data.username);
    } catch {
      setError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <form onSubmit={onSubmit} className="glass glass-gold w-full max-w-sm p-8">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="FOCUS" width={56} height={56} className="h-12 w-auto" />
        </div>
        <h1 className="font-display text-center text-xl mb-6">ADMIN НЭВТРЭХ</h1>

        <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">
          Нэвтрэх нэр
        </label>
        <input
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm mb-4 outline-none focus:border-gold/60"
        />

        <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">
          Нууц үг
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm mb-5 outline-none focus:border-gold/60"
        />

        {error && <p className="text-blood-soft text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-ink font-semibold py-2.5 text-sm uppercase tracking-wide hover:bg-gold-soft transition-colors disabled:opacity-50"
        >
          {submitting ? "Нэвтэрч байна…" : "Нэвтрэх"}
        </button>
      </form>
    </div>
  );
}
