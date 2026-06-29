# BUILD_PROMPT_V1.md

You are Claude Code working inside the TBridge repository.

Build V1 of TBridge as a small, polished, frontend-only timezone conversion web app.

Use:

Vite
React
TypeScript
Tailwind CSS
Luxon

Read and follow:

docs/PRODUCT_BRIEF.md
docs/TECHNICAL_BRIEF.md

The goal is to create a complete working MVP in one day.

Implementation requirements:

Create a clean React app.
Use TypeScript.
Use Tailwind for styling.
Use Luxon for timezone conversion.
Use IANA timezone IDs internally.
Include a curated timezone/city dataset.
Do not create a backend.
Do not add a database.
Do not add authentication.
Do not manually calculate timezone offsets.

The app must support:

Date input
Time input
Source city/timezone selector
Multiple destination timezone selector
Converted result cards
Timezone abbreviation display
Correct DST handling
Previous day / next day indicator
12h / 24h toggle
Copy results
Shareable URL state
Responsive layout

Default example state:

Date: 30 June 2026
Time: 17:00
Source: Europe/London
Destinations:
America/New_York
America/Denver
Asia/Tokyo

Expected default result:

London: Tue 30 Jun 2026, 17:00 BST
New York: Tue 30 Jun 2026, 12:00 EDT
Denver: Tue 30 Jun 2026, 10:00 MDT
Tokyo: Wed 1 Jul 2026, 01:00 JST

Add a short README with:

What the app does
How to run locally
How to build
How to deploy to Vercel

Before finishing, run:

npm install
npm run build

Then report:

Files created
Main implementation decisions
Any limitations
How to run the app locally
