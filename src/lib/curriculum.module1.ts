/**
 * Module 1: TypeScript Foundations for Beginners
 * 5 lessons covering TS basics, functions, async/await, interfaces, and control flow.
 */
import { Module } from "./types";

export const module1: Module = {
  id: "1",
  title: "TypeScript Foundations for Beginners",
  icon: "📦",
  description:
    "Master TypeScript basics — types, functions, promises, interfaces, and control flow — with analogies and hands-on coding challenges.",
  lessons: [
    {
      id: "1.1",
      moduleId: "1",
      title: "Modern JS & TS Basics",
      slug: "modern-js-ts-basics",
      duration: "15 min",
      description:
        "Learn the difference between JavaScript and TypeScript, and declare your first typed variables.",
      analogy: {
        title: "Variables as Labeled Storage Boxes",
        description:
          "Think of variables like labeled storage boxes. A label tells you what type of item is inside. In JavaScript, you can put anything in any box — a 'shoe' label might later hold a 'book' and you won't know until you look. TypeScript ensures each box has the right label from the start, so you always know what's inside without opening it.",
        visual: "📦",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  subgraph JS["JavaScript (Dynamic Typing)"]
    direction LR
    JSLabel["📦 Box labelled 'shoe'"]
    JSContent["👟 Sneakers"]
    JSRetrieve["Retrieving → ? Unknown type!"]
  end

  subgraph TS["TypeScript (Static Typing)"]
    direction LR
    TSLabel["📦 Box labelled 'shoe: string'"]
    TSContent["👟 Sneakers (checked at compile time)"]
    TSRetrieve["Retrieving → ✅ string guaranteed"]
  end

  JS --> JSContent --> JSRetrieve
  TS --> TSContent --> TSRetrieve`,
        altText:
          "Comparison of JavaScript dynamic typing (box can hold any type) vs TypeScript static typing (box enforces type at compile time).",
      },
      codeExample: {
        language: "typescript",
        description:
          "Declare variables with explicit TypeScript types and see how the compiler enforces them.",
        code: `const username: string = "Shweta";
const age: number = 25;
const isBeginner: boolean = true;

console.log("Name:", username);
console.log("Age:", age);
console.log("Is Beginner:", isBeginner);`,
      },
      quiz: [
        {
          id: "q1",
          question: "What does TypeScript add to JavaScript?",
          options: [
            "Faster execution speed",
            "Static type checking at compile time",
            "A new web framework",
            "Automatic browser compatibility",
          ],
          correctIndices: [1],
          explanation:
            "TypeScript adds optional static typing that is checked at compile time, catching errors before the code runs.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which of these is a valid TypeScript type?",
          options: ["str", "String", "number", "float"],
          correctIndices: [2],
          explanation:
            "'number' is a built-in TypeScript type for both integers and decimals. 'String' (capitalized) is the object wrapper, not the primitive type.",
          type: "single",
        },
        {
          id: "q3",
          question: "If you declare `let x: number = 'hello'`, what happens?",
          options: [
            "x becomes the string 'hello'",
            "TypeScript shows a compile error",
            "x becomes undefined",
            "The program crashes at runtime",
          ],
          correctIndices: [1],
          explanation:
            "TypeScript catches the type mismatch at compile time, so you get an error before the code runs.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Declare three variables with appropriate TypeScript types: a string for your name, a number for your age, and a boolean indicating if you're a test automation learner.",
        starterCode: `// TODO: Declare typed variables here
const studentName: string = ""
const age: number = 0
const isAutomationLearner: boolean = false

console.log("Student:", studentName)
console.log("Age:", age)
console.log("Learning Automation:", isAutomationLearner)`,
        solution: `const studentName: string = "Shweta";
const age: number = 26;
const isAutomationLearner: boolean = true;

console.log("Student:", studentName);
console.log("Age:", age);
console.log("Learning Automation:", isAutomationLearner);`,
        tests: [
          {
            description: "Variables are declared and logged",
            code: `
var ok = typeof studentName === 'string' && studentName.length > 0 &&
  typeof age === 'number' && age > 0 &&
  isAutomationLearner === true;
console.log(ok
  ? 'PASS: All variables typed and logged correctly'
  : 'FAIL: Set a non-empty name, a positive age and isAutomationLearner = true');
`,
            expected: "PASS: All variables typed and logged correctly",
          },
        ],
      },
    },
    {
      id: "1.2",
      moduleId: "1",
      title: "Functions & Basic Logic",
      slug: "functions-and-basic-logic",
      duration: "20 min",
      description:
        "Write reusable functions that take inputs and return processed results.",
      analogy: {
        title: "A Kitchen Blender",
        description:
          "A function is like a kitchen blender. You put ingredients (inputs/parameters) in, press a button (call the function), the blades process them (function body), and out comes a smoothie (return value). Just as you can reuse the same blender with different ingredients, you can call the same function with different arguments.",
        visual: "🧃",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  A["Ingredients (Parameters)"] --> B["Blender (Function Body)"]
  B --> C["Smoothie (Return Value)"]
  style A fill:#E2E8F0,color:#0F172A
  style B fill:#4F46E5,color:#FFFFFF
  style C fill:#E2E8F0,color:#0F172A`,
        altText:
          "Function flow: parameters go in, function body processes, return value comes out.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Create a helper function that formats test data into a readable string.",
        code: `function formatTestData(name: string, passed: boolean): string {
  const status = passed ? "✅ PASS" : "❌ FAIL";
  return \`Test "\${name}" — \${status}\`;
}

console.log(formatTestData("Login Button Visible", true));
console.log(formatTestData("Error Message Displayed", false));`,
      },
      quiz: [
        {
          id: "q1",
          question:
            "What is the correct way to define a function that takes two string parameters and returns a string?",
          options: [
            "function myFunc(str1, str2) { return str1 + str2 }",
            "function myFunc(str1: string, str2: string): string { return str1 + str2 }",
            "const myFunc = (str1, str2) => str1 + str2",
            "Both B and C with type annotations",
          ],
          correctIndices: [1],
          explanation:
            "TypeScript requires type annotations on parameters and the return type. Option B is the fully typed version.",
          type: "single",
        },
        {
          id: "q2",
          question: "Which keyword is used to return a value from a function?",
          options: ["return", "break", "yield", "exit"],
          correctIndices: [0],
          explanation:
            "The 'return' keyword sends a value back to the caller and ends the function.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a function called `formatTestResult` that takes a test name (string) and a passed flag (boolean). It should return a formatted string like 'Test \"Login\" PASSED' or 'Test \"Logout\" FAILED'.",
        starterCode: `// TODO: Implement formatTestResult function
function formatTestResult(testName: string, passed: boolean): string {
  // Your code here
}

console.log(formatTestResult("Login", true));
console.log(formatTestResult("Logout", false));
console.log(formatTestResult("Dashboard Load", true));`,
        solution: `function formatTestResult(testName: string, passed: boolean): string {
  const result = passed ? "PASSED" : "FAILED";
  return \`Test "\${testName}" \${result}\`;
}

console.log(formatTestResult("Login", true));
console.log(formatTestResult("Logout", false));
console.log(formatTestResult("Dashboard Load", true));`,
        tests: [
          {
            description: "Function formats test results correctly",
            code: `if (typeof formatTestResult !== 'function') {
  console.log('FAIL: formatTestResult is not defined');
} else {
  var passedResult = formatTestResult('Login', true);
  var failedResult = formatTestResult('Logout', false);
  var ok = typeof passedResult === 'string' &&
    passedResult.indexOf('Login') !== -1 &&
    passedResult.indexOf('PASS') !== -1 &&
    failedResult.indexOf('Logout') !== -1 &&
    failedResult.indexOf('FAIL') !== -1;
  console.log(ok
    ? 'PASS: formatTestResult works correctly'
    : 'FAIL: Expected formatted PASS/FAIL strings, got ' + passedResult + ' and ' + failedResult);
}`,
            expected: "PASS: formatTestResult works correctly",
          },
        ],
      },
    },
    {
      id: "1.3",
      moduleId: "1",
      title: "Promises & Async / Await",
      slug: "promises-and-async-await",
      duration: "25 min",
      description:
        "Convert callback-based code to clean async/await syntax for better readability.",
      analogy: {
        title: "Ordering Food at a Restaurant Counter",
        description:
          "A Promise is like getting an order buzzer at a restaurant. Instead of standing at the counter waiting (blocking), you sit down and do other things. When your food is ready, the buzzer rings (the Promise resolves). async/await is like saying 'I'll wait here until the buzzer rings' — it makes asynchronous code look and feel synchronous.",
        visual: "🍔",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  subgraph Sync["Synchronous (Blocking)"]
    direction TB
    S1["1. Start task"] --> S2["2. Wait for completion"]
    S2 --> S3["3. Do next task"]
  end

  subgraph Async["Asynchronous (Non-blocking)"]
    direction TB
    A1["1. Start task + get buzzer (Promise)"] --> A2["2. Do other things while waiting"]
    A2 --> A3["3. Buzzer rings → await result"]
    A3 --> A4["4. Do next task"]
  end

  Sync --> Async
  style S1 fill:#E2E8F0,color:#0F172A
  style S2 fill:#E2E8F0,color:#0F172A
  style S3 fill:#E2E8F0,color:#0F172A
  style A1 fill:#E2E8F0,color:#0F172A
  style A2 fill:#E2E8F0,color:#0F172A
  style A3 fill:#E2E8F0,color:#0F172A
  style A4 fill:#E2E8F0,color:#0F172A`,
        altText:
          "Synchronous blocking workflow vs asynchronous non-blocking workflow using promises and async/await.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Simulate fetching test results from an API using async/await instead of nested callbacks.",
        code: `async function fetchTestStatus(testId: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Test " + testId + " completed successfully");
    }, 100);
  });
}

async function runAllTests() {
  console.log("Starting test suite...");
  const result1 = await fetchTestStatus("T001");
  console.log(result1);
  const result2 = await fetchTestStatus("T002");
  console.log(result2);
  console.log("All tests finished!");
}

runAllTests();`,
      },
      quiz: [
        {
          id: "q1",
          question: "What does the 'async' keyword do?",
          options: [
            "Makes a function run faster",
            "Makes a function return a Promise",
            "Stops a function from running",
            "Converts a function to a callback",
          ],
          correctIndices: [1],
          explanation:
            "The 'async' keyword ensures the function always returns a Promise and allows using 'await' inside it.",
          type: "single",
        },
        {
          id: "q2",
          question: "What happens when you 'await' a Promise that hasn't resolved yet?",
          options: [
            "It returns undefined immediately",
            "The function throws an error",
            "Execution pauses until the Promise resolves or rejects",
            "It skips to the next line",
          ],
          correctIndices: [2],
          explanation:
            "'await' pauses execution of the async function until the Promise settles (resolves or rejects).",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Rewrite this callback-based code using async/await. The function should simulate fetching data and log the result.",
        starterCode: `// TODO: Rewrite using async/await
function fetchData(url: string, callback: (data: string) => void) {
  setTimeout(() => {
    callback("Data from: " + url);
  }, 100);
}

function run() {
  fetchData("https://api.tests.com/results", function(data) {
    console.log(data);
  });
}

run();`,
        solution: `async function fetchData(url: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data from: " + url);
    }, 100);
  });
}

async function run() {
  const data = await fetchData("https://api.tests.com/results");
  console.log(data);
}

run();`,
        tests: [
          {
            description: "Async/await version resolves and logs correctly",
            code: `var source = window.__USER_CODE__ || '';
var hasAsync = source.indexOf('async function') !== -1 || source.indexOf('async (') !== -1;
var hasAwait = source.indexOf('await ') !== -1;
var hasPromise = source.indexOf('new Promise') !== -1;
var noCallbackParam = source.indexOf('callback') === -1;
console.log(hasAsync && hasAwait && hasPromise && noCallbackParam
  ? 'PASS: async/await version works correctly'
  : 'FAIL: Convert the callback version to async/await (no callback parameter)');`,
            expected: "PASS: async/await version works correctly",
          },
        ],
      },
    },
    {
      id: "1.4",
      moduleId: "1",
      title: "Arrays, Objects & Interfaces",
      slug: "arrays-objects-interfaces",
      duration: "25 min",
      description:
        "Structure test data using typed objects and interfaces for better code organization.",
      analogy: {
        title: "An Interface as a Structured Checklist",
        description:
          "An interface is like a job application form template. It defines exactly which fields are required (name, email, phone) and what types they should be. Just as the form enforces structure on the applicant's data, a TypeScript interface enforces structure on your objects — and the compiler checks it before your code runs.",
        visual: "📋",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart LR
  subgraph Form["Interface: TestUser"]
    direction TB
    F1["name: string"]
    F2["email: string"]
    F3["age: number"]
  end

  subgraph Data["Object: rajUser"]
    direction TB
    D1["name = \"Raj\""]
    D2["email = \"raj@test.com\""]
    D3["age = 25"]
  end

  Form --> Data
  style Form fill:#DBEAFE,color:#0F172A
  style Data fill:#FFEDD5,color:#7C2D12`,
        altText:
          "An interface defines field structure; an object provides values matching that interface.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Create a typed interface for test users and instantiate objects that follow it.",
        code: `interface TestUser {
  username: string;
  password: string;
  email: string;
  isActive: boolean;
}

const users: TestUser[] = [
  { username: "shweta", password: "pass123", email: "shweta@test.com", isActive: true },
  { username: "raj", password: "pass456", email: "raj@test.com", isActive: true },
];

function getUsernames(users: TestUser[]): string[] {
  return users.map((u) => u.username);
}

console.log(getUsernames(users));`,
      },
      quiz: [
        {
          id: "q1",
          question:
            "What is the correct way to declare an array of strings in TypeScript?",
          options: ["string[]", "Array<string>", "string list", "Both A and B"],
          correctIndices: [3],
          explanation:
            "Both 'string[]' and 'Array<string>' are valid ways to declare an array of strings in TypeScript.",
          type: "single",
        },
        {
          id: "q2",
          question: "What does an interface enforce?",
          options: [
            "Runtime performance",
            "Object shape and property types at compile time",
            "Network requests",
            "Database schema",
          ],
          correctIndices: [1],
          explanation:
            "Interfaces enforce that objects have the correct shape (properties) and types at compile time.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Define a TestUser interface with fields: username, password, email, and isActive. Create an array of TestUser objects. Write a function that filters only active users.",
        starterCode: `// TODO: Define interface, create array, and filter active users
interface TestUser {
  // add fields here
}
const testUsers: TestUser[] = [
  // add 3 users here
];
function getActiveUsers(users: TestUser[]): TestUser[] {
  // return only active users
}
console.log(getActiveUsers(testUsers));`,
        solution: `interface TestUser {
  username: string;
  password: string;
  email: string;
  isActive: boolean;
}
const testUsers: TestUser[] = [
  { username: "shweta", password: "pass123", email: "shweta@test.com", isActive: true },
  { username: "raj", password: "pass456", email: "raj@test.com", isActive: false },
  { username: "guest", password: "pass789", email: "guest@test.com", isActive: true },
];
function getActiveUsers(users: TestUser[]): TestUser[] {
  return users.filter((u) => u.isActive);
}
console.log(getActiveUsers(testUsers));`,
        tests: [
          {
            description: "Active users are filtered correctly",
            code: `var ok = Array.isArray(testUsers) &&
  testUsers.length === 3 &&
  testUsers.every(function (user) {
    return user.username && user.password && user.email && typeof user.isActive === 'boolean';
  }) &&
  typeof getActiveUsers === 'function' &&
  getActiveUsers(testUsers).length === 2 &&
  getActiveUsers(testUsers).every(function (user) { return user.isActive; });
console.log(ok
  ? 'PASS: Active users filtered correctly'
  : 'FAIL: Define the interface fields, three users and filter by isActive');`,
            expected: "PASS: Active users filtered correctly",
          },
        ],
      },
    },
    {
      id: "1.5",
      moduleId: "1",
      title: "Control Flow & Basic Loops",
      slug: "control-flow-and-loops",
      duration: "20 min",
      description:
        "Use if/else and loops to evaluate test results and iterate over test data.",
      analogy: {
        title: "Traffic Lights Directing Traffic",
        description:
          "Control flow is like a traffic light. Green (if) lets you go down one path; red (else) sends you down another. Loops are like a roundabout that keeps cycling until the exit condition (yellow light) is met — each lap processes one more data point until all are handled.",
        visual: "🚦",
      },
      diagram: {
        type: "mermaid",
        chart: `flowchart TD
  Start(["Start: Check Test Result"]) --> Check{"Did test pass?"}
  Check -->|"Yes (Green)"| Pass["PASS: ✅ Continue"]
  Check -->|"No (Red)"| Fail["FAIL: ❌ Handle error"]
  Pass --> Next["Next test in loop"]
  Fail --> Next
  LoopCheck{"More tests?"} -->|"Yes (Loop)"| Next
  LoopCheck -->|"No (Exit)"| End(["End"])
  Next --> LoopCheck
  style Start fill:#E0F2FE,color:#0C4A6E
  style End fill:#E0F2FE,color:#0C4A6E
  style Check fill:#FEF3C7,color:#78350F
  style LoopCheck fill:#FEF3C7,color:#78350F`,
        altText:
          "Traffic light analogy: if/else branches (green/red) and a loop roundabout that cycles until exit.",
      },
      codeExample: {
        language: "typescript",
        description:
          "Iterate over test results using a for loop and evaluate pass/fail conditions.",
        code: `const testResults = [
  { name: "Login", passed: true },
  { name: "Logout", passed: false },
  { name: "Dashboard Load", passed: true },
];

for (const result of testResults) {
  if (result.passed) {
    console.log("✅ Test '" + result.name + "' PASSED");
  } else {
    console.log("❌ Test '" + result.name + "' FAILED");
  }
}

console.log("Total tests: " + testResults.length);`,
      },
      quiz: [
        {
          id: "q1",
          question: "Which loop iterates over each element of an array without an index counter?",
          options: ["for loop", "while loop", "for...of loop", "do...while loop"],
          correctIndices: [2],
          explanation:
            "The 'for...of' loop iterates directly over array elements without needing an index variable.",
          type: "single",
        },
        {
          id: "q2",
          question: "What will this evaluate to: `if (false) { console.log('yes') } else { console.log('no') }`?",
          options: ["'yes'", "'no'", "undefined", "An error"],
          correctIndices: [1],
          explanation:
            "Since the condition is false, the else branch executes and logs 'no'.",
          type: "single",
        },
      ],
      codingTask: {
        description:
          "Write a loop that checks a list of test results. For each result, log 'PASS' or 'FAIL', and at the end, log how many passed and how many failed.",
        starterCode: `// TODO: Loop through results and check pass/fail
const results = [
  { test: "Login Visible", passed: true },
  { test: "Password Field", passed: true },
  { test: "Submit Button Click", passed: false },
  { test: "Dashboard Loaded", passed: true },
];
let passedCount = 0;
let failedCount = 0;
// Your loop here
console.log("Passed:", passedCount);
console.log("Failed:", failedCount);`,
        solution: `const results = [
  { test: "Login Visible", passed: true },
  { test: "Password Field", passed: true },
  { test: "Submit Button Click", passed: false },
  { test: "Dashboard Loaded", passed: true },
];
let passedCount = 0;
let failedCount = 0;
for (const result of results) {
  if (result.passed) {
    console.log("✅ PASS: " + result.test);
    passedCount++;
  } else {
    console.log("❌ FAIL: " + result.test);
    failedCount++;
  }
}
console.log("Passed:", passedCount);
console.log("Failed:", failedCount);`,
        tests: [
          {
            description: "Counts pass and fail correctly",
            code: `var ok = typeof passedCount !== 'undefined' &&
  typeof failedCount !== 'undefined' &&
  passedCount === 3 &&
  failedCount === 1;
console.log(ok
  ? 'PASS: Counts are correct - 3 passed, 1 failed'
  : 'FAIL: Expected 3 passed, 1 failed, got ' + passedCount + ' and ' + failedCount);`,
            expected: "PASS: Counts are correct - 3 passed, 1 failed",
          },
        ],
      },
    },
  ],
};