# Play and Learn

An interactive, web-based learning platform designed for beginners **Shweta** and **Raj** to learn **TypeScript & Playwright** step-by-step — through analogies, visual diagrams, quizzes, and a built-in code runner.

A third **Tester** profile is included for QA: it can open any module, compare every learner's progress side-by-side, and reset progress (one profile, all profiles, or a single lesson).

## 🚀 Quick Start

```bash
# Node v22+ required
npm install
npm run dev
# Open http://localhost:3000
```

For production:
```bash
npm run build
npm run start
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) + React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Code Editor** | [@monaco-editor/react](https://www.npmjs.com/package/@monaco-editor/react) |
| **Code Execution** | Sucrase (TS→JS transpile) + sandboxed iframe sandbox |
| **Diagrams** | Mermaid.js (dynamic import) |
| **Persistence** | localStorage (per-user) |
| **Deployment** | Vercel-ready (zero-config) |

### Environment
- **Node.js:** v22.23.3
- **npm:** 10.9.9

## 📚 Curriculum (7 Modules, 35 Lessons)

### Module 1: TypeScript Foundations
1.1 Modern JS & TS Basics · 1.2 Functions & Basic Logic · 1.3 Promises & Async/Await · 1.4 Arrays, Objects & Interfaces · 1.5 Control Flow & Loops

### Module 2: Getting Started with Playwright
2.1 What is Playwright & Setup · 2.2 Locating Elements · 2.3 Interacting with Elements · 2.4 Auto-Waiting & Assertions · 2.5 Handling Dynamic UI

### Module 3: Building Structured Automation Scripts
3.1 Page Object Model · 3.2 Multiple Tabs & Frames · 3.3 Data-Driven Testing · 3.4 API Mocking · 3.5 Screenshots & Reporting

### Module 4: Advanced Locators & Reliable Interactions
4.1 Locator Strategies & Strict Mode · 4.2 Chaining, Filtering & Lists · 4.3 Auto-Waiting & Web-First Assertions · 4.4 Keyboard, Mouse & Drag-and-Drop · 4.5 Uploads, Downloads & Date Pickers

### Module 5: Test Architecture, Fixtures & Debugging
5.1 describe, Hooks & Tags · 5.2 Custom Fixtures with test.extend · 5.3 Parameterised Tests · 5.4 Trace Viewer & Debugging · 5.5 Parallelism, Retries & Isolation

### Module 6: API Testing, Network Mocking & Authentication
6.1 APIRequestContext · 6.2 route.fulfill Mocking · 6.3 Waiting for Responses · 6.4 storageState Auth · 6.5 Multi-Role & Token Handling

### Module 7: CI/CD, Reporting & Capstone Project
7.1 Projects & Browsers · 7.2 Environment Variables · 7.3 Reporters · 7.4 GitHub Actions & Sharding · 7.5 Capstone E-Commerce Suite

## 🎯 Features

- **Three Profiles** — Shweta, Raj (learners) and Tester (QA) each get independent progress tracking via localStorage
- **Tester Mode** — Per-profile progress overview, quick module launch, and reset controls (own profile, any profile, all profiles, or a single lesson)
- **Interactive Code Runner** — Write TypeScript in Monaco, transpile with Sucrase, execute in a sandboxed iframe with a **simulated Playwright API** (`page`, `expect`, `test`, `request`, `chromium`, `devices`, `defineConfig`) so automation code runs without a real browser
- **Code Draft Restore** — Saved drafts are reloaded automatically when a lesson is reopened
- **Visual Diagrams** — Mermaid.js flowcharts rendered for every lesson
- **Concept + Analogy** — Every lesson first explains what the topic *is*, then reinforces it with a relatable analogy
- **Annotated, Highlighted Code** — TypeScript examples are syntax coloured (keywords, `async`/`await`, `Promise`, Playwright APIs), commented line by line, and followed by a "how this code explains the theme" walkthrough
- **Instant Quiz Feedback** — Multiple-choice quizzes with explanations
- **Progress Tracking** — Progress bars per module and overall
- **Code Draft Saving** — Per-user draft persistence in localStorage

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Tailwind + UserProvider
│   ├── page.tsx                # Profile selection (Shweta / Raj)
│   ├── dashboard/page.tsx      # Module overview + progress bars
│   ├── module/[id]/page.tsx    # Module page: list of lessons
│   └── lesson/[id]/page.tsx    # Lesson page: content + quiz + code runner
├── components/
│   ├── UserContext.tsx         # Context for user state + progress
│   ├── ProfileSelector.tsx     # Shweta/Raj selection cards
│   ├── Navigation.tsx          # Top nav bar
│   ├── ProgressBar.tsx         # Progress visualization
│   ├── LessonContent.tsx       # Full lesson orchestration
│   ├── MermaidDiagram.tsx      # Diagram rendering
│   ├── Quiz.tsx                # Interactive multiple-choice quiz
│   ├── CodeRunner.tsx          # Monaco editor + sandboxed execution
│   └── Dashboard.tsx           # Dashboard UI
└── lib/
    ├── types.ts                # All TypeScript interfaces
    ├── users.ts                # User definitions
    ├── storage.ts              # localStorage persistence helpers
    ├── hooks.ts                # React hooks (useUser, useProgress)
    ├── curriculum.ts           # Curriculum index (7 modules, 35 lessons)
    ├── curriculum.module1.ts   # Module 1: TypeScript Foundations
    ├── curriculum.module2.ts   # Module 2: Playwright Basics
    ├── curriculum.module3.ts   # Module 3: Structured Automation
    ├── curriculum.module4.ts   # Module 4: Advanced Locators
    ├── curriculum.module5.ts   # Module 5: Architecture & Debugging
    ├── curriculum.module6.ts   # Module 6: API, Network & Auth
    ├── curriculum.module7.ts   # Module 7: CI/CD & Capstone
    └── runnerSandbox.ts        # Sandboxed runtime + simulated Playwright API
```

## 🏗️ Sprint Plan (Completed)

- ✅ **Sprint 1:** Multi-profile auth (Shweta / Raj / Tester) & dashboard UI with localStorage persistence
- ✅ **Sprint 2:** Interactive Monaco Editor, sandboxed runner, draft restore, simulated Playwright API
- ✅ **Sprint 3:** Modules 1–3 populated with content, quizzes, and coding challenges
- ✅ **Sprint 4:** Modules 4–7 added — 35 lessons covering advanced Playwright, API, auth, CI/CD and a capstone
- ✅ **Sprint 5:** Tester mode with progress overview and reset tools (profile, all profiles, single lesson)
- ✅ **Sprint 6:** Progress analytics, type-checked build, UX polish, deployment ready

