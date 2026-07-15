---
sidebar_position: 9
title: Dawarich vs Reitti
description: Compare Dawarich with Reitti across features, mobile apps, location sharing, imports, integrations, and hosting options.
---

# Dawarich vs Reitti

Reitti is a self-hosted location tracking application built in Java, licensed under AGPL-3.0 like Dawarich. It focuses on a clean daily timeline with visit and trip detection, and offers location sharing between users — including across separate Reitti instances.

This page compares Dawarich with Reitti to help you understand the differences and choose the best option for your needs. Both projects are actively developed — this comparison reflects each project's documentation and releases as of July 2026. If something is out of date, [tell us and we'll fix it](https://github.com/dawarich-app/site/issues).

## Legend

- ✅ **Fully supported** - Feature is available and well-implemented
- ⚠️ **Partially supported** - Feature exists but with limitations
- ❌ **Not supported** - Feature is not available

## Feature Comparison

| Feature | Dawarich | Reitti |
|---------|----------|--------|
| **Licensing & Hosting** |
| Open source license | ✅ AGPL-3.0 | ✅ AGPL-3.0 |
| Self-hosted | ✅ | ✅ |
| Managed cloud option | ✅ Dawarich Cloud | ❌ |
| **Location Tracking** |
| Own native mobile apps | ✅ iOS & Android | ❌ (web app only) |
| Built-in tracking, no extra apps | ✅ | ❌ (requires a third-party tracker) |
| OwnTracks / Overland / GPSLogger support | ✅ | ✅ |
| Home Assistant support | ✅ | ✅ |
| Multiple devices per user | ✅ | ✅ |
| **Timeline & Analysis** |
| Visit & place detection | ✅ | ✅ |
| Transport mode detection | ✅ | ✅ |
| Statistics dashboard | ✅ | ⚠️ (basic statistics) |
| Yearly / monthly digests | ✅ | ❌ |
| Trip creation with photos | ✅ | ❌ |
| GPS point correction tools | ⚠️ (point editing on the map) | ✅ (interactive workbench) |
| **Sharing & Family** |
| Live location share links | ✅ (phrase-protected, revocable, respects privacy zones) | ✅ (magic links for temporary access) |
| Sharing across instances (federation) | ❌ | ✅ |
| Trip / track share links | ✅ | ❌ |
| Shareable monthly stats | ✅ | ❌ |
| Family live location + history | ✅ | ⚠️ (user-to-user sharing) |
| Privacy zones | ✅ | ❌ |
| **Data Import/Export** |
| Google Takeout import (all formats) | ✅ | ✅ |
| GPX / GeoJSON import | ✅ | ✅ |
| KML / FIT import | ✅ | ❌ |
| Full data export (no lock-in) | ✅ GPX, GeoJSON, account archive | ⚠️ (GPX) |
| **Integrations** |
| Immich | ✅ | ✅ |
| PhotoPrism | ✅ | ❌ |
| OIDC / SSO | ✅ | ✅ |
| **Technical** |
| Resource footprint | ⚠️ (heavier today; ~20% lighter stack ships in the next release) | ⚠️ (moderate: JVM + Redis + PostGIS) |
| Community | ✅ 9.7k stars, 56 contributors | ⚠️ 2.3k stars, 17 contributors |

## What Reitti Does Well

- **Federation** — sharing your location with users on *other* Reitti instances is a genuinely novel feature none of the alternatives offer.
- **GPS workbench** — an interactive tool for correcting bad GPS points.
- **Same license philosophy** — AGPL-3.0, so everything stays open source.

## What Dawarich Adds

- **Native iOS and Android apps** with built-in tracking — no third-party tracker apps to configure. Install, sign in, and tracking works, including for non-technical family members.
- **A managed Cloud option** — if you ever stop wanting to run a server, your data can move to Dawarich Cloud (and back out again; exports are always open formats).
- **Privacy zones** — hide sensitive areas (home, work) from shared links and exports.
- **Richer sharing** — live location, individual trips, tracks, and monthly stats, each with its own expiring, revocable link.
- **Trips, digests and deeper statistics** — build trips from your points with photos, and get monthly/yearly recaps of your travels.
- **PhotoPrism support** in addition to Immich.

## Pricing

| Plan | Dawarich | Reitti |
|------|----------|--------|
| Self-hosted | Free (open source) | Free (open source) |
| Cloud | €120/year or €18/month | N/A |
| Free trial | 7-day Cloud trial | N/A |

## Migrating from Reitti

Export your data from Reitti as GPX and import it into Dawarich — imports are streamed and handle millions of points. The reverse works too: Dawarich exports your complete history in open formats, because your data should never be locked in.

## Try Dawarich Cloud

No server to set up, works with the Dawarich mobile apps, automatic backups, and a 7-day free trial. [Start your free trial →](https://dawarich.app/pricing)
