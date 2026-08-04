import Image from "next/image";
import { Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons";

const ORGANIZER = {
  name: "BPro Tattoo Studio",
  phone: "+976 94201086",
  phoneHref: "tel:+97694201086",
  instagram: "https://www.instagram.com/bprotattoo/",
  facebook: "https://www.facebook.com/profile.php?id=61551045509783",
};

export default function Footer() {
  return (
    <footer className="border-t border-gold/25 py-10 mt-auto">
      <div className="container-page flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[0.65rem] uppercase tracking-[0.12em] text-ivory/40">
              Зохион байгуулагч
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-semibold">{ORGANIZER.name}</span>
              <a
                href={ORGANIZER.phoneHref}
                aria-label={`Утас: ${ORGANIZER.phone}`}
                title={ORGANIZER.phone}
                className="w-8 h-8 border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold-soft transition-colors"
              >
                <Phone size={14} />
              </a>
              <a
                href={ORGANIZER.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BPro Tattoo Studio Instagram"
                title="Instagram"
                className="w-8 h-8 border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold-soft transition-colors"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href={ORGANIZER.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BPro Tattoo Studio Facebook"
                title="Facebook"
                className="w-8 h-8 border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold-soft transition-colors"
              >
                <FacebookIcon size={14} />
              </a>
            </div>
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
