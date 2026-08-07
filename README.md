# TechQuizAi ☁️

[![Netlify Status](https://api.netlify.com/api/v1/badges/e4a21b3c-7e1a-45de-bfb5-53323c90e7ab/deploy-status)](https://app.netlify.com/projects/techquizai/deploys)
[![Automated Release](https://github.com/eaccmk/TechQuizAi/actions/workflows/release.yml/badge.svg?branch=netlify)](https://github.com/eaccmk/TechQuizAi/actions/workflows/release.yml)

> **Master Tech Concepts, One Quiz at a Time.**

TechQuizAi is a lightweight, scalable, Markdown-driven platform. Users take interactive swipeable card-based quizzes in Cloud Computing, AI/ML, and Data Science. Designed for Developers, AI Engineers, QA/SDETs, DevRels, and Data Scientists to earn personalized certificates of completion and share their achievements.

🌐 **Live Demo**: [https://techquizai.netlify.app/](https://techquizai.netlify.app/)

---

## 🔑 Passwordless Auth Setup & Configuration

This project includes a secure, passwordless Email OTP (One-Time Password) system integrated with Supabase and Netlify Functions.

### 1. Supabase Relational Database Schema Setup
Log into your [Supabase Dashboard](https://supabase.com) and follow these steps to execute the SQL database structure:
1. Navigate to **SQL Editor** from the left-hand navigation sidebar.
2. Click **New Query**.
3. Open [schema.sql](/src/schema.sql) from the repository, copy its contents, and paste it into the Supabase SQL editor.
4. Click **Run**.
5. *(Optional)* Enable `pg_cron` in database extensions if you plan to automate monthly audit log purges:
   - Go to **Database** -> **Extensions** -> Search for `pg_cron` and enable it.
   - Run the commented cron scheduling SQL statement at the bottom of `schema.sql` to execute the reset on the 1st of every month.

---

### 2. Configure Environment Variables in Netlify
For a public repository, security is paramount. **Never commit secret keys to GitHub.** Follow this checklist to safely configure environment variables in the Netlify Dashboard:
1. Log into your [Netlify account](https://app.netlify.com/) and select your site/project.
2. Go to **Site settings** -> **Environment variables** (under **Build & deploy**).
3. Click **Add a variable** -> **Add single variable** and insert the following:
   - `SUPABASE_URL`: Your Supabase API endpoint (e.g. `https://[YOUR_PROJECT_ID].supabase.co`). Find your Project ID under *Project Settings -> General*.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role key. Under *Project Settings -> API Keys*, copy the `default` key under **Secret keys**.
   - `JWT_SECRET`: A secure signing key. If using Netlify Identity, go to your Netlify Dashboard -> **Site Settings** -> **Identity** -> Scroll down to **Services** -> **Git Gateway** -> Copy the **JWT secret** shown there. Alternatively, if Netlify Identity is not fully set up yet, you can generate any secure random string (e.g., via `openssl rand -hex 32`) and paste it as the `JWT_SECRET`.
   - `RESEND_API_KEY`: *(Optional)* Your Resend API key to deliver OTP passcodes.
   - `SENDGRID_API_KEY`: *(Optional)* Your SendGrid/Twilio API key to deliver OTP passcodes.
4. Click **Save**.

*Note: For local development with Netlify CLI, create a local `.env` file in the root directory containing these keys. The `.gitignore` file will prevent it from being checked into your git repository.*

---

## 🧪 Testing & Verification Guide

### 1. Automated Mock Verification
To verify the core auth logic, hashing security, and JWT encoding verify that mock tests pass locally:
```bash
node test/test-auth.js
```

### 2. Local Manual Testing Flow
1. Start your local Netlify dev server:
   ```bash
   npx netlify dev
   ```
2. Open the dev site (typically `http://localhost:8888`) in your web browser.
3. Click **Sign In / Sign Up** in the header.
4. Enter an email and click **Send Code**.
5. Check your console terminal logs! Since you are running in local mock/development mode, the Netlify Functions will print your OTP passcode directly to the console:
   ```
   [DEV/MOCK] OTP for learner@techquizai.com is: 123456
   ```
6. Enter the 6 digits in the responsive verification modal. Try pasting a full 6-digit passcode by clicking in the first input box to confirm it auto-fills the remaining inputs.
7. Upon verification, confirm that the header updates with your logged-in user profile badge. Open browser Developer Tools, go to **Application** -> **Local Storage** and verify that:
   - `techquizai_auth_token` holds your valid JWT.
   - `techquizai_auth_user` contains your profile JSON metadata.
   - `techquizai_user_name` has successfully merged your email username prefix without corrupting prior quiz scores.
8. Check the **Network** tab in Developer Tools. Inspect the requests to `/api/request-otp` and `/api/verify-otp` to verify that the payloads are obfuscated (Base64) rather than clear text.
9. Log into your Supabase console:
   - Under `users` table: Verify your status is `REPEAT`.
   - Under `audit_logs` table: Verify entries with `OTP_REQUESTED` and `OTP_VERIFIED` actions are recorded.
10. Click your user profile badge on the site header to open the profile details modal. Click **Delete Account** to trigger the compliant deletion flow, and verify that your record is hard-deleted from the `users` table while an anonymized retention log remains in `audit_logs` for exactly 30 days.

---

## 🚀 Quick Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- `git`

### 1. Clone Repository
```bash
git clone https://github.com/eaccmk/TechQuizAi.git
cd TechQuizAi
```

### 2. Build Quiz Catalog
Compile Markdown quiz files from `quizzes/` into runtime JSON & JavaScript data bundles (`src/quizzes.json` & `src/quizzes-data.js`):
```bash
npm run build
```

### 3. Run Automated Test Suite
Execute the zero-dependency test runner in `test/test.js`:
```bash
npm test
```

### 4. Run Locally
Open `index.html` directly in your browser or run a simple local web server:
```bash
npx serve .
```

---

## 🧪 Automated Test Suite Coverage

The automated test suite in `test/test.js` validates code integrity, Markdown schemas, cryptographic security, and business rules before deployment:

| Test Name | Test File | Description & Assertion Coverage |
| :--- | :--- | :--- |
| **Central Configuration Validation** | `test/test.js` | Validates `src/config.js` (`CONFIG`) structure, verifying string types for `appName`, `storageKeys`, `siteUrl`, and branding color tokens. |
| **Core File & Directory Structure Integrity Check** | `test/test.js` | Ensures all essential entry points (`index.html`, `quiz.html`, `404.html`, `disclaimer.html`), core scripts (`src/app.js`, `src/quiz.js`, `src/certificate.js`), stylesheets (`src/style.css`, `src/quiz.css`), assets (`assets/favicon.png`), and build scripts exist. |
| **Subfolder Markdown Quiz Files Parsing & Schema Test** | `test/test.js` | Recursively scans all 12 Markdown quiz files across `quizzes/` subfolders (`AWS`, `AI`, `AZURE`, `GCP`), asserting YAML frontmatter metadata, minimum question count, array schema, 64-character SHA-256 `answerHash` strings, and confirming no plaintext correct answers or indices are exposed. |
| **Answer Obfuscation SHA-256 Hash Matching** | `test/test.js` | Validates cryptographic hashing functions in `scripts/build-quizzes.js`, confirming deterministic SHA-256 output, 64-character hash length, and non-collision for incorrect inputs. |
| **Dynamic 50% Passing Criteria Logic Test** | `test/test.js` | Validates dynamic passing threshold math (`Math.ceil(totalCount * 0.5)`), asserting that 5/10 passes (50%), 4/10 fails (40%), 3/5 passes (60%), and 2/5 fails (40%). |

### 🎓 Local Certificate Design Preview

To rapidly iterate on or preview certificate canvas designs locally without taking a full quiz:
1. Open `test/test-cert.html` directly in your web browser.
2. Click **Generate & Preview** to render the certificate canvas on-screen instantly.

---

## 📁 Repository Architecture

```
TechQuizAi/
├── index.html           # Main dashboard (horizontal quiz rows by category)
├── quiz.html            # Interactive card-stack quiz player
├── 404.html             # Gamified 404 page encouraging quiz search
├── disclaimer.html      # Terms of Use, Vendor Disclaimer & Contact Us modal
├── package.json         # Build & test npm scripts
├── netlify.toml         # Netlify site deployment configuration
├── AGENT.md             # Developer & AI agent architectural rules
├── SKILLS.md            # Working guidelines & pre-deploy checklist
├── RELEASES.md          # Version history & release notes
├── README.md            # Setup guide & test suite documentation
├── assets/
│   └── favicon.png      # App favicon icon
├── scripts/
│   └── build-quizzes.js # Compiles quizzes/ into src/ JSON/JS bundles & cleans legacy root files
├── test/
│   ├── test.js          # Automated test suite (npm test)
│   ├── test-cert.html   # Local certificate design preview tool
│   └── test-auth.js     # Auth mock verification tests
├── src/
│   ├── config.js        # Central branding, site URLs, GA4 ID, storage keys
│   ├── app.js           # Dashboard rendering, search bar, wheel picker, GA4 & cookie consent
│   ├── quiz.js          # Quiz engine, SHA-256 verification, option shuffling, confetti
│   ├── certificate.js   # Canvas certificate rendering & PNG download logic
│   ├── style.css        # Dashboard, modal, wheel picker, & cookie banner styling
│   ├── quiz.css         # Card stack, swipe gestures, confetti cannons, popup overlays
│   ├── quizzes.json     # Compiled JSON quiz manifest & catalog
│   └── quizzes-data.js  # Compiled window.QUIZ_CATALOG script for local/offline fallback
└── quizzes/             # Categorized Markdown quiz source files
    ├── AWS/             # AWS_BASIC.md, IAM_CONCEPTS.md, EC2_COMPUTE.md
    ├── AI/              # LLM_FUNDAMENTALS.md, MCP_CONCEPTS.md, EVALUATION_EVALS.md
    ├── AZURE/           # AZURE_FUNDAMENTALS.md, AZURE_DEVOPS.md, AZURE_SECURITY.md
    └── GCP/             # GCP_FUNDAMENTALS.md, GCP_ARCHITECTURE.md, GCP_DATA_AI.md
```

---

## 📝 How to Add New Quizzes

1. Create a `.md` file inside the appropriate category folder under `quizzes/` (e.g. `quizzes/AWS/MY_NEW_QUIZ.md`).
2. Add YAML frontmatter at the top:
   ```yaml
   ---
   id: my-new-quiz
   title: My New Quiz
   subtitle: Quick overview of key concepts.
   icon: ☁️
   category: AWS Fundamentals
   questions: 10
   available: true
   ---
   ```
3. Add questions using Markdown format:
   ```markdown
   ### Question 1
   Difficulty: Easy

   What is AWS S3?

   - [ ] Elastic Compute Cloud
   - [x] Simple Storage Service
   - [ ] Relational Database Service

   > Hint: Think object storage.
   ```
4. Run `npm run build` to update `src/quizzes.json` and `src/quizzes-data.js`.
5. Run `npm test` to verify your new quiz passes schema checks.


## netlify CLI commands

```bash
# Login to Netlify
npx netlify login

# Run only builds ( Dry run of build )
npx netlify build --dry

# locally build and serve
npx netlify serve

# Deploy to non prod site with alias
netlify deploy --alias=V3

# show env variable secrets in the project
npx netlify env:list --plain

# Deploy to a non-prod site
npx netlify deploy --dir=./dist

# Deploy to the production site
npx netlify deploy --dir=./dist --prod

# Deploy to a specific site
npx netlify deploy --dir=./dist --site=[SITE_ID]
```

---

## 📄 License & Disclaimer

TechQuizAi is an independent tool built for fun to help developers brush up on technical skills. Not affiliated with, endorsed by, or sponsored by AWS, Microsoft Azure, Google Cloud Platform, or official vendor certification programs.
