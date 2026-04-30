import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/shared/TopNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "TrendPulse — AI-Native Demand Forecasting",
  description:
    "Trend-to-Production intelligence for global fast fashion manufacturing. Powered by DevX Labs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <TopNav />
        <main className="flex-1 pb-12">{children}</main>
        <footer className="fixed bottom-3 right-4 text-[11px] uppercase tracking-[0.18em] text-navy-400 select-none pointer-events-none">
          powered by <span className="text-teal font-semibold">DevX Labs</span>
        </footer>
      </body>
    </html>
  );
}
