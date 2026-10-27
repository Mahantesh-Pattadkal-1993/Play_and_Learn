import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@/components/UserContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Play and Learn — Interactive TypeScript & Playwright Platform",
  description:
    "Learn TypeScript and Playwright through interactive lessons, quizzes, and coding challenges.",
  keywords: "Playwright, TypeScript, testing, automation, learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
