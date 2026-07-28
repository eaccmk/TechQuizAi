# AGENT.md — TechQuizAiAi Project

## Project Overview
TechQuizAiAi is an interactive cloud-computing quiz platform (starting with AWS Basics).
Users take swipeable card-based quizzes, earn certificates, and share achievements.
Frontend is vanilla JavaScript (no framework). Hosted on Netlify. Backend planned: Firebase.

## Tech Stack
- HTML/CSS/JS (vanilla, no build step, no framework)
- Firebase (planned: Auth, Firestore) — not yet integrated
- Netlify (static hosting + serverless functions)
- Canvas API for certificate generation (no external libraries)

## File Structure

/
├── index.html # Dashboard with quiz tiles
├── style.css # Dashboard styles
├── app.js # Dashboard logic (rendering tiles, search, theme toggle, cookie consent)
├── quiz.html # Quiz-taking screen
├── quiz.css # Quiz screen styles (card stack, confetti, modals)
├── quiz.js # Quiz logic (questions, swipe, scoring, results)
├── certificate.js # Shared certificate generator (used by both index.html and quiz.js)
├── AGENT.md # This file, agent instructions
├── README.md # Project readme
├── .gitignore # Git ignore rules
└── netlify.toml # Netlify deployment config


## Key Conventions
- `certificate.js` must load BEFORE `app.js` and `quiz.js` in their respective HTML files, since both call `generateCertificate()`.
- Certificate generation happens client-side only (Canvas API), no server round-trip.
- User name on certificates is stored in `localStorage` under key `techquizai_user_name` (entered via pre-quiz personalization modal, falling back to "Learner").
- Quiz attempt tracking (max 3 retakes after scoring 0) uses `localStorage`, key pattern: `techquizai_attempts_{quizId}`.
- Dark mode preference stored in `localStorage` under key `theme`.
- Cookie consent stored in `localStorage` under key `cookieConsent` (values: `standard` or `rejected`).

## Reusable Project Conventions & Guardrails

### 1. Modal Navigation State Handling
When closing a modal before initiating a page redirect or navigation, capture target state parameters in a local variable before invoking the modal cleanup function:
```javascript
function proceedToQuiz() {
    const targetQuizId = pendingQuizId;
    const name = userNameInput.value.trim() || 'Learner';
    localStorage.setItem('techquizai_user_name', name);
    closeNameModal(); // Clears pendingQuizId to null
    if (targetQuizId) {
        window.location.href = `quiz.html?id=${targetQuizId}`;
    }
}
```

### 2. Netlify Form Integration
- All Netlify form markup must include `data-netlify="true"` on the `<form>` element and a `<input type="hidden" name="form-name" value="form_name_here" />` field.
- AJAX submissions must post to `/` using `headers: { 'Content-Type': 'application/x-www-form-urlencoded' }` and `body: new URLSearchParams(formData).toString()`.

### 3. Mobile Viewport & Native Sharing
- Always use `100dvh` (dynamic viewport height) in CSS for full-bleed mobile views to prevent bottom controls from clipping under mobile browser toolbars.
- Share buttons should detect mobile screens (`window.innerWidth <= 768` or `navigator.share`) and launch `navigator.share(...)` directly, falling back to the custom share drawer on desktop.

### 4. User Name & Certificate Tracking
- User names entered in pre-quiz modals are persisted in `localStorage` under key `techquizai_user_name`.
- Certificate generators in both `app.js` and `quiz.js` must consume `localStorage.getItem('techquizai_user_name') || 'Learner'`.

## Known Placeholders / Not Yet Built
- User authentication / profiles (full account sync)
- Firebase backend (progress currently doesn't persist across devices)
- Multi-tab session locking (planned, not implemented)
- 404 / 500 / offline custom pages (not yet built)
- Ads integration (deferred by design)
- Only AWS Basics quiz has real questions; other tiles are styled as "Coming Soon"

## How to Test Locally
No build step needed. Open `index.html` directly in a browser, or serve the folder with any static server (e.g., VS Code Live Server extension) to avoid any local file-access quirks with `localStorage`.

## Deployment
Hosted on Netlify as a static site. See deployment steps below.


