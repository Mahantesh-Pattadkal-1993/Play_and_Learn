"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserContext } from "@/components/UserContext";
import Navigation from "@/components/Navigation";
import ProgressBar from "@/components/ProgressBar";
import { CURRICULUM, getLesson } from "@/lib/curriculum";
import Link from "next/link";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const { userId, user, progress } = useUserContext();
  const moduleId = params?.id as string;

  useEffect(() => {
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  const module = CURRICULUM.find((m) => m.id === moduleId);

  if (!module) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen py-8 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4">Module Not Found</h2>
              <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const moduleProgress = module.lessons.filter((l) =>
    progress?.completedLessons.includes(l.id)
  ).length;

  return (
    <>
      <Navigation />
      <div className="min-h-screen py-8 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2 mb-4">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{module.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-white">{module.title}</h1>
                <p className="text-slate-400">
                  Module {module.id} of {CURRICULUM.length}
                </p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">{module.description}</p>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Module Progress</span>
                <span className="font-medium text-white">
                  {moduleProgress}/{module.lessons.length} lessons completed
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(moduleProgress / module.lessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {module.lessons.map((lesson) => {
              const isCompleted = progress?.completedLessons.includes(lesson.id);
              const quizScore = progress?.quizScores[lesson.id];
              return (
                <Link
                  key={lesson.id}
                  href={`/lesson/${lesson.id}`}
                  className={`block p-4 rounded-xl border transition-all duration-200 ${
                    isCompleted
                      ? "bg-green-900/20 border-green-500/30 hover:bg-green-900/30"
                      : "bg-slate-800/50 border-slate-700 hover:border-indigo-400"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{lesson.analogy.visual}</span>
                    <span className="text-sm font-medium text-slate-400">
                      Lesson {lesson.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1">{lesson.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                    {lesson.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{lesson.duration}</span>
                    {isCompleted && (
                      <span className="text-green-400 font-medium">✓ Completed</span>
                    )}
                    {quizScore !== undefined && !isCompleted && (
                      <span className="text-indigo-400">Quiz: {quizScore}%</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
