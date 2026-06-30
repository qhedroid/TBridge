# TBridge Engineering Guide

TBridge is a small frontend-only timezone conversion app. The project favors correctness,
clarity, and a compact codebase over broad feature scope.

## Principles

- Use IANA timezone IDs internally.
- Use Luxon for all timezone conversion.
- Do not manually calculate offsets.
- Keep V1 focused on timezone comparison, copy, and shareable URL state.
- Do not add a backend, database, authentication, analytics, or payments without a clear product need.
- Keep documentation lean and accurate.

## Quality Bar

- Run `npm test` before marking implementation work complete.
- Run `npm run build` before release or project review.
- Do not ignore TypeScript errors.
- Do not leave TODO comments, dead code, or unused files.
- Use ADRs in `docs/ADR/` for significant technical decisions.

## Design Direction

The interface should be typography-led, calm, practical, and responsive. It should feel like a
focused utility rather than a dashboard or marketing page.
