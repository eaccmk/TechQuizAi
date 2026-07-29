# TechQuizAi ☁️

[![Netlify Status](https://api.netlify.com/api/v1/badges/e4a21b3c-7e1a-45de-bfb5-53323c90e7ab/deploy-status)](https://app.netlify.com/projects/techquizai/deploys)
[![Automated Release](https://github.com/eaccmk/TechQuizAi/actions/workflows/release.yml/badge.svg?branch=netlify)](https://github.com/eaccmk/TechQuizAi/actions/workflows/release.yml)

> **Master Tech Concepts, One Quiz at a Time.**

TechQuizAi is a lightweight, scalable, Markdown-driven platform. Users take interactive swipeable card-based quizzes in Cloud Computing, AI/ML, and Data Science. Designed for Developers, AI Engineers, QA/SDETs, DevRels, and Data Scientists to earn personalized certificates of completion and share their achievements.

🌐 **Live Demo**: [https://techquizai.netlify.app/](https://techquizai.netlify.app/)

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
│   └── test.js          # Automated test suite (npm test)
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

---

## 📄 License & Disclaimer

TechQuizAi is an independent tool built for fun to help developers brush up on technical skills. Not affiliated with, endorsed by, or sponsored by AWS, Microsoft Azure, Google Cloud Platform, or official vendor certification programs.
