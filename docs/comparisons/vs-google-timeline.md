---
sidebar_position: 1
title: Dawarich vs Google Timeline
description: Dawarich is the privacy-first, self-hostable alternative to Google Timeline. Full feature comparison, migration in 5 minutes, FAQ, and verdict for ex-Timeline users in 2026.
keywords: [google timeline alternative, replace google timeline, google timeline shutdown, location history alternative, dawarich vs google]
---

# Dawarich vs Google Timeline

**TL;DR:** Google quietly killed the browser version of Timeline in late 2024 and is shrinking on-device retention. **Dawarich** is the closest drop-in replacement: an open-source, privacy-first location-history app that imports your existing Google Takeout export and lets you keep your timeline forever — either self-hosted (free) or on Dawarich Cloud (from €49.99/yr). It's the option most often recommended by [XDA Developers](https://www.xda-developers.com/self-hosted-google-timeline-location-history-alternative/), [MakeUseOf](https://www.makeuseof.com/i-use-free-open-source-app-track-everywhere-ive-been-without-google/), and [Android Authority](https://www.androidauthority.com/google-maps-timeline-alternative-3568195/).

If you're here to migrate today, [skip to the 5-minute migration](#migrating-from-google-timeline-in-5-minutes).

## Why people are switching

Three things changed for Google Timeline users between 2024 and 2026:

- **The web view is gone.** As of December 2024 you can no longer open `maps.google.com/timeline` in a browser. Your timeline now lives only on the device that recorded it.
- **Default retention shrank to 3 months.** Older entries are deleted unless you actively re-enable longer retention on every device.
- **Export is one-shot.** You get a Takeout dump and that's it. There's no continuous backup, no API, no syncing across devices.

People are leaving Timeline either because they want their decade of history *visible again* (the web view), or because they want it *somewhere it isn't going to disappear next time Google reorganises a product line*. Dawarich answers both.

## What Dawarich does that Google Timeline doesn't

| | Google Timeline (2026) | Dawarich |
|---|---|---|
| Browser-based timeline | ❌ Removed Dec 2024 | ✅ Always |
| Default retention | 3 months on-device | Forever (you control storage) |
| Self-host on your own hardware | ❌ | ✅ Open source, AGPLv3 |
| Public API | ⚠️ Via Takeout one-shot | ✅ Full REST API |
| Heatmaps | ❌ | ✅ |
| Custom areas (geofences) | ❌ | ✅ |
| Trip creation & journaling | ❌ | ✅ |
| Family sharing | ❌ | ✅ (self-hosted) |
| Imports your existing Takeout | n/a | ✅ Records.json, Semantic, phone exports |

Dawarich is missing one thing Timeline has: **direct geotagging of photos in your phone gallery**. Dawarich does ingest geodata *from* configured Immich or PhotoPrism instances (see [photo integrations](/integrations/)), but it doesn't push EXIF back to your camera roll. If photo geotagging is your single most important feature, Timeline's hybrid approach still wins on that one axis.

## Migrating from Google Timeline in 5 minutes

The cleanest path:

1. **Export your Timeline data** from [takeout.google.com](https://takeout.google.com/) → "Location History (Timeline)". Wait for the email (anywhere from a few minutes to a day).
2. **Convert it (optional, but recommended)**: Google's export format is awkward. Drop the JSON files into the [free Google Timeline Converter](/tools/google-timeline-converter/) to get clean GPX/KML/GeoJSON. The tool runs entirely in your browser — your location data never leaves your device.
3. **Pick a Dawarich flavour:**
   - **Cloud** ([€49.99/yr Lite or €17.99/mo Pro](/#pricing)) — sign up, drag your file in, done.
   - **Self-hosted** ([free](/docs/self-hosting/introduction/)) — `docker compose up -d` and you have your own private timeline server.
4. **Import** via the web UI (Settings → Imports). Dawarich auto-detects whether you uploaded raw Records.json, Semantic Location History, the new on-phone export, or a converted GPX.
5. **You're done.** Your full history is on the [interactive map](/interactive-map/), with [heatmap and trip overlays](/statistics/), and the [API](/docs/api/dawarich-api/) is available if you want to build your own dashboards on top.

If your Takeout file is enormous, run it through the [Timeline Splitter](/tools/google-timeline-splitter/) first. If you have multiple exports from different phones, the [Timeline Merger](/tools/timeline-merger/) deduplicates them.

## Full feature comparison

### Legend

- ✅ **Fully supported** — Feature is available and well-implemented
- ⚠️ **Partially supported** — Feature exists but with limitations
- ❌ **Not supported** — Feature is not available

| Feature | Dawarich | Google Timeline |
|---|---|---|
| **Privacy & data control** | | |
| Own your data | ✅ | ❌ |
| No data sharing with third parties | ✅ | ❌ |
| Self-host on your own server | ✅ (Docker, free) | ❌ |
| Open source | ✅ (AGPLv3) | ❌ |
| **Location tracking** | | |
| Automatic location tracking | ✅ (iOS, Android) | ✅ |
| Manual location logging | ✅ (iOS) | ❌ |
| GPS accuracy settings | ✅ (iOS, Android) | ❌ |
| **Data import / export** | | |
| Google Takeout import | ✅ (web) | ❌ |
| GPX import | ✅ (web) | ❌ |
| GeoJSON import | ✅ (web) | ❌ |
| KML import | ✅ (web) | ✅ |
| JSON export | ✅ (web) | ⚠️ (via Takeout, one-shot) |
| GPX export | ✅ (web) | ❌ |
| KML export | ⚠️ (planned) | ✅ |
| **Visualization** | | |
| Browser-based interactive map | ✅ | ❌ (removed Dec 2024) |
| Timeline view | ✅ (web) | ✅ (mobile only) |
| Heatmap | ✅ (web) | ❌ |
| Statistics dashboard | ✅ | ⚠️ (basic) |
| **Places & areas** | | |
| Custom areas / geofences | ✅ (web) | ❌ |
| Place detection | ✅ | ✅ |
| Visit duration tracking | ✅ | ✅ |
| **Photos** | | |
| Photo geotagging in your camera roll | ❌ | ✅ |
| Photo timeline integration | ✅ (Immich, PhotoPrism) | ✅ |
| **Trips & analysis** | | |
| Trip creation & journaling | ✅ (web) | ❌ |
| Distance tracking | ✅ (web) | ✅ |
| Transport mode detection | ✅ | ✅ |
| **Technical** | | |
| Public REST API | ✅ | ⚠️ (Takeout only) |
| Family access | ✅ (self-hosted) | ❌ |
| **Platforms** | | |
| Web interface | ✅ | ❌ (removed) |
| iOS app | ✅ | ✅ |
| Android app | ✅ | ✅ |
| Default retention | Forever | 3 months |

## Frequently asked questions

**Is Dawarich free?**
Yes — self-hosted is free and open source under AGPLv3. Dawarich Cloud (managed hosting in Germany) starts at €49.99/yr (Lite) or €17.99/mo / €119.99/yr (Pro).

**Will Dawarich import my old Google Timeline data?**
Yes. Dawarich auto-detects all the major Google Timeline export formats: Records.json, Semantic Location History (the monthly `YYYY_MONTH.json` files), the newer on-phone export, and the legacy formats. See [the import guide](/docs/getting-started/import-existing-data/).

**Where is my data stored?**
On Dawarich Cloud: in Germany (EU), encrypted at rest, on hardware operated by ZeitFlow UG. Self-hosted: wherever you put your Docker volume — your laptop, your NAS, a VPS, anywhere.

**Is Dawarich safer than Google Timeline?**
"Safer" depends on your threat model. Google has better infrastructure security than any indie operator. But Google also reads, monetises, and uses your location data for advertising and product training; Dawarich does none of that, can't legally share with third parties under EU rules, and on self-hosted you own the storage outright. For users who left Timeline because of *privacy*, Dawarich is unambiguously a step up.

**Will my phone battery survive?**
The Dawarich iOS and Android apps use the same coarse-grained background tracking pattern as Google Maps (significant-location-change events plus periodic samples), not continuous GPS. Battery impact is comparable.

**What happens if Dawarich shuts down?**
Self-hosted: nothing — it's your container, your database, your data. Cloud: you can export your full history at any time as JSON, GPX, or GeoJSON. Open source means even if the project disappears, the code keeps working and forks can take over.

## Verdict

If you came to Google Timeline for the **map of your life** and stayed for the casual "where was I last summer?" lookups, Dawarich is the closest drop-in replacement available in 2026. It's faster than Timeline ever was, it has features Timeline never shipped (heatmap, custom areas, trip journaling, REST API), and crucially it puts your decade of location history back in a browser tab where you can actually look at it.

If photo geotagging in your camera roll is the *only* reason you used Timeline, you'll want to keep using it on mobile and pair it with Dawarich for everything else. For everyone else: [convert your Takeout export](/tools/google-timeline-converter/), [pick a flavour](/#pricing), and you're done.
