import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Teenee",
  description: "Turn today's class into tomorrow's fluency.",
  applicationName: "Teenee",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Teenee",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable} h-full`}>
      <body className="min-h-full bg-canvas-light text-foreground-light antialiased">
        <ServiceWorkerRegistration />
        <OfflineBanner />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
