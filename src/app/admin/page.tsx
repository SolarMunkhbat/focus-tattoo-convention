"use client";

import Link from "next/link";
import { Users, CalendarClock, Trophy, Handshake, Images } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import type { Artist, ScheduleItem, BattleCategory, Sponsor, GalleryImage } from "@/lib/types";

const CARDS = [
  { key: "artists", label: "Артист", href: "/admin/artists", icon: Users },
  { key: "schedule", label: "Хөтөлбөрийн мөр", href: "/admin/schedule", icon: CalendarClock },
  { key: "battles", label: "Тэмцээний ангилал", href: "/admin/battles", icon: Trophy },
  { key: "sponsors", label: "Sponsor", href: "/admin/sponsors", icon: Handshake },
  { key: "gallery", label: "Gallery зураг", href: "/admin/gallery", icon: Images },
] as const;

export default function AdminDashboard() {
  const artists = useCollection<Artist>("artists");
  const schedule = useCollection<ScheduleItem>("schedule");
  const battles = useCollection<BattleCategory>("battles");
  const sponsors = useCollection<Sponsor>("sponsors");
  const gallery = useCollection<GalleryImage>("gallery");

  const counts: Record<string, number> = {
    artists: artists.data.length,
    schedule: schedule.data.length,
    battles: battles.data.length,
    sponsors: sponsors.data.length,
    gallery: gallery.data.length,
  };

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">DASHBOARD</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {CARDS.map(({ key, label, href, icon: Icon }) => (
          <Link key={key} href={href} className="glass p-6 hover:border-gold/40 transition-colors">
            <Icon size={20} className="text-gold-soft mb-4" />
            <div className="font-display text-3xl">{counts[key]}</div>
            <div className="text-xs text-ivory/50 mt-1 uppercase tracking-wide">{label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
