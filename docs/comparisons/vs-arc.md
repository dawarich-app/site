---
sidebar_position: 6
title: Dawarich vs Arc (Retired)
description: Arc app has been retired. Compare Dawarich as an alternative to Arc for automatic location tracking, timeline views, and activity detection.
---

# Dawarich vs Arc (Retired)

Arc was an iOS app for automatic location and activity tracking, known for its beautiful timeline interface and machine learning-powered activity detection. **Arc was retired and is no longer available for download or use.**

If you were an Arc user looking for a replacement, this page compares what Arc offered with what Dawarich provides today.

## Legend

- ✅ **Fully supported** - Feature is available and well-implemented
- ⚠️ **Partially supported** - Feature exists but with limitations
- ❌ **Not supported** - Feature is not available
- 🚫 **App retired** - No longer available

## Feature Comparison

| Feature | Dawarich | Arc (Retired) |
|---------|----------|---------------|
| **Availability** |
| Currently available | ✅ | 🚫 Retired |
| Open source | ✅ | ❌ |
| **Privacy & Data Control** |
| Own your data | ✅ | ⚠️ (on-device) |
| Data export | ✅ (JSON, GPX) | ⚠️ (JSON) |
| Self-hosted option | ✅ | ❌ |
| **Location Tracking** |
| Automatic location tracking | ✅ (iOS, Android) | ✅ (iOS only) |
| Activity detection | ✅ (transport mode) | ✅ (ML-powered) |
| Place detection | ✅ | ✅ |
| Manual corrections | ⚠️ | ✅ |
| **Data Import/Export** |
| Google Takeout import | ✅ (web) | ❌ |
| GPX import | ✅ (web) | ❌ |
| GeoJSON import | ✅ (web) | ❌ |
| Arc JSON import | ❌ | N/A |
| **Visualization** |
| Interactive map | ✅ (web, iOS, Android) | ✅ (iOS) |
| Timeline view | ✅ (web) | ✅ (iOS) |
| Heatmap | ✅ (web) | ❌ |
| Statistics dashboard | ✅ | ⚠️ (basic) |
| **Location History** |
| Long-term history | ✅ (unlimited) | ✅ (on-device) |
| Trip creation | ✅ (web) | ❌ |
| Distance tracking | ✅ | ✅ |
| Countries/cities visited | ✅ | ❌ |
| **Photos** |
| Photo timeline integration | ✅ (web<sup>1</sup>) | ❌ |
| **Platform Support** |
| Web interface | ✅ | ❌ |
| iOS app | ✅ | 🚫 |
| Android app | ✅ | ❌ (never supported) |

<sup>1</sup> Photo timeline integration is available in the web interface, but currently only works with Immich and Photoprism.

## What Arc Users Miss Most

Arc users often mention these features they loved:

- **Automatic activity detection** — Dawarich detects transport modes (walking, driving, cycling) from your GPS data, though without Arc's machine learning granularity.
- **Beautiful timeline UI** — Dawarich's web timeline lets you browse your history day by day with an interactive map, similar in concept but different in design.
- **On-device processing** — Dawarich Cloud processes data on its servers, but the self-hosted version keeps everything on your own infrastructure. Either way, your data is never shared.

## What Dawarich Adds That Arc Never Had

- **Web interface** — View your data on a big screen, not just your phone
- **Android support** — Track on both platforms
- **Google Timeline import** — Bring in years of history from Google
- **Heatmap visualization** — See your most-visited areas at a glance
- **Multi-format import** — GPX, GeoJSON, KML, and more
- **Open source** — Verify the code, contribute, self-host
- **Trip creation** — Build trips from your tracked points with photos

## Pricing

| Plan | Dawarich | Arc (was) |
|------|----------|-----------|
| Self-hosted | Free (open source) | N/A |
| Cloud | €120/year or €18/month | ~$5/month (subscription) |
| Free trial | 7-day Cloud trial | N/A (retired) |

## Migrating from Arc

If you have Arc data exported as JSON, you can convert it to GPX and import it into Dawarich. The community has shared conversion scripts — check the [Dawarich Discord](https://discord.gg/pHsBjpt5MG) for help.

## Try Dawarich Cloud

No server to set up, works with the Dawarich mobile apps, automatic backups, and a 7-day free trial. [Start your free trial →](https://dawarich.app/pricing)
