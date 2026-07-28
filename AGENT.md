# AGENT.md — TechQuizAi Project Architecture & Instructions

## Project Overview
TechQuizAi is a lightweight, scalable, Markdown-driven cloud computing & AI quiz platform.
Users take swipeable card-based quizzes, earn certificates, and share achievements.
Hosted as a static web app on Netlify. Zero heavy frameworks.

## Directory Structure
```
/
├── index.html           # Main entry point (horizontal quiz rows by category)
├── quiz.html            # Interactive quiz player page
├── 404.html             # 404 Not Found page encouraging quiz searches
├── disclaimer.html      # Terms of Use, Vendor Disclaimer & Contact Us integration
├── netlify.toml         # Netlify build configuration
├── package.json         # Build and test script definitions
├── AGENT.md             # Core developer & agent instructions
├── SKILLS.md            # Working guidelines & testing checklist
├── scripts/
│   └── build-quizzes.js # Compiles quizzes/ into src/quizzes.json & src/quizzes-data.js
├── test/
│   └── test.js          # Automated test runner (npm test)
├── src/
│   ├── config.js        # Central branding, site URLs, storage keys, colors
│   ├── app.js           # Dashboard rendering, search bar, clear button, modal logic
│   ├── quiz.js          # Quiz engine, SHA-256 answer verification, option shuffling
│   ├── certificate.js   # Canvas certificate generator
│   ├── style.css        # Dashboard, header, footer, 404, disclaimer styles
│   ├── quiz.css         # Card stack, swipe gestures, confetti, results styles
│   ├── quizzes.json     # Compiled JSON catalog
│   └── quizzes-data.js  # Compiled window.QUIZ_CATALOG script for offline/local server fallback
└── quizzes/             # Markdown quiz definition files grouped by subfolder
    ├── AWS/             # AWS_BASIC.md, IAM_CONCEPTS.md, EC2_COMPUTE.md
    ├── AI/              # LLM_FUNDAMENTALS.md, MCP_CONCEPTS.md, EVALUATION_EVALS.md
    ├── AZURE/           # AZURE_FUNDAMENTALS.md, AZURE_DEVOPS.md, AZURE_SECURITY.md
    └── GCP/             # GCP_FUNDAMENTALS.md, GCP_ARCHITECTURE.md, GCP_DATA_AI.md
```

## Key Conventions & Conventions
1. **Root Entry Point**: `index.html`, `quiz.html`, `404.html`, `disclaimer.html` stay at project root so Netlify automatically deploys without extra path routing.
2. **Centralized Configuration**: All site branding, app names, copyright text, and site URLs are stored in `src/config.js` (`CONFIG`). Never hardcode site URLs. Private repo URLs are kept hidden from public config.
3. **Markdown Quiz Parsing**: Quizzes are defined in `quizzes/<CATEGORY>/<NAME>.md` using YAML frontmatter and Markdown questions (`- [x]` for correct option).
4. **Answer Obfuscation**: Correct options are hashed into SHA-256 (`answerHash`). Plaintext answers or correct indices are never exposed in DOM or console.
5. **Horizontal Grouping**: Categories render as horizontal full-width row blocks (`repeat(3, 1fr)`) in sequence: AWS Fundamentals, AI Foundations, GCP, Azure Cloud & DevOps.
6. **Accessibility**: 95%+ WCAG 2.1 AA coverage (`.skip-link`, `:focus-visible`, ARIA landmark roles, Escape key modal trap, screen reader utilities).

## Testing & Build Commands
```bash
npm run build   # Parses quizzes/ subfolders and generates src/quizzes.json & src/quizzes-data.js
npm test        # Runs test/test.js validating configuration, markdown schemas, hashing, & paths
```
