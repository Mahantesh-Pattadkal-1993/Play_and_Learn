"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserContext } from "@/components/UserContext";
import ProgressBar from "@/components/ProgressBar";
import { CURRICULUM } from "@/lib/curriculum";
import { USERS_LIST } from "@/lib/users";
import { UserProgress } from "@/lib/types";

const TOTAL_LESSONS = CURRICULUM.reduce(
  (sum, mod) => sum + mod.lessons.length,
  0,
);

const summarize = (entry: UserProgress | undefined) => {
  const completed = entry?.completedLessons.length ?? 0;
  const scores = entry ? Object.values(entry.quizScores) : [];
  const average = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  return {
    completed,
    average,
    percent: TOTAL_LESSONS
      ? Math.round((completed / TOTAL_LESSONS) * 100)
      : 0,
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const {
    userId,
    user,
    progress,
    allProgress,
    resetProgress,
    resetAllProgress,
  } = useUserContext();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  if (!userId || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{user.avatar}</span>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                {user.name}'s Dashboard
                {user.role === "tester" && (
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    🧪 Tester mode
                  </span>
                )}
              </h1>
              <p className="text-slate-400">
                {user.level} • {CURRICULUM.length} modules • {TOTAL_LESSONS} lessons
              </p>
            </div>
          </div>
        </div>

        {/* Tester Tools */}
        {user.role === "tester" && (
          <div className="bg-emerald-950/30 rounded-xl p-6 border border-emerald-500/30 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-emerald-200 flex items-center gap-2">
                  🧪 Tester Tools
                </h2>
                <p className="text-sm text-emerald-200/60">
                  Jump into any module, inspect every profile, and reset progress
                  when you need a clean slate.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset progress for ALL profiles (Shweta, Raj, Tester)? This cannot be undone.",
                    )
                  ) {
                    resetAllProgress();
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-300 text-sm font-medium transition-colors"
              >
                ♻️ Reset all profiles
              </button>
            </div>

            {/* Quick launch */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-emerald-300/70 mb-2">
                Test a module
              </h3>
              <div className="flex flex-wrap gap-2">
                {CURRICULUM.map((mod) => (
                  <Link
                    key={mod.id}
                    href={`/lesson/${mod.lessons[0]?.id}`}
                    className="px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-sm text-slate-200 transition-colors"
                  >
                    {mod.icon} Module {mod.id} — {mod.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress overview for all profiles */}
            <div className="overflow-x-auto">
              <h3 className="text-xs uppercase tracking-wider text-emerald-300/70 mb-2">
                Profile progress overview
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="py-2 pr-4 font-medium">Profile</th>
                    <th className="py-2 pr-4 font-medium">Role</th>
                    <th className="py-2 pr-4 font-medium">Completed</th>
                    <th className="py-2 pr-4 font-medium">Quiz avg</th>
                    <th className="py-2 pr-4 font-medium">Overall</th>
                    <th className="py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS_LIST.map((profile) => {
                    const stats = summarize(
                      allProgress ? allProgress[profile.id] : undefined,
                    );
                    return (
                      <tr
                        key={profile.id}
                        className="border-b border-slate-800/70 last:border-0"
                      >
                        <td className="py-2 pr-4 text-slate-200">
                          <span className="mr-2">{profile.avatar}</span>
                          {profile.name}
                        </td>
                        <td className="py-2 pr-4 text-slate-400 capitalize">
                          {profile.role}
                        </td>
                        <td className="py-2 pr-4 text-slate-300">
                          {stats.completed}/{TOTAL_LESSONS}
                        </td>
                        <td className="py-2 pr-4 text-slate-300">
                          {stats.average}%
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 w-10">
                              {stats.percent}%
                            </span>
                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${stats.percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Reset progress for ${profile.name}? This cannot be undone.`,
                                )
                              ) {
                                resetProgress(profile.id);
                              }
                            }}
                            className="px-2 py-1 rounded bg-red-600/15 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs transition-colors"
                          >
                            ♻️ Reset
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Progress Overview
          </h2>
          <ProgressBar progress={progress} userId={userId} />
        </div>

        {/* Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {CURRICULUM.map((mod) => {
            const completed = progress
              ? mod.lessons.filter((l) =>
                  progress.completedLessons.includes(l.id),
                ).length
              : 0;
            const pct = Math.round((completed / mod.lessons.length) * 100);

            return (
              <Link
                key={mod.id}
                href={`/module/${mod.id}`}
                className="group block bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-indigo-400 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{mod.icon}</span>
                  <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-300">
                    {mod.id} of {CURRICULUM.length}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {mod.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {mod.lessons.length} lessons
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">{pct}%</span>
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/lesson/${mod.lessons[0]?.id}`);
                  }}
                  className="mt-4 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                >
                  Start Module →
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
