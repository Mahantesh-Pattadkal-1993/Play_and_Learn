/**
 * Module 6: API Testing, Network Mocking & Authentication
 * APIRequestContext, route mocking, response waiting, storageState and
 * multi-role sessions.
 */
import { Module } from "./types";

export const module6: Module = {
  id: "6",
  title: "API Testing, Network Mocking & Authentication",
  icon: "🌐",
  description:
    "Test APIs directly, mock network responses, wait for the right payload, and reuse authenticated sessions across tests.",
  lessons: [
    {
      id: "6.1",
      moduleId: "6",
      title: "API Testing with APIRequestContext",
      slug: "api-testing-with-apirequestcontext",
      duration: "30 min",
      description:
        "Call REST endpoints directly from Playwright, assert status and payload, and reuse created data in UI tests.",
      analogy: {
        title: "Inspecting the Parcel Directly",
        description:
          "Instead of asking the receptionist whether your parcel arrived, you walk to the counter and inspect the parcel yourself. API testing does the same: it checks the server response directly (status, headers, body) instead of driving the UI and guessing what happened behind it.",
        visual: "📦",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["request.post('/api/users')"] --> B["201 Created + JSON body"]
  B --> C["expect(status).toBe(201)"]
  B --> D["const body = await response.json()"]
  D --> E["Reuse body.id in a UI test"]
  style A fill:#4F46E5,color:#FFFFFF
  style B fill:#FEF3C7,color:#78350F
  style C fill:#DBEAFE,color:#0F172A
  style E fill:#10B981,color:#052E16`,
        altText:
          "An API request returns a response whose status and JSON body are asserted, then the created id is reused in the UI.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Create a user through the API, assert the status and payload, then reuse the id.",
        code: `import { test, expect } from '@playwright/test';

test('create user through the API', async ({ request, page }) => {
  const response = await request.post('/api/users', {
    data: { name: 'Shweta', email: 'shweta@example.com' },
    headers: { 'Content-Type': 'application/json' },
  });

  expect(response.status()).toBe(201);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.id).toBeDefined();

  // Reuse the created record in the UI instead of clicking through signup
  await page.goto('/users/' + body.id);
  await expect(page.getByRole('heading', { name: 'Shweta' })).toBeVisible();
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which fixture provides an HTTP client for API testing?",
          options: ["page", "request", "context", "browser"],
          correctIndices: [1],
          explanation:
            "The request fixture is an APIRequestContext that can send HTTP requests without involving a browser page.",
          type: "single",
        },
        {
          id: "q2",
          question: "How do you read a JSON response body?",
          options: [
            "response.body",
            "await response.json()",
            "response.text",
            "await response.data()",
          ],
          correctIndices: [1],
          explanation:
            "response.json() returns a promise resolving to the parsed body. response.text() returns raw text instead.",
          type: "single",
        },
        {
          id: "q3",
          question: "Why create test data through the API instead of the UI?",
          options: [
            "It looks better in reports",
            "It is faster and less brittle than clicking through screens",
            "The UI cannot create data",
            "Playwright requires it",
          ],
          correctIndices: [1],
          explanation:
            "API setup avoids UI flakiness and is much faster, letting UI tests start from a known state.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a function that POSTs a new user to /api/users, asserts the status is 201, reads the JSON body, and returns the new user id.",
        starterCode: `// TODO: POST /api/users, assert 201, return body.id
async function createUser(request: any) {
  // Hint: const response = await request.post('/api/users', { data: { name: 'Shweta' } });
}`,
        solution: `async function createUser(request: any) {
  const response = await request.post('/api/users', {
    data: { name: 'Shweta', email: 'shweta@example.com' },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  return body.id;
}`,
        tests: [
          {
            description: "Creates a user and returns its id",
            code: `if (typeof createUser !== 'function') {
  console.log('FAIL: createUser is not defined');
} else {
  var id = await createUser(request);
  var log = window.__mockLog.join(' | ');
  var src = window.__USER_CODE__;
  var ok = id === 'user_123' &&
    log.indexOf('request.post("/api/users")') !== -1 &&
    src.indexOf('expect(response.status()).toBe(201)') !== -1;
  console.log(ok
    ? 'PASS: API user created, 201 asserted, id returned'
    : 'FAIL: id=' + id + ' log=' + log);
}`,
            expected: "PASS: API user created, 201 asserted, id returned",
          },
        ],
      },
    },
    {
      id: "6.2",
      moduleId: "6",
      title: "Network Interception & Mocking with route.fulfill",
      slug: "network-interception-and-mocking",
      duration: "35 min",
      description:
        "Intercept requests and return deterministic responses so UI tests never depend on a real backend.",
      analogy: {
        title: "Swapping the Letter at the Post Office",
        description:
          "A postal clerk can intercept an envelope and replace its contents before delivery. page.route() intercepts a matching request, and route.fulfill() delivers your own response — perfect for testing loading states, empty results, server errors or edge cases the real backend cannot easily produce.",
        visual: "📬",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["App requests /api/products"] --> B{"page.route matcher"}
  B -->|"match"| C["handler(route)"]
  C -->|"fulfill"| D["Custom JSON response"]
  C -->|"abort"| E["Network error state"]
  C -->|"continue"| F["Real backend"]
  D --> G["UI renders mocked data"]
  style B fill:#4F46E5,color:#FFFFFF
  style D fill:#FEF3C7,color:#78350F
  style G fill:#10B981,color:#052E16`,
        altText:
          "A route matcher intercepts a request and can fulfill it with mock data, abort it, or continue to the real server.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Mock a products endpoint with three fake items and assert the UI renders them.",
        code: `import { test, expect } from '@playwright/test';

const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Phone', price: 800 },
  { id: 3, name: 'Tablet', price: 500 },
];

test('renders mocked products', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(products),
    });
  });

  await page.goto('/products');

  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByText('Laptop')).toBeVisible();

  // Simulate a server error for the same endpoint
  await page.route('**/api/products', (route) =>
    route.fulfill({ status: 500, body: 'Internal error' }),
  );
  await page.reload();
  await expect(page.getByText('Something went wrong')).toBeVisible();
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which method sends a custom response for an intercepted request?",
          options: ["route.continue()", "route.fulfill()", "route.abort()", "route.respond()"],
          correctIndices: [1],
          explanation:
            "route.fulfill() returns a response you define (status, headers, body) without hitting the network.",
          type: "single",
        },
        {
          id: "q2",
          question: "What does page.route('**/api/products', handler) match?",
          options: [
            "Only exact URL /api/products",
            "Any URL ending with /api/products, including query strings",
            "Only POST requests",
            "Every request on the page",
          ],
          correctIndices: [1],
          explanation:
            "The ** wildcard matches any prefix, so the pattern matches the endpoint regardless of host or query string.",
          type: "single",
        },
        {
          id: "q3",
          question: "How do you simulate a network failure for a request?",
          options: [
            "route.fulfill({ status: 404 })",
            "route.abort('failed')",
            "route.continue()",
            "page.close()",
          ],
          correctIndices: [1],
          explanation:
            "route.abort() aborts the request, which lets you test offline or failed-request states. fulfill with 500 tests server-error states instead.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a function that mocks /api/products with three products (Laptop, Phone, Tablet), opens /products, and asserts three list items are rendered.",
        starterCode: `// TODO: route + fulfill + goto + toHaveCount(3)
async function mockProducts(page: any) {
  // Your code here
}`,
        solution: `async function mockProducts(page: any) {
  await page.route('**/api/products', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Laptop' },
        { id: 2, name: 'Phone' },
        { id: 3, name: 'Tablet' },
      ]),
    });
  });

  await page.goto('/products');
  await expect(page.getByRole('listitem')).toHaveCount(3);
}`,
        tests: [
          {
            description: "Mocks the API and asserts the rendered count",
            code: `if (typeof mockProducts !== 'function') {
  console.log('FAIL: mockProducts is not defined');
} else {
  await mockProducts(page);
  var log = window.__mockLog.join(' | ');
  var ok = log.indexOf('route("**/api/products")') !== -1 &&
    log.indexOf('route.fulfill(') !== -1 &&
    log.indexOf('Laptop') !== -1 &&
    log.indexOf('Phone') !== -1 &&
    log.indexOf('Tablet') !== -1 &&
    log.indexOf('toHaveCount') !== -1;
  console.log(ok
    ? 'PASS: Products mocked and count asserted'
    : 'FAIL: Mocking incomplete. Log: ' + log);
}`,
            expected: "PASS: Products mocked and count asserted",
          },
        ],
      },
    },
    {
      id: "6.3",
      moduleId: "6",
      title: "Waiting for Responses & Asserting Payloads",
      slug: "waiting-for-responses-and-asserting-payloads",
      duration: "30 min",
      description:
        "Await the exact network response, assert its payload, and avoid race conditions.",
      analogy: {
        title: "Waiting for the Right Bus Number",
        description:
          "You do not board any bus that arrives — you wait for bus 42. waitForResponse() lets you wait for the specific request/response pair by URL, method or status, then assert the payload. Waiting before triggering the action ensures you never miss the bus.",
        visual: "🚌",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["const promise = waitForResponse(matcher)"] --> B["Trigger UI action"]
  B --> C["Response arrives"]
  C --> D["await promise"]
  D --> E["body = await response.json()"]
  E --> F["expect(body.total).toBe(3)"]
  style A fill:#4F46E5,color:#FFFFFF
  style C fill:#FEF3C7,color:#78350F
  style F fill:#10B981,color:#052E16`,
        altText:
          "Create the response promise first, trigger the UI, await the response, then assert the parsed body.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Wait for a search response and assert its payload before continuing.",
        code: `import { test, expect } from '@playwright/test';

test('search returns matching products', async ({ page }) => {
  await page.goto('/products');

  // 1. Register the waiter BEFORE triggering the request
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/search') && response.status() === 200,
  );

  // 2. Trigger the UI
  await page.getByPlaceholder('Search products').fill('laptop');
  await page.getByRole('button', { name: 'Search' }).click();

  // 3. Await and assert
  const response = await responsePromise;
  const body = await response.json();

  expect(body.query).toBe('laptop');
  expect(body.total).toBeGreaterThan(0);

  await expect(page.getByRole('listitem')).toHaveCount(body.total);
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "When should you create the waitForResponse promise?",
          options: [
            "After clicking the button",
            "Before triggering the action that fires the request",
            "In a beforeEach hook only",
            "After the assertions",
          ],
          correctIndices: [1],
          explanation:
            "If you create the waiter after the action, the response may already have arrived and the promise would never resolve.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which predicate waits for a successful search response?",
          options: [
            "res => res.status() === 200",
            "res => res.url().includes('/api/search') && res.status() === 200",
            "res => res.ok",
            "res => true",
          ],
          correctIndices: [1],
          explanation:
            "Match both URL and status so the test waits for the specific request instead of any response on the page.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a function that registers a waiter for a 200 response from '/api/search', fills the search box with the query, clicks Search, and returns the parsed JSON body.",
        starterCode: `// TODO: waitForResponse before the click, then return the JSON body
async function searchProducts(page: any, query: string) {
  // Your code here
}`,
        solution: `async function searchProducts(page: any, query: string) {
  const responsePromise = page.waitForResponse(
    (response: any) =>
      response.url().includes('/api/search') && response.status() === 200,
  );

  await page.getByPlaceholder('Search products').fill(query);
  await page.getByRole('button', { name: 'Search' }).click();

  const response = await responsePromise;
  return response.json();
}`,
        tests: [
          {
            description: "Waits for the matching response before asserting",
            code: `if (typeof searchProducts !== 'function') {
  console.log('FAIL: searchProducts is not defined');
} else {
  var body = await searchProducts(page, 'laptop');
  var log = window.__mockLog.join(' | ');
  var waitIndex = log.indexOf('waitForResponse(');
  var clickIndex = log.indexOf('click()');
  var ok = body && body.total === 3 &&
    waitIndex !== -1 &&
    clickIndex !== -1 &&
    waitIndex < clickIndex &&
    window.__USER_CODE__.indexOf('/api/search') !== -1;
  console.log(ok
    ? 'PASS: Response awaited before the action and payload asserted'
    : 'FAIL: wait=' + waitIndex + ' click=' + clickIndex + ' body=' + JSON.stringify(body));
}`,
            expected: "PASS: Response awaited before the action and payload asserted",
          },
        ],
      },
    },
    {
      id: "6.4",
      moduleId: "6",
      title: "Authentication with storageState",
      slug: "authentication-with-storagestate",
      duration: "35 min",
      description:
        "Log in once in a global setup, save the session, and start every test already authenticated.",
      analogy: {
        title: "A Fast-Pass Wristband",
        description:
          "At a theme park you show your ticket once at the gate and receive a wristband; every ride after that just checks the wristband. Authenticating once and saving storageState works the same way — each test reuses the saved cookies and localStorage instead of repeating the login flow.",
        visual: "🎟️",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["globalSetup"] --> B["page.goto('/login')"]
  B --> C["fill + click Sign in"]
  C --> D["context.storageState({ path: 'auth/user.json' })"]
  D --> E["config use.storageState"]
  E --> F["Every test starts logged in"]
  style A fill:#E2E8F0,color:#0F172A
  style C fill:#4F46E5,color:#FFFFFF
  style D fill:#FEF3C7,color:#78350F
  style F fill:#10B981,color:#052E16`,
        altText:
          "Global setup logs in once, saves storage state to a file, and the config reuses it for every test.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Create a global setup file and reference it from the config.",
        code: `// auth.setup.ts
import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.context().storageState({ path: 'auth/user.json' });
});

// playwright.config.ts
// export default defineConfig({
//   use: { storageState: 'auth/user.json' },
// });`,
      },
      quiz: [
        {
          id: "q1",
          question: "What does storageState save?",
          options: [
            "Only screenshots",
            "Cookies and localStorage origins for the browser context",
            "The test source code",
            "The HTML report",
          ],
          correctIndices: [1],
          explanation:
            "storageState serialises cookies plus localStorage per origin, which is exactly what most apps use to represent a session.",
          type: "single",
        },
        {
          id: "q2",
          question: "Where do you point Playwright at the saved session?",
          options: [
            "use: { session: 'auth/user.json' }",
            "use: { storageState: 'auth/user.json' }",
            "projects: ['auth/user.json']",
            "globalSetup: 'auth/user.json'",
          ],
          correctIndices: [1],
          explanation:
            "Set use.storageState to the JSON file so each test's browser context starts with those cookies/localStorage values.",
          type: "single",
        },
        {
          id: "q3",
          question: "Why wait for the dashboard URL before saving storageState?",
          options: [
            "It makes the file smaller",
            "The session cookies are only fully set after login completes",
            "Playwright requires a URL change",
            "It disables tracing",
          ],
          correctIndices: [1],
          explanation:
            "Saving too early can capture a pre-login state. Waiting for the post-login page guarantees the session is established.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a globalSetup function that logs in with qa@example.com / secret, waits for the dashboard URL, and saves the session to 'auth/user.json'.",
        starterCode: `// TODO: login, waitForURL('**/dashboard'), storageState
async function globalSetup() {
  // Hint: use browser.newContext() and context.newPage()
}`,
        solution: `async function globalSetup() {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('/login');
  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/dashboard');
  await context.storageState({ path: 'auth/user.json' });
  await context.close();
}`,
        tests: [
          {
            description: "Saves an authenticated storage state",
            code: `if (typeof globalSetup !== 'function') {
  console.log('FAIL: globalSetup is not defined');
} else {
  await globalSetup();
  var log = window.__mockLog.join(' | ');
  var src = window.__USER_CODE__;
  var ok = log.indexOf('goto("/login")') !== -1 &&
    log.indexOf('fill("qa@example.com")') !== -1 &&
    log.indexOf('waitForURL') !== -1 &&
    log.indexOf('storageState') !== -1 &&
    log.indexOf('auth/user.json') !== -1 &&
    src.indexOf('storageState') !== -1;
  console.log(ok
    ? 'PASS: Session captured to auth/user.json'
    : 'FAIL: Missing step. Log: ' + log);
}`,
            expected: "PASS: Session captured to auth/user.json",
          },
        ],
      },
    },
    {
      id: "6.5",
      moduleId: "6",
      title: "Session Injection, Multi-Role & Token Handling",
      slug: "session-injection-multi-role-and-tokens",
      duration: "30 min",
      description:
        "Test different permission levels by injecting sessions and tokens instead of logging in through the UI.",
      analogy: {
        title: "Different ID Badges",
        description:
          "Visitor, staff and admin badges all open the same building but unlock different doors. Multi-role testing gives each test the right badge (session or token) so you can verify what each role can and cannot do — without repeatedly walking through reception.",
        visual: "🪪",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["admin auth state"] --> B["adminPage fixture"]
  C["viewer auth state"] --> D["viewerPage fixture"]
  E["localStorage token"] --> F["context.addInitScript"]
  F --> G["page loads already signed in"]
  B --> H["Admin sees Delete"]
  D --> I["Viewer cannot see Delete"]
  style B fill:#4F46E5,color:#FFFFFF
  style D fill:#DBEAFE,color:#0F172A
  style F fill:#FEF3C7,color:#78350F
  style H fill:#10B981,color:#052E16
  style I fill:#10B981,color:#052E16`,
        altText:
          "Separate role fixtures built from different storage states, plus token injection via addInitScript.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Inject an auth token before page scripts run and verify role-based visibility.",
        code: `import { test as base, expect } from '@playwright/test';

const test = base.extend({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/admin.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  viewerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth/viewer.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

test('role based permissions', async ({ adminPage, viewerPage }) => {
  await adminPage.goto('/admin/users');
  await expect(adminPage.getByRole('button', { name: 'Delete' })).toBeVisible();

  await viewerPage.goto('/admin/users');
  await expect(viewerPage.getByRole('button', { name: 'Delete' })).toBeHidden();
});

// Inject a token before any app code runs:
// await context.addInitScript((token) => {
//   window.localStorage.setItem('auth_token', token);
// }, process.env.API_TOKEN);`,
      },
      quiz: [
        {
          id: "q1",
          question: "When does context.addInitScript run?",
          options: [
            "After the page load event",
            "Before any page script executes, on every navigation",
            "Only once per worker",
            "After each test",
          ],
          correctIndices: [1],
          explanation:
            "addInitScript evaluates before the page's own scripts, so localStorage or window globals are ready for the app on first load.",
          type: "single",
        },
        {
          id: "q2",
          question: "How do you test a viewer cannot see admin controls?",
          options: [
            "Delete the button in the DOM",
            "Assert the control is hidden for the viewer's session",
            "Skip the test",
            "Use waitForTimeout and hope",
          ],
          correctIndices: [1],
          explanation:
            "Role tests should assert both positive (admin sees it) and negative (viewer does not) visibility, using the appropriate session.",
          type: "single",
        },
        {
          id: "q3",
          question: "Why build role fixtures instead of logging in inside each test?",
          options: [
            "Fixtures are required by Playwright",
            "It removes repeated UI login and keeps each role's context isolated",
            "It disables tracing",
            "It runs tests serially",
          ],
          correctIndices: [1],
          explanation:
            "Fixtures give each test a clean, pre-authenticated context, which is faster and prevents session bleed between roles.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write loginAs(page, role) that logs in as <role>@example.com and asserts the Delete button is visible for 'admin' and hidden otherwise.",
        starterCode: `// TODO: login, then assert role-based visibility
async function loginAs(page: any, role: string) {
  // Your code here
}`,
        solution: `async function loginAs(page: any, role: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(role + '@example.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();

  if (role === 'admin') {
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  } else {
    await expect(page.getByRole('button', { name: 'Delete' })).toBeHidden();
  }
}`,
        tests: [
          {
            description: "Verifies admin and viewer permissions",
            code: `if (typeof loginAs !== 'function') {
  console.log('FAIL: loginAs is not defined');
} else {
  await loginAs(page, 'admin');
  await loginAs(page, 'viewer');
  var log = window.__mockLog.join(' | ');
  var ok = log.indexOf('fill("admin@example.com")') !== -1 &&
    log.indexOf('fill("viewer@example.com")') !== -1 &&
    log.indexOf('toBeVisible') !== -1 &&
    log.indexOf('toBeHidden') !== -1;
  console.log(ok
    ? 'PASS: Admin and viewer permissions verified'
    : 'FAIL: Role assertions missing. Log: ' + log);
}`,
            expected: "PASS: Admin and viewer permissions verified",
          },
        ],
      },
    },
  ],
};
