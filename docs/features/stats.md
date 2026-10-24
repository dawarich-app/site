---
sidebar_position: 3
title: Stats
description: Find your yearly and monthly statistics on the Insights page, recalculate them, and share a month publicly.
---

# Stats

Your statistics now live on the [Insights](/docs/features/insights) page. The separate Stats page and its yearly views are gone: `/stats` and `/stats/:year` redirect to Insights, so old bookmarks still work.

## Where to Find Your Statistics

- **All of your history** - open Insights and choose **All Time**. You get your totals and one card per year with its distance, a map of its routes, its months, and its countries and cities.
- **One year** - pick the year in the period bar at the top of Insights. **Distance by month** lists every month of that year.
- **One month** - click a month card to open that month's statistics page.

Click a countries or cities count to see the full list of places, with links to the map.

## Monthly Stats

A month's page shows:

- Distance traveled, plus flight distance imported from AirTrail, which is not counted in the distance
- Active days, countries and cities visited
- A map of the month's points or heatmap
- Daily activity, with the month's peak day and quietest week
- A **Share** button for public sharing (see below) and a link back to Insights

## Updating Stats

Stats are calculated in the background after imports and new points arrive, and are recalculated every hour. To recalculate them yourself:

1. Open Insights
2. Select a year, or **All Time** to recalculate every year
3. Click **Update stats** in the page header
4. Wait for the background job to finish (usually a few minutes)

## Public Stats Sharing

You can share your monthly statistics publicly with others without requiring them to log in.

### Enabling Sharing

1. Navigate to a specific month's stats page
2. Click the **Share** button
3. Configure sharing settings:
   - **Expiration**: Choose when the share link expires
     - 1 hour
     - 12 hours
     - 24 hours
     - 1 week
     - 1 month
4. Copy the generated share URL

On Dawarich Cloud, public stats sharing requires the Pro plan. To share your live location, a date range, a trip or a single track instead, use [Sharing Links](/docs/features/sharing).

### Share Link

The share URL uses a unique UUID for security:
```
https://your-dawarich-domain/shared/month/unique-uuid-here
```

Anyone with this link can view the statistics for that month without logging in.

### What's Shared

Public viewers can see:
- Monthly distance traveled
- Countries visited
- Cities visited
- Hexagon map visualization (if enabled)

They **cannot** see:
- Your exact GPS points
- Personal information
- Other months' data
- Any account details

### Disabling Sharing

To stop sharing a month's stats:
1. Go to the month's stats page
2. Click **Share** settings
3. Toggle off or let the expiration pass

Once disabled, the share link becomes invalid.

### Automatic Expiration

Every link becomes inactive once the chosen period has passed. To keep sharing after that, enable sharing again.

## API Access for Shared Stats

When sharing is enabled, the hexagon map data can also be accessed via API:

```
GET /api/v1/maps/hexagons?uuid=your-share-uuid
```

This allows embedding the shared visualization in other applications.

## Privacy Considerations

- Share links use unguessable UUIDs
- Only specifically enabled data is exposed
- Exact coordinates are never publicly shared
- You control when sharing starts and stops
- Expiration provides automatic privacy protection
