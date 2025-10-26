---
slug: carefully-preserve-your-memories
title: Carefully Preserve Your Memories
authors: evgenii
tags: [tools]
---

# Building a Privacy-First Google Timeline Visualizer

Google Timeline has been tracking your location history for years, quietly collecting data about everywhere you've been. But what happens when you export that data? You get one or multiple JSON files that... well, most people have no idea what to do with them.

That's why we built the [Google Timeline Visualizer](https://dawarich.app/tools/timeline-visualizer) — a free, privacy-first tool that turns those cryptic JSON files into an interactive map you can actually explore.

<!--truncate-->

## The Problem: Google's Timeline Limitations

Google recently made some controversial changes to Timeline. They killed the web-based timeline browser, moved all data to mobile devices, [lost years of users' data in the process](https://www.reddit.com/r/GoogleMaps/comments/1diivt3/megathread_google_maps_timeline_moving_to/), and started limiting how long your location history is stored. If you want to keep your data or visualize it properly, you're basically on your own.

When you export your Google Timeline data through Takeout or from your phone, you get JSON files — sometimes hundreds of megabytes worth. These files contain years of location data, place visits, and activity segments, but there's no easy way to visualize them without uploading to yet another third-party service.

We needed a solution that was fast, secure, and most importantly: kept your data private.

## Privacy-First Architecture

Location data is incredibly sensitive. It shows where you live, where you work, where you go for medical appointments, who you visit, and your daily routines. Uploading this to a random web service is a huge privacy risk (except for Dawarich Cloud haha).

That's why our visualizer runs **entirely in your browser**. When you upload your JSON files:

- **Nothing is sent to any server** — all processing happens locally on your device
- **No tracking or analytics** on your location data
- **Your data stays in your browser's memory** and disappears when you close the tab
- **[Open source and transparent](https://github.com/dawarich-app/site/blob/main/src/components/TimelineMap.js)** — you can verify exactly what the code does

This approach means your location history never leaves your computer. It's the digital equivalent of opening a paper map in your living room instead of mailing it to a stranger.

## How It Works

The visualizer follows a straightforward process:

1. **Upload Your Files** — Drop your Google Timeline JSON files into the browser
2. **Auto-Detection** — The tool automatically identifies the format (Records.json, Semantic Timeline, Location History, etc.)
3. **Progressive Processing** — Files are parsed in batches to keep your browser responsive
4. **Interactive Map** — Points and paths appear on the map using Leaflet and OpenStreetMap
5. **Year Filtering** — Filter by year to explore specific time periods without overwhelming your browser

The entire process happens in JavaScript running in your browser. For a 170 MB file with 630,000 location points, processing takes about 20-30 seconds on a modern computer.

### Handling Massive Files

One of the biggest technical challenges was performance. Google exports can contain hundreds of thousands of GPS points. Loading all of them at once would crash most browsers.

We solved this with several optimizations:

**Batch Processing** — Points are streamed to the map in batches of 5,000, yielding control to the browser between batches. This keeps the UI responsive even while processing massive datasets.

**Year-Based Pagination** — The visualizer calculates how many points exist in each year, then defaults to showing only the earliest year. Users can switch between years or view all data at once. This typically reduces the initial render from 600k+ points to 40-60k points.

**Incremental Rendering** — When switching years, only the new points are added to the map. The library handles clustering and de-duplication automatically.

**Lazy Popups** — Instead of generating HTML for 600k popups upfront, popup content is created only when you click on a marker.

These optimizations mean you can visualize years of location history without your browser grinding to a halt.

## Supported Formats

Google exports location data in several different formats depending on when and how you export it. The visualizer supports all of them:

**Records.json** — Raw GPS location records in E7 coordinate format. This is the oldest format and typically the largest file, containing every GPS ping Google recorded.

**Semantic Timeline (YYYY_MONTH.json)** — Monthly files containing place visits and activity segments. These are more structured and include information about what you were doing (walking, driving, etc.) and which places you visited.

**Location History (from phone)** — The newer format exported directly from Google Maps on Android or iOS. This uses a different JSON structure with `semanticSegments` and timeline paths.

**Semantic Segments** — A processed format with geographic coordinates in "geo:lat,lng" string format, often created by parsing raw exports with tools like `jq`.

No matter which format Google gives you, the visualizer will detect it automatically and extract:
- GPS coordinates and timestamps
- Place visits with duration
- Activity segments (walking, driving, cycling)
- Activity paths showing your actual route

## Features

**Interactive Map** — Pan, zoom, and explore your location history on an OpenStreetMap base layer. Markers show individual locations, while colored polylines show your movement paths.

**Smart Filtering** — The side panel shows only meaningful visits and places, not every GPS ping. For a Records.json file with 600k raw points, the list shows only actual place visits — making it useful instead of overwhelming.

**Year Selector** — Filter by year to focus on specific time periods. The dropdown shows how many points exist in each year, making it easy to explore your data chronologically.

**Auto-Fit Bounds** — When you switch years, the map automatically zooms to show all points for that period. Traveled from Europe to the USA in different years? The map adapts to each dataset.

**Dark Mode** — Full support for light and dark themes with proper contrast.

## Limitations

Bigger files take time to process. A 170 MB file with hundreds of thousands of points needs 20-30 seconds to parse and render. This happens once when you first load the file.

Browser memory limits apply. While we've tested files with 600k+ points across 15 years successfully, extremely large exports (multiple years, multiple large files) might struggle on older computers with limited RAM.

The visualizer shows your data but doesn't edit it. If you want to keep your location history accessible, export it to formats like GPX, or store it long-term, you'll need additional tools.

## Getting Your Data

The visualizer includes detailed instructions for exporting your Google Timeline data:

**Google Takeout** — Visit [takeout.google.com](https://takeout.google.com), select "Location History (Timeline)", and export. Note that this method doesn't work for everyone due to Google's policy changes.

**Android** — Open Google Maps → Settings → Location → Location Services → Timeline → Export Timeline

**iOS** — Open Google Maps → Settings → Personal Content → Export Timeline data

Once you have your JSON files, just drag and drop them into the visualizer.

## When You Need More

The Timeline Visualizer is great for quick exploration and one-time analysis. But if you want to:
- Store your location history securely long-term
- Import data from multiple sources (GPX, GeoJSON, etc.)
- Track ongoing location data from your devices
- Access your timeline from anywhere
- Share specific trips or areas

...then you need a proper location tracking platform.

That's where [Dawarich](https://dawarich.app) comes in. It's an open-source location tracker that gives you full control over your location data. It supports all the same Google Timeline formats as the visualizer, plus GPX files from hiking apps, GeoJSON exports, and real-time tracking from mobile apps.

The visualizer shows you what's possible. Dawarich lets you keep it.

## Technical Stack

The visualizer is built with:
- **React 18** — UI components and state management
- **Leaflet** — Interactive maps with OpenStreetMap tiles
- **Leaflet.markercluster** — Efficient clustering of thousands of markers
- **Docusaurus** — Static site generation and documentation
- **Custom JavaScript parsers** — Handle Google's various export formats

All processing happens client-side. No backend, no database, no user tracking.

## Future Improvements

We're exploring additional visualizations like heatmaps, timeline charts, and statistics (most visited places, total distance traveled, etc.). Better performance optimizations are always on the roadmap.

## Try It Yourself

The Google Timeline Visualizer is free to use at [dawarich.app/tools/timeline-visualizer](https://dawarich.app/tools/timeline-visualizer).

Export your Google Timeline data, drop it in, and see where you've been. All in your browser, all private, all yours.

---

## Resources & Credits

Building this visualizer required understanding Google's various export formats and parsing their different JSON structures. Here are the key resources and tools that made it possible:

- https://locationhistoryformat.com/ — Comprehensive documentation of Google Location History formats
- jq — Command-line JSON processor used for parsing and transforming Google Location History (the exports from user's devices)
- Leaflet.js — Open-source JavaScript library for interactive maps

---

*The Google Timeline Visualizer is part of the Dawarich ecosystem. All code is open source and available on GitHub.*
