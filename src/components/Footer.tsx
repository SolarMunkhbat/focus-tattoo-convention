import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gold/25 py-10 mt-auto">
      <div className="container-page flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="FOCUS Tattoo Convention" width={32} height={32} className="h-8 w-auto opacity-90" />
          <span className="text-xs text-ivory/45">
            © 2026 FOCUS Tattoo Convention. Бүх эрх хуулиар хамгаалагдсан.
          </span>
        </div>
        <a href="/admin" className="text-[0.7rem] text-ivory/25 hover:text-ivory/50 transition-colors">
          Admin
        </a>
      </div>
    </footer>
  );
}
