"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { transform } from "sucrase";
import { Lesson } from "@/lib/types";
import { RUNNER_SRC_DOC } from "@/lib/runnerSandbox";

interface CodeRunnerProps {
  lesson: Lesson;
  /** Saved draft to restore for this profile (falls back to starter code). */
  initialCode?: string;
  onSavedCode?: (code: string) => void;
}

export default function CodeRunner({
  lesson,
  initialCode,
  onSavedCode,
}: CodeRunnerProps) {
  const [code, setCode] = useState(
    initialCode ?? lesson.codingTask.starterCode,
  );
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testPassed, setTestPassed] = useState<boolean | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const outputRef = useRef<string[]>([]);
  const runningTestsRef = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object" || !event.data.type) return;
      const { type, data } = event.data;
      if (type === "stdout" || type === "stderr") {
        setOutput((prev) => {
          const next = [...prev, data];
          outputRef.current = next;
          return next;
        });
      } else if (type === "done") {
        setIsRunning(false);
        if (runningTestsRef.current) {
          runningTestsRef.current = false;
          const hasPass = outputRef.current.some((o) => o.includes("PASS"));
          const hasFail = outputRef.current.some((o) => o.includes("FAIL"));
          setTestPassed(hasPass && !hasFail);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Restore a saved draft once progress loads (or when the lesson changes).
  useEffect(() => {
    if (initialCode !== undefined) {
      setCode(initialCode);
    }
  }, [initialCode, lesson.id]);

  const transpileCode = useCallback((tsCode: string): string => {
    try {
      // "imports" converts ESM to CommonJS; the sandbox provides a mock `require`
      // that resolves @playwright/test, playwright, fs, path, dotenv, ...
      return transform(tsCode, { transforms: ["typescript", "imports"] }).code;
    } catch (e) {
      return `// Error: ${String(e)}`;
    }
  }, []);

  const runCode = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    setOutput([]);
    outputRef.current = [];
    setIsRunning(true);
    setTestPassed(null);
    const jsCode = transpileCode(code);
    iframeRef.current.contentWindow?.postMessage(
      { type: "run", code: jsCode, source: code },
      "*",
    );
  }, [code, transpileCode]);

  const runTests = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !lesson.codingTask.tests) return;
    setOutput([]);
    outputRef.current = [];
    setIsRunning(true);
    setTestPassed(null);
    runningTestsRef.current = true;

    const testCode = lesson.codingTask.tests.map((t) => t.code).join("\n\n");
    const fullCode = `${transpileCode(code)}\n\n${testCode}`;
    iframeRef.current.contentWindow?.postMessage(
      { type: "run", code: fullCode, source: code },
      "*",
    );

    // Fallback timeout in case "done" message is missed
    setTimeout(() => {
      if (runningTestsRef.current) {
        runningTestsRef.current = false;
        const hasPass = outputRef.current.some((o) => o.includes("PASS"));
        const hasFail = outputRef.current.some((o) => o.includes("FAIL"));
        setTestPassed(hasPass && !hasFail);
        setIsRunning(false);
      }
    }, 3000);
  }, [code, lesson.codingTask.tests, transpileCode]);

  const loadSolution = useCallback(() => {
    setCode(lesson.codingTask.solution);
  }, [lesson.codingTask.solution]);

  const resetToStarter = useCallback(() => {
    setCode(lesson.codingTask.starterCode);
    setOutput([]);
    outputRef.current = [];
    setTestPassed(null);
  }, [lesson.codingTask.starterCode]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {isRunning ? "⏳ Running..." : "▶ Run Code"}
        </button>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          🧪 Run Tests
        </button>
        <button
          onClick={loadSolution}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
        >
          💡 Show Solution
        </button>
        <button
          onClick={resetToStarter}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
        >
          ↺ Reset Code
        </button>
        {onSavedCode && (
          <button
            onClick={() => onSavedCode(code)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            💾 Save Draft
          </button>
        )}
      </div>

      {/* Code Editor */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <Editor
          height="300px"
          defaultLanguage="typescript"
          value={code}
          onChange={(val) => setCode(val ?? "")}
          theme="vs-dark"
          onMount={(editor) => {
            // Store editor reference if needed
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 12 },
          }}
        />
      </div>

      {/* Output Panel */}
      <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 min-h-[120px]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-300">Console Output</h4>
          <button
            onClick={() => setOutput([])}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            Clear
          </button>
        </div>
        {output.length === 0 ? (
          <p className="text-slate-500 text-sm">Run your code to see output here...</p>
        ) : (
          <div className="space-y-1 font-mono text-sm">
            {output.map((line, i) => (
              <div
                key={i}
                className={
                  line.includes("FAIL") ? "text-red-400"
                  : line.includes("PASS") ? "text-green-400"
                  : line.includes("Error") ? "text-red-400"
                  : "text-slate-300"
                }
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Result */}
      {testPassed !== null && (
        <div
          className={`p-3 rounded-lg border ${
            testPassed
              ? "bg-green-900/20 border-green-500/30"
              : "bg-red-900/20 border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{testPassed ? "✅" : "❌"}</span>
            <span className="font-medium">
              {testPassed ? "All tests passed!" : "Some tests failed."}
            </span>
          </div>
        </div>
      )}

      {/* Hidden iframe for sandboxed execution */}
      <iframe
        ref={iframeRef}
        title="code-runner"
        className="hidden"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={RUNNER_SRC_DOC}
      />
    </div>
  );
}
