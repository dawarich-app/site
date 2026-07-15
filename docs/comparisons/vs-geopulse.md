---
sidebar_position: 8
title: Dawarich vs GeoPulse
description: Compare Dawarich with GeoPulse across licensing, mobile apps, live location sharing, imports, integrations, and resource usage.
---

# Dawarich vs GeoPulse

GeoPulse is a self-hosted location timeline platform started in 2025, built in Java (Quarkus) with a Vue frontend. Like Dawarich, it positions itself as an alternative to Google Timeline, with an emphasis on a small resource footprint.

This page compares Dawarich with GeoPulse to help you understand the differences and choose the best option for your needs. Both projects are actively developed — this comparison reflects each project's documentation and releases as of July 2026. If something is out of date, [tell us and we'll fix it](https://github.com/dawarich-app/site/issues).

## Legend

- ✅ **Fully supported** - Feature is available and well-implemented
- ⚠️ **Partially supported** - Feature exists but with limitations
- ❌ **Not supported** - Feature is not available

## Feature Comparison

| Feature | Dawarich | GeoPulse |
|---------|----------|----------|
| **Licensing & Hosting** |
| Open source license | ✅ AGPL-3.0 | ⚠️ BSL 1.1 (source-available, free for personal use) |
| Self-hosted | ✅ | ✅ |
| Managed cloud option | ✅ Dawarich Cloud | ❌ |
| **Location Tracking** |
| Own native mobile apps | ✅ iOS & Android | ❌ (web app only) |
| Built-in tracking, no extra apps | ✅ | ❌ (requires a third-party tracker) |
| OwnTracks / Overland / GPSLogger support | ✅ | ✅ |
| Traccar support | ✅ | ✅ |
| Home Assistant support | ✅ | ✅ |
| **Timeline & Analysis** |
| Visit & place detection | ✅ | ✅ |
| Configurable detection thresholds | ⚠️ (defaults tuned automatically) | ✅ |
| Transport mode detection | ✅ | ✅ |
| Statistics dashboard | ✅ | ✅ |
| Yearly / monthly digests | ✅ | ❌ |
| AI insights | ❌ | ⚠️ (bring your own OpenAI key) |
| **Sharing & Family** |
| Live location share links | ✅ (phrase-protected, revocable, respects privacy zones) | ✅ (password-protected, revocable) |
| Trip / track share links | ✅ | ❌ |
| Shareable monthly stats | ✅ | ❌ |
| Family live location + history | ✅ | ⚠️ (friends with per-friend permissions) |
| Privacy zones | ✅ | ❌ |
| **Data Import/Export** |
| Google Takeout import (all formats) | ✅ | ⚠️ (Google Timeline export) |
| GPX / GeoJSON import | ✅ | ✅ |
| KML / FIT import | ✅ | ❌ |
| CSV import | ❌ | ✅ |
| Full data export (no lock-in) | ✅ GPX, GeoJSON, account archive | ✅ GPX, GeoJSON, CSV, JSON |
| **Integrations** |
| Immich | ✅ | ✅ |
| PhotoPrism | ✅ | ❌ |
| OIDC / SSO | ✅ | ✅ |
| **Technical** |
| Resource footprint | ⚠️ (heavier today; ~20% lighter stack ships in the next release) | ✅ (very light native binary) |
| Community | ✅ 9.7k stars, 56 contributors | ⚠️ 1.3k stars, 12 contributors |

## What GeoPulse Does Well

- **Small footprint** — compiled to a native binary, GeoPulse runs comfortably on very small servers. If your homelab is a 1 GB VPS and every megabyte counts, that's a real advantage.
- **Timeline configurability** — stay/trip detection thresholds are exposed as settings you can tune.
- **Fast iteration** — a motivated maintainer ships weekly releases.

## What Dawarich Adds

- **Native iOS and Android apps** with built-in tracking — no third-party tracker apps to configure. Install, sign in, and tracking works, including for non-technical family members.
- **A managed Cloud option** — if you ever stop wanting to run a server, your data can move to Dawarich Cloud (and back out again; exports are always open formats).
- **Privacy zones** — hide sensitive areas (home, work) from shared links and exports.
- **Richer sharing** — share live location, individual trips, tracks, and monthly stats, each with its own expiring, revocable link.
- **AGPL-3.0 open source** — Dawarich is OSI-approved open source. GeoPulse's BSL 1.1 is free for personal use but is not an open-source license and restricts commercial use.
- **A larger contributor community** — 56 contributors versus a mostly single-maintainer project, which matters for long-term continuity.

## Pricing

| Plan | Dawarich | GeoPulse |
|------|----------|----------|
| Self-hosted | Free (open source) | Free for personal use (BSL 1.1) |
| Cloud | €120/year or €18/month | N/A |
| Free trial | 7-day Cloud trial | N/A |

## Migrating from GeoPulse

Export your data from GeoPulse as GPX or GeoJSON and import it into Dawarich — imports are streamed and handle millions of points. The reverse works too: Dawarich exports your complete history in open formats, because your data should never be locked in.

## Try Dawarich Cloud

No server to set up, works with the Dawarich mobile apps, automatic backups, and a 7-day free trial. [Start your free trial →](https://dawarich.app/pricing)
