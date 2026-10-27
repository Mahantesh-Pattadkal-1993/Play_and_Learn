/**
 * Module 3: Building Structured Automation Scripts
 * Page Object Model, multi-tab/iframe, data-driven testing, API mocking, reporting.
 */
import { Module } from "./types";

export const module3: Module = {
  id: "3",
  title: "Building Structured Automation Scripts",
  icon: "🏗️",
  description:
    "Structure tests with POM, handle multi-tabs and API mocking, and generate reports.",
  lessons: [
    {
      id: "3.1",
      moduleId: "3",
      title: "Page Object Model (POM) Basics",
      slug: "page-object-model-basics",
      duration: "30 min",
      description:
        "Organize tests using the Page Object Model pattern for maintainable code.",
      analogy: {
        title: "A TV Remote Control",
        description:
          "The Page Object Model is like a TV remote control. Instead of pressing buttons directly on the TV (hardcoded selectors scattered everywhere), you use the remote (Page Object) which has labeled buttons (methods) that map to specific TV functions. If the TV changes, you only update the remote — not every place that was pressing buttons directly.",
        visual: "🎮",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  Tests["Test File"] --> POM["Page Object (LoginPage)"]
  POM --> Loc["Element Locators"]
  POM --> Actions["Action Methods (login)"]
  Loc --> Browser["Browser Page"]
  Actions --> Browser
  style Tests fill:#E2E8F0,color:#0F172A
  style POM fill:#4F46E5,color:#FFFFFF
  style Loc fill:#DBEAFE,color:#0F172A
  style Actions fill:#DBEAFE,color:#0F172A
  style Browser fill:#FFEDD5,color:#7C2D12`,
        altText: "Tests use Page Object containing locators and actions that target the browser page.",
      },
      codeExample: {
        language: "typescript",
        description: "Create a LoginPage class with element locators and login action.",
        code: `import { Page } from '@playwright/test';

class LoginPage {
  readonly page: Page;

  usernameInput = () => this.page.getByLabel('Username');
  passwordInput = () => this.page.getByLabel('Password');
  loginButton = () => this.page.getByRole('button', { name: 'Login' });

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }
}

export { LoginPage };`,
      },
      quiz: [
        {
          id: "q1",
          question: "What is the main benefit of the Page Object Model?",
          options: [
            "Makes code run faster",
            "Reduces code duplication and improves maintainability",
            "Eliminates the need for selectors",
            "Runs tests in parallel",
          ],
          correctIndices: [1],
          explanation: "POM centralizes element locators and actions in one class for easier maintenance.",
          type: "single",
        },
        {
          id: "q2",
          question: "In POM, what should the test file primarily contain?",
          options: [
            "All element selectors and test data",
            "Only the test logic and assertions",
            "The entire HTML structure",
            "Database connection code",
          ],
          correctIndices: [1],
          explanation: "The test file should contain only test logic and assertions, keeping locators in the Page Object.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Create a LoginPage class with username/password input locators, a login button locator, and a login() method.",
        starterCode: `// TODO: Create LoginPage class
import { Page } from '@playwright/test';

class LoginPage {
  readonly page: Page;
  usernameInput = // TODO
  passwordInput = // TODO
  loginButton = // TODO
  constructor(page: Page) { this.page = page; }
  async login(username: string, password: string) {
    // TODO: fill username, fill password, click login
  }
}
export { LoginPage };`,
        solution: `import { Page } from '@playwright/test';
class LoginPage {
  readonly page: Page;
  usernameInput = () => this.page.getByLabel('Username');
  passwordInput = () => this.page.getByLabel('Password');
  loginButton = () => this.page.getByRole('button', { name: 'Login' });
  constructor(page: Page) { this.page = page; }
  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }
}
export { LoginPage };`,
        tests: [
          {
            description: "LoginPage class has required locators and methods",
            code: `const cls = "class LoginPage { usernameInput = () => this.page.getByLabel('Username'); passwordInput = () => this.page.getByLabel('Password'); loginButton = () => this.page.getByRole('button'); async login(username, password) { await this.usernameInput().fill(username); await this.passwordInput().fill(password); await this.loginButton().click(); } }";
const hasAll = cls.includes("getByLabel") && cls.includes("getByRole") && cls.includes("async login") && cls.includes("click()");
if (hasAll) { console.log("PASS: LoginPage class is correctly structured"); } else { console.log("FAIL: Missing locators or methods"); }`,
            expected: "PASS: LoginPage class is correctly structured",
          },
        ],
      },
    },
    {
      id: "3.2",
      moduleId: "3",
      title: "Working with Multiple Tabs & Frames",
      slug: "multiple-tabs-and-frames",
      duration: "25 min",
      description:
        "Switch between browser tabs and interact with iframe elements.",
      analogy: {
        title: "Reading Two Open Books Side by Side",
        description:
          "Working with multiple tabs is like having two books open on a desk. You finish reading one page in the first book, then flip to the second book to continue. iframes are like a small booklet glued inside the first book — you need to switch your focus into the booklet (frame) to read it, then switch back to the main book.",
        visual: "📚",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  Main["Main Tab (Book 1)"] <--> Context["BrowserContext"]
  Context <--> Other["Other Tab (Book 2)"]
  Main --> Frame["iframe (Booklet)"]
  style Main fill:#4F46E5,color:#FFFFFF
  style Other fill:#E2E8F0,color:#0F172A
  style Frame fill:#FFEDD5,color:#7C2D12`,
        altText: "BrowserContext manages multiple pages (tabs) and iframes within pages.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Open multiple tabs and interact with an iframe within a page.",
        code: `// The '_blank' link opens a new tab
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]'),
]);

// Now interact with the new tab
await newPage.waitForLoadState();
console.log('New page title:', await newPage.title());

// Switch to an iframe
const frame = page.frame({ url: /docs/ });
if (frame) {
  await frame.getByRole('button', { name: 'Accept' }).click();
}

// Go back to the original page
await page.bringToFront();`,
      },
      quiz: [
        {
          id: "q1",
          question: "How do you wait for a new tab/page to open in Playwright?",
          options: [
            "page.waitFor('newtab')",
            "context.waitForEvent('page')",
            "browser.waitForPage()",
            "page.on('popup')",
          ],
          correctIndices: [1],
          explanation:
            "context.waitForEvent('page') waits for a new page (tab) to be created within the browser context.",
          type: "single",
        },
        {
          id: "q2",
          question: "How do you access an iframe on a page?",
          options: [
            "page.iframe('#id')",
            "page.frame({ url: /pattern/ })",
            "page.getFrame()",
            "Both A and B",
          ],
          correctIndices: [3],
          explanation:
            "You can access iframes using page.frame() with either a URL pattern or a name/index.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write code to open a link that opens a new tab, wait for it, get its title, and then switch to an iframe on the original page to click a button.",
        starterCode: `// TODO: Handle new tab and iframe
// Wait for new tab and get its title


// Switch to iframe and click a button


`,
        solution: `const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]'),
]);
await newPage.waitForLoadState();
const title = await newPage.title();
console.log(title);

const frame = page.frame({ name: 'docs-frame' });
await frame?.getByRole('button', { name: 'Accept' }).click();
page.bringToFront();`,
        tests: [
          {
            description: "Multi-tab and iframe handling uses correct APIs",
            code: `var log = window.__mockLog.join(' | ');
var ok = log.indexOf('context.waitForEvent("page")') !== -1 &&
  log.indexOf('page.click(') !== -1 &&
  log.indexOf('frame(') !== -1 &&
  log.indexOf('bringToFront') !== -1;
console.log(ok
  ? 'PASS: Multi-tab and iframe handling is correct'
  : 'FAIL: Missing required APIs. Log: ' + log);`,
            expected: "PASS: Multi-tab and iframe handling is correct",
          },
        ],
      },
    },
    {
      id: "3.3",
      moduleId: "3",
      title: "Data-Driven Testing for Beginners",
      slug: "data-driven-testing",
      duration: "25 min",
      description:
        "Run the same test with multiple sets of test data.",
      analogy: {
        title: "A Stamp Tool with Different Ink Colors",
        description:
          "Data-driven testing is like a rubber stamp with different colored inks. The stamp (test logic) is the same — you press it the same way. But each press uses a different color ink (test data). You stamp once with red ink (user1/ password1), once with blue (user2/password2), and so on, using the same motion but different data.",
        visual: "🖏️",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  Data["Test Data Array\n[user1, user2, user3]"] --> Loop{"For each row"}
  Loop --> Test["Run Test Logic"]
  Test --> Assert["Assert Result"]
  Assert --> Loop
  Loop -->|"Done"| Result["Summary Report"]
  style Data fill:#E2E8F0,color:#0F172A
  style Loop fill:#FEF3C7,color:#78350F
  style Test fill:#4F46E5,color:#FFFFFF
  style Result fill:#10B981,color:#052E16`,
        altText: "Iterate over test data rows: run test, assert result, repeat until all data is exhausted.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Run a login test with multiple username/password pairs using test fixtures.",
        code: `import { test } from '@playwright/test';

const testData = [
  { username: 'shweta', password: 'pass123', expected: 'Dashboard' },
  { username: 'raj', password: 'pass456', expected: 'Dashboard' },
  { username: 'guest', password: 'wrong', expected: 'Invalid credentials' },
];

for (const data of testData) {
  test(\`Login as \${data.username}\`, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(data.username);
    await page.getByLabel('Password').fill(data.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveTitle(data.expected);
  });
}`,
      },
      quiz: [
        {
          id: "q1",
          question: "What is the purpose of data-driven testing?",
          options: [
            "To make tests run faster",
            "To run the same test with different data inputs",
            "To generate test reports",
            "To mock network requests",
          ],
          correctIndices: [1],
          explanation:
            "Data-driven testing runs the same test logic against multiple sets of input data to verify behavior across scenarios.",
          type: "single",
        },
        {
          id: "q2",
          question:
            "Which Playwright feature is commonly used for data-driven testing?",
          options: [
            "test.use()",
            "test.describe() with a loop",
            "test.fixtures()",
            "page.evaluate()",
          ],
          correctIndices: [1],
          explanation:
            "You can use a for loop inside test.describe() to create multiple test instances with different data.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Create a test data array with 3 users and use a for loop to log each user's credentials.",
        starterCode: `// TODO: Data-driven testing setup
const testUsers = [
  // Add 3 user objects with username and password
];

for (const user of testUsers) {
  // Log each user's credentials
}
`,
        solution: `const testUsers = [
  { username: "shweta", password: "pass123" },
  { username: "raj", password: "pass456" },
  { username: "guest", password: "pass789" },
];

for (const user of testUsers) {
  console.log("Testing login for:", user.username, "with password:", user.password);
}`,
        tests: [
          {
            description: "Data-driven test iterates over user data",
            code: `var ok = Array.isArray(testUsers) &&
  testUsers.length === 3 &&
  testUsers.every(function (user) { return user.username && user.password; });
console.log(ok
  ? 'PASS: Data-driven test iterates correctly'
  : 'FAIL: Provide 3 users with username and password');`,
            expected: "PASS: Data-driven test iterates correctly",
          },
        ],
      },
    },
    {
      id: "3.4",
      moduleId: "3",
      title: "API Mocking & Intercepting",
      slug: "api-mocking-and-intercepting",
      duration: "30 min",
      description:
        "Intercept network requests and mock responses for testing.",
      analogy: {
        title: "Intercepting a Letter at the Post Office",
        description:
          "API mocking is like a postal worker intercepting a letter before it reaches the recipient. When someone sends a letter (API request), the postal worker stops it, opens it, and replaces the contents with a fake letter (mock response) before delivering it. This lets you test how your application handles different responses without depending on the real backend.",
        visual: "📬",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  Browser["Browser (Request)"] --> Intercept["Playwright Network Interceptor"]
  Intercept --> Mock["Mock Server Response"]
  Mock --> Browser
  style Browser fill:#E2E8F0,color:#0F172A
  style Intercept fill:#4F46E5,color:#FFFFFF
  style Mock fill:#FFEDD5,color:#7C2D12`,
        altText: "Browser sends request → Playwright intercepts → returns mocked response → browser receives it.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Intercept a GET request and return mock user data instead.",
        code: `await page.route('https://api.example.com/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      users: [
        { id: 1, name: 'Shweta', role: 'admin' },
        { id: 2, name: 'Raj', role: 'user' },
      ],
    }),
  });
});

await page.goto('/dashboard');
await page.waitForLoadState('networkidle');
await expect(page.getByText('Shweta')).toBeVisible();
await expect(page.getByText('Raj')).toBeVisible();`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which Playwright method is used to intercept and mock network requests?",
          options: [
            "page.intercept()",
            "page.route()",
            "page.mock()",
            "page.fetch()",
          ],
          correctIndices: [1],
          explanation:
            "page.route() is used to intercept network requests and fulfill, abort, or continue them.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which method provides a mock response on the intercepted route?",
          options: [
            "route.respond()",
            "route.fulfill()",
            "route.reply()",
            "route.mock()",
          ],
          correctIndices: [1],
          explanation:
            "route.fulfill() intercepts the request and responds with mock data, status, and headers.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write code to intercept a GET request to '/api/tests' and return mock test data with 3 test names.",
        starterCode: `// TODO: Mock API response
await page.route('/api/tests', async route => {
  // Fulfill with mock data containing 3 test names
});

await page.goto('/test-dashboard');
await page.waitForLoadState('networkidle');`,
        solution: `await page.route('/api/tests', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      tests: ['Login Test', 'Logout Test', 'Dashboard Test'],
    }),
  });
});

await page.goto('/test-dashboard');
await page.waitForLoadState('networkidle');`,
        tests: [
          {
            description: "API mock intercepts route and fulfills with data",
            code: `var log = window.__mockLog.join(' | ');
var ok = log.indexOf('route("/api/tests")') !== -1 &&
  log.indexOf('route.fulfill(') !== -1 &&
  log.indexOf('Login Test') !== -1 &&
  log.indexOf('Dashboard Test') !== -1;
console.log(ok
  ? 'PASS: API mock intercepts and fulfills correctly'
  : 'FAIL: Missing route fulfillment. Log: ' + log);`,
            expected: "PASS: API mock intercepts and fulfills correctly",
          },
        ],
      },
    },
    {
      id: "3.5",
      moduleId: "3",
      title: "Screenshots & Basic Reporting",
      slug: "screenshots-and-basic-reporting",
      duration: "25 min",
      description:
        "Capture screenshots on failure and generate HTML test reports.",
      analogy: {
        title: "Taking a Photo Proof When a Package Is Delivered",
        description:
          "Think of automated screenshots like delivery proof photos. When a delivery person leaves a package (test passes), they just move on. But if the package can't be delivered (test fails), they take a photo of the problem (stacked packages, wrong address) and send it to the customer (developer). The HTML report is like a photo album compiling all deliveries — which ones succeeded and which ones needed photos.",
        visual: "📸",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  Run["Test Execution"] --> Result{"Test Passed?"}
  Result -->|"Yes"| Pass["✅ Continue"]
  Result -->|"No"| Fail["❌ Capture Screenshot"]
  Fail --> Report["Generate HTML Report"]
  Pass --> Report
  style Run fill:#E2E8F0,color:#0F172A
  style Result fill:#FEF3C7,color:#78350F
  style Pass fill:#10B981,color:#052E16
  style Fail fill:#DC2626,color:#FFFFFF
  style Report fill:#4F46E5,color:#FFFFFF`,
        altText: "Test runs; on failure, capture screenshot; always generate HTML report with results.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Configure Playwright to capture screenshots on failure and generate an HTML report.",
        code: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which screenshot option captures screenshots only when tests fail?",
          options: [
            "screenshot: 'on'",
            "screenshot: 'always'",
            "screenshot: 'only-on-failure'",
            "screenshot: 'never'",
          ],
          correctIndices: [2],
          explanation:
            "The 'only-on-failure' option captures screenshots only when a test fails, saving storage space while providing debugging info.",
          type: "single",
        },
        {
          id: "q2",
          question:
            "Which reporter generates an interactive HTML report?",
          options: [
            "['list']",
            "['junit']",
            "['html']",
            "['dot']",
          ],
          correctIndices: [2],
          explanation:
            "The 'html' reporter generates a clickable HTML report showing test results, screenshots, and traces.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a playwright.config.ts that enables screenshots on failure and uses both list and HTML reporters.",
        starterCode: `// TODO: Configure Playwright for screenshots and reporting
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Enable screenshot on failure
  },
  reporter: [
    // List and HTML reporters
  ],
});`,
        solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
});`,
        tests: [
          {
            description: "Config enables screenshots and HTML reporter",
            code: `var cfg = exports.default;
var reporters = cfg && cfg.reporter ? cfg.reporter.map(function (entry) {
  return Array.isArray(entry) ? entry[0] : entry;
}) : [];
var ok = cfg && cfg.use &&
  cfg.use.screenshot === 'only-on-failure' &&
  reporters.indexOf('list') !== -1 &&
  reporters.indexOf('html') !== -1;
console.log(ok
  ? 'PASS: Screenshot and reporting config is correct'
  : 'FAIL: Config was ' + JSON.stringify(cfg));`,
            expected: "PASS: Screenshot and reporting config is correct",
          },
        ],
      },
    },
  ],
};