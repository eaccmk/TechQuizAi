# SKILLS.md — Working Guidelines for TechQuizAi

## Purpose
Guidelines for developers and AI agents adding features or editing code in TechQuizAi.

## Guidelines
1. **Plain HTML/CSS/JS First**: Keep frontend dependencies zero or minimal. Do not introduce heavy frontend frameworks.
2. **Directory Architecture**:
   - `index.html`, `quiz.html`, `404.html`, `disclaimer.html` stay at root.
   - Core source code lives in `src/`.
   - Automated tests live in `test/test.js`.
   - Quiz definitions live in categorized subfolders: `quizzes/AWS/`, `quizzes/AI/`, `quizzes/AZURE/`, `quizzes/GCP/`.
3. **Adding New Quizzes**:
   - Create a `.md` file inside the appropriate `quizzes/<CATEGORY>/` folder.
   - Mark the correct answer with `- [x]`.
   - Run `npm run build` to update `src/quizzes.json` and `src/quizzes-data.js`.
4. **Answer Protection**: Never expose plain answer strings or `correctIndex` in client-side memory. Always use `answerHash` (SHA-256).
5. **Accessibility**: Maintain focus indicators (`:focus-visible`), ARIA roles, high contrast text ratios, and keyboard navigation.

## Testing Checklist Before Deploy
- [ ] Run `npm run build`
- [ ] Run `npm test`
- [ ] Verify dark mode & light mode rendering
- [ ] Verify search clear button (`✕`) resets search text
- [ ] Verify certificate downloads with user personalization name
- [ ] Verify share link copies to clipboard and direct launch name modal functions correctly
- [ ] Confirm no console errors on page load
