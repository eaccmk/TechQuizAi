---
id: qa-playwright
title: Playwright Testing Basics
icon: 🎭
subtitle: Learn the fundamentals of Playwright for test automation
category: QA / SDET
available: true
skills: Automation Testing using Playwright
questions: 10
---

### Question 1
Difficulty: easy
What is Playwright?
- [x] A framework for Web Testing and Automation
- [ ] A billing boundary for cloud providers
- [ ] A design tool for web user interfaces
- [ ] A runtime environment for Python only
> Hint: It allows testing Chromium, Firefox, and WebKit with a single API.
<!-- Source: https://playwright.dev/docs/intro -->

### Question 2
Difficulty: easy
Which command is used to install Playwright in a Node.js project?
- [x] npm init playwright@latest
- [ ] npm install playwright-global
- [ ] npx install-playwright
- [ ] npm create playwright-app
> Hint: It initializes a new Playwright project, installs browsers, and sets up configuration.
<!-- Source: https://playwright.dev/docs/intro -->

### Question 3
Difficulty: easy
Which browsers are supported by Playwright out-of-the-box?
- [x] Chromium, Firefox, and WebKit
- [ ] Chromium and Edge only
- [ ] Chrome, Safari, and Internet Explorer
- [ ] Chromium, Firefox, and Opera
> Hint: It includes WebKit (the engine behind Safari) and Chromium (which powers Chrome and Edge).
<!-- Source: https://playwright.dev/docs/intro -->

### Question 4
Difficulty: easy
How do you run Playwright tests in UI Mode?
- [x] npx playwright test --ui
- [ ] npx playwright test --headed
- [ ] npx playwright show-report
- [ ] npx playwright open-ui
> Hint: The CLI option for launching the interactive UI mode is --ui.
<!-- Source: https://playwright.dev/docs/intro -->

### Question 5
Difficulty: medium
What is the default mode when running Playwright tests from the command line?
- [x] Headless mode (no visible browser window)
- [ ] Headed mode (visible browser window)
- [ ] UI mode
- [ ] Debug mode
> Hint: Playwright runs tests without a GUI by default to optimize speed and resource usage.
<!-- Source: https://playwright.dev/docs/intro -->

### Question 6
Difficulty: medium
What is the command to generate tests by recording user actions?
- [ ] npx playwright record
- [ ] npx playwright generate
- [ ] npx playwright test --record
- [x] npx playwright codegen
> Hint: This command opens a browser and the Playwright Inspector to generate code as you interact with the page.
<!-- Source: https://playwright.dev/docs/intro -->

### Question 7
Difficulty: medium
Which three Test Agents does Playwright offer out of the box for automation tasks?
- [ ] Runner, Inspector, and Reporter
- [ ] Crawler, Extractor, and Analyzer
- [x] Planner, Generator, and Healer
- [ ] Compiler, Builder, and Deployer
> Hint: These built-in agents plan workflows, generate code, and self-heal test scripts.
<!-- Source: https://playwright.dev/docs/test-agents#introduction -->

### Question 8
Difficulty: hard
Where does Playwright save the test execution traces for debugging?
- [x] In the trace viewer zip files (trace.zip)
- [ ] In a local playwright.log file
- [ ] In a video file (.mp4) only
- [ ] In the system temporary directory
> Hint: These traces can be loaded in the Playwright Trace Viewer to step through actions, screenshots, and logs.
<!-- Source: https://playwright.dev/docs/intro -->

### Question 9
Difficulty: hard
In Playwright, what is a "Locator"?
- [x] A view that represents a way to find element(s) on the page at any moment
- [ ] A function that starts the browser session
- [ ] A configuration setting for geographic location testing
- [ ] A command-line tool for installing browsers
> Hint: Locators are the central piece of Playwright's auto-waiting and retry-ability.
<!-- Source: https://playwright.dev/docs/intro -->

### Question 10
Difficulty: hard
What are test fixtures in Playwright?
- [ ] External plugins used to run tests on mobile emulators only.
- [x] Isolated, pre-configured environments established for each test to provide everything it needs and clean up after itself.
- [ ] Global configuration options defined in playwright.config.js to control timeout settings.
- [ ] Utility classes used to generate HTML test reports automatically.
> Hint: Playwright test fixtures are isolated, reusable, and lazily initialized based on what the test function requests.
<!-- Source: https://playwright.dev/docs/test-fixtures -->
