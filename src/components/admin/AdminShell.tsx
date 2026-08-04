"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarClock, Trophy, Handshake, Images, HelpCircle, LogOut, ExternalLink } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/artists", label: "Артистууд", icon: Users },
  { href: "/admin/schedule", label: "Хөтөлбөр", icon: CalendarClock },
  { href: "/admin/battles", label: "Тэмцээн", icon: Trophy },
  { href: "/admin/sponsors", label: "Sponsor", icon: Handshake },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
];

export default function AdminShell({
  children,
  username,
  onLoggedOut,
}: {
  children: ReactNode;
  username: string;
  onLoggedOut: () => void;
}) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    onLoggedOut();
  }

  return (
    <div className="min-h-screen flex bg-ink">
      <aside className="w-60 shrink-0 border-r border-white/10 hidden sm:flex flex-col">
        <div className="p-5 border-b border-white/10">
          <span className="font-display text-lg">FOCUS ADMIN</span>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-gold/15 text-gold-soft" : "text-ivory/65 hover:bg-white/5"
                }`}
              >
                <Icon size={17} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/50 hover:bg-white/5"
          >
            <ExternalLink size={16} /> Сайт үзэх
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/50 hover:bg-white/5 text-left"
          >
            <LogOut size={16} /> Гарах
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-5 sm:px-8">
          <span className="text-sm text-ivory/50 truncate">{username}</span>
        </header>
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
