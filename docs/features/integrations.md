---
sidebar_position: 11.5
title: Integrations
description: Connect Dawarich to TREK trip plans, TeslaMate drives and AirTrail flights. Set up each integration under Settings → Integrations, sync on demand or on a schedule.
---

# Integrations

Dawarich can pull data from other self-hosted services you already use. Each integration is set up under **Settings → Integrations**, where a list on the left shows every service and whether it is connected.

| Service | What Dawarich imports |
|---------|-----------------------|
| [TREK](#trek) | Trip plans: days, stops, places, reservations and day notes |
| [TeslaMateApi](#teslamate) | Positions from your cars' completed drives |
| [AirTrail](#airtrail) | Your flights, drawn as arcs on the map |
| [Immich and PhotoPrism](/docs/features/photos) | Photos shown on the map and in trips |

On Dawarich Cloud, integrations are not included in the Lite plan. On a self-hosted instance every user can use them.

:::tip
Dawarich Cloud connects to your services over the internet, so their address must be publicly reachable. A self-hosted Dawarich instance can also reach services on your local network or over Tailscale.
:::

## TREK

TREK is a self-hosted trip planner. Connecting it turns selected TREK itineraries into Dawarich [trips](/docs/features/trips). TREK stays the source of the plan; your recorded location data stays separate.

### Connecting TREK

1. In TREK, create a read-only API key under **Settings → Integrations**. It starts with `trek_`.
2. In Dawarich, open **Settings → Integrations → TREK**.
3. Enter your **TREK URL** and **TREK API key**, then click **Connect TREK**.
4. On **Choose TREK trips**, select the trips you want and click **Import selected trips**. Only selected trips are copied. A trip needs start and end dates in TREK before it can be imported.

You can change the selection later with **Choose trips**. **Sync now** fetches changes immediately; otherwise Dawarich syncs every six hours.

### TREK trips in Dawarich

An imported trip shows a **Plan from TREK** panel above the recorded days. It lists the days and stops of the plan, travellers, accommodations, other reservations and unplanned places, and links back with **Open in TREK**.

- **Name and dates come from TREK.** They are read-only in Dawarich and update with every sync. Change them in TREK.
- **Trips with nothing recorded yet** draw the planned stops on their map and card preview.
- **Recorded trips** can lay the plan over the recorded track.
- **Day notes** from TREK fill in the trip's day notes and stay in sync until you edit a note in Dawarich.

### Disconnecting

Click **Disconnect**. The trips you imported and their recorded data stay in Dawarich, including the plan, but stop syncing. **Reconnect TREK** lets you enter the connection details again.

## TeslaMate

Dawarich reads your Tesla drives through [TeslaMateApi](https://github.com/tobiasehlert/teslamateapi), a REST API for TeslaMate. It needs TeslaMateApi v1.25.0 or newer.

### Connecting TeslaMateApi

1. Open **Settings → Integrations → TeslaMateApi**.
2. Enter the **TeslaMateApi URL**, the base URL of your TeslaMateApi instance.
3. If TeslaMateApi sits behind a protected reverse proxy, fill in **HTTP Basic username** and **HTTP Basic password**. Use **Bearer token** instead for a proxy or fork that expects one. Plain TeslaMateApi read endpoints need neither.
4. Turn on **Skip SSL certificate verification** only for a self-signed certificate you trust on your local network.
5. Click **Save & Test Connection**.

### What gets synced

- Positions from the **completed drives** of every car in TeslaMate become points in Dawarich.
- Current drives and parked positions are not available through TeslaMateApi, so they are not imported.
- The first sync imports your drive history. After that, completed drives sync automatically once a day, or immediately with **Sync TeslaMateApi drives → Sync now**.
- Points from TeslaMate get [suggested visits](/docs/features/visits-and-places) like any other points. To cover drives imported before you upgraded to Dawarich 1.17.0, choose **Re-run detection on full history** in the visit settings (**Settings → Visits**).

On Dawarich Cloud, synced points count toward your plan's point limit, and syncing stops when the limit is reached or the plan no longer includes integrations.

## AirTrail

[AirTrail](https://github.com/johanohly/AirTrail) is a self-hosted flight tracker. Dawarich imports your flights from it and draws them as arcs, so a flight no longer shows up as a straight line of sparse GPS points.

### Connecting AirTrail

1. In AirTrail, create an API key under **Settings → Security**.
2. In Dawarich, open **Settings → Integrations → AirTrail**.
3. Enter the **AirTrail URL** and **AirTrail API Key**. Turn on **Skip SSL certificate verification** only for a self-signed certificate you trust.
4. Click **Save & Test Connection**.

Flights sync automatically once a day. **Sync AirTrail flights → Sync now** fetches them immediately.

### Where flights appear

- **Map:** the **Flights** layer shows your flights as arcs and hides the GPS points recorded during them. See [Map layers](/docs/features/map#map-layers).
- **Trips:** the **Flights** toggle on a trip's map shows the flights of that trip and hides the day routes that fall inside a flight.
- **Poster Studio:** downloaded trip posters include the flight arcs when the Flights layer is on. Posters saved to the gallery use GPS routes only. See [Poster Studio](/docs/features/poster-studio).
- **Stats:** monthly stats show the flight distance as its own figure. See [Stats](/docs/features/stats).
