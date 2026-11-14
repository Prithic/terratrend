import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TerraTrend | NASA Earth System Trend Discovery & Intelligence",
  description: "Official NASA Space Apps 2026 solution for detecting, calculating, and explaining Earth system climate trends with non-parametric Mann-Kendall statistics and NASA MERRA-2 assimilation data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
