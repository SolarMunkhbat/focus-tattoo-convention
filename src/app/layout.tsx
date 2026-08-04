import type { Metadata } from "next";
import { Anton, Archivo_Narrow, Permanent_Marker } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const archivo = Archivo_Narrow({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const marker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = "https://focustattooconvention.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FOCUS Tattoo Convention 2026 — Улаанбаатар",
    template: "%s · FOCUS Tattoo Convention",
  },
  description:
    "FOCUS Tattoo Convention 2026 — 2026.09.19–20, Улаанбаатар. Монголын tattoo болон street art урлагийн хамгийн том фестиваль. Уран бүтээлчид, тэмцээн, flash gallery.",
  keywords: [
    "tattoo convention",
    "focus tattoo",
    "Ulaanbaatar tattoo",
    "Mongolia tattoo",
    "tattoo festival 2026",
  ],
  openGraph: {
    title: "FOCUS Tattoo Convention 2026",
    description: "2026.09.19–20, Улаанбаатар. Tattoo болон street art урлагийн фестиваль.",
    url: siteUrl,
    siteName: "FOCUS Tattoo Convention",
    images: ["/logo.png"],
    locale: "mn_MN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOCUS Tattoo Convention 2026",
    description: "2026.09.19–20, Улаанбаатар.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mn"
      className={`${anton.variable} ${archivo.variable} ${marker.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-ivory">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
