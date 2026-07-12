import type { Metadata } from "next";
import { Fraunces, Karla, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bloom & Bow — Flowers, wrapped like a small good thing",
  description:
    "Hand-tied bouquets and pocket-sized gifts, delivered the same day across the Kathmandu valley. Small bouquets and smaller gifts, wrapped like they matter.",
  keywords: [
    "flower delivery Kathmandu",
    "Nepal flowers",
    "same day delivery",
    "bouquets",
    "gifts Nepal",
  ],
  authors: [{ name: "Bloom & Bow" }],
  openGraph: {
    title: "Bloom & Bow — Flowers, wrapped like a small good thing",
    description:
      "Hand-tied bouquets and pocket-sized gifts, delivered the same day across the valley.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${karla.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}