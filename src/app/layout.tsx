import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Nebula Tasks - Premium Glassmorphism Todo Dashboard",
  description: "A feature-rich, high-performance ToDo dashboard with glassmorphism design, priority levels, subtask checklists, and statistics visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
