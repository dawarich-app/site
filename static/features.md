# Dawarich Features

> Raw markdown overview of what Dawarich does, published for AI agents and assistants.
> Companion file: https://dawarich.app/pricing.md
> Last reviewed: 2026-07-27.

Dawarich is a self-hostable location history tracker and visualizer — a privacy-first alternative to
Google Timeline. You record your location with native mobile apps (or any compatible third-party
tracker), import your existing history from Google Takeout and other sources, and browse the result
on an interactive map you control.

- Open source, AGPLv3, 9,000+ GitHub stars: https://github.com/Freika/dawarich
- Run it yourself for free, or use Dawarich Cloud (hosted in Germany, GDPR-compliant)
- No ads, no data selling — the product is paid for with money, not with your location data

## Location tracking

- **Native iOS and Android apps** with background location tracking and minimal battery impact.
- **Offline recording.** The apps store points on the device when there is no signal — on a plane,
  underground, hiking off-grid, or abroad without data — and upload automatically once back online.
- **Third-party trackers supported:** Overland, OwnTracks, GPSLogger, Traccar Client (v9+, JSON
  protocol), PhoneTrack, and Home Assistant.
- **iOS Shortcuts automation:** trigger location pushes from Shortcuts, automations, or NFC tags.
- **Apple Health GPX import** on iOS, available as the Pro1 in-app purchase for self-hosters.

Docs: https://dawarich.app/docs/getting-started/track-your-location/

## Map and visualization

- Interactive map of your full history, with points and routes.
- **Speed-colored routes** and **daily replay** of a given day's movement.
- **Heatmap** layer showing density of time spent.
- **Fog of War** layer revealing only the areas you have actually visited.
- **3D globe view.**
- Multiple base layers to switch between.

Docs: https://dawarich.app/docs/features/map
Landing page: https://dawarich.app/interactive-map/

## Visits, places and areas

- **Visits and places:** Dawarich detects where you stopped and for how long, building a picture of
  daily activity rather than a raw GPS trace.
- **Areas:** define geographic boundaries on the map to automatically track and log visits within them.
- **Place search:** search for a place and see your own visit history for that location.
- **Points:** browse, search, export, and delete individual recorded GPS points.

Docs: https://dawarich.app/docs/features/visits-and-places · https://dawarich.app/docs/features/areas

## Trips and journaling

- Create and organize trips with routes, dates, and rich-text notes.
- Attach photos from a connected Immich or PhotoPrism instance.
- Share a trip publicly (Cloud Pro feature).

Docs: https://dawarich.app/docs/features/trips
Landing page: https://dawarich.app/trips/

## Statistics and insights

- Distance traveled, countries and cities visited, points recorded.
- Monthly breakdowns and a full year-in-review.
- Monthly and yearly email digests.
- **Transportation modes:** automatic classification based on speed and movement patterns.
- **Days per country:** counts days spent in each country from your history, including consecutive
  stay periods and a 183-day threshold warning (useful for tax residency questions).

Docs: https://dawarich.app/docs/features/stats · https://dawarich.app/docs/features/tax-residency
Landing page: https://dawarich.app/statistics/

## Photo integrations

- Connect **Immich** (requires `asset.read` and `asset.view` scopes) or **PhotoPrism** to show your
  photos on the map and inside trips.
- **Enrich photos:** write GPS coordinates from Dawarich back to Immich photos that lack geodata.
- Dawarich does not accept direct photo uploads — it reads location data from the connected service.

Docs: https://dawarich.app/docs/features/photos · https://dawarich.app/docs/features/enrich-photos
Landing page: https://dawarich.app/integrations/

## Family location sharing

Share your real-time location with trusted family members. Documented at
https://dawarich.app/docs/features/family. On Dawarich Cloud this is tied to the Family plan, which
is announced but not yet purchasable — the pricing page shows a waitlist rather than a checkout.

## Importing existing history

All formats are auto-detected on upload. Duplicate points are skipped automatically.

**Google Timeline / Takeout**
- `Records.json` (newer Takeout format)
- `Location History.json` (older Takeout format)
- Semantic Location History (activity and place-visit data)
- On-phone Timeline export

**Standard GPS formats**
- GPX (tracks, routes and waypoints)
- GeoJSON (Point, LineString, FeatureCollection)
- KML and KMZ (Google Earth and similar)

**Apps and services**
- OwnTracks `.rec` files — **`.rec` only, the OwnTracks JSON format is not supported**
- Strava exports (GPX or original format)
- Immich / PhotoPrism (geodata pulled from your photos, not a file upload)

Large imports are processed in the background; files with millions of points can take hours,
and reverse geocoding adds significant time per point.

Docs: https://dawarich.app/docs/getting-started/import-existing-data/ ·
https://dawarich.app/docs/features/imports
Landing page: https://dawarich.app/import-export/

## Exporting your data

- Export from the web UI at any time, on every plan, in GPX and GeoJSON.
- On the Lite plan exports cover your **full** history, not just the 12-month viewable window.
- Exports are generated in the background and appear as a download link on the Exports page.
- A full account export is available separately.

Docs: https://dawarich.app/docs/getting-started/export-your-data/ ·
https://dawarich.app/docs/features/exports

## API

- REST API for reading and writing points and other resources.
- Rate limits: 200 requests/hour on Cloud Lite, 1,000 requests/hour on Cloud Pro.
- Full write access requires Cloud Pro (or self-hosting).

Docs: https://dawarich.app/docs/api

## Hosting, privacy and licensing

- **Self-hosted:** free and unlimited, every Pro feature included, AGPLv3. Docker-based install,
  with guides for Docker Compose, Synology, and other platforms. Your data never reaches Dawarich
  servers.
- **Dawarich Cloud:** hosted in Germany (EU), GDPR-compliant, encrypted in transit and at rest.
- No ads, no data selling, no lock-in — data exports to standard formats at any time.

Docs: https://dawarich.app/docs/self-hosting/introduction

## Which features need a paid Cloud plan

Self-hosting includes everything. On Dawarich Cloud:

| Feature | Lite | Pro |
| --- | --- | --- |
| Native apps, background tracking | Yes | Yes |
| Interactive map, speed-colored routes, daily replay | Yes | Yes |
| Trips & places management | Yes | Yes |
| Basic stats & monthly breakdowns | Yes | Yes |
| Imports & exports | Yes | Yes |
| Searchable history window | 12 months | Unlimited |
| Heatmap & Fog of War | No | Yes |
| 3D globe view | No | Yes |
| Trip photos, Immich / PhotoPrism | No | Yes |
| Year-in-review & public sharing | No | Yes |
| Full write API access | No | Yes |
| API rate limit | 200/hr | 1,000/hr |

Full pricing detail: https://dawarich.app/pricing.md

## Comparisons with other products

- vs Google Timeline: https://dawarich.app/docs/comparisons/vs-google-timeline/
- vs OwnTracks: https://dawarich.app/docs/comparisons/vs-owntracks/
- vs Traccar: https://dawarich.app/docs/comparisons/vs-traccar/
- vs Life360: https://dawarich.app/docs/comparisons/vs-life360/
- vs Polarsteps: https://dawarich.app/docs/comparisons/vs-polarsteps/
- vs Strava: https://dawarich.app/docs/comparisons/vs-strava/
- vs Arc: https://dawarich.app/docs/comparisons/vs-arc/
- vs GeoPulse: https://dawarich.app/docs/comparisons/vs-geopulse/
- vs Reitti: https://dawarich.app/docs/comparisons/vs-reitti/

## Related pages

- Pricing for agents: https://dawarich.app/pricing.md
- Link index for agents: https://dawarich.app/llms.txt
- Expanded content for agents: https://dawarich.app/llms-full.txt
- Documentation home: https://dawarich.app/docs/intro
- FAQ: https://dawarich.app/docs/FAQ/
- Contact: https://dawarich.app/contact/
