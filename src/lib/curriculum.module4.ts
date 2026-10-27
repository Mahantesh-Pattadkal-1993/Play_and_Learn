/**
 * Module 4: Advanced Locators & Reliable Interactions
 * Locator strategy, chaining/filtering, auto-waiting, mouse/keyboard,
 * uploads/downloads and date pickers.
 */
import { Module } from "./types";

export const module4: Module = {
  id: "4",
  title: "Advanced Locators & Reliable Interactions",
  icon: "🔍",
  description:
    "Write resilient locators, chain and filter them, master auto-waiting, and automate keyboards, mice, uploads, downloads and date pickers.",
  lessons: [
    {
      id: "4.1",
      moduleId: "4",
      title: "Locator Strategies & Strict Mode",
      slug: "locator-strategies-and-strict-mode",
      duration: "25 min",
      description:
        "Choose user-facing locators in priority order and understand why Playwright's strict mode rejects ambiguous matches.",
      analogy: {
        title: "Reading a Street Address in Priority Order",
        description:
          "To find a flat you use the most specific information first: building, floor, then door number. Playwright locators work the same way — start with the user-facing role and accessible name, fall back to label or text, and use CSS/test ids only when nothing better exists. Strict mode is the building manager who refuses to hand over a parcel when two residents share the same name.",
        visual: "🏠",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["Locator priority"] --> B["getByRole (role + name)"]
  B --> C["getByLabel / getByPlaceholder"]
  C --> D["getByText / getByAltText"]
  D --> E["getByTestId"]
  E --> F["locator('css=...')"]
  B --> G{"Exactly 1 match?"}
  G -->|"No"| H["Strict mode violation"]
  G -->|"Yes"| I["Perform action"]
  style B fill:#4F46E5,color:#FFFFFF
  style G fill:#FEF3C7,color:#78350F
  style H fill:#DC2626,color:#FFFFFF
  style I fill:#10B981,color:#052E16`,
        altText:
          "Locator priority ladder from getByRole down to CSS, with strict mode enforcing a single match.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Use user-facing locators and narrow ambiguous matches before acting.",
        code: `import { test, expect } from '@playwright/test';

test('login button is unique', async ({ page }) => {
  await page.goto('/login');

  // Best: role + accessible name (how a user finds it)
  const loginButton = page.getByRole('button', { name: 'Login' });
  await loginButton.click();

  await expect(page).toHaveURL(/dashboard/);

  // Two "Save" buttons? Scope to the dialog instead of using nth()
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  await dialog.getByRole('button', { name: 'Save' }).click();

  // Test ids are the escape hatch for unnamed UI
  await expect(page.getByTestId('user-avatar')).toBeVisible();
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "What does Playwright's strict mode do?",
          options: [
            "Makes every locator wait 30 seconds",
            "Throws when a locator resolves to more than one element",
            "Disables CSS selectors",
            "Runs tests serially",
          ],
          correctIndices: [1],
          explanation:
            "Strict mode fails fast when a locator matches multiple elements, forcing an unambiguous locator instead of silently acting on the first match.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which locator is preferred for a button labelled 'Submit'?",
          options: [
            "page.locator('button:nth-child(3)')",
            "page.getByRole('button', { name: 'Submit' })",
            "page.$('button')",
            "page.locator('//button[1]')",
          ],
          correctIndices: [1],
          explanation:
            "getByRole matches the accessibility tree, which is resilient to DOM restructuring and closest to real user behaviour.",
          type: "single",
        },
        {
          id: "q3",
          question:
            "Two dialogs each contain a 'Save' button. What is the most robust fix?",
          options: [
            "page.getByRole('button', { name: 'Save' }).first()",
            "Add waitForTimeout(1000) before clicking",
            "Scope it: page.getByRole('dialog', { name: 'Edit profile' }).getByRole('button', { name: 'Save' })",
            "Switch to XPath index",
          ],
          correctIndices: [2],
          explanation:
            "Scoping a locator to its container keeps the intent explicit and avoids brittle index-based selection.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a helper that returns the login button locator using its role and accessible name. The function receives the simulated Playwright `page` object.",
        starterCode: `// TODO: return the "Login" button locator
function findLoginButton(page: any) {
  // Hint: page.getByRole('button', { name: 'Login' })
}`,
        solution: `function findLoginButton(page: any) {
  return page.getByRole('button', { name: 'Login' });
}`,
        tests: [
          {
            description: "Uses getByRole with the accessible name Login",
            code: `if (typeof findLoginButton !== 'function') {
  console.log('FAIL: findLoginButton is not defined');
} else {
  var button = findLoginButton(page);
  var desc = button && button._desc ? button._desc : '';
  var ok = desc.indexOf('getByRole("button"') !== -1 && desc.indexOf('Login') !== -1;
  console.log(ok
    ? 'PASS: Uses getByRole with the accessible name Login'
    : 'FAIL: Expected getByRole("button", { name: "Login" }), got ' + desc);
}`,
            expected: "PASS: Uses getByRole with the accessible name Login",
          },
        ],
      },
    },
    {
      id: "4.2",
      moduleId: "4",
      title: "Chaining, Filtering & Working with Lists",
      slug: "chaining-filtering-and-lists",
      duration: "30 min",
      description:
        "Narrow page areas, filter repeated rows by content, and pick items from lists without brittle indexes.",
      analogy: {
        title: "Narrowing a Shopping List",
        description:
          "Instead of scanning the whole supermarket, you walk to the dairy aisle, look only at items on offer, then take the second carton. Playwright works the same way: a parent locator narrows the search area, filter() narrows by content, and first()/nth()/last() pick a specific item.",
        visual: "🛒",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["page.locator('tr')"] --> B["filter({ hasText: 'Invoice #42' })"]
  B --> C["getByRole('button', { name: 'Delete' })"]
  B --> D["first() / nth(0) / last()"]
  B --> E["count() / all() / allTextContents()"]
  C --> F["click()"]
  style B fill:#4F46E5,color:#FFFFFF
  style C fill:#DBEAFE,color:#0F172A
  style F fill:#10B981,color:#052E16`,
        altText:
          "A table-row locator is filtered by invoice text, then a Delete button inside the matched row is targeted.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Filter rows by content, scope actions to a row, and read list data.",
        code: `import { test, expect } from '@playwright/test';

test('delete the invoice row for customer 42', async ({ page }) => {
  await page.goto('/invoices');

  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(3);

  const targetRow = rows.filter({ hasText: 'Invoice #42' });
  await expect(targetRow).toHaveCount(1);
  await targetRow.getByRole('button', { name: 'Delete' }).click();

  // Read text from every remaining row
  const remaining = await page.locator('tbody tr').allTextContents();
  console.log('Remaining invoices:', remaining);

  // Chain instead of using a global selector
  const firstBadge = page.locator('tbody tr').first().locator('.badge');
  await expect(firstBadge).toHaveText('Paid');
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "What does locator.filter({ hasText: 'Invoice #42' }) do?",
          options: [
            "Removes text from the page",
            "Keeps only elements containing the given text",
            "Waits 42 seconds for the element",
            "Converts the locator into an array",
          ],
          correctIndices: [1],
          explanation:
            "filter() narrows an existing locator — hasText keeps elements that contain the given text.",
          type: "single",
        },
        {
          id: "q2",
          question: "How do you count matching product cards?",
          options: [
            "await page.locator('.card').count()",
            "await page.locator('.card').length",
            "await page.locator('.card').size()",
            "await page.locator('.card').total()",
          ],
          correctIndices: [0],
          explanation:
            "count() returns a promise resolving to the number of matching elements. Locators are lazy, so .length is not available.",
          type: "single",
        },
        {
          id: "q3",
          question: "Best way to click Delete in a specific invoice row?",
          options: [
            "page.getByRole('button', { name: 'Delete' }).nth(2)",
            "page.locator('tr').filter({ hasText: 'Invoice #42' }).getByRole('button', { name: 'Delete' })",
            "page.click('text=Delete')",
            "page.locator('button').last()",
          ],
          correctIndices: [1],
          explanation:
            "Scoping to the filtered row stays stable when rows are reordered or new rows appear.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a helper that returns the Delete button inside the row containing the given invoice number.",
        starterCode: `// TODO: scope to the matching row, then find its Delete button
function findDeleteButtonForInvoice(page: any, invoiceNumber: string) {
  // Hint: page.locator('tr').filter({ hasText: invoiceNumber }).getByRole('button', { name: 'Delete' })
}`,
        solution: `function findDeleteButtonForInvoice(page: any, invoiceNumber: string) {
  return page
    .locator('tr')
    .filter({ hasText: invoiceNumber })
    .getByRole('button', { name: 'Delete' });
}`,
        tests: [
          {
            description: "Builds a scoped, filtered locator",
            code: `if (typeof findDeleteButtonForInvoice !== 'function') {
  console.log('FAIL: findDeleteButtonForInvoice is not defined');
} else {
  var button = findDeleteButtonForInvoice(page, 'Invoice #42');
  var desc = button && button._desc ? button._desc : '';
  var ok = desc.indexOf('page.locator("tr")') === 0 &&
    desc.indexOf('filter') !== -1 &&
    desc.indexOf('Invoice #42') !== -1 &&
    desc.indexOf('getByRole("button"') !== -1 &&
    desc.indexOf('Delete') !== -1;
  console.log(ok
    ? 'PASS: Scopes to the invoice row before locating Delete'
    : 'FAIL: Locator chain was ' + desc);
}`,
            expected: "PASS: Scopes to the invoice row before locating Delete",
          },
        ],
      },
    },
    {
      id: "4.3",
      moduleId: "4",
      title: "Auto-Waiting, Timeouts & Web-First Assertions",
      slug: "auto-waiting-timeouts-and-web-first-assertions",
      duration: "30 min",
      description:
        "Understand actionability checks, configure retrying assertions, and eliminate arbitrary sleeps.",
      analogy: {
        title: "A Toaster That Pops When Ready",
        description:
          "A good toaster pops when the bread is actually done instead of ringing after a blind three-minute timer. Playwright auto-waits for elements to be visible, stable, enabled and able to receive events before acting, and web-first assertions retry until they pass or the timeout expires. Fixed sleeps (waitForTimeout) are the blind timer you want to avoid.",
        visual: "🍞",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  A["Action: locator.click()"] --> B{"Actionability checks"}
  B -->|"visible, stable, enabled, receives events"| C["Perform action"]
  B -->|"not ready"| B
  C --> D["Assertion: expect(locator).toHaveText('Active', { timeout: 7000 })"]
  D -->|"retry until pass"| E["Continue test"]
  D -->|"timeout"| F["Fail + trace + screenshot"]
  style B fill:#FEF3C7,color:#78350F
  style D fill:#4F46E5,color:#FFFFFF
  style E fill:#10B981,color:#052E16
  style F fill:#DC2626,color:#FFFFFF`,
        altText:
          "Actionability checks gate each action; assertions retry until passing or timing out.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Use retrying assertions with explicit timeouts instead of sleep calls.",
        code: `import { test, expect } from '@playwright/test';

test('status badge becomes active', async ({ page }) => {
  await page.goto('/dashboard');

  // BAD: await page.waitForTimeout(3000);

  // GOOD: retry the assertion for up to 7 seconds
  await expect(page.getByTestId('status-badge')).toHaveText('Active', {
    timeout: 7000,
  });

  // Assertions can also poll custom logic
  await expect.poll(async () => {
    return page.getByRole('row').count();
  }, { timeout: 5000 }).toBeGreaterThan(0);

  // Soft assertions collect failures instead of stopping immediately
  await expect.soft(page.getByRole('heading')).toHaveText('Dashboard');
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which checks does Playwright perform before clicking?",
          options: [
            "Only that the element exists",
            "Visible, stable, enabled and able to receive events",
            "Only that the element is enabled",
            "Nothing — clicks are instant",
          ],
          correctIndices: [1],
          explanation:
            "Before acting, Playwright verifies actionability: attached, visible, stable (not animating), enabled and receiving pointer events.",
          type: "single",
        },
        {
          id: "q2",
          question: "Why should waitForTimeout be avoided?",
          options: [
            "It throws an error",
            "It always waits too little",
            "It makes tests slow and flaky because the wait is unrelated to app state",
            "It is not available in Playwright",
          ],
          correctIndices: [2],
          explanation:
            "Fixed sleeps either waste time or fail randomly. Web-first assertions wait for real state changes and continue as soon as they pass.",
          type: "single",
        },
        {
          id: "q3",
          question: "What is the default timeout for a web-first assertion?",
          options: ["1 second", "5 seconds", "30 seconds", "No timeout"],
          correctIndices: [1],
          explanation:
            "Assertions use the expect timeout, which defaults to 5 seconds and can be overridden per assertion or in the config.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a function that waits (retrying) for the status badge to read 'Active', with a 7000 ms timeout. Do not use waitForTimeout.",
        starterCode: `// TODO: use a web-first assertion with { timeout: 7000 }
async function waitForActiveBadge(page: any) {
  // Hint: await expect(page.getByTestId('status-badge')).toHaveText('Active', { timeout: 7000 });
}`,
        solution: `async function waitForActiveBadge(page: any) {
  await expect(page.getByTestId('status-badge')).toHaveText('Active', {
    timeout: 7000,
  });
}`,
        tests: [
          {
            description: "Uses a retrying assertion with a 7s timeout",
            code: `if (typeof waitForActiveBadge !== 'function') {
  console.log('FAIL: waitForActiveBadge is not defined');
} else {
  await waitForActiveBadge(page);
  var log = window.__mockLog.join(' | ');
  var src = window.__USER_CODE__;
  var ok = log.indexOf('toHaveText') !== -1 &&
    log.indexOf('status-badge') !== -1 &&
    src.indexOf('7000') !== -1 &&
    src.indexOf('waitForTimeout') === -1;
  console.log(ok
    ? 'PASS: Retrying assertion with a 7s timeout, no fixed sleeps'
    : 'FAIL: Log was ' + log);
}`,
            expected: "PASS: Retrying assertion with a 7s timeout, no fixed sleeps",
          },
        ],
      },
    },
    {
      id: "4.4",
      moduleId: "4",
      title: "Keyboard, Mouse & Drag-and-Drop",
      slug: "keyboard-mouse-and-drag-and-drop",
      duration: "30 min",
      description:
        "Drive the keyboard and mouse precisely, use shortcuts, hover menus, and perform drag-and-drop.",
      analogy: {
        title: "Using a Physical Keyboard and Mouse",
        description:
          "Sometimes you type a whole sentence, sometimes you just press Enter. Sometimes you hover to reveal a menu, and sometimes you physically drag a card across the desk. Playwright exposes each of these: fill() pastes a value, press() taps a key, hover() reveals menus, and dragTo() moves an element onto a target.",
        visual: "⌨️",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["fill(value)"] --> B["Input ready"]
  B --> C["press('Enter')"]
  C --> D["Results render"]
  D --> E["hover() menu"]
  E --> F["click() item"]
  F --> G["dragTo(target)"]
  style A fill:#4F46E5,color:#FFFFFF
  style C fill:#DBEAFE,color:#0F172A
  style E fill:#DBEAFE,color:#0F172A
  style G fill:#10B981,color:#052E16`,
        altText:
          "Keyboard and mouse actions: fill, press Enter, hover a menu, click, then drag to a drop target.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Search with the keyboard, open a hover menu, and drag a card into a drop zone.",
        code: `import { test, expect } from '@playwright/test';

test('search, hover and drag', async ({ page }) => {
  await page.goto('/shop');

  const search = page.getByPlaceholder('Search products');
  await search.fill('laptop');
  await search.press('Enter');

  await expect(page.getByRole('heading', { name: 'Results' })).toBeVisible();

  // Hover reveals the account menu
  await page.getByRole('button', { name: 'Account' }).hover();
  await page.getByRole('menuitem', { name: 'Orders' }).click();

  // Drag a product card into the cart drop zone
  const card = page.getByTestId('product-card').first();
  const dropZone = page.getByTestId('cart-drop-zone');
  await card.dragTo(dropZone);

  // Low-level input when no element API fits
  await page.mouse.move(200, 300);
  await page.mouse.down();
  await page.mouse.up();
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "What is the difference between fill() and type()?",
          options: [
            "fill() types character by character, type() pastes instantly",
            "fill() sets the value at once, type() sends individual key events",
            "They are identical",
            "type() only works on textareas",
          ],
          correctIndices: [1],
          explanation:
            "fill() sets the input value directly and is faster; type() (now pressSequentially) sends real key events and triggers key handlers.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which call submits a search after filling the input?",
          options: [
            "await search.submit()",
            "await search.press('Enter')",
            "await page.keyboard.enter()",
            "await search.click('Enter')",
          ],
          correctIndices: [1],
          explanation:
            "press('Enter') dispatches a real key press on the locator, triggering form submission handlers.",
          type: "single",
        },
        {
          id: "q3",
          question: "Which method performs a drag-and-drop between two locators?",
          options: ["locator.dragTo(target)", "locator.moveTo(target)", "page.drag(target)", "locator.drop(target)"],
          correctIndices: [0],
          explanation:
            "locator.dragTo(target) performs the mouse down, move and up sequence required for HTML5 drag-and-drop.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a function that fills the search box with 'laptop', presses Enter, hovers the Account menu, then drags the first product card to the cart drop zone.",
        starterCode: `// TODO: fill + press Enter + hover + dragTo
async function searchAndDrag(page: any) {
  const search = page.getByPlaceholder('Search products');
  // Your code here
}`,
        solution: `async function searchAndDrag(page: any) {
  const search = page.getByPlaceholder('Search products');
  await search.fill('laptop');
  await search.press('Enter');
  await page.getByRole('button', { name: 'Account' }).hover();
  const card = page.getByTestId('product-card').first();
  const dropZone = page.getByTestId('cart-drop-zone');
  await card.dragTo(dropZone);
}`,
        tests: [
          {
            description: "Uses fill, press, hover and dragTo",
            code: `if (typeof searchAndDrag !== 'function') {
  console.log('FAIL: searchAndDrag is not defined');
} else {
  await searchAndDrag(page);
  var log = window.__mockLog.join(' | ');
  var ok = log.indexOf('fill("laptop")') !== -1 &&
    log.indexOf('press("Enter")') !== -1 &&
    log.indexOf('hover()') !== -1 &&
    log.indexOf('dragTo(') !== -1;
  console.log(ok
    ? 'PASS: Keyboard, hover and drag actions executed'
    : 'FAIL: Missing an action. Log: ' + log);
}`,
            expected: "PASS: Keyboard, hover and drag actions executed",
          },
        ],
      },
    },
    {
      id: "4.5",
      moduleId: "4",
      title: "File Uploads, Downloads & Date Pickers",
      slug: "file-uploads-downloads-and-date-pickers",
      duration: "30 min",
      description:
        "Upload files, capture downloads, and fill date fields reliably across input types.",
      analogy: {
        title: "Handing a Document to a Clerk",
        description:
          "You hand a document over the counter, the clerk processes it, and you receive a stamped receipt. Uploads and downloads work the same way: setInputFiles hands the file to the browser, then you wait for the download event and save the receipt on disk. Date pickers are like writing the date in the exact format the clerk expects.",
        visual: "📄",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["getByLabel('Profile picture')"] --> B["setInputFiles('profile.png')"]
  B --> C["Server processes"]
  C --> D["waitForEvent('download')"]
  D --> E["download.saveAs('report.pdf')"]
  F["getByLabel('Start date')"] --> G["fill('2025-06-01')"]
  style B fill:#4F46E5,color:#FFFFFF
  style D fill:#FEF3C7,color:#78350F
  style E fill:#10B981,color:#052E16
  style G fill:#10B981,color:#052E16`,
        altText:
          "Upload a file, wait for the download event, save it, and fill a date input in ISO format.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Upload an avatar, download a generated report, and fill a date field.",
        code: `import { test, expect } from '@playwright/test';

test('upload avatar and export report', async ({ page }) => {
  await page.goto('/profile/settings');

  await page.getByLabel('Profile picture').setInputFiles('fixtures/profile.png');
  await expect(page.getByText('Upload complete')).toBeVisible();

  // Start waiting BEFORE clicking so the event is never missed
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export report' }).click();
  const download = await downloadPromise;

  console.log('Downloading:', download.suggestedFilename());
  await download.saveAs('downloads/report.pdf');

  // Native date inputs accept ISO strings
  await page.getByLabel('Start date').fill('2025-06-01');
  await expect(page.getByLabel('Start date')).toHaveValue('2025-06-01');
});`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which method uploads a file to an <input type='file'> element?",
          options: ["locator.upload()", "locator.setInputFiles()", "page.sendFile()", "locator.choose()"],
          correctIndices: [1],
          explanation:
            "setInputFiles() accepts a path, an array of paths, or in-memory file payloads to populate the file input.",
          type: "single",
        },
        {
          id: "q2",
          question: "Why start waitForEvent('download') before clicking the download button?",
          options: [
            "It is faster",
            "The event can fire before you start waiting, so you would miss it",
            "Playwright requires it for uploads",
            "It cancels the download",
          ],
          correctIndices: [1],
          explanation:
            "Downloads can start the moment the click is processed. Creating the promise first guarantees the listener is registered in time.",
          type: "single",
        },
        {
          id: "q3",
          question: "How do you fill a native date input for 1 June 2025?",
          options: [
            "fill('01/06/2025')",
            "fill('2025-06-01')",
            "type('June 1')",
            "selectOption('June')",
          ],
          correctIndices: [1],
          explanation:
            "Native <input type='date'> elements expect the ISO format YYYY-MM-DD, so fill('2025-06-01').",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a function that uploads 'profile.png', starts waiting for the download before clicking 'Export report', saves it as 'report.pdf', and sets the Start date to 2025-06-01.",
        starterCode: `// TODO: setInputFiles -> waitForEvent('download') -> saveAs -> fill date
async function uploadAvatarAndDownloadReport(page: any) {
  // Your code here
}`,
        solution: `async function uploadAvatarAndDownloadReport(page: any) {
  await page.getByLabel('Profile picture').setInputFiles('profile.png');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export report' }).click();
  const download = await downloadPromise;
  await download.saveAs('report.pdf');

  await page.getByLabel('Start date').fill('2025-06-01');
}`,
        tests: [
          {
            description: "Uploads, captures the download, and fills the date",
            code: `if (typeof uploadAvatarAndDownloadReport !== 'function') {
  console.log('FAIL: uploadAvatarAndDownloadReport is not defined');
} else {
  await uploadAvatarAndDownloadReport(page);
  var log = window.__mockLog.join(' | ');
  var src = window.__USER_CODE__;
  var waitIndex = log.indexOf('waitForEvent("download")');
  var clickIndex = log.indexOf('click()');
  var ok = log.indexOf('setInputFiles(profile.png)') !== -1 &&
    waitIndex !== -1 &&
    clickIndex !== -1 &&
    waitIndex < clickIndex &&
    log.indexOf('saveAs("report.pdf")') !== -1 &&
    log.indexOf('fill("2025-06-01")') !== -1 &&
    src.indexOf('waitForTimeout') === -1;
  console.log(ok
    ? 'PASS: Upload, download and date handling are correct'
    : 'FAIL: Actions were ' + log);
}`,
            expected: "PASS: Upload, download and date handling are correct",
          },
        ],
      },
    },
  ],
};
