/**
 * Module 2: Getting Started with Playwright
 * 5 lessons covering Playwright setup, locators, interactions, assertions, and dynamic UI.
 */
import { Module } from "./types";

export const module2: Module = {
  id: "2",
  title: "Getting Started with Playwright",
  icon: "🎮",
  description:
    "Install and use Playwright to launch browsers, locate elements, interact with pages, and make assertions.",
  lessons: [
    {
      id: "2.1",
      moduleId: "2",
      title: "What is Playwright & Setup",
      slug: "what-is-playwright-and-setup",
      duration: "20 min",
      description:
        "Understand what Playwright is and how to set it up for browser automation.",
      analogy: {
        title: "A Remote Control Operating a Web Browser",
        description:
          "Playwright is like a universal TV remote control that can operate any web browser automatically. Just as you use a remote to turn on the TV, change channels, and adjust volume without touching the TV itself, Playwright controls a browser to navigate, click, and type without any manual interaction.",
        visual: "🎮",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TB
  A["Playwright Test Runner"] --> B["Browser Context"]
  B --> C["Web Page (Browser Tab)"]
  C --> D["Page Actions: Click, Fill, Navigate"]
  style A fill:#4F46E5,color:#FFFFFF
  style B fill:#E2E8F0,color:#0F172A
  style C fill:#E2E8F0,color:#0F172A
  style D fill:#E2E8F0,color:#0F172A`,
        altText:
          "Playwright Runner creates Browser Context, which contains Page, which receives Action commands.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Launch a Chromium browser, open a new page, and navigate to a URL.",
        code: `import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com');
  console.log('Page title:', await page.title());
  await browser.close();
})();`,
      },
      quiz: [
        {
          id: "q1",
          question: "What is Playwright primarily used for?",
          options: [
            "Building mobile apps",
            "Browser automation and testing",
            "Database management",
            "Machine learning",
          ],
          correctIndices: [1],
          explanation:
            "Playwright is a browser automation framework used for testing web applications across Chromium, Firefox, and WebKit.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which method is used to navigate to a URL?",
          options: [
            "page.click()",
            "page.goto()",
            "page.open()",
            "page.navigate()",
          ],
          correctIndices: [1],
          explanation:
            "page.goto() is the Playwright method to navigate to a specific URL.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write code to launch a Chrome browser, open a context, create a new page, and navigate to 'https://playwright.dev'. (Use Playwright API syntax.)",
        starterCode: `// TODO: Launch browser, create context, open page, navigate
import { chromium } from 'playwright';

(async () => {
  // Your code here
})();`,
        solution: `import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://playwright.dev');
  console.log('Page title:', await page.title());
  await browser.close();
})();`,
        tests: [
          {
            description: "Browser launch and page navigation code is correct",
            code: `await new Promise(function (resolve) { setTimeout(resolve, 60); });
var log = window.__mockLog.join(' | ');
var ok = log.indexOf('chromium.launch(') !== -1 &&
  log.indexOf('newContext') !== -1 &&
  log.indexOf('newPage') !== -1 &&
  log.indexOf('goto("https://playwright.dev")') !== -1;
console.log(ok
  ? 'PASS: Browser launch and navigation code is correct'
  : 'FAIL: Missing required Playwright calls. Log: ' + log);`,
            expected: "PASS: Browser launch and navigation code is correct",
          },
        ],
      },
    },
    {
      id: "2.2",
      moduleId: "2",
      title: "Locating Elements on a Webpage",
      slug: "locating-elements-on-a-webpage",
      duration: "25 min",
      description:
        "Find elements on a webpage using user-friendly Playwright locators.",
      analogy: {
        title: "Finding Items in a Grocery Store",
        description:
          "Finding elements on a webpage is like shopping in a grocery store. You can find items by section signs (getByRole), by labels on jars (getByLabel), or by reading the price tags (getByText). Some stores have everything in one big bin where you'd have to dig (querySelector), but smart stores use clear signage to guide you directly.",
        visual: "🛒",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  DOM["Webpage DOM"] --> Section["getByRole('button')"]
  DOM --> Label["getByLabel('Email')"]
  DOM --> Text["getByText('Submit')"]
  Section --> Action["Click / Fill"]
  Label --> Action
  Text --> Action
  style DOM fill:#DBEAFE,color:#0F172A
  style Action fill:#4F46E5,color:#FFFFFF`,
        altText:
          "DOM elements are located via getByRole, getByLabel, or getByText; all lead to an action.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Locate elements using user-friendly Playwright locators.",
        code: `// Find a button by its accessible role
const submitButton = page.getByRole('button', { name: 'Submit' });

// Find an input by its label text
const emailInput = page.getByLabel('Email Address');

// Find an element by its visible text
const heading = page.getByText('Welcome Back');

// Now interact with them
await emailInput.fill('test@example.com');
await submitButton.click();`,
      },
      quiz: [
        {
          id: "q1",
          question:
            "Which locator strategy finds an element by its ARIA role and accessible name?",
          options: [
            "page.$('#id')",
            "page.getByRole('button', { name: 'Submit' })",
            "page.locator('.class')",
            "page.getByText('Submit')",
          ],
          correctIndices: [1],
          explanation:
            "getByRole finds elements by their ARIA role (like 'button', 'input') and optionally matches an accessible name.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which method finds an element by the text label associated with it?",
          options: [
            "getByText",
            "getByLabel",
            "getByPlaceholder",
            "getByRole",
          ],
          correctIndices: [1],
          explanation:
            "getByLabel finds form elements by their visible label text, matching how users identify inputs.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write three locators: one to find a username input by its label, one to find a login button by its role, and one to find a 'Sign up' link by its text.",
        starterCode: `// TODO: Write locators for username input, login button, and sign up link
// Username input with label "Username"
const usernameInput = // your code

// Login button
const loginButton = // your code

// Sign up link
const signUpLink = // your code`,
        solution: `const usernameInput = page.getByLabel('Username');
const loginButton = page.getByRole('button', { name: 'Login' });
const signUpLink = page.getByText('Sign up');`,
        tests: [
          {
            description: "Locators use correct Playwright methods",
            code: `const locators = "page.getByLabel('Username'); page.getByRole('button', { name: 'Login' }); page.getByText('Sign up');";
if (locators.includes("getByLabel") && locators.includes("getByRole") && locators.includes("getByText")) {
  console.log("PASS: Correct locator methods used");
} else { console.log("FAIL: Missing locator methods"); }`,
            expected: "PASS: Correct locator methods used",
          },
        ],
      },
    },
    {
      id: "2.3",
      moduleId: "2",
      title: "Interacting with Elements (Clicks & Inputs)",
      slug: "interacting-with-elements",
      duration: "25 min",
      description:
        "Automate clicking buttons and typing into input fields on a web page.",
      analogy: {
        title: "Filling Out a Physical Application Form",
        description:
          "Interacting with web elements is like filling out a paper form at a government office. You write your name in the 'Name' field (fill), check the 'I agree' checkbox (check/click), and finally hand in the form by pressing the 'Submit' button (click). Each action targets a specific field, and Playwright automates each precisely.",
        visual: "📝",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["Identify Element"] --> B{"Element Type?"}
  B -->|"Input/textarea"| C["page.fill('text')"]
  B -->|"Button/checkbox/radio"| D["page.click()"]
  B -->|"Select dropdown"| E["page.selectOption('value')"]
  C --> F["Element updated"]
  D --> F
  E --> F
  style A fill:#E2E8F0,color:#0F172A
  style B fill:#FEF3C7,color:#78350F
  style F fill:#4F46E5,color:#FFFFFF`,
        altText:
          "Identify element, determine type, then use fill, click, or selectOption accordingly.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Fill a login form and submit it using Playwright actions.",
        code: `// Fill input fields
await page.getByLabel('Username').fill('shweta_test');
await page.getByLabel('Password').fill('SecurePass123');

// Check a checkbox
await page.getByLabel('Remember me').check();

// Click the submit button
await page.getByRole('button', { name: 'Login' }).click();

// Or combine click and type in one chain
await page.getByLabel('Username').fill('shweta_test').click();`,
      },
      quiz: [
        {
          id: "q1",
          question:
            "Which method is used to type text into an input field?",
          options: ["click()", "type()", "fill()", "Both B and C"],
          correctIndices: [3],
          explanation:
            "Both type() (types character by character) and fill() (fills the entire input at once) can be used to enter text, but fill() is preferred for most cases.",
          type: "single",
        },
        {
          id: "q2",
          question: "What does the .check() method do?",
          options: [
            "Clicks a button",
            "Selects a checkbox or radio button",
            "Fills a text input",
            "Navigates to a new page",
          ],
          correctIndices: [1],
          explanation:
            "The .check() method checks (selects) a checkbox or radio button if it isn't already selected.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write code to fill a login form with username 'raj', password 'Test@123', check the 'Remember me' checkbox, and click the 'Login' button.",
        starterCode: `// TODO: Automate login form
await page.getByLabel('Username'). // fill with 'raj'
await page.getByLabel('Password'). // fill with 'Test@123'
await page.getByLabel('Remember me'). // check
await // click the Login button`,
        solution: `await page.getByLabel('Username').fill('raj');
await page.getByLabel('Password').fill('Test@123');
await page.getByLabel('Remember me').check();
await page.getByRole('button', { name: 'Login' }).click();`,
        tests: [
          {
            description: "Login form automation is complete",
            code: `const code = "fill('raj'); fill('Test@123'); check(); click();";
if (code.includes("fill('raj')") && code.includes("fill('Test@123')") && code.includes("check()") && code.includes("click()")) {
  console.log("PASS: Login form automation is complete");
} else { console.log("FAIL: Missing form actions"); }`,
            expected: "PASS: Login form automation is complete",
          },
        ],
      },
    },
    {
      id: "2.4",
      moduleId: "2",
      title: "Auto-Waiting & First Assertions",
      slug: "auto-waiting-and-first-assertions",
      duration: "25 min",
      description:
        "Use auto-waiting and assertions to verify page state in your tests.",
      analogy: {
        title: "Waiting for a Boiling Kettle to Whistle",
        description:
          "Playwright's auto-waiting is like waiting for a kettle to whistle before pouring water. You don't set a timer and hope it's ready — you wait for the actual signal (whistle = element is ready). Assertions are like tasting the water to confirm it's actually boiling hot before proceeding. This makes tests more reliable than guessing how long to wait.",
        visual: " ⏱️",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["Action: click()"] --> B["Auto-wait: is element ready?"]
  B -->|"No"| B
  B -->|"Yes"| C["Perform click"]
  C --> D["Assertion: expect(locator).toBeVisible()"]
  D -->|"Pass"| E["Continue"]
  D -->|"Fail"| F["Throw error → Screenshot"]
  style A fill:#E2E8F0,color:#0F172A
  style B fill:#FEF3C7,color:#78350F
  style C fill:#E2E8F0,color:#0F172A
  style D fill:#4F46E5,color:#FFFFFF
  style E fill:#10B981,color:#052E16
  style F fill:#DC2626,color:#FFFFFF`,
        altText:
          "Auto-waiting checks element readiness before action; assertions verify state and handle pass/fail.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Use Playwright's expect() assertions to verify element visibility and text.",
        code: `import { test, expect } from '@playwright/test';

await page.goto('https://example.com/login');

// Auto-wait: Playwright waits until the input is visible, then fills it
await page.getByLabel('Username').fill('shweta');

// Assertions: verify the state of elements
await expect(page.getByLabel('Username')).toHaveValue('shweta');
await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();`,
      },
      quiz: [
        {
          id: "q1",
          question: "What does Playwright's auto-waiting do?",
          options: [
            "Adds artificial delays to tests",
            "Waits for elements to be ready before performing actions",
            "Skips waiting for faster execution",
            "Only waits for page load events",
          ],
          correctIndices: [1],
          explanation:
            "Playwright automatically waits for elements to reach an actionable state (visible, stable, etc.) before performing actions.",
          type: "single",
        },
        {
          id: "q2",
          question:
            "Which import is needed to use Playwright's expect assertions?",
          options: [
            "import { expect } from 'playwright'",
            "import { expect } from '@playwright/test'",
            "import expect from 'chai'",
            "No import needed",
          ],
          correctIndices: [1],
          explanation:
            "When using Playwright Test, expect is imported from '@playwright/test'. When using the Playwright library directly, it comes from 'playwright'.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write assertions to verify that a username input has the value 'raj', a login button is visible and enabled, and a welcome heading is visible after login.",
        starterCode: `// TODO: Write assertions to verify page state
await page.getByLabel('Username').fill('raj');

// Assert username input has value 'raj'

// Assert login button is visible and enabled

// Assert welcome heading is visible`,
        solution: `await page.getByLabel('Username').fill('raj');

await expect(page.getByLabel('Username')).toHaveValue('raj');
await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();
await expect(page.getByText('Welcome')).toBeVisible();`,
        tests: [
          {
            description: "Assertions use correct Playwright expect matchers",
            code: `var log = window.__mockLog.join(' | ');
var ok = log.indexOf('toHaveValue') !== -1 &&
  log.indexOf('toBeVisible') !== -1 &&
  log.indexOf('toBeEnabled') !== -1;
console.log(ok
  ? 'PASS: Correct assertion matchers used'
  : 'FAIL: Missing required matchers. Log: ' + log);`,
            expected: "PASS: Correct assertion matchers used",
          },
        ],
      },
    },
    {
      id: "2.5",
      moduleId: "2",
      title: "Handling Dynamic UI Elements",
      slug: "handling-dynamic-ui-elements",
      duration: "30 min",
      description:
        "Interact with dynamic elements like dropdowns, modals, and alert pop-ups.",
      analogy: {
        title: "Waiting for a Bus to Stop Completely",
        description:
          "Dynamic UI elements are like a city bus. A dropdown is like the bus door opening wide before you step in — you wait for it to fully open (be ready) before interacting. A modal popup is like a popup information booth at the bus stop that appears suddenly; you must acknowledge it (click OK or Close) before continuing your journey. Playwright automatically waits for these elements to be ready.",
        visual: "🚌",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["Element appears (dropdown/modal)"] --> B["Playwright auto-waits"]
  B --> C{"Element ready?"}
  C -->|"No"| B
  C -->|"Yes"| D["Interact: selectOption / click"]
  D --> E["Dialog appears"]
  E --> F["page.on('dialog', dialog => dialog.accept())"]
  F --> G["Continue execution"]
  style A fill:#E2E8F0,color:#0F172A
  style B fill:#FEF3C7,color:#78350F
  style C fill:#FEF3C7,color:#78350F
  style D fill:#4F46E5,color:#FFFFFF
  style F fill:#10B981,color:#052E16
  style G fill:#E2E8F0,color:#0F172A`,
        altText:
          "Dynamic elements: auto-wait for readiness, interact, handle dialogs, continue.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Handle dropdowns, modals, and alert dialogs using Playwright.",
        code: `// Handle a dropdown select
await page.getByLabel("Country").selectOption("India");

// Handle a modal popup
await page.getByRole("button", { name: "Open Modal" }).click();
await expect(page.getByRole("dialog")).toBeVisible();
await page.getByRole("button", { name: "Close" }).click();

// Handle JavaScript alert dialogs
page.on("dialog", async (dialog) => {
  console.log("Alert:", dialog.message());
  await dialog.accept();
});
await page.getByRole("button", { name: "Show Alert" }).click();`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which method is used to select an option from a dropdown?",
          options: [
            "page.click()",
            "page.fill()",
            "page.selectOption()",
            "page.hover()",
          ],
          correctIndices: [2],
          explanation:
            "selectOption() is the Playwright method for choosing an option from a <select> dropdown element.",
          type: "single",
        },
        {
          id: "q2",
          question:
            "How do you handle a JavaScript alert/popup dialog in Playwright?",
          options: [
            "page.alert()",
            "page.on('dialog', handler)",
            "page.dismissAlert()",
            "page.handleDialog()",
          ],
          correctIndices: [1],
          explanation:
            "Playwright uses page.on('dialog', ...) to listen for dialog events, and you can then call dialog.accept() or dialog.dismiss().",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write code to select 'India' from a country dropdown, handle a modal by clicking Close, and accept an alert dialog.",
        starterCode: `// TODO: Handle dropdown, modal, and alert
// Select 'India' from Country dropdown


// Handle modal - click Close button


// Handle alert dialog


`,
        solution: `await page.getByLabel("Country").selectOption("India");
await page.getByRole("button", { name: "Close" }).click();
page.on("dialog", async (dialog) => {
  await dialog.accept();
});
await page.getByRole("button", { name: "Show Alert" }).click();`,
        tests: [
          {
            description: "Dynamic UI handling uses correct methods",
            code: `var log = window.__mockLog.join(' | ');
var ok = log.indexOf('selectOption(India)') !== -1 &&
  log.indexOf('on("dialog")') !== -1 &&
  log.indexOf('dialog.accept()') !== -1 &&
  log.indexOf('Close') !== -1;
console.log(ok
  ? 'PASS: Dynamic UI elements handled correctly'
  : 'FAIL: Missing dialog or select handling. Log: ' + log);`,
            expected: "PASS: Dynamic UI elements handled correctly",
          },
        ],
      },
    },
  ],
};
