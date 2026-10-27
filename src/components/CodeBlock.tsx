"use client";

import { useMemo, useState } from "react";

/**
 * Lightweight, dependency-free TypeScript syntax highlighter.
 * Highlights comments, strings, numbers, keywords (`async`, `await`,
 * `interface`, ...), built-ins (`Promise`, `Array`, ...), Playwright APIs
 * (`page`, `expect`, `test`, ...), calls and properties. Lesson-specific
 * comments can be injected above matching lines via `annotations`.
 */

type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "api"
  | "builtin"
  | "number"
  | "function"
  | "property"
  | "punct"
  | "plain";

interface Token {
  type: TokenType;
  value: string;
}

export interface CodeAnnotation {
  /** Substring identifying the line the comment should appear above. */
  match: string;
  /** Comment text (without the leading `//`). */
  comment: string;
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "class", "extends", "implements",
  "interface", "type", "enum", "namespace", "module", "declare", "import",
  "from", "export", "default", "new", "return", "if", "else", "for", "of",
  "in", "while", "do", "switch", "case", "break", "continue", "try", "catch",
  "finally", "throw", "async", "await", "typeof", "instanceof", "keyof",
  "infer", "is", "as", "satisfies", "readonly", "public", "private",
  "protected", "static", "abstract", "get", "set", "constructor", "void",
  "null", "undefined", "true", "false", "this", "super", "delete",
]);

const BUILTINS = new Set([
  "string", "number", "boolean", "any", "unknown", "never", "object",
  "symbol", "bigint", "Array", "Promise", "Record", "Partial", "Readonly",
  "Map", "Set", "Date", "Error", "JSON", "Math", "Object", "String",
  "Number", "Boolean", "RegExp", "URL", "console", "process", "setTimeout",
  "clearTimeout", "setInterval", "Page", "Locator", "Browser",
  "BrowserContext", "APIRequestContext", "Request", "Response", "TestInfo",
  "expect", "test",
]);

const PLAYWRIGHT_APIS = new Set([
  "page", "context", "browser", "request", "route", "locator", "chromium",
  "firefox", "webkit", "devices", "defineConfig", "describe", "beforeEach",
  "afterEach", "beforeAll", "afterAll", "storageState", "trace", "reporter",
]);

const COLORS: Record<TokenType, string> = {
  comment: "text-slate-500 italic",
  string: "text-emerald-300",
  keyword: "text-fuchsia-400",
  api: "text-amber-300",
  builtin: "text-cyan-300",
  number: "text-orange-300",
  function: "text-blue-300",
  property: "text-sky-300",
  punct: "text-slate-400",
  plain: "text-slate-200",
};

const ID_START = /[A-Za-z_$]/;
const ID_PART = /[\w$]/;
const DIGIT = /[0-9]/;
const SPACE = /\s/;

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  let previous = "";

  const push = (type: TokenType, value: string) => {
    tokens.push({ type, value });
  };

  while (index < code.length) {
    const char = code[index];
    const nextChar = code[index + 1];

    if (SPACE.test(char)) {
      let end = index;
      while (end < code.length && SPACE.test(code[end])) end += 1;
      push("plain", code.slice(index, end));
      index = end;
      continue;
    }

    if (char === "/" && nextChar === "/") {
      let end = code.indexOf("\n", index);
      if (end === -1) end = code.length;
      push("comment", code.slice(index, end));
      index = end;
      continue;
    }

    if (char === "/" && nextChar === "*") {
      let end = code.indexOf("*/", index + 2);
      end = end === -1 ? code.length : end + 2;
      push("comment", code.slice(index, end));
      index = end;
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      const quote = char;
      let end = index + 1;
      while (end < code.length) {
        if (code[end] === "\\") {
          end += 2;
          continue;
        }
        if (code[end] === quote) {
          end += 1;
          break;
        }
        end += 1;
      }
      push("string", code.slice(index, end));
      index = end;
      previous = quote;
      continue;
    }

    if (DIGIT.test(char)) {
      let end = index;
      while (end < code.length && /[0-9._]/.test(code[end])) end += 1;
      push("number", code.slice(index, end));
      index = end;
      previous = "0";
      continue;
    }

    if (ID_START.test(char)) {
      let end = index;
      while (end < code.length && ID_PART.test(code[end])) end += 1;
      const word = code.slice(index, end);

      let lookahead = end;
      while (lookahead < code.length && SPACE.test(code[lookahead])) lookahead += 1;
      const isCall = code[lookahead] === "(";

      let type: TokenType = "plain";
      if (KEYWORDS.has(word)) type = "keyword";
      else if (PLAYWRIGHT_APIS.has(word)) type = "api";
      else if (BUILTINS.has(word)) type = "builtin";
      else if (previous === ".") type = "property";
      else if (isCall) type = "function";
      else if (/^[A-Z]/.test(word)) type = "builtin";

      push(type, word);
      index = end;
      previous = word;
      continue;
    }

    if (/[{}()[\];,.<>+\-*/%=!&|?:@]/.test(char)) {
      push("punct", char);
      index += 1;
      previous = char;
      continue;
    }

    push("plain", char);
    index += 1;
    previous = char;
  }

  return tokens;
}

/**
 * Adds lesson-specific `//` comments above the first line containing each
 * annotation's `match` string. Unmatched annotations are ignored.
 */
function injectAnnotations(code: string, annotations: CodeAnnotation[]): string {
  if (!annotations.length) return code;

  const pending = [...annotations];
  const output: string[] = [];

  for (const line of code.split("\n")) {
    const foundIndex = pending.findIndex((item) => line.includes(item.match));
    if (foundIndex !== -1) {
      const indent = line.match(/^\s*/)?.[0] ?? "";
      output.push(indent + "// " + pending[foundIndex].comment);
      pending.splice(foundIndex, 1);
    }
    output.push(line);
  }

  return output.join("\n");
}

interface CodeBlockProps {
  code: string;
  language?: string;
  annotations?: CodeAnnotation[];
  filename?: string;
}

export default function CodeBlock({
  code,
  language = "typescript",
  annotations = [],
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const displayCode = useMemo(
    () => injectAnnotations(code, annotations),
    [code, annotations],
  );
  const tokens = useMemo(() => tokenize(displayCode), [displayCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied; silently ignore.
    }
  };

  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            {filename ?? language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <code>
          {tokens.map((token, index) => (
            <span key={index} className={COLORS[token.type]}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
