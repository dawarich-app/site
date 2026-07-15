---
sidebar_position: 15
title: Days per Country
description: Count the days you spent in each country from your location history, with consecutive stay periods and a 183-day threshold warning.
---

# Days per Country

Dawarich counts how many days you spent in each country during a calendar year, using the location history you already collect. It reports consecutive stay periods and flags any country where you crossed **183 days** — the threshold used by many tax residency rules.

This is useful if you travel across borders often and need to know where your days actually went: digital nomads, cross-border commuters, and anyone tracking the Schengen 90/180 window or a 183-day residency rule.

:::caution Not tax advice
Dawarich reports what your location history says. It does not interpret any country's tax law, and different jurisdictions count days differently — some count partial days, some exclude travel days, some use multi-year averaging. Treat the output as evidence to bring to a professional, not as a conclusion.
:::

## Opening it

1. Open **Map** (the MapLibre map — this feature is not available on the old Leaflet map).
2. Open the settings panel.
3. Click **Days / Country**.

Pick a year from the dropdown. Only years with recorded statistics appear.

## What it shows

For each country, ordered by days spent:

| Field | Meaning |
|---|---|
| **Days** | Number of distinct days with at least one recorded point in that country |
| **Percentage** | Share of your *tracked* days, not of the calendar year |
| **Year percentage** | Share of the full calendar year (365 or 366 days) |
| **Stay periods** | Runs of consecutive days, each with a start date, end date, and length |
| **Threshold warning** | Raised when a country reaches 183 days or more |

It also reports **total tracked days** — the number of distinct days in that year for which you have any location data at all. This matters: if you tracked 200 days out of 365, a country showing 150 days is 75% of your *tracked* time but only 41% of the year.

## How days are counted

Understanding these rules matters, because they determine whether the numbers mean what you think they mean.

**Any presence counts.** A day counts toward a country if you have at least one recorded point there that day. If you fly from Germany to France on a Tuesday, that Tuesday counts as a day in **both** countries. Consequently, the sum of per-country days can exceed your total tracked days. Most tax authorities have their own rule for travel days; Dawarich does not guess which one applies to you.

**Days are bounded by UTC, not your local time zone.** A point recorded at 00:30 local time in Berlin (23:30 UTC the previous day) is attributed to the previous day. Near midnight, near a border, this can shift a day from one country to another.

**Anomalous points are excluded.** Points flagged as anomalies do not contribute.

**Untracked days are invisible.** A day with no recorded points counts toward nothing. If your phone was off, or tracking lapsed, that day is simply absent — it is not attributed to your last known country.

## Requirements

Each point must know which country it is in. Dawarich fills this in through reverse geocoding, so:

- **Reverse geocoding must be configured**, and your points must have been geocoded. Points without a country are skipped entirely.
- Imported historical data needs geocoding before it will appear here. See [Imports](./imports.md).

If a country you know you visited is missing, the most likely cause is that those points were never geocoded.

## Availability

- **Self-hosted:** available to everyone, no subscription.
- **Dawarich Cloud:** included with **Pro** and **Family**. Not available on Lite.

On Lite, the **Days / Country** button is hidden and the API returns `403 pro_plan_required`.

## API

The same data is available programmatically:

```
GET /api/v1/residency?year=2026&api_key=YOUR_API_KEY
```

The `year` parameter is optional; it defaults to your most recent year with statistics. The response includes `total_tracked_days`, `days_in_year`, `available_years`, a `daily_countries` map of date to country, and a `countries` array carrying `days`, `percentage`, `year_percentage`, `periods`, and `threshold_warning` for each.

Full schema: [Returns per-country day counts for tax residency calculations](/docs/api/returns-per-country-day-counts-for-tax-residency-calculations).

For days when you were in more than one country, `daily_countries` picks the country with the most recorded points that day — so the calendar shows one country per day, while the per-country `days` counts credit both.
