import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons";

const MAP_QUERY = encodeURIComponent("Буянт-Ухаа спорт цогцолбор, Улаанбаатар, Монгол улс");

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-ink-raised/40">
      <div className="container-page">
        <div className="max-w-2xl mb-10">
          <span className="eyebrow">Get in touch</span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] mt-3">ХОЛБОО БАРИХ</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass overflow-hidden aspect-[4/3] lg:aspect-auto">
            <iframe
              title="Venue location"
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              className="w-full h-full min-h-[280px] grayscale contrast-125 invert-[0.92]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="glass p-8 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gold-soft mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Байршил</p>
                <p className="text-sm text-ivory/60">Буянт-Ухаа спорт цогцолбор · Улаанбаатар, Монгол</p>
              </div>
            </div>
            <a href="mailto:info@focustattoo.mn" className="flex items-center gap-3 group">
              <Mail size={18} className="text-gold-soft shrink-0" />
              <span className="text-sm text-ivory/75 group-hover:text-gold-soft transition-colors">
                info@focustattoo.mn
              </span>
            </a>
            <a href="tel:+97694201086" className="flex items-center gap-3 group">
              <Phone size={18} className="text-gold-soft shrink-0" />
              <span className="text-sm text-ivory/75 group-hover:text-gold-soft transition-colors">
                +976 94201086
              </span>
            </a>
            <div className="flex gap-3 mt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold-soft hover:scale-105 transition-all"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold-soft hover:scale-105 transition-all"
              >
                <FacebookIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
