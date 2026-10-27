/**
 * Sandboxed iframe document used by <CodeRunner />.
 *
 * The script below runs with **no network access** and provides:
 *  - a console bridge back to the parent window (`stdout` / `stderr`)
 *  - async execution (so top-level `await` works in lessons)
 *  - `window.__USER_CODE__` so tests can inspect the learner's source
 *  - a lightweight **simulated Playwright API** (`page`, `expect`, `test`,
 *    `request`, `chromium`, `devices`, `defineConfig`, ...) that records every
 *    action in `window.__mockLog` instead of launching a real browser.
 */
const SANDBOX_SCRIPT = String.raw`
(function () {
  var send = function (type, data) {
    window.parent.postMessage({ type: type, data: data }, '*');
  };

  var stringify = function (value) {
    try {
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    } catch (e) {
      return String(value);
    }
  };

  console.log = function () {
    for (var i = 0; i < arguments.length; i++) send('stdout', stringify(arguments[i]));
  };
  console.info = console.log;
  console.warn = function () {
    for (var i = 0; i < arguments.length; i++) send('stderr', stringify(arguments[i]));
  };
  console.error = console.warn;

  window.__mockLog = [];
  window.__pending = [];
  window.__USER_CODE__ = '';

  function rec(action) {
    window.__mockLog.push(action);
    console.log('> ' + action);
  }

  function track(promise) {
    window.__pending.push(promise);
    return promise;
  }

  function optName(options) {
    return options && options.name ? ', { name: "' + options.name + '" }' : '';
  }

  function makeLocator(desc) {
    var loc = { _desc: desc, __isLocator: true };

    var simple = ['click', 'dblclick', 'hover', 'check', 'uncheck', 'focus', 'blur', 'tap', 'scrollIntoViewIfNeeded'];
    simple.forEach(function (action) {
      loc[action] = function () {
        rec(action + '() -> ' + desc);
        return Promise.resolve();
      };
    });

    loc.fill = function (value) {
      rec('fill("' + value + '") -> ' + desc);
      return Promise.resolve();
    };
    loc.type = function (value) {
      rec('type("' + value + '") -> ' + desc);
      return Promise.resolve();
    };
    loc.press = function (key) {
      rec('press("' + key + '") -> ' + desc);
      return Promise.resolve();
    };
    loc.pressSequentially = function (value) {
      rec('pressSequentially("' + value + '") -> ' + desc);
      return Promise.resolve();
    };
    loc.selectOption = function (value) {
      rec('selectOption(' + stringify(value) + ') -> ' + desc);
      return Promise.resolve();
    };
    loc.setInputFiles = function (files) {
      rec('setInputFiles(' + stringify(files) + ') -> ' + desc);
      return Promise.resolve();
    };
    loc.dragTo = function (target) {
      rec('dragTo(' + (target && target._desc ? target._desc : String(target)) + ') -> ' + desc);
      return Promise.resolve();
    };
    loc.waitFor = function (options) {
      rec('waitFor(' + stringify(options || {}) + ') -> ' + desc);
      return Promise.resolve();
    };
    loc.locator = function (selector) {
      return makeLocator(desc + '.locator("' + selector + '")');
    };
    loc.getByRole = function (role, options) {
      return makeLocator(desc + '.getByRole("' + role + '"' + optName(options) + ')');
    };
    loc.getByText = function (text) {
      return makeLocator(desc + '.getByText("' + text + '")');
    };
    loc.getByLabel = function (label) {
      return makeLocator(desc + '.getByLabel("' + label + '")');
    };
    loc.getByTestId = function (id) {
      return makeLocator(desc + '.getByTestId("' + id + '")');
    };
    loc.filter = function (options) {
      return makeLocator(desc + '.filter(' + stringify(options || {}) + ')');
    };
    loc.first = function () { return makeLocator(desc + '.first()'); };
    loc.last = function () { return makeLocator(desc + '.last()'); };
    loc.nth = function (index) { return makeLocator(desc + '.nth(' + index + ')'); };
    loc.count = function () {
      rec('count() -> ' + desc);
      return Promise.resolve(3);
    };
    loc.all = function () {
      rec('all() -> ' + desc);
      return Promise.resolve([
        makeLocator(desc + '.nth(0)'),
        makeLocator(desc + '.nth(1)'),
        makeLocator(desc + '.nth(2)'),
      ]);
    };
    loc.allTextContents = function () {
      rec('allTextContents() -> ' + desc);
      return Promise.resolve(['Mock item 1', 'Mock item 2', 'Mock item 3']);
    };
    loc.textContent = function () {
      rec('textContent() -> ' + desc);
      return Promise.resolve('Mock text');
    };
    loc.innerText = loc.textContent;
    loc.inputValue = function () {
      rec('inputValue() -> ' + desc);
      return Promise.resolve('mock-value');
    };
    loc.getAttribute = function (name) {
      rec('getAttribute("' + name + '") -> ' + desc);
      return Promise.resolve('mock-attribute');
    };
    loc.isVisible = function () { return Promise.resolve(true); };
    loc.isEnabled = function () { return Promise.resolve(true); };
    loc.isChecked = function () { return Promise.resolve(false); };
    loc.isEditable = function () { return Promise.resolve(true); };
    loc.evaluate = function (fn) {
      rec('evaluate() -> ' + desc);
      try {
        return Promise.resolve(typeof fn === 'function' ? fn({ textContent: 'Mock text' }) : fn);
      } catch (e) {
        return Promise.resolve(null);
      }
    };
    return loc;
  }

  function makeExpect(actual) {
    var desc = actual && actual._desc ? actual._desc : stringify(actual);
    var matchers = {};

    var webFirst = ['toBeVisible', 'toBeHidden', 'toBeEnabled', 'toBeDisabled', 'toBeChecked',
      'toBeEditable', 'toBeEmpty', 'toBeFocused', 'toBeAttached', 'toBeInViewport',
      'toBeTruthy', 'toBeFalsy', 'toContainText', 'toHaveText', 'toHaveValue',
      'toHaveValues', 'toHaveCount', 'toHaveAttribute', 'toHaveClass', 'toHaveId',
      'toHaveCSS', 'toHaveJSProperty', 'toHaveURL', 'toHaveTitle', 'toMatchAriaSnapshot'];

    webFirst.forEach(function (name) {
      matchers[name] = function () {
        rec('expect(' + desc + ').' + name + '() PASSED');
        return Promise.resolve();
      };
    });

    var exact = ['toBe', 'toEqual', 'toStrictEqual', 'toContain', 'toMatch', 'toHaveLength',
      'toBeGreaterThan', 'toBeGreaterThanOrEqual', 'toBeLessThan', 'toBeLessThanOrEqual'];
    exact.forEach(function (name) {
      matchers[name] = function (expected) {
        var ok = true;
        if (name === 'toBe' || name === 'toEqual' || name === 'toStrictEqual') ok = actual === expected;
        if (name === 'toContain') ok = String(actual).indexOf(String(expected)) !== -1;
        if (name === 'toMatch') ok = new RegExp(expected).test(String(actual));
        if (name === 'toHaveLength') ok = !!actual && actual.length === expected;
        if (name === 'toBeGreaterThan') ok = actual > expected;
        if (name === 'toBeGreaterThanOrEqual') ok = actual >= expected;
        if (name === 'toBeLessThan') ok = actual < expected;
        if (name === 'toBeLessThanOrEqual') ok = actual <= expected;
        if (!ok) throw new Error('expect(' + desc + ').' + name + '(' + stringify(expected) + ') failed');
        rec('expect(' + desc + ').' + name + '(' + stringify(expected) + ') PASSED');
        return Promise.resolve();
      };
    });

    matchers.not = matchers;
    matchers.soft = matchers;
    matchers.resolves = matchers;
    return matchers;
  }

  var expect = makeExpect;
  expect.soft = makeExpect;
  expect.configure = function () { return expect; };
  expect.poll = function (fn, options) {
    rec('expect.poll(' + stringify(options || {}) + ')');
    return Promise.resolve()
      .then(fn)
      .then(function (value) {
        rec('expect.poll PASSED (value: ' + stringify(value) + ')');
      });
  };

  function makeResponse(payload, statusCode) {
    return {
      status: function () { return statusCode || 200; },
      ok: function () { return true; },
      url: function () { return 'https://mock.local/api/items'; },
      json: function () { return Promise.resolve(payload || { ok: true }); },
      text: function () { return Promise.resolve(JSON.stringify(payload || { ok: true })); },
      headers: function () { return { 'content-type': 'application/json' }; },
    };
  }

  function makeDownload() {
    return {
      suggestedFilename: function () { return 'report.pdf'; },
      url: function () { return 'https://mock.local/files/report.pdf'; },
      path: function () { return Promise.resolve('/tmp/report.pdf'); },
      saveAs: function (file) {
        rec('download.saveAs("' + file + '")');
        return Promise.resolve();
      },
      failure: function () { return Promise.resolve(null); },
    };
  }

  function makePage() {
    var page = { __isPage: true };

    page.goto = function (url) {
      rec('goto("' + url + '")');
      return Promise.resolve(makeResponse({ ok: true }));
    };
    page.reload = function () { rec('reload()'); return Promise.resolve(); };
    page.goBack = function () { rec('goBack()'); return Promise.resolve(null); };
    page.goForward = function () { rec('goForward()'); return Promise.resolve(null); };
    page.title = function () { rec('title()'); return Promise.resolve('Mock Page Title'); };
    page.url = function () { return Promise.resolve('https://mock.local/'); };
    page.content = function () { return Promise.resolve('<html><body>Mock</body></html>'); };
    page.close = function () { rec('page.close()'); return Promise.resolve(); };
    page.setViewportSize = function (size) {
      rec('setViewportSize(' + stringify(size) + ')');
      return Promise.resolve();
    };

    page.getByRole = function (role, options) {
      return makeLocator('page.getByRole("' + role + '"' + optName(options) + ')');
    };
    page.getByLabel = function (label) {
      return makeLocator('page.getByLabel("' + label + '")');
    };
    page.getByText = function (text) {
      return makeLocator('page.getByText("' + text + '")');
    };
    page.getByPlaceholder = function (placeholder) {
      return makeLocator('page.getByPlaceholder("' + placeholder + '")');
    };
    page.getByTestId = function (id) {
      return makeLocator('page.getByTestId("' + id + '")');
    };
    page.getByAltText = function (text) {
      return makeLocator('page.getByAltText("' + text + '")');
    };
    page.getByTitle = function (title) {
      return makeLocator('page.getByTitle("' + title + '")');
    };
    page.locator = function (selector) {
      return makeLocator('page.locator("' + selector + '")');
    };

    // Legacy selector-based APIs (still supported by Playwright)
    page.click = function (selector, options) {
      rec('page.click("' + selector + '")');
      return Promise.resolve();
    };
    page.dblclick = function (selector) {
      rec('page.dblclick("' + selector + '")');
      return Promise.resolve();
    };
    page.fill = function (selector, value) {
      rec('page.fill("' + selector + '", "' + value + '")');
      return Promise.resolve();
    };
    page.type = function (selector, value) {
      rec('page.type("' + selector + '", "' + value + '")');
      return Promise.resolve();
    };
    page.press = function (selector, key) {
      rec('page.press("' + selector + '", "' + key + '")');
      return Promise.resolve();
    };
    page.hover = function (selector) {
      rec('page.hover("' + selector + '")');
      return Promise.resolve();
    };
    page.check = function (selector) {
      rec('page.check("' + selector + '")');
      return Promise.resolve();
    };
    page.waitForSelector = function (selector) {
      rec('page.waitForSelector("' + selector + '")');
      return Promise.resolve(makeLocator('page.locator("' + selector + '")'));
    };
    page.bringToFront = function () {
      rec('bringToFront()');
      return Promise.resolve(page);
    };
    page.frame = function (options) {
      rec('frame(' + stringify(options) + ')');
      return makeLocator('page.frame(' + stringify(options) + ')');
    };
    page.frames = function () {
      rec('frames()');
      return [page.mainFrame()];
    };
    page.mainFrame = function () {
      return makeLocator('page.mainFrame()');
    };
    page.frameLocator = function (selector) {
      return makeLocator('page.frameLocator("' + selector + '")');
    };

    page.keyboard = {
      press: function (key) { rec('keyboard.press("' + key + '")'); return Promise.resolve(); },
      type: function (text) { rec('keyboard.type("' + text + '")'); return Promise.resolve(); },
      down: function (key) { rec('keyboard.down("' + key + '")'); return Promise.resolve(); },
      up: function (key) { rec('keyboard.up("' + key + '")'); return Promise.resolve(); },
    };
    page.mouse = {
      move: function (x, y) { rec('mouse.move(' + x + ', ' + y + ')'); return Promise.resolve(); },
      click: function (x, y) { rec('mouse.click(' + x + ', ' + y + ')'); return Promise.resolve(); },
      dblclick: function (x, y) { rec('mouse.dblclick(' + x + ', ' + y + ')'); return Promise.resolve(); },
      down: function () { rec('mouse.down()'); return Promise.resolve(); },
      up: function () { rec('mouse.up()'); return Promise.resolve(); },
      wheel: function (dx, dy) { rec('mouse.wheel(' + dx + ', ' + dy + ')'); return Promise.resolve(); },
    };

    page.on = function (event, handler) {
      rec('on("' + event + '")');
      var eventObject = {
        type: function () { return event; },
        message: function () { return 'Mock dialog message'; },
        accept: function () { rec('dialog.accept()'); return Promise.resolve(); },
        dismiss: function () { rec('dialog.dismiss()'); return Promise.resolve(); },
        url: function () { return 'https://mock.local/files/report.pdf'; },
        suggestedFilename: function () { return 'report.pdf'; },
        saveAs: function (file) { rec('download.saveAs("' + file + '")'); return Promise.resolve(); },
        failure: function () { return Promise.resolve(null); },
        text: function () { return Promise.resolve(''); },
        json: function () { return Promise.resolve({}); },
      };
      try {
        if (typeof handler === 'function') {
          var result = handler(eventObject);
          if (result && typeof result.catch === 'function') result.catch(function () {});
        }
      } catch (e) {}
      return page;
    };
    page.once = page.on;

    page.route = function (pattern, handler) {
      rec('route("' + pattern + '")');
      var route = {
        request: function () {
          return {
            url: function () { return pattern; },
            method: function () { return 'GET'; },
            headers: function () { return {}; },
            postDataJSON: function () { return {}; },
          };
        },
        fulfill: function (options) {
          rec('route.fulfill(' + stringify(options || {}) + ')');
          return Promise.resolve();
        },
        abort: function (reason) {
          rec('route.abort("' + (reason || 'failed') + '")');
          return Promise.resolve();
        },
        continue: function () { rec('route.continue()'); return Promise.resolve(); },
        fallback: function () { rec('route.fallback()'); return Promise.resolve(); },
      };
      try {
        if (typeof handler === 'function') {
          var result = handler(route);
          if (result && typeof result.catch === 'function') result.catch(function () {});
        }
      } catch (e) {}
      return Promise.resolve();
    };
    page.unroute = function (pattern) { rec('unroute("' + pattern + '")'); return Promise.resolve(); };
    page.routeFromHAR = function (har) { rec('routeFromHAR("' + har + '")'); return Promise.resolve(); };

    page.waitForResponse = function (matcher) {
      rec('waitForResponse(' + (typeof matcher === 'string' ? '"' + matcher + '"' : 'matcher') + ')');
      return Promise.resolve(makeResponse({ items: [], total: 3 }));
    };
    page.waitForRequest = function (matcher) {
      rec('waitForRequest(' + (typeof matcher === 'string' ? '"' + matcher + '"' : 'matcher') + ')');
      return Promise.resolve({
        url: function () { return 'https://mock.local/api'; },
        method: function () { return 'GET'; },
      });
    };
    page.waitForURL = function (pattern) {
      rec('waitForURL(' + stringify(pattern) + ')');
      return Promise.resolve();
    };
    page.waitForLoadState = function (state) {
      rec('waitForLoadState("' + (state || 'load') + '")');
      return Promise.resolve();
    };
    page.waitForTimeout = function (ms) {
      rec('waitForTimeout(' + ms + ')');
      return Promise.resolve();
    };
    page.waitForEvent = function (event) {
      rec('waitForEvent("' + event + '")');
      if (event === 'download') return Promise.resolve(makeDownload());
      return Promise.resolve(makeResponse({}));
    };
    page.screenshot = function (options) {
      rec('screenshot(' + stringify(options || {}) + ')');
      return Promise.resolve('mock-screenshot.png');
    };
    page.setInputFiles = function (selector, files) {
      rec('setInputFiles(' + stringify(files) + ')');
      return Promise.resolve();
    };
    page.addInitScript = function (script) {
      rec('addInitScript()');
      try {
        if (typeof script === 'function') script();
      } catch (e) {}
      return Promise.resolve();
    };
    page.evaluate = function (fn, arg) {
      rec('evaluate()');
      try {
        return Promise.resolve(typeof fn === 'function' ? fn(arg) : fn);
      } catch (e) {
        return Promise.resolve(null);
      }
    };
    return page;
  }

  function makeRequest() {
    var request = {};
    var methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'fetch'];
    methods.forEach(function (method) {
      request[method] = function (url) {
        rec('request.' + method + '("' + url + '")');
        var statusCode = method === 'post' ? 201 : 200;
        return Promise.resolve(makeResponse({
          ok: true,
          id: 'user_123',
          token: 'mock-token',
          items: [{ id: 1 }, { id: 2 }],
          total: 3,
        }, statusCode));
      };
    });
    request.dispose = function () { return Promise.resolve(); };
    return request;
  }

  var page = makePage();

  var context = {
    newPage: function () { rec('context.newPage()'); return Promise.resolve(page); },
    pages: function () { return [page]; },
    close: function () { rec('context.close()'); return Promise.resolve(); },
    storageState: function (options) {
      rec('context.storageState(' + stringify(options || {}) + ')');
      return Promise.resolve({ cookies: [], origins: [] });
    },
    addCookies: function () { rec('context.addCookies()'); return Promise.resolve(); },
    clearCookies: function () { return Promise.resolve(); },
    grantPermissions: function () { rec('grantPermissions()'); return Promise.resolve(); },
    setDefaultTimeout: function (ms) { rec('setDefaultTimeout(' + ms + ')'); },
    waitForEvent: function (event) {
      rec('context.waitForEvent("' + event + '")');
      return Promise.resolve(event === 'page' ? page : makeResponse({}));
    },
    waitForPage: function () {
      rec('context.waitForPage()');
      return Promise.resolve(page);
    },
    route: page.route,
    unroute: page.unroute,
    addInitScript: page.addInitScript,
  };

  var browser = {
    newContext: function (options) {
      rec('browser.newContext(' + stringify(options || {}) + ')');
      return Promise.resolve(context);
    },
    newPage: function () { rec('browser.newPage()'); return Promise.resolve(page); },
    close: function () { rec('browser.close()'); return Promise.resolve(); },
    contexts: function () { return [context]; },
    version: function () { return '1.50.0-mock'; },
    isConnected: function () { return true; },
  };

  function makeBrowserType(name) {
    return {
      name: function () { return name; },
      launch: function (options) {
        rec(name + '.launch(' + stringify(options || {}) + ')');
        return Promise.resolve(browser);
      },
      launchPersistentContext: function () {
        rec(name + '.launchPersistentContext()');
        return Promise.resolve(context);
      },
      connect: function () {
        rec(name + '.connect()');
        return Promise.resolve(browser);
      },
      executablePath: function () { return '/mock/' + name; },
    };
  }

  var defineConfig = function (config) {
    rec('defineConfig()');
    return config;
  };

  var devices = {
    'Desktop Chrome': { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 },
    'Desktop Firefox': { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 },
    'Desktop Safari': { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 },
    'Pixel 5': { viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true },
    'iPhone 13': { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  };

  var process = {
    env: {
      BASE_URL: 'https://staging.example.com',
      CI: 'true',
      NODE_ENV: 'test',
    },
    platform: 'browser',
    version: 'v22.0.0',
  };

  window.page = page;
  window.context = context;
  window.browser = browser;
  window.request = makeRequest();
  window.expect = expect;
  window.defineConfig = defineConfig;
  window.devices = devices;
  window.process = process;
  window.chromium = makeBrowserType('chromium');
  window.firefox = makeBrowserType('firefox');
  window.webkit = makeBrowserType('webkit');

  var beforeEachHooks = [];
  var afterEachHooks = [];
  var beforeAllHooks = [];
  var beforeAllDone = false;

  function makeFixtures() {
    return {
      page: page,
      context: context,
      browser: browser,
      request: window.request,
      browserName: 'chromium',
    };
  }

  var test = function (name, fn) {
    rec('test("' + name + '")');
    var fixtures = makeFixtures();
    var run = (async function () {
      if (!beforeAllDone) {
        beforeAllDone = true;
        for (var b = 0; b < beforeAllHooks.length; b++) {
          await beforeAllHooks[b](fixtures);
        }
      }
      for (var i = 0; i < beforeEachHooks.length; i++) {
        await beforeEachHooks[i](fixtures);
      }
      await fn(fixtures);
      for (var j = 0; j < afterEachHooks.length; j++) {
        await afterEachHooks[j](fixtures);
      }
    })()
      .then(function () { rec('test PASSED: ' + name); })
      .catch(function (error) {
        console.error('Error: ' + (error && error.message ? error.message : error));
      });
    return track(run);
  };

  test.describe = function (name, fn) {
    rec('describe("' + name + '")');
    fn();
  };
  test.describe.configure = function (options) {
    rec('describe.configure(' + stringify(options || {}) + ')');
  };
  test.beforeEach = function (fn) { beforeEachHooks.push(fn); };
  test.afterEach = function (fn) { afterEachHooks.push(fn); };
  test.beforeAll = function (fn) { beforeAllHooks.push(fn); };
  test.afterAll = function () {};
  test.skip = function (name) {
    if (typeof name === 'string') rec('test.skip("' + name + '")');
  };
  test.only = test;
  test.fixme = test.skip;
  test.slow = function () {};
  test.step = function (name, fn) {
    rec('step("' + name + '")');
    return Promise.resolve().then(fn);
  };
  test.use = function (options) {
    rec('test.use(' + stringify(options || {}) + ')');
  };
  test.extend = function (definitions) {
    var base = test;
    var extended = function (name, fn) {
      return base(name, async function (fixtures) {
        var merged = {};
        var key;
        for (key in fixtures) merged[key] = fixtures[key];
        for (key in definitions) {
          var definition = definitions[key];
          if (typeof definition === 'function') {
            var captured;
            var use = async function (value) { captured = value; };
            await definition(merged, use);
            merged[key] = captured;
          } else {
            merged[key] = definition;
          }
        }
        return fn(merged);
      });
    };
    extended.describe = base.describe;
    extended.beforeEach = base.beforeEach;
    extended.afterEach = base.afterEach;
    extended.beforeAll = base.beforeAll;
    extended.afterAll = base.afterAll;
    extended.extend = base.extend;
    extended.step = base.step;
    extended.skip = base.skip;
    extended.use = base.use;
    return extended;
  };

  window.test = test;

  window.exports = {};
  window.module = { exports: window.exports };
  window.require = function (name) {
    var modules = {
      '@playwright/test': {
        test: test,
        expect: expect,
        devices: devices,
        defineConfig: defineConfig,
      },
      '@playwright/test/reporter': {
        default: function Reporter() {},
        Reporter: function Reporter() {},
      },
      'playwright': {
        chromium: window.chromium,
        firefox: window.firefox,
        webkit: window.webkit,
        devices: devices,
      },
      'playwright-core': {
        chromium: window.chromium,
        firefox: window.firefox,
        webkit: window.webkit,
      },
      'dotenv': {
        config: function () { return { parsed: process.env }; },
      },
      'fs': {
        readFileSync: function () { return '{}'; },
        writeFileSync: function () {},
        existsSync: function () { return true; },
        mkdirSync: function () {},
      },
      'path': {
        join: function () {
          return Array.prototype.slice.call(arguments).join('/');
        },
      },
    };
    return modules[name] || {};
  };

  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'run') return;

    window.__mockLog = [];
    window.__pending = [];
    window.exports = {};
    window.module = { exports: window.exports };
    window.__USER_CODE__ = event.data.source || '';

    var body = 'return (async function () {\n' + event.data.code + '\n}).call(this);';

    Promise.resolve()
      .then(function () { return new Function(body)(); })
      .then(function () { return Promise.allSettled(window.__pending); })
      .then(function () { send('done', 'OK'); })
      .catch(function (error) {
        var message = error && error.stack ? String(error.stack).split('\n')[0] : String(error);
        console.error(message);
        send('done', 'ERROR');
      });
  });
})();
`;

/**
 * Full HTML document injected into the hidden sandbox iframe.
 * Kept as a plain string so it can be written with `document.write`.
 */
export const RUNNER_SRC_DOC = [
  '<!DOCTYPE html>',
  '<html><head><meta charset="utf-8"><title>Code Runner</title>',
  '<style>body{margin:0;font-family:monospace;background:#0F172A;color:#CBD5E1;font-size:13px;}</style>',
  '</head><body><script>',
  SANDBOX_SCRIPT,
  '</scr' + 'ipt></body></html>',
].join('\n');
