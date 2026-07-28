# TechQuizAi — Release Notes & Version History

---

## 🚀 Version 2.0.0 — Major Architectural & UI Upgrade
**Release Date**: July 28, 2026

### 🎨 UI & Layout Enhancements
- **Horizontal Category Rows**: Replaced single-column layout with horizontal full-width category blocks (*AWS Fundamentals*, *Artificial Intelligence (AI) Foundations*, *Google Cloud Platform (GCP)*, *Azure Cloud & DevOps*).
- **Default Dark Mode**: Site defaults to dark mode (`data-theme="dark"`) on initial load with zero light-mode flash while retaining user toggle capability.
- **3D Drum Wheel Picker**: Empty search state (`search term with 0 matches`) automatically displays a 3D cylindrical selector wheel populated dynamically with all published available quizzes.
- **Search Input Clear Button (`✕`)**: Search bar displays a clear button (`✕`) whenever text is entered, enabling 1-click query reset.
- **Dual Party Popper Confetti Cannons**: Celebration screen fires dual bottom-left & bottom-right confetti cannons shooting up to top-center before fluttering across the viewport.
- **Centered Backdrop Overlays**: Submit quiz popup and Share Achievement overlay (`.share-menu-overlay`) center dialogs over a blurred backdrop (`backdrop-filter: blur(8px)`).

### ⚙️ Core Logic & Quiz Engine Upgrades
- **Dynamic 50% Passing Criteria**: Passing criteria updated to dynamic 50% threshold (`Math.ceil(totalQuestions * 0.5)`).
- **Categorized Subfolders**: Organized quizzes into subfolders under `quizzes/` (`AWS/`, `AI/`, `AZURE/`, `GCP/`).
- **Answer Obfuscation (SHA-256)**: Plaintext answers and `correctIndex` are stripped during build time and verified via `sha256(userSelection) === question.answerHash`.
- **Favicon Integration**: Added `<link rel="icon" type="image/png" href="assets/favicon.png">` across all HTML pages.

### 🔒 Privacy, Analytics & Netlify Forms
- **Sticky Bottom Cookie Banner**: Added a sticky bottom consent banner (`.cookie-banner`) with **Reject All** and **Accept** options.
- **Multi-Tab Cross-Tab Sync**: Uses `window.addEventListener('storage')` to sync cookie consent decisions instantly across all open browser tabs.
- **Google Analytics 4 (GA4) Consent Mode v2**: Rejecting cookies globally disables tracking (`window['ga-disable-MEASUREMENT_ID'] = true`); accepting enables GA4 with IP anonymization.
- **Netlify & Google Forms Integration**: Sign Up / Contact modal submits asynchronously via AJAX to Netlify Forms and behind-the-scenes Google Form endpoint (`CONFIG.urls.googleFormUrl`).

### 📁 Project Restructuring
- Entry HTML files (`index.html`, `quiz.html`, `404.html`, `disclaimer.html`) positioned at project root for Netlify autodetection.
- Source scripts and styles moved to `src/` (`src/app.js`, `src/quiz.js`, `src/certificate.js`, `src/config.js`, `src/style.css`, `src/quiz.css`).
- Build pipeline in `scripts/build-quizzes.js` automatically cleans up legacy root duplicate files.

---

## 📦 Version 1.0.0 — Initial Release
**Release Date**: June 15, 2026

- Initial release of TechQuizAi platform with AWS Basics and IAM Concepts quizzes.
- Swipeable card stack interface for mobile & desktop.
- HTML5 Canvas personalized Certificate of Completion download.
- Light and Dark mode toggle.
- Search filtering by quiz title.
