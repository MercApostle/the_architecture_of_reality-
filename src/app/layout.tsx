import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader, Cinzel, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050608",
};

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "The Architecture of Reality — Human Energy, Universal Law, Sovereign Life",
    template: "%s · The Architecture of Reality",
  },
  description:
    "A systems-level philosophy platform bridging universal laws, human energy management, and high-trust enterprise design. Take the Energy & Time Audit.",
  openGraph: {
    title: "The Architecture of Reality",
    description: "Bridging Human Energy, Universal Law, and Sovereign Life.",
    type: "website",
  },
};

import { CartProvider } from "@/context/CartContext";
import { MemberProvider } from "@/context/MemberContext";
import CartDrawer from "@/components/checkout/CartDrawer";
import PointsNotificationToast from "@/components/gamification/PointsNotificationToast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${newsreader.variable} ${cinzel.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-obsidian text-ink">
        <MemberProvider>
          <CartProvider>
            <Suspense fallback={<div className="h-16 border-b border-line bg-charcoal/80" />}>
              <Navbar />
            </Suspense>
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <PointsNotificationToast />
            <Footer />
          </CartProvider>
        </MemberProvider>
      </body>
    </html>
  );
}
