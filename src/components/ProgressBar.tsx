"use client";

import { UserId, Lesson, UserProgress } from "@/lib/types";
import { CURRICULUM } from "@/lib/curriculum";

interface ProgressBarProps {
  progress: UserProgress | null;
  userId: UserId | null;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  // Calculate progress for all modules
  const totalLessons = CURRICULUM.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0,
  );
  const completedLessons = progress
    ? progress.completedLessons.length
    : 0;
  const percent = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  // Per-module progress
  const moduleProgress = CURRICULUM.map((mod) => {
    const completed = progress
      ? mod.lessons.filter((l) =>
          progress.completedLessons.includes(l.id),
        ).length
      : 0;
    const pct = mod.lessons.length > 0
      ? Math.round((completed / mod.lessons.length) * 100)
      : 0;
    return { module: mod, completed, pct };
  });

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">Overall Progress</span>
          <span className="font-semibold text-white">{percent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Per-module progress */}
      <div className="space-y-4">
        {moduleProgress.map(({ module, completed, pct }) => (
          <div key={module.id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">
                Module {module.id}: {module.title}
              </span>
              <span className="text-xs text-slate-400">
                {completed}/{module.lessons.length} lessons
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
