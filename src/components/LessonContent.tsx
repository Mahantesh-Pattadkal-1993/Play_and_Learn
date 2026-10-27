"use client";

import { useState, useCallback, useEffect } from "react";
import { Lesson } from "@/lib/types";
import { CURRICULUM, getLesson } from "@/lib/curriculum";
import MermaidDiagram from "@/components/MermaidDiagram";
import Quiz from "@/components/Quiz";
import CodeRunner from "@/components/CodeRunner";
import CodeBlock from "@/components/CodeBlock";
import { getLessonNotes } from "@/lib/lessonNotes";
import { useUserContext } from "@/components/UserContext";
import Link from "next/link";

interface LessonContentProps {
  lessonId: string;
}

export default function LessonContent({ lessonId }: LessonContentProps) {
  const {
    progress,
    user,
    completeLesson,
    setQuizScore,
    setCodeDraft,
    resetLesson,
    userId,
  } = useUserContext();
  const lesson = getLesson(lessonId);
  const notes = getLessonNotes(lessonId);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScoreState] = useState<number | null>(null);

  // Sync local quiz state with stored progress (including Tester resets).
  useEffect(() => {
    if (!progress) return;
    const score = progress.quizScores[lessonId];
    if (score !== undefined) {
      setQuizScoreState(score);
      setQuizCompleted(true);
    } else {
      setQuizScoreState(null);
      setQuizCompleted(false);
    }
  }, [lessonId, progress]);

  const handleQuizComplete = useCallback((score: number) => {
    setQuizScoreState(score);
    setQuizCompleted(true);
    setQuizScore(lessonId, score);
  }, [setQuizScore, lessonId]);

  if (!lesson) {
    return (
      <div className="min-h-screen py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-2">Lesson Not Found</h2>
            <p className="text-slate-400">The requested lesson does not exist.</p>
            <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find previous/next lessons
  const module = CURRICULUM.find((m) => m.id === lesson.moduleId);
  const lessonIndex = module?.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = lessonIndex && lessonIndex > 0 && module ? module.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex !== undefined && lessonIndex !== null && module && lessonIndex < module.lessons.length - 1
    ? module.lessons[lessonIndex + 1]
    : null;

  const handleCodeSaved = useCallback(
    (code: string) => {
      if (userId) {
        setCodeDraft(lessonId, code);
      }
    },
    [userId, lessonId, setCodeDraft],
  );

  const handleResetLesson = useCallback(() => {
    if (!userId) return;
    if (
      window.confirm(
        `Reset progress for lesson ${lessonId}? Completion, quiz score and saved code will be cleared.`,
      )
    ) {
      resetLesson(lessonId);
      setQuizCompleted(false);
      setQuizScoreState(null);
    }
  }, [userId, lessonId, resetLesson]);

  const handleMarkComplete = useCallback(() => {
    if (userId) {
      completeLesson(lessonId);
    }
  }, [userId, completeLesson, lessonId]);

  const canComplete = quizCompleted || quizScore !== null;

  return (
    <div className="min-h-screen py-8 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Lesson Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2 mb-4">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Module {lesson.moduleId}</span>
              <span className="text-slate-600">›</span>
              <span className="text-sm font-medium text-indigo-400">Lesson {lesson.id}</span>
            </div>
            <span className="text-sm text-slate-500">• {lesson.duration}</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
              <p className="text-slate-400">{lesson.description}</p>
            </div>
            {user?.canResetProgress && (
              <button
                type="button"
                onClick={handleResetLesson}
                className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-300 text-sm transition-colors"
              >
                ♻️ Reset this lesson
              </button>
            )}
          </div>
          {progress?.completedLessons.includes(lessonId) && (
            <p className="mt-3 text-sm text-green-400">
              ✓ Completed
              {progress?.quizScores[lessonId] !== undefined
                ? ` • Quiz score: ${progress.quizScores[lessonId]}%`
                : ""}
            </p>
          )}
        </div>

        {/* Concept Section — what the topic actually is */}
        <div className="mb-6 p-6 bg-slate-800/40 rounded-xl border border-indigo-500/30">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <span>🧠</span> What is {lesson.title}?
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {notes?.concept ?? lesson.description}
          </p>
        </div>

        {/* Analogy Section — a friendly mental model for the concept */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>🧩</span> Analogy
          </h2>
          <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700">
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">{lesson.analogy.visual}</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{lesson.analogy.title}</h3>
                <p className="text-slate-300 leading-relaxed">{lesson.analogy.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagram Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>📊</span> Visual Diagram
          </h2>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <MermaidDiagram chart={lesson.diagram.chart} altText={lesson.diagram.altText} />
          </div>
        </div>

        {/* Code Example Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>💻</span> Step-by-Step Code Example
          </h2>
          <p className="text-slate-300 mb-4">{lesson.codeExample.description}</p>
          <CodeBlock
            code={lesson.codeExample.code}
            annotations={notes?.annotations}
            filename="example.ts"
          />
          {notes?.codeExplanation && (
            <div className="mt-4 p-4 bg-slate-800/40 border border-slate-700 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <span>🔎</span> How this code explains the topic
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {notes.codeExplanation}
              </p>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>📝</span> Quick Quiz
          </h2>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <Quiz questions={lesson.quiz} onComplete={handleQuizComplete} />
          </div>
        </div>

        {/* Coding Task Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Interactive Coding Task
          </h2>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-300 mb-4">{lesson.codingTask.description}</p>
            <p className="text-xs text-slate-500 mb-4">
              Playwright lessons run against a simulated browser API — actions are
              printed to the console instead of launching a real browser.
            </p>
            <CodeRunner
              key={lesson.id}
              lesson={lesson}
              initialCode={progress?.codeDrafts[lessonId]}
              onSavedCode={handleCodeSaved}
            />
          </div>
        </div>

        {/* Completion Section */}
        {canComplete && (
          <div className="mb-8 p-6 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Ready to mark complete?</h3>
                <p className="text-sm text-slate-400">
                  You have completed the quiz{quizScore !== null ? ` (score: ${quizScore}%)` : ""}.
                </p>
              </div>
              <button
                onClick={handleMarkComplete}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors"
              >
                ✅ Mark Lesson Complete
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-700">
          {prevLesson ? (
            <Link
              href={`/lesson/${prevLesson.id}`}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              ← Previous: {prevLesson.title}
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link
              href={`/lesson/${nextLesson.id}`}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
            >
              Next: {nextLesson.title} →
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              ← Back to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
