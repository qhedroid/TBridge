# Qhedroid Engineering Standard

## Purpose

This document defines the reusable engineering structure for Qhedroid portfolio projects.

Every project should feel consistent, maintainable and professional from day one.

This standard applies to projects such as:

TBridge
SnipKit
DocShot
MediaForge
CueBot
Personal browser projects
Future portfolio utilities

Faide is separate because it is a startup product, but it may borrow selected practices.

## Core Principle

Build small, useful products with serious engineering discipline.

The goal is not to overengineer.

The goal is to avoid messy one-off projects.

Every project should have:

Clear purpose
Clean architecture
Good documentation
Simple deployment
Reliable build process
Consistent design quality

## Standard Repository Structure

```text
project-name/
│
├── docs/
│   ├── ADR/
│   ├── PRODUCT_BRIEF.md
│   ├── TECHNICAL_BRIEF.md
│   ├── DESIGN_BRIEF.md
│   ├── ROADMAP.md
│   ├── CHANGELOG.md
│   └── QA_CHECKLIST.md
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
│
├── README.md
├── docs/ENGINEERING.md
├── .gitignore
├── package.json
└── tsconfig.json
```

Only create folders that are actually needed.

Do not create empty placeholder folders just to satisfy the template.

## Required Documentation

### PRODUCT_BRIEF.md

Explains:

What the product is
Who it is for
What problem it solves
What V1 includes
What V1 does not include
Example user flows

### TECHNICAL_BRIEF.md

Explains:

Stack choice
Architecture
Data model
Core logic
Testing approach
Known risks
Deployment target

### DESIGN_BRIEF.md

Explains:

Visual direction
Tone
Spacing
Typography
Interaction style
Accessibility expectations
What to avoid

### ROADMAP.md

Explains:

V1
V1.1
V2
Future ideas
Deferred features

### CHANGELOG.md

Tracks:

Features shipped
Bug fixes
Design changes
Technical changes

### QA_CHECKLIST.md

Tracks manual checks before release.

### ADR/

Architecture Decision Records.

Use ADRs for important decisions such as:

Why this stack was chosen
Why there is no backend
Why a specific library was used
Why a feature was deferred

## Standard Build Phases

### Phase 0 — Discovery

Define the problem.

Do not code yet.

Output:

PRODUCT_BRIEF.md

### Phase 1 — Architecture

Define the technical approach.

Output:

TECHNICAL_BRIEF.md
Initial ADRs

### Phase 2 — MVP Build

Build the smallest useful version.

Rules:

No unnecessary features
No backend unless required
No database unless required
No auth unless required
No UI library unless justified

### Phase 3 — Functional Polish

Improve:

Edge cases
State handling
URL sharing
Copy/export behaviour
Search
Validation
Testing

### Phase 4 — Design Pass

Refine design only after the app works.

Design should improve:

Typography
Spacing
Hierarchy
Density
Interaction states
Mobile behaviour
Accessibility

Design should not introduce random new features.

### Phase 5 — QA

Run:

npm test
npm run build
Manual browser test
Mobile layout check

### Phase 6 — Release

Push to GitHub.
Deploy to Vercel.
Use free Vercel URL first.
Add custom domain only after V1 is worth keeping.

## Default Web App Stack

Use this unless there is a strong reason not to:

Vite
React
TypeScript
Tailwind CSS
Vitest
Vercel

Optional:

Luxon for timezone/date-heavy apps
Zod for complex validation
Playwright only when browser flows become important

Avoid by default:

Redux
Heavy UI libraries
Premature backend
Premature database
Premature authentication
Premature analytics
Complex routing for one-page apps

## Implementation Rules

Contributors must:

Read all docs before coding
Follow `docs/ENGINEERING.md`
Keep scope tight
Run tests before completion
Run production build before completion
Summarise changes clearly

Contributors must not:

Add features without approval
Add backend without approval
Add database without approval
Add auth without approval
Add large dependencies without justification
Leave TODO comments
Leave dead code
Ignore TypeScript errors

## Standard Design Philosophy

Qhedroid projects should feel:

Useful
Calm
Fast
Practical
Human-made
Professional
Slightly distinctive

Avoid:

Generic software-as-a-service styling
Glassmorphism
Unnecessary gradients
Huge cards everywhere
Oversized rounded corners
Dashboard clutter
Marketing-page design where utility design is needed

Design should be typography-led.

Spacing and rhythm matter more than decoration.

## Standard Release Checklist

Before GitHub push:

npm install
npm test
npm run build

Manual checks:

App loads locally
Core happy path works
Known examples pass
Mobile layout works
Copy/share actions work
No console errors
README is accurate
Docs are up to date

Before Vercel deploy:

Repo is clean
Build passes locally
No secrets committed
No unnecessary files committed
README has run instructions

## Git Commit Style

Use clear commits:

feat: build TBridge v1
fix: correct timezone alias resolution
style: refine result card layout
docs: add engineering standard
test: add DST conversion coverage
chore: configure Vercel deployment

## Portfolio Standard

Every completed project should eventually have:

Live demo
GitHub repo
README
Screenshots
Short technical write-up
Clear explanation of what was learned

The goal is for each project to be useful on its own and credible as part of a professional engineering portfolio.
