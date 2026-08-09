import Image from "next/image";
import { Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons";

const ORGANIZERS = [
  {
    name: "BPro Tattoo Studio",
    logo: "/organizers/bpro-tattoo-studio.png",
    phone: "+976 94201086",
    phoneHref: "tel:+97694201086",
    instagram: "https://www.instagram.com/bprotattoo/",
    facebook: "https://www.facebook.com/profile.php?id=61551045509783",
  },
  {
    name: "Piercing Mongolia",
    logo: "/organizers/piercing-mongolia.png",
    phone: null,
    phoneHref: null,
    instagram: null,
    facebook: null,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold/25 py-10 mt-auto">
      <div className="container-page flex flex-col gap-6">
        <div>
          <span className="text-[0.65rem] uppercase tracking-[0.12em] text-ivory/40">
            Ерөнхий зохион байгуулагч
          </span>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mt-2">
            {ORGANIZERS.map((org) => (
              <div key={org.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden">
                  <Image src={org.logo} alt={org.name} width={28} height={28} className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-semibold">{org.name}</span>
                {org.phoneHref && (
                  <a
                    href={org.phoneHref}
                    aria-label={`Утас: ${org.phone}`}
                    title={org.phone ?? undefined}
                    className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold-soft transition-colors"
                  >
                    <Phone size={14} />
                  </a>
                )}
                {org.instagram && (
                  <a
                    href={org.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${org.name} Instagram`}
                    title="Instagram"
                    className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold-soft transition-colors"
                  >
                    <InstagramIcon size={14} />
                  </a>
                )}
                {org.facebook && (
                  <a
                    href={org.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${org.name} Facebook`}
                    title="Facebook"
                    className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold-soft transition-colors"
                  >
                    <FacebookIcon size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-white/10">
          <Image src="/logo.png" alt="FOCUS Tattoo Convention" width={32} height={32} className="h-8 w-auto opacity-90" />
          <span className="text-xs text-ivory/45">© 2026 FOCUS Tattoo Convention.</span>
        </div>
      </div>
    </footer>
  );
}
