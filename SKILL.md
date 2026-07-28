# SKILL.md — Working on TechQuizAi

## Purpose
Instructions for anyone (human or AI agent) making changes to this codebase.

## Before Making Changes
1. Read AGENT.md first for project context.
2. Confirm which file(s) actually need editing — this project intentionally avoids frameworks, so changes should stay in plain HTML/CSS/JS.
3. Never introduce a build step (no Webpack, no npm bundler) unless explicitly asked — the project's simplicity is a deliberate choice for low-maintenance hosting.

## When Editing JavaScript
- Keep `certificate.js` framework-agnostic and dependency-free — it must work identically whether called from `app.js` or `quiz.js`.
- Do not duplicate functions across files. If a function is needed in two places, it belongs in a shared file (like `certificate.js`), not copy-pasted.
- Preserve existing `localStorage` key names unless explicitly asked to change them, since changing them will break returning users' saved state.

## When Editing CSS
- This project uses CSS custom properties (`--bg-primary`, `--accent`, etc.) for theming. Never hardcode colors that should respect dark/light mode.
- Animations should be tested on mobile viewport sizes first, since this is primarily a mobile-first product.

## When Adding Features
- Always ask whether a new feature needs backend support (Firebase) or can stay client-side only. Default to client-side/localStorage until Firebase is actually wired up, to avoid half-integrated backend code.
- Any new UI text should stay simple and clear, avoid jargon, per project's content tone goals.

## Testing Checklist Before Marking a Fix "Done"
- [ ] Test in an actual mobile browser viewport, not just desktop resized
- [ ] Test with dark mode both on and off
- [ ] Test with cookie consent both accepted and rejected
- [ ] Confirm no console errors on page load
- [ ] Confirm the specific bug/feature described was actually verified working, not just "should work"

## Do Not
- Do not add tracking/analytics calls without explicit request — this project has strict privacy requirements (no PII, anonymous only).
- Do not hardcode real user data anywhere except clearly-marked placeholders (e.g., "John Smith").