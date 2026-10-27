"use client";

import Link from "next/link";
import { useUserContext } from "@/components/UserContext";

export default function Navigation() {
  const { user, userId, resetProgress } = useUserContext();

  const handleReset = () => {
    if (!userId || !user) return;
    const confirmed = window.confirm(
      `Reset all progress for ${user.name}? This cannot be undone.`,
    );
    if (confirmed) {
      resetProgress();
    }
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl">🎮</span>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Play and Learn
          </span>
        </Link>

        {userId && (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl">{user?.avatar}</span>
            <span className="font-medium text-white hidden sm:inline">
              {user?.name}
            </span>
            {user?.role === "tester" && (
              <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                🧪 Tester
              </span>
            )}
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition-colors"
            >
              Dashboard
            </Link>
            {user?.canResetProgress && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset progress for this profile"
                className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-300 text-sm transition-colors"
              >
                ♻️ Reset
              </button>
            )}
            <Link
              href="/"
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors"
            >
              Switch Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
