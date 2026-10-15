import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050608",
};

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-obsidian text-ink">
        <MemberProvider>
          <CartProvider>
            <Navbar />
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
