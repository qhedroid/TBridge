# TECHNICAL_BRIEF.md

# TBridge Technical Brief

## Recommended Stack

Vite
React
TypeScript
Tailwind CSS
Luxon
Vercel

## Architecture

This should be a frontend-only app.

No backend.
No database.
No authentication.
No server-side timezone calculations.

All conversion logic should happen in the browser.

## Timezone Rules

Use IANA timezone IDs internally.

Examples:

Europe/London
America/New_York
America/Denver
America/Los_Angeles
Asia/Tokyo
Asia/Dubai
Asia/Kolkata
Australia/Sydney

Display friendly city names and timezone abbreviations to the user.

Never rely on timezone abbreviations as the source of truth. EST, EDT, BST, GMT, MDT and MST can be ambiguous depending on date and region.

## Suggested Data Model

```ts
type TimezoneOption = {
  id: string;
  label: string;
  city: string;
  country: string;
  iana: string;
  keywords: string[];
};

type ConversionResult = {
  timezone: TimezoneOption;
  localDateTime: string;
  displayDate: string;
  displayTime: string;
  abbreviation: string;
  dayOffset: -1 | 0 | 1;
};
```

## Initial Timezone Dataset

Include a small curated dataset first.

London — Europe/London
New York — America/New_York
Denver — America/Denver
Los Angeles — America/Los_Angeles
Chicago — America/Chicago
Toronto — America/Toronto
Vancouver — America/Vancouver
Dubai — Asia/Dubai
Doha — Asia/Qatar
Riyadh — Asia/Riyadh
Istanbul — Europe/Istanbul
Paris — Europe/Paris
Berlin — Europe/Berlin
Madrid — Europe/Madrid
Rome — Europe/Rome
Budapest — Europe/Budapest
Bucharest — Europe/Bucharest
Tokyo — Asia/Tokyo
Seoul — Asia/Seoul
Singapore — Asia/Singapore
Hong Kong — Asia/Hong_Kong
Mumbai — Asia/Kolkata
Sydney — Australia/Sydney
Melbourne — Australia/Melbourne
Auckland — Pacific/Auckland

## Core Conversion Logic

Given:

date
time
source timezone
destination timezone list

Create a Luxon DateTime in the source timezone.
Convert the same instant to each destination timezone.
Format the result for display.

## Required Edge Cases

London summer should display BST.
London winter should display GMT.
New York summer should display EDT.
New York winter should display EST.
Denver summer should display MDT.
Denver winter should display MST.
Tokyo may become next day for UK evening times.
Los Angeles may become previous day for early UK times.

## Suggested Tests

30 June 2026 17:00 Europe/London to America/New_York should be 12:00 EDT.
30 June 2026 17:00 Europe/London to America/Denver should be 10:00 MDT.
30 June 2026 17:00 Europe/London to Asia/Tokyo should be 01:00 JST on 1 July 2026.
15 January 2026 17:00 Europe/London to America/New_York should be 12:00 EST.
15 January 2026 17:00 Europe/London to America/Denver should be 10:00 MST.

## UI Direction

Clean, calm, premium and practical.

Avoid gimmicks.
Avoid clutter.
Avoid enterprise dashboard vibes.

The app should feel like a focused utility.

Suggested layout:

Header
Input card
Destination selector
Results card
Copy/share actions

## Deployment

Deploy to Vercel.

The app should work at:

localhost during development
Vercel preview URL
Final custom domain later

## City Search

TBridge V1 uses a local offline city index that includes all world capitals and selected major secondary cities. The index (`src/data/cityIndex.ts`) carries `name`, `country`, `countryCode`, `timezoneIana`, optional `aliases[]`, a `priority` score, `capital` flag, and `tier` classification. Search is ranked by match tier (exact name → starts-with → contains → alias → country) and then by priority within each tier. Capital cities carry higher priority values, and major cities generally rank above regional cities.

Every IANA timezone referenced by the city index should also have a primary entry in `src/data/timezones.ts`, with abbreviation fallback coverage in `src/utils/conversion.ts` where needed. Future versions may generate this index from GeoNames or a similar open dataset.

## Quality Bar

TypeScript should be strict.
No unused files.
No dead code.
No fake backend.
No hardcoded offset maths.
No overengineering.
