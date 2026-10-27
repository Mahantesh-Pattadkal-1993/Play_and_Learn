import type { CodeAnnotation } from "@/components/CodeBlock";

/**
 * Extra teaching content per lesson.
 *
 * - `concept` explains what the topic actually is (shown before the analogy).
 * - `codeExplanation` explains how the sample code demonstrates the topic.
 * - `annotations` injects short `//` comments above matching code lines so the
 *   highlighted example documents itself.
 */
export interface LessonNotes {
  concept: string;
  codeExplanation: string;
  annotations: CodeAnnotation[];
}

export const LESSON_NOTES: Record<string, LessonNotes> = {
  "1.1": {
    concept:
      "TypeScript is a superset of JavaScript: every valid JavaScript program is also valid TypeScript, but TypeScript adds a static type system that is checked before the code runs. You annotate variables, parameters and return values with types such as string, number and boolean, and the compiler rejects assignments that break those contracts. In test automation this catches mistakes like passing a number where an email string is expected — long before Playwright ever opens a browser.",
    codeExplanation:
      "Three variables are declared with explicit annotations and then logged. The ': string', ': number' and ': boolean' suffixes are the contract; the console output proves each value satisfies its declared type.",
    annotations: [
      { match: "const username: string", comment: "The annotation after ':' locks this variable to text." },
      { match: "const age: number", comment: "number covers integers and decimals." },
      { match: "const isBeginner: boolean", comment: "boolean accepts only true or false." },
      { match: 'console.log("Name:"', comment: "The compiler already verified these values before this line runs." },
    ],
  },
  "1.2": {
    concept:
      "Functions are reusable blocks that accept inputs (parameters), run logic, and return a result. TypeScript goes further by declaring the type of every parameter and the return type, so callers know exactly what goes in and what comes out, and editors can autocomplete safely. Most test helpers — formatting a result, generating test data, building a selector — are small typed functions like this.",
    codeExplanation:
      "formatTestData takes a name and a boolean, turns the boolean into a PASS/FAIL label, and returns one formatted string. The declared return type ': string' guarantees every branch returns text.",
    annotations: [
      { match: "function formatTestData(name: string", comment: "Parameters are typed: name is text, passed is true/false." },
      { match: "const status = passed ?", comment: "The ternary turns the boolean input into a readable label." },
      { match: "return `Test", comment: "Returning a value keeps the helper reusable in logs and reports." },
    ],
  },
  "1.3": {
    concept:
      "A Promise represents a value that will exist later — a network call, a file read, or a browser action. async marks a function as Promise-returning, and await pauses that function until the Promise settles without blocking the rest of the program. Playwright's entire API is Promise-based, so nearly every automation step you write relies on async/await.",
    codeExplanation:
      "fetchTestStatus wraps a delayed result inside a Promise. runAllTests awaits each call in order, so the final log only prints after both statuses have resolved.",
    annotations: [
      { match: "async function fetchTestStatus", comment: "async guarantees this function always returns a Promise<string>." },
      { match: "return new Promise", comment: "resolve() delivers the value once the timer finishes." },
      { match: "const result1 = await", comment: "await suspends runAllTests until this Promise resolves." },
      { match: "All tests finished", comment: "Because of await, this line runs last — the order is deterministic." },
    ],
  },
  "1.4": {
    concept:
      "Interfaces describe the shape of an object: which properties exist and what type each one has. An array typed as TestUser[] then guarantees that every element provides exactly those fields. This is how test data stays consistent — a missing email or a misspelled field becomes a compile error instead of a runtime surprise.",
    codeExplanation:
      "The TestUser interface defines four required fields. The users array is typed with it, so each element is validated, and getUsernames maps over typed objects to return a string[].",
    annotations: [
      { match: "interface TestUser", comment: "An interface is a reusable contract for object shape." },
      { match: "const users: TestUser[]", comment: "Every array element must provide all four interface fields." },
      { match: "return users.map", comment: "TypeScript infers the callback parameter as TestUser." },
    ],
  },
  "1.5": {
    concept:
      "Control flow decides which code runs (if/else, switch) and loops repeat work over collections. In testing this is how you count passed and failed assertions, skip steps conditionally, or iterate over test data. TypeScript keeps the conditions type-safe: inside the loop, result.passed is known to be a boolean.",
    codeExplanation:
      "The loop visits three results, the if/else prints a PASS or FAIL message for each one, and the final line reports how many results were checked.",
    annotations: [
      { match: "for (const result of testResults)", comment: "for...of visits each object without manual indexes." },
      { match: "if (result.passed)", comment: "Branch on the boolean field to choose the message." },
      { match: "testResults.length", comment: "Array length gives the total number of iterations." },
    ],
  },
  "2.1": {
    concept:
      "Playwright is a browser automation library. Its runner launches a browser engine, creates an isolated browser context (a fresh profile with its own cookies and storage), and opens pages that you can drive with a Promise-based API. Every Playwright test ultimately builds on this sequence: launch → context → page → navigate.",
    codeExplanation:
      "The async IIFE launches Chromium, creates a context and a page, navigates to example.com, logs the page title, and closes the browser.",
    annotations: [
      { match: "import { chromium }", comment: "chromium is the browser engine Playwright will drive." },
      { match: "chromium.launch", comment: "Launch starts the browser process; headless: false shows the window." },
      { match: "browser.newContext()", comment: "A context is an isolated session with its own cookies and storage." },
      { match: "context.newPage()", comment: "The page is the tab you navigate and interact with." },
      { match: "page.goto(", comment: "goto waits for the navigation to finish." },
    ],
  },
  "2.2": {
    concept:
      "Locators are queries that describe how to find an element, and they are lazy: nothing is searched until an action or assertion runs. Playwright encourages user-facing locators — role, accessible name, label and text — because they mirror how a real person identifies elements and survive DOM refactors far better than CSS or XPath.",
    codeExplanation:
      "Three locators target a button by role and name, an input by its label, and a heading by its visible text. The final two lines act on those locators, and Playwright resolves them at that moment.",
    annotations: [
      { match: "page.getByRole('button'", comment: "Role + accessible name is the most user-like locator." },
      { match: "page.getByLabel", comment: "Matches the label associated with a form field." },
      { match: "page.getByText", comment: "Matches visible text on the page." },
      { match: "await emailInput.fill", comment: "The locator is resolved here, not when it was declared." },
    ],
  },
  "2.3": {
    concept:
      "Once you can find an element you can act on it: fill() sets an input value, click() presses buttons, check() toggles checkboxes, and selectOption() chooses dropdown values. Before each action Playwright waits for the element to be actionable, so most explicit waits become unnecessary.",
    codeExplanation:
      "The script fills username and password, checks 'Remember me', clicks Login, and then demonstrates chaining fill() and click() on a single locator.",
    annotations: [
      { match: "getByLabel('Username').fill", comment: "fill() writes the whole value in one step." },
      { match: "Remember me", comment: "check() guarantees the checkbox ends up selected." },
      { match: "name: 'Login' }).click", comment: "click() waits for the button to be visible and enabled." },
    ],
  },
  "2.4": {
    concept:
      "Playwright auto-waits before every action: an element must be attached, visible, stable, enabled and able to receive events. Assertions are web-first too — expect(locator) retries the check until it passes or the timeout expires. Together these remove arbitrary sleeps and make tests far less flaky.",
    codeExplanation:
      "After filling the username, three assertions verify the input's value, the login button's visibility, and its enabled state, each retried automatically until it passes.",
    annotations: [
      { match: "getByLabel('Username').fill('shweta')", comment: "The fill itself waits for the input to become actionable." },
      { match: "toHaveValue", comment: "Web-first assertion: retries until the value matches." },
      { match: "toBeVisible", comment: "Checks visibility, retrying until the timeout." },
      { match: "toBeEnabled", comment: "Verifies the control can actually be clicked." },
    ],
  },
  "2.5": {
    concept:
      "Real pages change while you use them: dropdowns, modals and alert dialogs appear in response to actions. Playwright handles these dynamic elements with selectOption() for <select>, the dialog role for modals, and page.on('dialog') to accept or dismiss native alerts.",
    codeExplanation:
      "The example selects 'India', opens and closes a modal while asserting the dialog is visible, then registers a dialog handler before triggering an alert.",
    annotations: [
      { match: 'selectOption("India")', comment: "Chooses the option whose value or label matches." },
      { match: 'getByRole("dialog")', comment: "Modals are exposed through the dialog role." },
      { match: 'page.on("dialog"', comment: "Register the listener before the action that opens the alert." },
      { match: "dialog.accept()", comment: "accept() confirms the alert; dismiss() would cancel it." },
    ],
  },
  "3.1": {
    concept:
      "The Page Object Model wraps a page's locators and actions in a class. Tests then call readable methods like login() instead of repeating selectors everywhere, so a UI change is fixed in one place and tests stay focused on intent rather than DOM details.",
    codeExplanation:
      "LoginPage stores the Playwright page, exposes locator getters, and provides goto() and login() actions. A test only needs to create the object and call login().",
    annotations: [
      { match: "class LoginPage", comment: "One class per page or component." },
      { match: "usernameInput = ()", comment: "Locators live inside the page object, not in tests." },
      { match: "async login(", comment: "Tests call this intention-revealing method." },
      { match: "this.usernameInput().fill", comment: "Actions reuse the class's own locators." },
    ],
  },
  "3.2": {
    concept:
      "A browser context can own several pages (tabs), and a page can contain iframes whose content lives in a separate document. Switching to a new tab means waiting for the context's 'page' event, while interacting inside an iframe requires getting a frame handle first.",
    codeExplanation:
      "Promise.all() waits for the new-tab event while clicking the _blank link, then reads the new page's title. A frame handle is obtained before clicking inside the iframe, and bringToFront() returns focus to the original tab.",
    annotations: [
      { match: "context.waitForEvent('page')", comment: "Resolves with the new tab's Page object." },
      { match: "page.click('a[target=", comment: "The click that opens the tab runs in parallel with the wait." },
      { match: "page.frame(", comment: "Get a frame by URL, name, or element handle." },
      { match: "bringToFront()", comment: "Focus the original tab again before continuing." },
    ],
  },
  "3.3": {
    concept:
      "Data-driven testing runs the same test logic against many input rows. Each row becomes its own test with an independent result, so one failing dataset does not hide the others. In Playwright you generate those tests in a loop before the run starts.",
    codeExplanation:
      "testData holds three scenarios; the loop registers one test per row, and the test body uses that row's credentials while asserting the expected outcome.",
    annotations: [
      { match: "const testData = [", comment: "The dataset: one object per scenario." },
      { match: "for (const data of testData)", comment: "Generate one test per row, not one loop inside a test." },
      { match: "fill(data.username)", comment: "The test body reads values from the current row." },
      { match: "toHaveTitle(data.expected)", comment: "Each row declares its own expected result." },
    ],
  },
  "3.4": {
    concept:
      "Network mocking intercepts requests before they reach the server and returns a crafted response. This makes UI tests deterministic and lets you simulate edge cases — empty lists, errors, slow responses — that are difficult to reproduce against a real backend.",
    codeExplanation:
      "page.route() matches the users endpoint, route.fulfill() returns two fake users, and the assertions confirm the dashboard rendered both names from the mock.",
    annotations: [
      { match: "page.route('https://api.example.com/users'", comment: "Match the exact request you want to control." },
      { match: "route.fulfill({", comment: "fulfill sends your own status, content type and body." },
      { match: "waitForLoadState('networkidle')", comment: "Wait until the mocked request has been consumed." },
      { match: "getByText('Shweta')", comment: "The UI proves the mocked data was rendered." },
    ],
  },
  "3.5": {
    concept:
      "Reporting captures evidence from a run: screenshots, videos, traces and structured results. Playwright ships reporters for the terminal, HTML, JUnit and JSON, while configuration decides when to capture artifacts — for example screenshots only on failure to save space.",
    codeExplanation:
      "defineConfig enables screenshots on failure, a trace on the first retry, and both list and HTML reporters, so every run produces console output plus a clickable report.",
    annotations: [
      { match: "screenshot: 'only-on-failure'", comment: "Capture evidence only when something breaks." },
      { match: "trace: 'on-first-retry'", comment: "Traces let you replay the failing attempt step by step." },
      { match: "['html'", comment: "The HTML report includes screenshots, traces and timings." },
    ],
  },
  "4.1": {
    concept:
      "Playwright locators follow a priority order, from user-facing role and accessible name down to CSS and XPath. Strict mode enforces that an action targets exactly one element, so an ambiguous locator fails loudly instead of silently clicking the wrong element. Scoping a locator to a container is the usual fix.",
    codeExplanation:
      "The test finds the Login button by role and accessible name, asserts the URL, scopes a Save button to the 'Edit profile' dialog, and falls back to a test id for an element without an accessible name.",
    annotations: [
      { match: "getByRole('button', { name: 'Login' })", comment: "Role + accessible name: the most resilient locator." },
      { match: "getByRole('dialog'", comment: "Scope the second Save button to its dialog." },
      { match: "getByTestId", comment: "Test ids are the fallback when no accessible name exists." },
    ],
  },
  "4.2": {
    concept:
      "Locators support chaining, filtering and list operations: narrow a container, keep only rows containing some text, then choose the first or nth match or read all their contents. This avoids brittle global selectors and index guessing when many similar elements exist.",
    codeExplanation:
      "The rows locator is filtered to the invoice containing #42, and the Delete button is scoped to that row. allTextContents() reads the list, and first().locator() demonstrates chaining.",
    annotations: [
      { match: "const rows = page.locator('tbody tr')", comment: "One locator representing all rows." },
      { match: "rows.filter({ hasText", comment: "Keep only the row containing the invoice text." },
      { match: "targetRow.getByRole", comment: "Scope the action to the filtered row." },
      { match: "allTextContents()", comment: "Read the text of every matching element." },
    ],
  },
  "4.3": {
    concept:
      "Auto-waiting makes actions reliable; web-first assertions make checks reliable. expect(locator).toHaveText() retries until it passes or the timeout expires, and expect.poll() does the same for custom async logic. Fixed sleeps such as waitForTimeout are the anti-pattern because they are unrelated to the application's real state.",
    codeExplanation:
      "The badge assertion retries for up to seven seconds, expect.poll waits on a row count, and expect.soft records a failure without aborting the rest of the test.",
    annotations: [
      { match: "toHaveText('Active'", comment: "Retries until the badge text becomes Active (or 7s passes)." },
      { match: "expect.poll", comment: "Poll any async condition, not just locators." },
      { match: "expect.soft", comment: "Collect a failure but keep the test running." },
    ],
  },
  "4.4": {
    concept:
      "Beyond clicks and fills, Playwright exposes keyboard, mouse, hover and drag-and-drop interactions. press() sends real key events, hover() opens menus, dragTo() performs the full pointer sequence, and page.mouse gives low-level control when no element API fits.",
    codeExplanation:
      "The test types a search term, presses Enter, hovers the account menu, drags a product card into the cart drop zone, and finishes with raw mouse moves.",
    annotations: [
      { match: "search.press('Enter')", comment: "Sends a real key event to the focused element." },
      { match: ".hover()", comment: "Hover reveals menus that appear only on mouseover." },
      { match: "card.dragTo(dropZone)", comment: "dragTo performs mouse down, move and up." },
      { match: "page.mouse.move", comment: "Low-level input for cases without an element API." },
    ],
  },
  "4.5": {
    concept:
      "File inputs, downloads and date fields need special handling. setInputFiles() populates a file input with real files, downloads arrive as events you must wait for before saving, and native date inputs expect ISO-formatted strings.",
    codeExplanation:
      "The test uploads profile.png, starts waiting for the download before clicking Export, saves the file, and fills the date field with an ISO value.",
    annotations: [
      { match: "setInputFiles('fixtures/profile.png')", comment: "Populate the file input with a real file path." },
      { match: "page.waitForEvent('download')", comment: "Register the listener before the click that triggers it." },
      { match: "download.saveAs", comment: "Persist the downloaded file to disk." },
      { match: "fill('2025-06-01')", comment: "Native date inputs require the YYYY-MM-DD format." },
    ],
  },
  "5.1": {
    concept:
      "Test suites are organised with describe blocks, lifecycle hooks and tags. beforeEach runs shared setup before every test in its block, afterEach cleans up afterwards, and tags in titles let you select subsets (for example --grep @smoke) without editing any files.",
    codeExplanation:
      "The Authentication suite navigates to /login before each test, clears cookies afterwards, and defines two tagged tests for valid and invalid credentials.",
    annotations: [
      { match: "test.describe('Authentication @auth'", comment: "Group related tests; @auth is a tag." },
      { match: "test.beforeEach", comment: "Runs before every test in this describe block." },
      { match: "test.afterEach", comment: "Cleanup runs even when a test fails." },
      { match: "getByText('Invalid credentials')", comment: "The negative path is asserted in the @regression test." },
    ],
  },
  "5.2": {
    concept:
      "Fixtures are reusable setup units that Playwright creates only when a test asks for them. test.extend lets you define custom fixtures on top of the built-ins: code before use() is setup, and code after use() is teardown. This keeps every test independent while removing repeated login or seeding code.",
    codeExplanation:
      "The loggedInPage fixture logs in once per test and hands the authenticated page to the test through use(). The test then starts from a signed-in state without repeating the login steps.",
    annotations: [
      { match: "const test = base.extend", comment: "Create an extended test that knows extra fixtures." },
      { match: "loggedInPage: async ({ page }, use)", comment: "The fixture receives built-ins plus a use callback." },
      { match: "await use(page)", comment: "Everything before this line is setup; the test runs here." },
      { match: "test('cart is visible after login'", comment: "The test simply requests the custom fixture." },
    ],
  },
  "5.3": {
    concept:
      "Parameterised suites generate one test per dataset row from a loop. Each case is reported independently and can be retried or traced on its own, which is much better than a single test looping over data and stopping at the first failure.",
    codeExplanation:
      "A typed LoginCase[] array drives a for...of loop that registers one test per row, using that row's credentials and expected text.",
    annotations: [
      { match: "const loginCases: LoginCase[]", comment: "Typed dataset: every row has the same shape." },
      { match: "for (const data of loginCases)", comment: "Register a test per row, outside any test body." },
      { match: "fill(data.email)", comment: "Each generated test consumes its own row." },
      { match: "getByText(data.expected)", comment: "The expected result is part of the data." },
    ],
  },
  "5.4": {
    concept:
      "Debugging tools answer the question 'what actually happened?'. The trace viewer replays a run with DOM snapshots, network activity, console logs and timings, while UI mode and the Inspector let you step through actions locally. Screenshots and video add visual evidence for failures.",
    codeExplanation:
      "The config retries once, records a trace on the first retry, saves screenshots only on failure, and retains video for failures. The comments at the bottom list the commands that open each debugging tool.",
    annotations: [
      { match: "retries: 1", comment: "One retry gives the trace a second attempt to record." },
      { match: "trace: 'on-first-retry'", comment: "Capture a full trace when a test is retried." },
      { match: "screenshot: 'only-on-failure'", comment: "Screenshots only when something fails." },
      { match: "show-trace", comment: "Open the recorded trace to replay the failure." },
    ],
  },
  "5.5": {
    concept:
      "Parallelism splits test files across worker processes, each with an isolated browser context. Retries re-run flaky tests, and isolation prevents tests from depending on each other's data. Serial mode should be reserved for scenarios that are genuinely ordered.",
    codeExplanation:
      "The config enables fullyParallel, uses four workers, retries twice and records traces on the first retry; sharding splits a single run across multiple machines.",
    annotations: [
      { match: "fullyParallel: true", comment: "Run tests within a file in parallel too." },
      { match: "workers: 4", comment: "Four browser processes execute files concurrently." },
      { match: "retries: 2", comment: "Retry failures to surface flakiness, not hide it." },
      { match: "--shard=1/3", comment: "Sharding divides the suite across CI machines." },
    ],
  },
  "6.1": {
    concept:
      "API testing uses Playwright's request fixture to call HTTP endpoints directly, without a browser. You assert status codes, headers and JSON bodies, and you can create test data through the API before driving the UI — faster and far more stable than clicking through setup screens.",
    codeExplanation:
      "The test POSTs a new user, asserts a 201 status and a defined id, then opens the UI for that id to prove the API-created record is usable.",
    annotations: [
      { match: "request.post('/api/users'", comment: "Send JSON directly with the request fixture." },
      { match: "status()).toBe(201)", comment: "A created resource should return 201." },
      { match: "await response.json()", comment: "Parse the body to read the generated id." },
      { match: "page.goto('/users/'", comment: "Reuse API-created data in a UI flow." },
    ],
  },
  "6.2": {
    concept:
      "route.fulfill lets you intercept a request and return your own response. It is ideal for deterministic UI tests and for simulating states a real backend rarely produces, such as a specific product list, empty results, or a 500 server error.",
    codeExplanation:
      "The test mocks /api/products with three items, asserts the rendered count and a product name, then re-routes the same endpoint to a 500 to verify the error state.",
    annotations: [
      { match: "route('**/api/products'", comment: "The pattern matches the endpoint regardless of host." },
      { match: "route.fulfill({", comment: "Return a custom status, content type and body." },
      { match: "toHaveCount(3)", comment: "The UI must render exactly the mocked items." },
      { match: "status: 500", comment: "Re-route the endpoint to simulate a server error." },
    ],
  },
  "6.3": {
    concept:
      "waitForResponse waits for a specific network response that matches a predicate. Register it before triggering the UI so the event cannot be missed, then parse the body and assert the payload the application received.",
    codeExplanation:
      "The waiter is created first, the search UI is triggered, and the resolved response's JSON is asserted for the query and total before the rendered list count is checked.",
    annotations: [
      { match: "const responsePromise = page.waitForResponse", comment: "Register the waiter before triggering the request." },
      { match: "response.url().includes('/api/search')", comment: "Match URL and status so you wait for the right response." },
      { match: "await response.json()", comment: "Parse the payload the application consumed." },
      { match: "toHaveCount(body.total)", comment: "Assert the API data against the rendered data." },
    ],
  },
  "6.4": {
    concept:
      "Authenticating in every test is slow and repetitive. A global setup can log in once, save the browser storage state (cookies plus localStorage), and reuse it so every test starts already signed in. The saved state is just a JSON file you can inspect.",
    codeExplanation:
      "The setup performs a real login, waits for the dashboard, and writes auth/user.json; the configuration then loads that file for every test.",
    annotations: [
      { match: "setup('authenticate'", comment: "A setup test runs once before the suite." },
      { match: "waitForURL('**/dashboard')", comment: "Wait for login to finish before capturing state." },
      { match: "storageState({ path", comment: "Persist cookies and localStorage to a file." },
      { match: "use: { storageState", comment: "Every test reuses the saved session." },
    ],
  },
  "6.5": {
    concept:
      "Role-based testing verifies what different users can see and do. By creating separate contexts from different storage states (admin, viewer) or injecting tokens before page scripts run, you can test permissions without repeating UI logins.",
    codeExplanation:
      "Two fixtures build isolated contexts from admin and viewer storage states; the test asserts the Delete button is visible for admin and hidden for viewer.",
    annotations: [
      { match: "adminPage: async ({ browser }, use)", comment: "A fixture per role, each with its own context." },
      { match: "storageState: 'auth/admin.json'", comment: "Load the saved admin session." },
      { match: "toBeVisible()", comment: "Admin must see the destructive action." },
      { match: "toBeHidden()", comment: "Viewer must not see it." },
    ],
  },
  "7.1": {
    concept:
      "Projects let one suite run across multiple browser and device configurations. Each project combines a browser with options such as device emulation, viewport or baseURL, and shared use options are inherited by every project. This is how you test the same features on desktop and mobile without duplicating any tests.",
    codeExplanation:
      "The config defines a shared baseURL, timeout and trace setting, then four projects: Chromium, Firefox, WebKit and a Pixel 5 mobile profile.",
    annotations: [
      { match: "timeout: 30_000", comment: "Global timeout inherited by every project." },
      { match: "baseURL:", comment: "Relative page.goto('/...') calls resolve against this." },
      { match: "projects: [", comment: "Each entry runs the same tests in a different environment." },
      { match: "name: 'mobile-chrome'", comment: "Device emulation without duplicating tests." },
    ],
  },
  "7.2": {
    concept:
      "Environment variables let one suite target local, staging or production. The config reads BASE_URL once and applies it as use.baseURL, and CI should fail fast if the value is missing rather than silently testing the wrong (or unreachable) host.",
    codeExplanation:
      "The config reads BASE_URL with a localhost fallback, throws in CI when it is absent, and passes the resolved URL to every test through use.baseURL.",
    annotations: [
      { match: "process.env.BASE_URL", comment: "Read the target environment from outside the code." },
      { match: "process.env.CI", comment: "CI runs must not fall back silently." },
      { match: "throw new Error", comment: "Fail fast with a clear configuration error." },
      { match: "baseURL,", comment: "The resolved URL becomes baseURL for all tests." },
    ],
  },
  "7.3": {
    concept:
      "Reporters turn a run into output for different consumers: the list reporter for the terminal, HTML for humans, JUnit XML for CI dashboards, and JSON for tooling. Multiple reporters can run at once, and custom reporters implement lifecycle hooks such as onTestEnd.",
    codeExplanation:
      "The config enables four reporters simultaneously; the commented example shows a custom Reporter that counts failures in onTestEnd and prints the total at the end.",
    annotations: [
      { match: "['list']", comment: "Live, line-by-line terminal output." },
      { match: "['html'", comment: "Self-contained report with traces and screenshots." },
      { match: "['junit'", comment: "XML that CI servers can ingest." },
      { match: "onTestEnd(test, result)", comment: "Custom reporters hook into the test lifecycle." },
    ],
  },
  "7.4": {
    concept:
      "A CI pipeline installs dependencies and browsers, runs the suite, and publishes artifacts. Sharding splits the suite across parallel jobs, and uploading the report and traces preserves evidence after the runner is destroyed.",
    codeExplanation:
      "The workflow object mirrors a GitHub Actions file: it triggers on push and pull requests, shards tests three ways, installs browsers, and uploads the HTML report as an artifact.",
    annotations: [
      { match: "on: ['push'", comment: "Run on every push and pull request." },
      { match: "matrix: { shard: [1, 2, 3] }", comment: "Three parallel jobs, one per shard." },
      { match: "playwright install --with-deps", comment: "Install browser binaries and OS libraries." },
      { match: "upload-artifact", comment: "Keep the report after the job finishes." },
    ],
  },
  "7.5": {
    concept:
      "The capstone combines everything: navigation, locators, web-first assertions, network mocking and evidence capture. A realistic purchase flow touches search, cart, checkout and confirmation, while the payment provider is mocked so the test stays deterministic and never charges a real card.",
    codeExplanation:
      "The test searches for a laptop, adds the first result, mocks the payment endpoint with an order id, checks out, and asserts both the confirmation heading and the order id.",
    annotations: [
      { match: "fill('laptop')", comment: "Start from a user action, not internal state." },
      { match: "Add to cart", comment: "first() picks a deterministic result from the list." },
      { match: "route('**/api/payment'", comment: "Mock the external payment provider." },
      { match: "'Order confirmed'", comment: "Assert the user-visible business outcome." },
    ],
  },
};

export const getLessonNotes = (lessonId: string): LessonNotes | undefined =>
  LESSON_NOTES[lessonId];
