# CLAUDE.md

You are building TBridge, a small frontend-only timezone conversion web app.

Priorities:

Correct timezone conversion
Simple user experience
Clean responsive UI
Small maintainable codebase
No overengineering

Rules:

Use IANA timezone IDs internally.
Use Luxon for timezone conversion.
Do not manually calculate offsets.
Do not add a backend unless explicitly requested.
Do not add authentication unless explicitly requested.
Do not add a database unless explicitly requested.
Keep V1 focused.
Run a production build before completion.

Default stack:

Vite
React
TypeScript
Tailwind CSS
Luxon

Source docs:

docs/PRODUCT_BRIEF.md
docs/TECHNICAL_BRIEF.md
docs/BUILD_PROMPT_V1.md
docs/QHEDROID_ENGINEERING_STANDARD.md

Engineering standard:

docs/QHEDROID_ENGINEERING_STANDARD.md governs this project and all future Qhedroid portfolio
projects. Read it before making architectural decisions. Key rules that apply here:

- Do not add features without explicit approval
- Do not leave TODO comments or dead code
- Do not ignore TypeScript errors
- Run npm test and npm run build before marking any task complete
- Design should be typography-led, calm, and practical — not generic AI SaaS styling
- Use ADRs in docs/ADR/ for significant technical decisions
