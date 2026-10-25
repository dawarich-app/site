---
sidebar_position: 8.2
title: TREK
description: Import trips planned in TREK into Dawarich, keep their itinerary in sync, and see the plan next to the route you actually travelled.
---

# TREK

[TREK](https://github.com/liketrek/TREK) is a self-hosted trip planner. Dawarich can import trips you planned in TREK as [Trips](/docs/features/trips) and keep them in sync. TREK stays the source of the plan; Dawarich adds the route you actually travelled from your own location history.

## Connecting TREK

1. In TREK, create a read-only API key under **Settings → Integrations**. It starts with `trek_`.
2. In Dawarich, open **Settings → Integrations → TREK**.
3. Enter the **TREK URL**, for example `https://trek.example.com`, and the **TREK API key**.
4. Choose **Connect TREK**.

Dawarich Cloud needs a TREK URL that is reachable from the internet. A self-hosted Dawarich can also connect to a TREK instance on your home network or over Tailscale.

### Self-signed certificates

If your TREK instance uses a self-signed certificate or one from a private certificate authority, turn on **Skip SSL certificate verification (self-signed certificates)** when you connect it. The connected source then shows an **SSL verification off** badge. Use this only on a network you trust: without verification, the connection can be intercepted.

If Dawarich can't verify the certificate and the option is off, the error shown on the source tells you to reconnect with the option turned on.

## Choosing trips

After connecting, Dawarich asks which TREK trips to import. Only the trips you select are copied into Dawarich, and you can change the selection later with **Choose trips**.

A trip needs a start and an end date in TREK before it can be imported. Archived trips can't be selected.

## What you see in Dawarich

Each imported trip becomes a Dawarich trip with the name and dates from TREK. Dawarich calculates the trip's path, distance and countries from your own location points for those dates, as for any other trip.

The trip page shows a **Plan from TREK** section above the recorded days, with the itinerary: days and their stops, reservations, accommodations, travellers and unplanned places. Click a stop to centre the trip map on it, or **Open in TREK** to open the trip in TREK.

- A trip with nothing recorded yet draws the planned stops on its map and card preview.
- A recorded trip can lay its plan over the track.
- TREK day notes fill in the trip's day notes and stay in sync until you edit them in Dawarich.

The name and dates come from TREK and update with every sync, so change them in TREK rather than in Dawarich.

## Syncing

Dawarich syncs the selected trips every 6 hours. **Sync now** syncs them right away.

- A trip that you delete or archive in TREK, or whose dates you remove, stops syncing. It stays in Dawarich and shows **Sync stopped**.
- If TREK rejects the API key, for example because you deleted it, the source is switched off. Reconnect it with a new key.
- **Disconnect** stops syncing. The imported trips and their recorded data stay in Dawarich.

## Dawarich Cloud and self-hosted

On Dawarich Cloud, the TREK integration needs a Pro or Family plan. Self-hosted instances can use it without a plan.
