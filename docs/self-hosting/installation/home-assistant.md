@@ -0,0 +1,50 @@
---
sidebar_position: 4
title: Home Assistant
description: Run Dawarich as a native Home Assistant app with automatic location tracking.
---

# Home Assistant

Run Dawarich directly on your Home Assistant device as a native app — no separate Docker setup needed. PostgreSQL, Redis, and Sidekiq are all bundled in a single container.

:::note
This app requires **Home Assistant OS (HAOS)**. It does not work with Home Assistant Container or Core installations.
:::

**Source:** [github.com/thomdev-j/homeassistant-app-dawarich](https://github.com/thomdev-j/homeassistant-app-dawarich)

## Features

- Automatic location tracking via HA's real-time state change stream
- Multi-user household support (each person gets their own Dawarich account)
- GPS drift filtering
- Reverse geocoding (Geoapify or self-hosted Photon)
- Integrated backups via HA's backup system (includes PostgreSQL dumps)
- Sidebar access via ingress

## Requirements

- Home Assistant OS (HAOS)
- ~800 MB free RAM
- ~1 GB disk for the app image
- Raspberry Pi 4/5 (4 GB+), Home Assistant Green, or any amd64/aarch64 device

## Installation

1. Add the [repository](https://github.com/thomdev-j/homeassistant-addon-dawarich) to your Home Assistant app store
2. Install and start the Dawarich app
3. Configure your tracked entities (e.g. `device_tracker.your_phone`)
4. Access Dawarich from the HA sidebar

## Multi-user setup

To track multiple household members, use the `:Name` suffix in `ha_tracked_entities`:

```
device_tracker.phone_alice:Alice, device_tracker.phone_bob:Bob
```

This creates separate Dawarich accounts per person (e.g. `alice@dawarich.local` with default password `password`).

See the [full documentation](https://github.com/thomdev-j/homeassistant-app-dawarich) for all configuration options and troubleshooting.
