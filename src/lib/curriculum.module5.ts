/**
 * Module 5: Test Architecture, Fixtures & Debugging
 * Hooks/tags, custom fixtures, data-driven suites, trace debugging,
 * parallelism and test isolation.
 */
import { Module } from "./types";

export const module5: Module = {
  id: "5",
  title: "Test Architecture, Fixtures & Debugging",
  icon: "🧱",
  description:
    "Structure suites with hooks and tags, build reusable fixtures, parameterise tests, debug with traces, and run safely in parallel.",
  lessons: [
    {
      id: "5.1",
      moduleId: "5",
      title: "Test Structure — describe, Hooks & Tags",
      slug: "test-structure-describe-hooks-and-tags",
      duration: "25 min",
      description:
        "Group tests with describe, share setup via hooks, and select subsets with tags.",
      analogy: {
        title: "A Theatre Rehearsal",
        description:
          "Before each scene the stage crew sets the props (beforeEach), the actors perform the scene (test), and afterwards the props are cleared (afterEach). beforeAll/afterAll are the morning setup and final lock-up. Tags such as @smoke and @regression tell the crew which scenes to rehearse today.",
        visual: "🎭",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["beforeAll (once per worker)"] --> B["beforeEach"]
  B --> C["test 1 @smoke"]
  B --> D["test 2 @regression"]
  C --> E["afterEach"]
  D --> E
  E --> F["afterAll"]
  G["--grep @smoke"] -.-> C
  style B fill:#4F46E5,color:#FFFFFF
  style G fill:#FEF3C7,color:#78350F`,
        altText:
          "Test lifecycle with beforeAll, beforeEach, tests and afterEach, plus tag selection with grep.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Group login tests, share navigation setup, and tag smoke tests.",
        code: `import { test, expect } from '@playwright/test';

test.describe('Authentication @auth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('valid credentials @smoke', async ({ page }) => {
    await page.getByLabel('Email').fill('shweta@example.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('invalid credentials @regression', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('nope');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});

// Run only smoke tests: npx playwright test --grep @smoke`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which hook runs before every test in its scope?",
          options: ["beforeAll", "beforeEach", "afterEach", "test.before"],
          correctIndices: [1],
          explanation:
            "beforeEach executes before each test in the current describe block — ideal for shared setup such as navigation.",
          type: "single",
        },
        {
          id: "q2",
          question: "How do you run only tests tagged @smoke?",
          options: [
            "npx playwright test --only=smoke",
            "npx playwright test --grep @smoke",
            "npx playwright test --tag smoke",
            "npx playwright test --filter smoke",
          ],
          correctIndices: [1],
          explanation:
            "Tags are plain text in the test title; --grep filters titles using a regular expression.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Build an Authentication suite with test.describe, a beforeEach that navigates to /login, and two tagged tests: a @smoke valid-login test and a @regression invalid-login test.",
        starterCode: `import { test, expect } from '@playwright/test';

// TODO: wrap in test.describe('Authentication @auth')
// TODO: add beforeEach -> page.goto('/login')
// TODO: add a @smoke valid login test and a @regression invalid login test`,
        solution: `import { test, expect } from '@playwright/test';

test.describe('Authentication @auth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('valid credentials @smoke', async ({ page }) => {
    await page.getByLabel('Email').fill('shweta@example.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('invalid credentials @regression', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('nope');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});`,
        tests: [
          {
            description: "Suite uses describe, a hook, and two tagged tests",
            code: `await Promise.allSettled(window.__pending.slice());
var log = window.__mockLog.join(' | ');
var src = window.__USER_CODE__;
var started = log.split('test("').length - 1;
var ok = log.indexOf('describe("Authentication') !== -1 &&
  src.indexOf('test.beforeEach') !== -1 &&
  log.indexOf('goto("/login")') !== -1 &&
  src.indexOf('@smoke') !== -1 &&
  src.indexOf('@regression') !== -1 &&
  started >= 2;
console.log(ok
  ? 'PASS: Suite structure, shared setup and tags are correct'
  : 'FAIL: started=' + started + ' log=' + log);`,
            expected: "PASS: Suite structure, shared setup and tags are correct",
          },
        ],
      },
    },
    {
      id: "5.2",
      moduleId: "5",
      title: "Custom Fixtures with test.extend",
      slug: "custom-fixtures-with-test-extend",
      duration: "35 min",
      description:
        "Build reusable, lazily-created fixtures so every test starts from a ready-made state.",
      analogy: {
        title: "A Hotel Concierge",
        description:
          "A concierge prepares your room, car and breakfast before you ask — and only for what you actually need. Fixtures work the same way: Playwright creates them lazily when a test requests them, shares setup code, and tears them down afterwards. test.extend lets you define your own fixtures on top of the built-in ones.",
        visual: "🛎️",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["Built-in fixture: page"] --> B["Your fixture: loggedInPage"]
  B --> C["Your fixture: cartWithItem"]
  C --> D["test({ cartWithItem })"]
  E["test.extend({ loggedInPage })"] --> B
  style A fill:#E2E8F0,color:#0F172A
  style B fill:#4F46E5,color:#FFFFFF
  style C fill:#DBEAFE,color:#0F172A
  style D fill:#10B981,color:#052E16`,
        altText:
          "Fixtures form a dependency graph: page feeds loggedInPage, which feeds cartWithItem, which the test consumes.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Create a loggedInPage fixture and use it in a test.",
        code: `import { test as base, expect } from '@playwright/test';

type Fixtures = {
  loggedInPage: import('@playwright/test').Page;
};

const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('shweta@example.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Everything before use() is setup; the test runs at use()
    await use(page);

    // Everything after use() is teardown
  },
});

test('cart is visible after login', async ({ loggedInPage }) => {
  await loggedInPage.goto('/cart');
  await expect(loggedInPage.getByRole('heading', { name: 'Your cart' })).toBeVisible();
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "When is a fixture created?",
          options: [
            "Before every test, whether used or not",
            "Lazily, only when a test requests it",
            "Only in the global setup file",
            "At config load time",
          ],
          correctIndices: [1],
          explanation:
            "Fixtures are set up on demand. If a test never asks for a fixture, its setup code never runs, keeping suites fast.",
          type: "single",
        },
        {
          id: "q2",
          question: "What does the use() callback inside a fixture do?",
          options: [
            "Imports a module",
            "Marks where the test body runs, separating setup from teardown",
            "Closes the browser",
            "Runs the test twice",
          ],
          correctIndices: [1],
          explanation:
            "Code before use() is setup, use(value) hands the fixture value to the test, and code after use() is teardown.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Create a loggedInPage fixture with test.extend that logs in as shweta@example.com and then use it in a test that visits /cart.",
        starterCode: `import { test as base, expect } from '@playwright/test';

// TODO: create loggedInPage fixture with base.extend
// TODO: add a test that receives { loggedInPage } and visits /cart`,
        solution: `import { test as base, expect } from '@playwright/test';

const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('shweta@example.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await use(page);
  },
});

test('cart is visible after login', async ({ loggedInPage }) => {
  await loggedInPage.goto('/cart');
  await expect(loggedInPage.getByRole('heading', { name: 'Your cart' })).toBeVisible();
});`,
        tests: [
          {
            description: "Fixture logs in and is consumed by the test",
            code: `await Promise.allSettled(window.__pending.slice());
var log = window.__mockLog.join(' | ');
var src = window.__USER_CODE__;
var ok = src.indexOf('loggedInPage') !== -1 &&
  src.indexOf('extend') !== -1 &&
  src.indexOf('use(') !== -1 &&
  log.indexOf('test("cart is visible after login")') !== -1 &&
  log.indexOf('fill("shweta@example.com")') !== -1 &&
  log.indexOf('goto("/cart")') !== -1;
console.log(ok
  ? 'PASS: Custom fixture provides an authenticated page'
  : 'FAIL: Fixture setup or test usage missing. Log: ' + log);`,
            expected: "PASS: Custom fixture provides an authenticated page",
          },
        ],
      },
    },
    {
      id: "5.3",
      moduleId: "5",
      title: "Parameterised & Data-Driven Suites",
      slug: "parameterised-and-data-driven-suites",
      duration: "30 min",
      description:
        "Generate one independent test per dataset row and keep failures easy to read.",
      analogy: {
        title: "A Cookie Cutter",
        description:
          "One cookie cutter produces identical shapes from different dough batches. A data-driven suite uses one test body with many input rows, so you write the logic once and still get a separate, individually-reported test for every scenario.",
        visual: "🍪",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["LoginCase[] dataset"] --> B["for (const data of loginCases)"]
  B --> C["test('login: ' + data.email)"]
  C --> D["Independent result row in the report"]
  style A fill:#E2E8F0,color:#0F172A
  style B fill:#4F46E5,color:#FFFFFF
  style D fill:#10B981,color:#052E16`,
        altText:
          "A dataset is iterated to generate separate tests, each reported independently.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Generate one test per dataset row from a typed array.",
        code: `import { test, expect } from '@playwright/test';

type LoginCase = {
  email: string;
  password: string;
  expected: string;
};

const loginCases: LoginCase[] = [
  { email: 'shweta@example.com', password: 'secret', expected: 'Dashboard' },
  { email: 'raj@example.com', password: 'secret', expected: 'Dashboard' },
  { email: 'ghost@example.com', password: 'wrong', expected: 'Invalid credentials' },
];

for (const data of loginCases) {
  test('login: ' + data.email, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(data.email);
    await page.getByLabel('Password').fill(data.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText(data.expected)).toBeVisible();
  });
}`,
      },
      quiz: [
        {
          id: "q1",
          question: "Why is a for-loop around test() preferred over a loop inside one test?",
          options: [
            "It is faster",
            "Each row becomes an independent test with its own result, retry and trace",
            "Playwright does not allow loops inside tests",
            "It reduces code coverage",
          ],
          correctIndices: [1],
          explanation:
            "Generating tests per row gives independent pass/fail reporting, retries and traces, instead of stopping at the first failing row.",
          type: "single",
        },
        {
          id: "q2",
          question: "What should the test title include in a data-driven suite?",
          options: [
            "Only the word 'test'",
            "The data that identifies the scenario (e.g. the email)",
            "A random id",
            "Nothing — titles are optional",
          ],
          correctIndices: [1],
          explanation:
            "Including the row's identifying data makes failures instantly traceable in the HTML report.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Define a typed loginCases array with three rows and generate one test per row that fills the login form and asserts the expected text.",
        starterCode: `import { test, expect } from '@playwright/test';

// TODO: define loginCases with 3 rows (two valid, one invalid)
// TODO: for (const data of loginCases) { test(...) }`,
        solution: `import { test, expect } from '@playwright/test';

const loginCases = [
  { email: 'shweta@example.com', password: 'secret', expected: 'Dashboard' },
  { email: 'raj@example.com', password: 'secret', expected: 'Dashboard' },
  { email: 'ghost@example.com', password: 'wrong', expected: 'Invalid credentials' },
];

for (const data of loginCases) {
  test('login: ' + data.email, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(data.email);
    await page.getByLabel('Password').fill(data.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText(data.expected)).toBeVisible();
  });
}`,
        tests: [
          {
            description: "Generates one independent test per dataset row",
            code: `await Promise.allSettled(window.__pending.slice());
var log = window.__mockLog.join(' | ');
var src = window.__USER_CODE__;
var generated = log.split('test("login: ').length - 1;
var ok = src.indexOf('loginCases') !== -1 &&
  src.indexOf('for (const') !== -1 &&
  generated === 3 &&
  log.indexOf('fill("ghost@example.com")') !== -1 &&
  log.indexOf('toHaveText') === -1;
console.log(ok
  ? 'PASS: Three data-driven login tests generated'
  : 'FAIL: generated=' + generated + ' log=' + log);`,
            expected: "PASS: Three data-driven login tests generated",
          },
        ],
      },
    },
    {
      id: "5.4",
      moduleId: "5",
      title: "Debugging with Trace Viewer, UI Mode & Inspector",
      slug: "debugging-with-trace-viewer-ui-mode-and-inspector",
      duration: "30 min",
      description:
        "Capture a trace on failure and replay exactly what happened, step by step.",
      analogy: {
        title: "An Aircraft Black Box",
        description:
          "When a plane has a problem, investigators replay the black box recording instead of guessing. A Playwright trace is that recorder: every action, DOM snapshot, network call and console message is stored so you can rewind to the exact failing step.",
        visual: "🛫",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["Test fails"] --> B["trace.zip captured"]
  B --> C["npx playwright show-trace trace.zip"]
  C --> D["Timeline: actions + DOM snapshots"]
  D --> E["Network + console logs"]
  E --> F["Fix the root cause"]
  style A fill:#DC2626,color:#FFFFFF
  style B fill:#FEF3C7,color:#78350F
  style C fill:#4F46E5,color:#FFFFFF
  style F fill:#10B981,color:#052E16`,
        altText:
          "A failed test produces a trace archive that is replayed in the trace viewer to inspect actions, DOM and network.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Enable traces, screenshots and video for debugging, plus the commands to inspect them.",
        code: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 1,
  use: {
    trace: 'on-first-retry',      // capture a trace when a test is retried
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});

// Inspect results:
//   npx playwright test --ui
//   npx playwright test --debug
//   npx playwright show-trace test-results/<test>/trace.zip
//   npx playwright show-report`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which trace setting records a trace only when a test is retried?",
          options: ["trace: true", "trace: 'on'", "trace: 'on-first-retry'", "trace: 'retain-on-failure'"],
          correctIndices: [2],
          explanation:
            "on-first-retry captures a trace only for the first retry, keeping storage small while still recording flaky failures.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which command opens a recorded trace?",
          options: [
            "npx playwright open trace.zip",
            "npx playwright show-trace trace.zip",
            "npx playwright debug trace.zip",
            "npx playwright report trace.zip",
          ],
          correctIndices: [1],
          explanation:
            "show-trace starts the trace viewer, where you can step through actions, DOM snapshots, network and console logs.",
          type: "single",
        },
        {
          id: "q3",
          question: "What does --debug do?",
          options: [
            "Runs tests headless with verbose logs",
            "Opens the Playwright Inspector and pauses at each step",
            "Generates an HTML report",
            "Retries failing tests",
          ],
          correctIndices: [1],
          explanation:
            "playwright test --debug opens the Inspector, letting you step through actions with the recorder and pick locators live.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Export a Playwright config that retries once, records a trace on the first retry, and captures screenshots only on failure.",
        starterCode: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  // TODO: retries: 1
  use: {
    // TODO: trace + screenshot options
  },
});`,
        solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 1,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});`,
        tests: [
          {
            description: "Config retries and records traces on failure",
            code: `var cfg = exports.default;
var ok = cfg &&
  cfg.retries === 1 &&
  cfg.use &&
  cfg.use.trace === 'on-first-retry' &&
  cfg.use.screenshot === 'only-on-failure';
console.log(ok
  ? 'PASS: Trace and screenshot debugging config is correct'
  : 'FAIL: Config was ' + JSON.stringify(cfg));`,
            expected: "PASS: Trace and screenshot debugging config is correct",
          },
        ],
      },
    },
    {
      id: "5.5",
      moduleId: "5",
      title: "Parallelism, Retries & Test Isolation",
      slug: "parallelism-retries-and-test-isolation",
      duration: "25 min",
      description:
        "Speed up suites with workers while keeping tests independent and deterministic.",
      analogy: {
        title: "Independent Checkout Lanes",
        description:
          "A supermarket with one till creates a long queue; ten staffed lanes move everyone quickly — as long as each shopper has their own basket. Playwright workers are those lanes. Parallelism helps only when every test owns its state (its own context, data and storage), otherwise lanes collide.",
        visual: "🛒",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["Test files"] --> B["Worker 1"]
  A --> C["Worker 2"]
  A --> D["Worker 3"]
  B --> E["Own context + storage"]
  C --> F["Own context + storage"]
  D --> G["Own context + storage"]
  E --> H["Shard 1"]
  F --> I["Shard 2"]
  G --> J["Shard 3"]
  style A fill:#E2E8F0,color:#0F172A
  style B fill:#4F46E5,color:#FFFFFF
  style E fill:#DBEAFE,color:#0F172A
  style H fill:#10B981,color:#052E16`,
        altText:
          "Test files are distributed across workers, each with an isolated browser context, then combined into shards.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Configure parallel workers and retries; use serial mode only when order matters.",
        code: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,   // run tests inside a file in parallel
  workers: 4,            // four browser processes
  retries: 2,            // re-run flaky failures twice
  use: {
    trace: 'on-first-retry',
  },
});

// Only when tests truly depend on each other:
// test.describe.configure({ mode: 'serial' });

// Split a run across machines:
// npx playwright test --shard=1/3`,
      },
      quiz: [
        {
          id: "q1",
          question: "What is a Playwright worker?",
          options: [
            "A single test function",
            "An OS process running tests with its own browser instances",
            "A reporter plugin",
            "A browser tab",
          ],
          correctIndices: [1],
          explanation:
            "Workers are OS processes. Each runs its own browser and can execute test files concurrently, which is how Playwright scales.",
          type: "single",
        },
        {
          id: "q2",
          question: "When should you use test.describe.configure({ mode: 'serial' })?",
          options: [
            "Always, for stability",
            "Only when tests genuinely depend on each other's state",
            "To speed up suites",
            "When using fixtures",
          ],
          correctIndices: [1],
          explanation:
            "Serial mode forces ordered execution and skips subsequent tests after a failure, hiding independent results — use it only for true dependencies.",
          type: "single",
        },
        {
          id: "q3",
          question: "Why does shared state break parallel tests?",
          options: [
            "Workers cannot access the network",
            "Workers run simultaneously, so they can overwrite each other's data",
            "Playwright disables retries in parallel mode",
            "It disables tracing",
          ],
          correctIndices: [1],
          explanation:
            "Parallel workers mutate shared accounts or records at the same time, producing flaky, order-dependent failures. Each test needs its own data.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Export a config with fullyParallel enabled, 4 workers, 2 retries, and traces on the first retry.",
        starterCode: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  // TODO: fullyParallel, workers, retries
  use: {
    // TODO: trace
  },
});`,
        solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  workers: 4,
  retries: 2,
  use: {
    trace: 'on-first-retry',
  },
});`,
        tests: [
          {
            description: "Configures parallel workers and retries",
            code: `var cfg = exports.default;
var ok = cfg &&
  cfg.fullyParallel === true &&
  cfg.workers === 4 &&
  cfg.retries === 2 &&
  cfg.use &&
  cfg.use.trace === 'on-first-retry';
console.log(ok
  ? 'PASS: Parallel workers, retries and tracing configured'
  : 'FAIL: Config was ' + JSON.stringify(cfg));`,
            expected: "PASS: Parallel workers, retries and tracing configured",
          },
        ],
      },
    },
  ],
};
