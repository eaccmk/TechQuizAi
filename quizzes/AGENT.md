# AI Agent Instructions for TechQuizAi Quizzes

When creating, editing, or verifying quizzes in this repository, you **MUST** adhere to the following rules:

1. **Verify Official Sources & Use Exact Links**: All technical knowledge, facts, and answers must be strictly verified against the official documentation for the respective technology. Try to get the exact URL link (direct deep link to the specific documentation page/section) as a source of truth for each question.
2. **Standardized 10-Question Structure**: When creating or updating a quiz, you must always provide exactly 10 questions distributed across difficulties as follows:
   - **Questions 1–4**: Easy difficulty
   - **Questions 5–7**: Medium difficulty
   - **Questions 8–10**: Hard difficulty
3. **Include Internal Source Links**: For every question, you must include a direct link to the official source documentation that verifies the correct answer. 
   - This link must be placed immediately following the `> Hint: ...` line.
   - **CRITICAL**: The link must be formatted as a standard HTML comment so it remains internal to the Markdown file and is never exposed to the end users taking the quiz. 
   - Format: `<!-- Source: https://... -->`
4. **Official Reference Links**:
   - AWS: https://aws.amazon.com/getting-started/cloud-essentials/
   - GCP: https://www.skills.google/
   - Azure DevOps: https://learn.microsoft.com/en-us/shows/devops-fundamentals/
   - MCP: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro

Do not guess or hallucinate quiz answers. Always use the specified references to guarantee accuracy.
