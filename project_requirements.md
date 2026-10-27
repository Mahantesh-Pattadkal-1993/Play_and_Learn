# Project Requirements: Interactive Playwright & TypeScript Learning Platform

## 1. Executive Summary & Goals

The goal of this project is to build an interactive, web-based learning platform tailored specifically for two beginner learners: **Shweta** and **Raj**. The platform guides users step-by-step from beginner TypeScript fundamentals to writing complete end-to-end automation scripts using **Playwright**.

### Key Highlights:

* **Multi-Profile & Progress Tracking:** Separate profile login options for Shweta, Raj, and a dedicated **Tester** profile. Each user’s module completion, quiz scores, and code editor progress are saved independently based on who is logged in.

* **Tester Mode:** A third, QA-oriented profile that can open **any** module or lesson freely, inspect every learner’s progress side-by-side, and **reset progress** (own progress, a single learner, or all profiles) without touching source data.

* **Interactive Compiler:** Built-in TypeScript/JavaScript code execution environment and runner. Playwright lessons run against a **simulated Playwright API** (`page`, `expect`, `test`, `request`, …) so beginners can execute automation syntax directly in the browser without installing a browser.

* **Modular Learning:** Maximum of 5 lessons per module to ensure digestible, beginner-friendly content. The full course now spans **7 modules / 35 lessons**, taking a learner from TypeScript basics to a production-grade Playwright CI pipeline.

* **Comprehensive Playwright Coverage:** Locators and strict mode, chaining/filtering, auto-waiting and web-first assertions, keyboard/mouse/file interactions, fixtures, parameterised tests, debugging with Trace Viewer, API testing, network mocking, authentication via `storageState`, CI/CD, reporting, and a capstone suite.

* **Rich Pedagogy:** Visual aids (diagrams, flowcharts) and real-world analogies in every lesson to help beginners grasp core concepts easily.

* **Evaluation Framework:** Multiple-choice quiz + interactive coding challenge at the end of each lesson.

## 2. Learner Profiles & Authentication

* **Learner Profiles:**
  * **Shweta (Beginner):** Learning TypeScript & Playwright automation step-by-step.
  * **Raj (Beginner):** Learning TypeScript & Playwright automation step-by-step.
  * **Tester (QA / Evaluator):** A power profile used to validate the course itself. Can jump straight into any module/lesson, review all learners’ progress, and reset progress on demand.

* **Tester Profile Requirements (new):**
  * Dedicated profile card on the profile-selection screen (clearly badged as *Tester*, distinct colour from learners).
  * **Unrestricted navigation:** may open any module and any lesson without completing prerequisites.
  * **Progress dashboard:** a side-by-side table of Shweta, Raj, and Tester showing completed lessons, quiz average, and overall percentage.
  * **Reset controls (all behind an explicit confirmation):**
    * Reset **my progress** (Tester only).
    * Reset progress for **Shweta**, **Raj**, or **Tester** individually.
    * Reset **all profiles** at once.
    * Reset a **single lesson** (completion, quiz score, and saved code draft) from the lesson page.
  * **Quick test-runner:** one-click “Test a module” shortcuts that open the first lesson of any module.
  * Reset actions must persist to storage and refresh all UI instantly (no page reload required).

* **Profile & Progress Requirements:**
  * Simple user selection / login screen to switch between **Shweta**, **Raj**, and **Tester**.
  * User-specific session persistence (local storage per profile, keyed by user id).
  * Independent progress tracking (e.g., if Shweta completes Lesson 1.2, her progress shows 40% for Module 1 while Raj's progress remains at his own completed state).
  * Saved code drafts in the in-browser compiler per user profile, restored automatically when the lesson is reopened.

## 3. Curriculum & Module Architecture

> **Rule:** Every module contains a maximum of **5 lessons**.
> **Lesson Structure:**
>
> 1. Concept & Beginner-Friendly Analogy
>
> 2. Visual Diagram / Workflow
>
> 3. Step-by-Step Code Example (TypeScript + Playwright)
>
> 4. Quick Quiz (2–3 questions)
>
> 5. Interactive Coding Task (In-Browser Editor)

### Module 1: TypeScript Foundations for Beginners

* **Lesson 1.1: Modern JS & TS Basics**
  * *Analogy:* Variables as labeled storage boxes; Types as safety labels showing what goes inside.
  * *Diagram:* Dynamic JS typing vs. Static TS type-checking workflow.
  * *Task:* Declare variables with basic types (`string`, `number`, `boolean`) for test data.

* **Lesson 1.2: Functions & Basic Logic**
  * *Analogy:* A kitchen blender (inputs ingredients, processes them, returns a smoothie).
  * *Diagram:* Function inputs -> Processing execution -> Return value flow.
  * *Task:* Write helper functions that take input parameters and return formatted string results.

* **Lesson 1.3: Promises & Async / Await**
  * *Analogy:* Ordering food at a restaurant counter (Promise = Order Buzzer, Await = Waiting until buzzer rings).
  * *Diagram:* Synchronous vs. Asynchronous execution flow.
  * *Task:* Convert basic callback functions into clean `async/await` syntax.

* **Lesson 1.4: Arrays, Objects & Interfaces**
  * *Analogy:* An interface as a structured checklist or template form.
  * *Diagram:* Object mapping against TypeScript interface specifications.
  * *Task:* Create typed objects representing test user login data.

* **Lesson 1.5: Control Flow & Basic Loops**
  * *Analogy:* Traffic lights directing traffic based on conditions.
  * *Diagram:* `if/else` decisions and simple `for` loop iteration.
  * *Task:* Write conditional logic to check if a test step passed or failed.

### Module 2: Getting Started with Playwright

* **Lesson 2.1: What is Playwright & Setup**
  * *Analogy:* A remote control operating a web browser automatically.
  * *Diagram:* Playwright Runner -> Browser Context -> Web Page hierarchy.
  * *Task:* Write code to launch a browser, open a new page, and navigate to a URL.

* **Lesson 2.2: Locating Elements on a Webpage**
  * *Analogy:* Finding items in a grocery store using section signboards vs item labels.
  * *Diagram:* Page DOM structure and Playwright locator target identification.
  * *Task:* Practice using user-friendly locators like `getByRole`, `getByLabel`, and `getByText`.

* **Lesson 2.3: Interacting with Elements (Clicks & Inputs)**
  * *Analogy:* Filling out a physical application form (typing into boxes and checking options).
  * *Diagram:* Click, fill, and select options execution flow.
  * *Task:* Automate filling out a simple login form (Username, Password, Submit button click).

* **Lesson 2.4: Auto-Waiting & First Assertions**
  * *Analogy:* Waiting for a boiling kettle to whistle before pouring water, rather than using a fixed timer.
  * *Diagram:* Playwright auto-waiting lifecycle check before performing actions.
  * *Task:* Write assertions using `expect(locator).toBeVisible()` and `expect(locator).toHaveText()`.

* **Lesson 2.5: Handling Dynamic UI Elements**
  * *Analogy:* Waiting for a bus to stop completely before opening the door (dropdowns & popups).
  * *Diagram:* Modal pop-up detection and focus management workflow.
  * *Task:* Automate interacting with dynamic alert pop-ups and dropdown menus.

### Module 3: Building Structured Automation Scripts

* **Lesson 3.1: Page Object Model (POM) Basics**
  * *Analogy:* A TV remote control that groups all button functions together in one neat physical tool.
  * *Diagram:* POM structure mapping webpage elements to a TypeScript class.
  * *Task:* Build a simple `LoginPage` class containing elements and action methods.

* **Lesson 3.2: Working with Multiple Tabs & Frames**
  * *Analogy:* Reading two open books side by side on a desk.
  * *Diagram:* Multi-page browser context event handling.
  * *Task:* Write scripts to switch focus between main windows and `iframe` elements.

* **Lesson 3.3: Data-Driven Testing for Beginners**
  * *Analogy:* A stamp tool applying the same stamp using different ink colors.
  * *Diagram:* Iterating test execution over a list of test data rows.
  * *Task:* Run a single login test using multiple sets of username/password pairs.

* **Lesson 3.4: API Mocking & Intercepting**
  * *Analogy:* Intercepting a letter at the post office and replacing its message before delivery.
  * *Diagram:* Browser -> Playwright Network Interceptor -> Mock Server Response.
  * *Task:* Intercept a network call to display custom mock test data on the UI.

* **Lesson 3.5: Screenshots & Basic Reporting**
  * *Analogy:* Taking a photo proof when a package is delivered.
  * *Diagram:* Test run execution -> Screenshot capture on failure -> HTML report generation.
  * *Task:* Configure automatic screenshot capture on test failure.

### Module 4: Advanced Locators & Reliable Interactions

* **Lesson 4.1: Locator Strategies & Strict Mode**
  * *Analogy:* Reading a street address in priority order — building name, floor, then door number (most specific first).
  * *Diagram:* Locator priority ladder: `getByRole` → `getByLabel` → `getByTestId` → CSS/XPath, with strict-mode failure paths.
  * *Task:* Build a `findLoginButton(page)` helper using `getByRole('button', { name: 'Login' })` and explain why strict mode rejects ambiguous locators.

* **Lesson 4.2: Chaining, Filtering & Working with Lists**
  * *Analogy:* Searching a shopping list by first narrowing to the “dairy” aisle, then filtering “only items on offer”.
  * *Diagram:* Parent locator → filter (`hasText`, `has`) → index (`first`, `nth`, `last`) → action.
  * *Task:* Locate the “Delete” button inside the row containing “Invoice #42” using `locator(...).filter({ hasText }).getByRole(...)`.

* **Lesson 4.3: Auto-Waiting, Timeouts & Web-First Assertions**
  * *Analogy:* A toaster that pops when the bread is actually ready instead of a blind 3-minute timer.
  * *Diagram:* Actionability checks (visible, stable, enabled, receives events) → retrying assertions (`expect.poll`, `toHaveText` with timeout) → failure trace.
  * *Task:* Write a retrying assertion that waits up to 7 seconds for a status badge to read “Active”, and list the anti-patterns (`waitForTimeout`) to avoid.

* **Lesson 4.4: Keyboard, Mouse & Drag-and-Drop**
  * *Analogy:* Using a physical keyboard and mouse: shortcuts versus slow character-by-character typing.
  * *Diagram:* `press` / `type` / `hover` / `dblclick` / `dragTo` / low-level `mouse` moves mapped to browser events.
  * *Task:* Implement a function that types a search term with `fill`, presses `Enter`, hovers a menu, and drags a card onto a drop zone using `dragTo`.

* **Lesson 4.5: File Uploads, Downloads & Date Pickers**
  * *Analogy:* Handing a document to a clerk and receiving a stamped receipt — upload in, download out.
  * *Diagram:* `setInputFiles` → server processing → `waitForEvent('download')` → `saveAs`, plus date input strategies.
  * *Task:* Upload `profile.png`, wait for the generated report download, and set a date field via `fill('2025-06-01')`.

### Module 5: Test Architecture, Fixtures & Debugging

* **Lesson 5.1: Test Structure — describe, Hooks & Tags**
  * *Analogy:* A theatre rehearsal: `beforeEach` sets the stage, each `test` is a scene, `afterEach` clears the props.
  * *Diagram:* Runner lifecycle: `beforeAll` → `beforeEach` → `test` → `afterEach` → `afterAll`, with tag-based filters (`@smoke`, `@regression`).
  * *Task:* Build a suite with `test.describe`, shared `beforeEach` login, and tags used to select smoke tests only.

* **Lesson 5.2: Custom Fixtures with test.extend**
  * *Analogy:* A hotel concierge who prepares your room, car, and breakfast before you even ask — reusable, lazy setup.
  * *Diagram:* Fixture dependency graph (`page` → `loggedInPage` → `cartWithItem`) with worker vs test scope.
  * *Task:* Create a `loggedInPage` fixture that logs in once per test and hands the ready page to every test.

* **Lesson 5.3: Parameterised & Data-Driven Suites**
  * *Analogy:* A cookie cutter stamping identical shapes from different dough batches.
  * *Diagram:* Dataset rows × single test body → independent test cases with readable titles.
  * *Task:* Generate one login test per row from a typed `LoginCase[]` dataset using a `for...of` loop.

* **Lesson 5.4: Debugging with Trace Viewer, UI Mode & Inspector**
  * *Analogy:* A flight recorder (black box) that replays exactly what happened before the crash.
  * *Diagram:* Failure → trace.zip (screenshots, DOM snapshots, network, console) → `npx playwright show-trace`.
  * *Task:* Enable `trace: 'on-first-retry'` plus `--trace on` debugging, and identify which command sequence to inspect first.

* **Lesson 5.5: Parallelism, Retries & Test Isolation**
  * *Analogy:* Independent checkout lanes in a supermarket — fully parallel beats a single queue.
  * *Diagram:* Workers ↔ shards ↔ retries; shared-state hazards and why each test needs its own storage/context.
  * *Task:* Configure `fullyParallel`, 4 workers, 2 retries, and explain when `test.describe.configure({ mode: 'serial' })` is appropriate.

### Module 6: API Testing, Network Mocking & Authentication

* **Lesson 6.1: API Testing with APIRequestContext**
  * *Analogy:* Inspecting the courier’s parcel directly instead of asking the receptionist whether it arrived.
  * *Diagram:* `request.post` → status/headers/body assertions → reuse the payload in a UI test.
  * *Task:* Create a user through the API, assert `201` and the returned id, then use the id in the UI.

* **Lesson 6.2: Network Interception & Mocking with route.fulfill**
  * *Analogy:* A post-office clerk swapping the letter inside an envelope before delivery.
  * *Diagram:* `page.route` matcher → `fulfill` / `abort` / `continue` → application rendering mocked data.
  * *Task:* Mock `/api/products` with three fake products and assert the UI renders them without a real backend.

* **Lesson 6.3: Waiting for Responses & Asserting Payloads**
  * *Analogy:* Waiting for the right bus number, not just any bus — match the specific response.
  * *Diagram:* `waitForResponse(matcher)` → parse JSON → assert fields → continue UI flow; race-condition traps.
  * *Task:* Trigger a search, await the matching `search?q=` response, and assert the returned result count and query echo.

* **Lesson 6.4: Authentication with storageState**
  * *Analogy:* A fast-pass wristband issued once at the gate and reused all day.
  * *Diagram:* Global setup → login once → `storageState.json` → every test starts authenticated.
  * *Task:* Write a global-setup that authenticates once and saves `storageState: 'auth/user.json'`.

* **Lesson 6.5: Session Injection, Multi-Role & Token Handling**
  * *Analogy:* Different ID badges for visitor, staff, and admin — same building, different permissions.
  * *Diagram:* Role fixtures (`adminPage`, `viewerPage`) built from separate storage states; token injection via `addInitScript`.
  * *Task:* Build two role-based fixtures and assert that a viewer cannot see the admin-only “Delete” button.

### Module 7: CI/CD, Reporting & Capstone Project

* **Lesson 7.1: Configuration Deep Dive — Projects & Browsers**
  * *Analogy:* A recipe card with variants (gluten-free, vegan) from one base recipe.
  * *Diagram:* `defineConfig` → projects (`chromium`, `firefox`, `webkit`, mobile) → shared `use` options → reporters.
  * *Task:* Configure three browser projects plus a `Mobile Chrome` device project sharing `baseURL`.

* **Lesson 7.2: Environment Variables & Multi-Environment Runs**
  * *Analogy:* Switching a train’s destination board: same train, different route.
  * *Diagram:* `.env.staging` / `.env.production` → `process.env.BASE_URL` → config `use.baseURL`; secrets handling.
  * *Task:* Read `BASE_URL` from the environment with a localhost fallback and fail fast when it is missing in CI.

* **Lesson 7.3: Built-in & Custom Reporters**
  * *Analogy:* A school report card: one page for parents, one feed for the school app.
  * *Diagram:* Listeners (`onTestBegin`, `onTestEnd`, `onEnd`) → list/HTML/JUnit/JSON/custom reporter outputs.
  * *Task:* Enable `list` + `html` + `junit` reporters and write a tiny custom reporter that counts failures.

* **Lesson 7.4: CI Pipeline with GitHub Actions & Sharding**
  * *Analogy:* A factory assembly line: install, build, split the work, publish results.
  * *Diagram:* GitHub Actions job → cache/install browsers → `--shard=1/3` matrix → upload HTML report + traces as artifacts.
  * *Task:* Write a workflow that runs tests on push/PR, shards across three jobs, and uploads the report artifact.

* **Lesson 7.5: Capstone — End-to-End E-Commerce Suite**
  * *Analogy:* Directing a full orchestra: every instrument (POM, fixtures, data, API, mocking, reporting) plays together.
  * *Diagram:* Test suite architecture: fixtures → page objects → API helpers → data factories → reporters, executed in CI.
  * *Task:* Assemble a complete purchase flow: login via API session, search, add to cart, mock payment, assert confirmation, and capture a trace on failure.

## 4. Engineering & Implementation Plan for Coding Team

### Tech Stack Recommendation

* **Frontend:** Next.js 15 (App Router, React 19), Tailwind CSS 3
* **Language:** TypeScript 5 (strict)
* **Code Editor:** `@monaco-editor/react`
* **Code Transpilation:** `sucrase` (in-browser TypeScript → JavaScript)
* **Code Execution Sandbox:** hidden `<iframe>` (`sandbox="allow-scripts allow-same-origin"`, loaded via `srcDoc`) with no network access, a `postMessage` console bridge, and a simulated Playwright API (`page`, `expect`, `test`, `request`, `chromium`, …) so Playwright syntax is executable without a real browser.
* **Diagrams:** Mermaid.js (client-side, dynamic import with text fallback)
* **Progress Persistence:** `localStorage`, one key per profile (`playandlearn_progress_<userId>`), synchronised across components via custom events.
* **Profiles:** `shweta`, `raj` (learners) and `tester` (QA/evaluator with reset + progress overview).
* **Database & Auth (future):** optional Supabase / PostgreSQL (Prisma ORM) to sync progress across devices; the current build is fully offline-capable.

### Development Sprint Plan (6-Week Execution Plan)

```
[Sprint 1: Profiles & Dashboard] ---> [Sprint 2: Editor & Runner] ---> [Sprint 3: Core Curriculum]
        ---> [Sprint 4: Advanced Playwright Modules] ---> [Sprint 5: Tester Mode & Reset Tools] ---> [Sprint 6: QA & Deploy]
```

#### Sprint 1: Multi-Profile Auth & Dashboard UI (Week 1)

* **Goal:** Create profile login/switcher for Shweta, Raj, and Tester with separate progress tracking.
* **Tasks:**
  * Build the user selection screen with three distinct profile cards and role badges.
  * Define the `User` model (`id`, `name`, `avatar`, `level`, `role`) and `UserProgress` shape (`completedLessons`, `quizScores`, `codeDrafts`, `currentLessonId`).
  * Implement persistence so switching profiles immediately reloads that profile's progress state.

#### Sprint 2: Interactive Code Editor & Runner Engine (Week 2)

* **Goal:** Integrated Monaco editor with live, sandboxed execution.
* **Tasks:**
  * Integrate `@monaco-editor/react` with TypeScript syntax and auto-completion.
  * Build the sandboxed runner: async IIFE execution, `stdout`/`stderr` console panel, timeout protection.
  * Provide the simulated Playwright API and expose `window.__USER_CODE__` for static-analysis tests.
  * Restore saved code drafts per profile and per lesson.

#### Sprint 3: Core Curriculum Content & Quizzes (Week 3)

* **Goal:** Content population for Modules 1–3 and visual diagram engine.
* **Tasks:**
  * Integrate dynamic Mermaid.js rendering with graceful fallback.
  * Build the interactive quiz component (single/multiple answers, explanations, instant feedback).
  * Populate Modules 1–3 (TypeScript foundations, Playwright basics, structured automation).

#### Sprint 4: Advanced Playwright Modules (Week 4)

* **Goal:** Deepen Playwright coverage to production level.
* **Tasks:**
  * Add Module 4 (advanced locators and reliable interactions) and Module 5 (test architecture, fixtures, debugging).
  * Add Module 6 (API testing, network mocking, authentication) and Module 7 (configuration, reporting, CI/CD, capstone).
  * Add 20 lessons with analogies, diagrams, quizzes, and runnable coding tasks — 35 lessons total.

#### Sprint 5: Tester Mode & Progress Reset Tools (Week 5)

* **Goal:** QA-oriented Tester profile.
* **Tasks:**
  * Add Tester login, badge, and unrestricted module/lesson access.
  * Build the Tester Tools panel: per-profile progress overview, quick module launch, and reset controls.
  * Implement reset actions (own progress, individual learner, all profiles, single lesson) with confirmation and instant UI refresh.

#### Sprint 6: Progress Analytics, Polish & Deployment (Week 6)

* **Goal:** User progress visuals, testing, and deployment.
* **Tasks:**
  * Add visual progress bars per module and per profile (e.g., "Shweta: 60% Completed", "Raj: 25% Completed").
  * Conduct UX testing across all three profiles to ensure zero progress overlap and reliable resets.
  * Optimize editor load times, run lint/type checks, and deploy to Vercel/AWS.