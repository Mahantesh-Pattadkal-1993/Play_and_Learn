"use client";

import { useState, useCallback } from "react";
import { QuizQuestion } from "@/lib/types";

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: Record<string, number[]>) => void;
  initialAnswers?: Record<string, number[]>;
}

export default function Quiz({ questions, onComplete, initialAnswers }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number[]>>(initialAnswers || {});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleToggle = useCallback((qid: string, idx: number) => {
    if (submitted) return;
    const q = questions.find((x) => x.id === qid);
    if (!q) return;
    setAnswers((prev) => {
      const cur = prev[qid] || [];
      const updated = q.type === "single" ? [idx] : cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx];
      return { ...prev, [qid]: updated };
    });
  }, [submitted, questions]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    let correct = 0;
    questions.forEach((q) => {
      const ua = answers[q.id] || [];
      if (q.correctIndices.length === ua.length && q.correctIndices.every((i) => ua.includes(i))) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    onComplete(pct, answers);
  }, [answers, submitted, questions, onComplete]);

  const reset = () => { setAnswers({}); setSubmitted(false); setScore(null); };
  const isCorrect = (q: QuizQuestion, idx: number) => q.correctIndices.includes(idx);
  const isSelected = (q: QuizQuestion, idx: number) => (answers[q.id] || []).includes(idx);
  const isQCorrect = (q: QuizQuestion) => {
    const ua = answers[q.id] || [];
    return q.correctIndices.length === ua.length && q.correctIndices.every((i) => ua.includes(i));
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <div key={q.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex gap-3 mb-3">
            <span className="text-sm font-bold text-indigo-400">Q{qi + 1}</span>
            <p className="font-medium text-white">{q.question}</p>
          </div>
          <div className="space-y-2 ml-10">
            {q.options.map((opt, oi) => {
              const sel = isSelected(q, oi);
              const cor = isCorrect(q, oi);
              let cls = "bg-slate-800 border-slate-600 text-slate-200";
              if (submitted && sel && cor) cls = "bg-green-900/30 border-green-400 text-green-300";
              else if (submitted && sel && !cor) cls = "bg-red-900/30 border-red-400 text-red-300";
              else if (submitted && cor) cls = "bg-green-900/30 border-green-400 text-green-300";
              return (
                <button key={oi} type="button" onClick={() => handleToggle(q.id, oi)} disabled={submitted}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all ${cls}`}>
                  <span className="font-semibold mr-2 text-slate-400">{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                  {submitted && cor && <span className="float-right text-green-400">✓</span>}
                  {submitted && sel && !cor && <span className="float-right text-red-400">✗</span>}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-300"><span className="font-semibold">Explanation:</span> {q.explanation}</p>
            </div>
          )}
        </div>
      ))}
      {!submitted && (
        <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-all">
          Submit Quiz
        </button>
      )}
      {submitted && score !== null && (
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div>
            <span className="font-bold text-lg">Score: {score}%</span>
            <span className="text-slate-400 ml-2">({questions.filter(isQCorrect).length} / {questions.length} correct)</span>
          </div>
          <button onClick={reset} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">Retake</button>
        </div>
      )}
    </div>
  );
}
