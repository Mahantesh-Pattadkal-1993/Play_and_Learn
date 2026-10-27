/**
 * Module 7: CI/CD, Reporting & Capstone Project
 * Projects/browsers, environments, reporters, GitHub Actions sharding and a
 * full end-to-end capstone suite.
 */
import { Module } from "./types";

export const module7: Module = {
  id: "7",
  title: "CI/CD, Reporting & Capstone Project",
  icon: "🚀",
  description:
    "Configure browser projects and environments, publish reports, run sharded pipelines in CI, and finish with an end-to-end commerce suite.",
  lessons: [
    {
      id: "7.1",
      moduleId: "7",
      title: "Configuration Deep Dive — Projects & Browsers",
      slug: "configuration-deep-dive-projects-and-browsers",
      duration: "30 min",
      description:
        "Run the same suite across Chromium, Firefox, WebKit and mobile devices with projects.",
      analogy: {
        title: "One Recipe, Several Variants",
        description:
          "A base recipe can be baked gluten-free or vegan by changing a few ingredients. In Playwright, one test suite runs across many browser projects, each with its own device, viewport and options — no duplicated tests.",
        visual: "🍰",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["defineConfig"] --> B["use: baseURL, trace, timeout"]
  A --> C["projects"]
  C --> D["chromium + Desktop Chrome"]
  C --> E["firefox + Desktop Firefox"]
  C --> F["webkit + Desktop Safari"]
  C --> G["mobile + Pixel 5"]
  B --> C
  style A fill:#4F46E5,color:#FFFFFF
  style C fill:#FEF3C7,color:#78350F
  style D fill:#DBEAFE,color:#0F172A
  style G fill:#10B981,color:#052E16`,
        altText:
          "A shared config feeds four browser/device projects, each reusing the same tests.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Configure three desktop browsers plus a mobile device project.",
        code: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'https://shop.example.com',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});

// Run one project:    npx playwright test --project=chromium
// List projects:      npx playwright test --list`,
      },
      quiz: [
        {
          id: "q1",
          question: "What is a Playwright project?",
          options: [
            "A folder of tests",
            "A named configuration of browser/device options that runs the suite",
            "A reporter",
            "A fixture file",
          ],
          correctIndices: [1],
          explanation:
            "A project combines a browser type with options such as devices, viewport and baseURL. The same tests run once per project.",
          type: "single",
        },
        {
          id: "q2",
          question: "How do you run only the chromium project?",
          options: [
            "npx playwright test --browser=chromium",
            "npx playwright test --project=chromium",
            "npx playwright test chromium",
            "npx playwright test --only chromium",
          ],
          correctIndices: [1],
          explanation:
            "--project filters execution to projects whose name matches, useful when iterating locally.",
          type: "single",
        },
        {
          id: "q3",
          question: "Where should shared baseURL live?",
          options: [
            "Inside every test file",
            "In the top-level use block, so all projects inherit it",
            "In package.json",
            "In the HTML reporter",
          ],
          correctIndices: [1],
          explanation:
            "Top-level use options are inherited by all projects and keep tests free of hard-coded URLs.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Export a config with baseURL 'https://shop.example.com', a 30s timeout, trace on first retry, and four projects: chromium, firefox, webkit and mobile-chrome using Pixel 5.",
        starterCode: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // TODO: timeout + use.baseURL + use.trace
  projects: [
    // TODO: chromium, firefox, webkit, mobile-chrome
  ],
});`,
        solution: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  use: {
    baseURL: 'https://shop.example.com',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});`,
        tests: [
          {
            description: "Configures four projects and a shared baseURL",
            code: `var cfg = exports.default;
var names = cfg && cfg.projects ? cfg.projects.map(function (p) { return p.name; }) : [];
var ok = cfg &&
  cfg.use &&
  cfg.use.baseURL === 'https://shop.example.com' &&
  cfg.use.trace === 'on-first-retry' &&
  cfg.timeout === 30000 &&
  names.length === 4 &&
  names.indexOf('chromium') !== -1 &&
  names.indexOf('firefox') !== -1 &&
  names.indexOf('webkit') !== -1 &&
  names.indexOf('mobile-chrome') !== -1;
console.log(ok
  ? 'PASS: Browser and device projects configured'
  : 'FAIL: Projects were ' + JSON.stringify(names));`,
            expected: "PASS: Browser and device projects configured",
          },
        ],
      },
    },
    {
      id: "7.2",
      moduleId: "7",
      title: "Environment Variables & Multi-Environment Runs",
      slug: "environment-variables-and-multi-environment-runs",
      duration: "25 min",
      description:
        "Point the same suite at local, staging or production URLs without editing code.",
      analogy: {
        title: "Switching the Destination Board",
        description:
          "The same train runs to different destinations depending on the board at the platform. Your test suite is the train; BASE_URL is the board. Change the environment variable and the identical suite runs against localhost, staging or production.",
        visual: "🚆",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A[".env.local"] --> D["process.env.BASE_URL"]
  B["CI secret / env var"] --> D
  C["shell export"] --> D
  D --> E["config use.baseURL"]
  E --> F["tests run against target environment"]
  style D fill:#4F46E5,color:#FFFFFF
  style F fill:#10B981,color:#052E16`,
        altText:
          "Environment sources feed BASE_URL, which becomes the config baseURL for the whole suite.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Read BASE_URL with a safe local fallback and fail fast in CI.",
        code: `import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

if (process.env.CI && !process.env.BASE_URL) {
  throw new Error('BASE_URL must be provided in CI');
}

export default defineConfig({
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
});

// Local:    BASE_URL=http://localhost:3000 npx playwright test
// Staging:  BASE_URL=https://staging.shop.example.com npx playwright test
// CI:       set the BASE_URL secret in the pipeline settings`,
      },
      quiz: [
        {
          id: "q1",
          question: "Why avoid hard-coding URLs inside tests?",
          options: [
            "It breaks type checking",
            "The same suite must run against multiple environments",
            "Playwright forbids absolute URLs",
            "It slows tests down",
          ],
          correctIndices: [1],
          explanation:
            "Reading baseURL from configuration lets one suite target local, staging and production without code changes.",
          type: "single",
        },
        {
          id: "q2",
          question: "What should happen in CI when BASE_URL is missing?",
          options: [
            "Silently use localhost",
            "Fail fast with a clear error",
            "Skip all tests",
            "Retry three times",
          ],
          correctIndices: [1],
          explanation:
            "Failing fast surfaces misconfiguration immediately instead of accidentally running against the wrong (or unreachable) host.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Export a config whose baseURL comes from process.env.BASE_URL with a localhost:3000 fallback, and throws in CI when the variable is missing.",
        starterCode: `import { defineConfig } from '@playwright/test';

// TODO: read BASE_URL with fallback and validate in CI

export default defineConfig({
  use: {
    // TODO: baseURL
  },
});`,
        solution: `import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

if (process.env.CI && !process.env.BASE_URL) {
  throw new Error('BASE_URL must be provided in CI');
}

export default defineConfig({
  use: { baseURL },
});`,
        tests: [
          {
            description: "Uses the environment BASE_URL",
            code: `var cfg = exports.default;
var src = window.__USER_CODE__;
var ok = cfg &&
  cfg.use &&
  cfg.use.baseURL === 'https://staging.example.com' &&
  src.indexOf('process.env.BASE_URL') !== -1;
console.log(ok
  ? 'PASS: baseURL resolved from process.env.BASE_URL'
  : 'FAIL: baseURL was ' + (cfg && cfg.use ? cfg.use.baseURL : 'undefined'));`,
            expected: "PASS: baseURL resolved from process.env.BASE_URL",
          },
        ],
      },
    },
    {
      id: "7.3",
      moduleId: "7",
      title: "Built-in & Custom Reporters",
      slug: "built-in-and-custom-reporters",
      duration: "30 min",
      description:
        "Publish results as console output, HTML, JUnit XML and JSON for different audiences.",
      analogy: {
        title: "A School Report Card",
        description:
          "Parents want a readable page, the school app wants structured data, and the district wants a standard file format. One test run can produce all three: the list reporter for the terminal, the HTML report for humans, and JUnit/JSON for machines.",
        visual: "📊",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["Test run"] --> B["list (terminal)"]
  A --> C["html (playwright-report/)"]
  A --> D["junit (results.xml)"]
  A --> E["json (results.json)"]
  A --> F["custom reporter listeners"]
  style A fill:#4F46E5,color:#FFFFFF
  style C fill:#FEF3C7,color:#78350F
  style D fill:#DBEAFE,color:#0F172A
  style F fill:#10B981,color:#052E16`,
        altText:
          "One run feeds list, HTML, JUnit, JSON and custom reporters for different consumers.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Enable multiple reporters and a tiny custom reporter that counts failures.",
        code: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results.xml' }],
    ['json', { outputFile: 'results.json' }],
  ],
});

// reporters/failure-counter.ts
// import type { Reporter } from '@playwright/test/reporter';
// export default class FailureCounter implements Reporter {
//   private failures = 0;
//   onTestEnd(test, result) {
//     if (result.status !== 'passed') this.failures += 1;
//   }
//   onEnd() {
//     console.log('Total failures:', this.failures);
//   }
// }`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which reporter produces the interactive HTML report?",
          options: ["'list'", "'junit'", "'html'", "'json'"],
          correctIndices: [2],
          explanation:
            "The html reporter writes a self-contained report (default playwright-report/) with traces, screenshots and timings.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which reporter is best for CI systems that consume test results as XML?",
          options: ["list", "junit", "html", "dot"],
          correctIndices: [1],
          explanation:
            "The junit reporter writes JUnit XML, which almost every CI dashboard can ingest.",
          type: "single",
        },
        {
          id: "q3",
          question: "Which reporter method receives each finished test?",
          options: ["onTestBegin", "onTestEnd", "onStepEnd", "onExit"],
          correctIndices: [1],
          explanation:
            "onTestEnd(test, result) fires after each test with its status, duration and attachments.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Export a config enabling the list, html (open: 'never'), junit (results.xml) and json (results.json) reporters.",
        starterCode: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    // TODO: list, html, junit, json
  ],
});`,
        solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results.xml' }],
    ['json', { outputFile: 'results.json' }],
  ],
});`,
        tests: [
          {
            description: "Configures four reporters",
            code: `var cfg = exports.default;
var names = cfg && cfg.reporter ? cfg.reporter.map(function (r) {
  return Array.isArray(r) ? r[0] : r;
}) : [];
var ok = names.length === 4 &&
  names.indexOf('list') !== -1 &&
  names.indexOf('html') !== -1 &&
  names.indexOf('junit') !== -1 &&
  names.indexOf('json') !== -1;
console.log(ok
  ? 'PASS: List, HTML, JUnit and JSON reporters configured'
  : 'FAIL: Reporters were ' + JSON.stringify(names));`,
            expected: "PASS: List, HTML, JUnit and JSON reporters configured",
          },
        ],
      },
    },
    {
      id: "7.4",
      moduleId: "7",
      title: "CI Pipeline with GitHub Actions & Sharding",
      slug: "ci-pipeline-with-github-actions-and-sharding",
      duration: "35 min",
      description:
        "Run the suite on every push, split it across machines, and publish reports as artifacts.",
      analogy: {
        title: "A Factory Assembly Line",
        description:
          "A factory does not build one car at a time by hand: it installs tooling, splits work across stations, and publishes the finished product. A CI pipeline installs dependencies and browsers, shards the suite across parallel machines, and uploads the HTML report and traces as artifacts.",
        visual: "🏭",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["push / pull_request"] --> B["checkout + setup-node"]
  B --> C["npm ci"]
  C --> D["npx playwright install --with-deps"]
  D --> E["shard 1/3"]
  D --> F["shard 2/3"]
  D --> G["shard 3/3"]
  E --> H["upload playwright-report artifact"]
  F --> H
  G --> H
  style A fill:#E2E8F0,color:#0F172A
  style E fill:#4F46E5,color:#FFFFFF
  style F fill:#4F46E5,color:#FFFFFF
  style G fill:#4F46E5,color:#FFFFFF
  style H fill:#10B981,color:#052E16`,
        altText:
          "A CI job installs dependencies and browsers, runs three shards in parallel, then uploads the report artifact.",
      },
      codeExample: {
        language: "typescript",
        description:
          "A GitHub Actions workflow definition with a sharded matrix and artifact upload.",
        code: `// .github/workflows/playwright.yml
const workflow = {
  name: 'Playwright Tests',
  on: ['push', 'pull_request'],
  jobs: {
    test: {
      'runs-on': 'ubuntu-latest',
      strategy: {
        failFast: false,
        matrix: { shard: [1, 2, 3] },
      },
      steps: [
        { uses: 'actions/checkout@v4' },
        { uses: 'actions/setup-node@v4', with: { 'node-version': 20 } },
        { run: 'npm ci' },
        { run: 'npx playwright install --with-deps' },
        {
          run: 'npx playwright test --shard=\$SHARD/3',
          env: { SHARD: 'matrix.shard' },
        },
        {
          uses: 'actions/upload-artifact@v4',
          with: { name: 'playwright-report', path: 'playwright-report/' },
        },
      ],
    },
  },
};

export default workflow;`,
      },
      quiz: [
        {
          id: "q1",
          question: "What does --shard=1/3 do?",
          options: [
            "Runs only the first test",
            "Runs one third of the suite, split deterministically, on this machine",
            "Runs tests three times",
            "Repeats flaky tests",
          ],
          correctIndices: [1],
          explanation:
            "Sharding splits the suite into equal, deterministic parts so parallel CI machines can each run a slice.",
          type: "single",
        },
        {
          id: "q2",
          question: "Why call npx playwright install --with-deps in CI?",
          options: [
            "To install npm packages",
            "To install browser binaries and OS dependencies on the runner",
            "To generate the HTML report",
            "To start the app server",
          ],
          correctIndices: [1],
          explanation:
            "CI runners start empty; --with-deps installs the browser binaries plus required Linux libraries. Upload playwright-report/ with upload-artifact to keep the report.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Export a workflow object: triggered on push and pull_request, with a 3-way shard matrix, steps for checkout, setup-node 20, npm ci, playwright install --with-deps, a sharded test run, and an artifact upload of playwright-report.",
        starterCode: `const workflow = {
  name: 'Playwright Tests',
  // TODO: on, jobs.test.strategy.matrix.shard, steps
};

export default workflow;`,
        solution: `const workflow = {
  name: 'Playwright Tests',
  on: ['push', 'pull_request'],
  jobs: {
    test: {
      'runs-on': 'ubuntu-latest',
      strategy: {
        failFast: false,
        matrix: { shard: [1, 2, 3] },
      },
      steps: [
        { uses: 'actions/checkout@v4' },
        { uses: 'actions/setup-node@v4', with: { 'node-version': 20 } },
        { run: 'npm ci' },
        { run: 'npx playwright install --with-deps' },
        {
          run: 'npx playwright test --shard=\$SHARD/3',
          env: { SHARD: 'matrix.shard' },
        },
        {
          uses: 'actions/upload-artifact@v4',
          with: { name: 'playwright-report', path: 'playwright-report/' },
        },
      ],
    },
  },
};

export default workflow;`,
        tests: [
          {
            description: "Workflow shards tests and uploads the report",
            code: `var wf = exports.default;
var job = wf && wf.jobs ? wf.jobs.test : null;
var shards = job && job.strategy && job.strategy.matrix ? job.strategy.matrix.shard : [];
var steps = job && job.steps ? JSON.stringify(job.steps) : '';
var triggers = wf && wf.on ? wf.on : [];
var ok = triggers.indexOf('push') !== -1 &&
  triggers.indexOf('pull_request') !== -1 &&
  shards.length === 3 &&
  steps.indexOf('actions/checkout') !== -1 &&
  steps.indexOf('npm ci') !== -1 &&
  steps.indexOf('playwright install') !== -1 &&
  steps.indexOf('--shard=') !== -1 &&
  steps.indexOf('upload-artifact') !== -1;
console.log(ok
  ? 'PASS: CI workflow shards tests and publishes the report'
  : 'FAIL: Workflow was ' + JSON.stringify(wf));`,
            expected: "PASS: CI workflow shards tests and publishes the report",
          },
        ],
      },
    },
    {
      id: "7.5",
      moduleId: "7",
      title: "Capstone — End-to-End E-Commerce Suite",
      slug: "capstone-end-to-end-ecommerce-suite",
      duration: "45 min",
      description:
        "Combine locators, network mocking, assertions and reporting into one realistic purchase flow.",
      analogy: {
        title: "Directing a Full Orchestra",
        description:
          "A symphony works because every instrument plays its part at the right time. Your capstone suite is the same: page objects hold the locators, fixtures prepare sessions, API helpers create data, route mocking controls the network, and reporters publish the result — in one coordinated flow.",
        visual: "🎻",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["Search product"] --> B["Add to cart"]
  B --> C["Mock payment API"]
  C --> D["Checkout"]
  D --> E["Assert order confirmation"]
  E --> F["Report + trace"]
  style C fill:#4F46E5,color:#FFFFFF
  style E fill:#10B981,color:#052E16
  style F fill:#FEF3C7,color:#78350F`,
        altText:
          "The capstone flow: search, add to cart, mock payment, checkout, assert confirmation, report results.",
      },
      codeExample: {
        language: "typescript",
        description:
          "A complete purchase flow using mocking, a locator chain and a final assertion.",
        code: `import { test, expect } from '@playwright/test';

test('customer can purchase a laptop', async ({ page }) => {
  await page.goto('/shop');

  // Search product
  await page.getByPlaceholder('Search products').fill('laptop');
  await page.getByRole('button', { name: 'Search' }).click();

  // Add the first result to the cart
  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  // Never hit the real payment provider in tests
  await page.route('**/api/payment', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, orderId: 'ORD-1001' }),
    });
  });

  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(
    page.getByRole('heading', { name: 'Order confirmed' }),
  ).toBeVisible();
  await expect(page.getByText('ORD-1001')).toBeVisible();
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "Why mock the payment API in the capstone test?",
          options: [
            "To make the test slower",
            "To keep the test deterministic and avoid charging real cards",
            "Because route() is required",
            "To disable assertions",
          ],
          correctIndices: [1],
          explanation:
            "Mocking removes external dependencies and prevents real side effects, keeping the flow fast and repeatable.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which layer should hold the locators in a mature suite?",
          options: [
            "Inline in every test",
            "In page objects or scoped helper functions",
            "In the CI workflow",
            "In the reporter",
          ],
          correctIndices: [1],
          explanation:
            "Centralising locators in page objects makes UI changes a one-file update instead of a suite-wide refactor.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Implement purchaseFlow(page): open /shop, search for 'laptop', add the first result to the cart, mock '/api/payment' with orderId ORD-1001, click Checkout, and assert the 'Order confirmed' heading is visible.",
        starterCode: `// TODO: search -> add to cart -> mock payment -> checkout -> assert
async function purchaseFlow(page: any) {
  // Your code here
}`,
        solution: `async function purchaseFlow(page: any) {
  await page.goto('/shop');
  await page.getByPlaceholder('Search products').fill('laptop');
  await page.getByRole('button', { name: 'Search' }).click();

  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  await page.route('**/api/payment', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, orderId: 'ORD-1001' }),
    });
  });

  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(
    page.getByRole('heading', { name: 'Order confirmed' }),
  ).toBeVisible();
}`,
        tests: [
          {
            description: "Runs the full purchase flow in order",
            code: `if (typeof purchaseFlow !== 'function') {
  console.log('FAIL: purchaseFlow is not defined');
} else {
  await purchaseFlow(page);
  var log = window.__mockLog.join(' | ');
  var searchIndex = log.indexOf('fill("laptop")');
  var addIndex = log.indexOf('Add to cart');
  var routeIndex = log.indexOf('route("**/api/payment")');
  var checkoutIndex = log.indexOf('Checkout');
  var assertIndex = log.indexOf('toBeVisible');
  var ok = searchIndex !== -1 &&
    addIndex !== -1 &&
    routeIndex !== -1 &&
    checkoutIndex !== -1 &&
    assertIndex !== -1 &&
    searchIndex < addIndex &&
    addIndex < routeIndex &&
    routeIndex < checkoutIndex &&
    checkoutIndex < assertIndex &&
    log.indexOf('ORD-1001') !== -1 &&
    log.indexOf('Order confirmed') !== -1;
  console.log(ok
    ? 'PASS: Full purchase flow completed and confirmed'
    : 'FAIL: Flow order incorrect. Log: ' + log);
}`,
            expected: "PASS: Full purchase flow completed and confirmed",
          },
        ],
      },
    },
  ],
};
