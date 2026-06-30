# PRODUCT_BRIEF.md

# TBridge Product Brief

## Product Summary

TBridge is a lightweight timezone conversion web app for quickly translating a date and time from one city or timezone into multiple other cities or timezones.

The app is designed for meetings, calls, online events, gaming sessions, distributed teams, travel planning and community coordination.

## Core Problem

Timezone conversion is easy to get wrong because of daylight saving time, ambiguous timezone abbreviations and date changes across regions.

Users need a fast, clear tool that answers:

"If it is 5pm in London on 30 June 2026, what time is it in New York, Denver and Tokyo?"

## MVP Goal

Build a clean, responsive web app that lets a user:

Enter a date
Enter a time
Choose a source city/timezone
Choose multiple destination cities/timezones
See the correctly converted date, time and timezone abbreviation
Copy the result
Share the conversion via URL

## Target User

People who coordinate across timezones, including:

Software engineers
Remote workers
Community organisers
Gamers
Travellers
Friends and families across countries

## V1 Requirements

Date picker
Time picker
Source timezone selector
Destination timezone multi-selector
Correct DST handling
Clear converted results
Highlight if result is previous day or next day
12h / 24h toggle
Copy results button
Shareable URL state
Responsive mobile-first layout
Dark mode friendly UI

## Non-Goals For V1

User accounts
Database
Backend API
Calendar integration
Notifications
Natural language parsing
Mobile native app
Payments
Analytics

## Product Principle

Correctness first, polish second, features third.

Do not manually calculate timezone offsets. Always use reliable timezone libraries and IANA timezone identifiers.

## Example

Input:

Date: 30 June 2026
Time: 17:00
Source: London, United Kingdom

Destinations:

New York
Denver
Tokyo

Output:

London: Tue 30 Jun 2026, 17:00 BST
New York: Tue 30 Jun 2026, 12:00 EDT
Denver: Tue 30 Jun 2026, 10:00 MDT
Tokyo: Wed 1 Jul 2026, 01:00 JST

Tokyo should be clearly marked as +1 day.
