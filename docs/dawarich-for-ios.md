---
sidebar_position: 97
title: Dawarich for iOS
description: Install the Dawarich iOS app, connect it to Dawarich Cloud or your self-hosted instance, grant location permissions, and tune tracking and upload settings.
---

# Dawarich for iOS

The Dawarich app records your location on your iPhone or iPad and uploads it to Dawarich Cloud or to your own self-hosted instance. It keeps recording in the background and works offline.

**Requirements:** iOS 17.6 or later, and either a Dawarich Cloud account or a self-hosted Dawarich instance.

## Installation

Search for "Dawarich" in the App Store, or tap the badge below.

<a href="https://apps.apple.com/app/apple-store/id6739544999?pt=128010810&ct=docs-ios&mt=8">
  <img src="/img/app-store.png" alt="Download on the App Store" width="220" />
</a>

## Connect to a server

On first launch the app shows a short intro, then the sign-in screen.

### Dawarich Cloud

Tap **Sign in with Apple**, **Sign in with Google**, or **Sign up with Email**. If you already have a Cloud account, tap **Already have an account? Sign in**.

### Self-hosted instance

Tap **For self-hosters — Connect to your own Dawarich instance**, then pick one of two methods:

- **Scan QR Code** — open your Dawarich instance in a browser, go to **Account → API access**, and scan the QR code shown there. The server URL and API key are filled in and validated for you.
- **Manual Setup** — enter your **Server URL** (for example `https://your-server.example.com`) and the **API key** from the same **Account → API access** page. If your server sits behind an authenticating reverse proxy such as Pangolin or Cloudflare Access, add the required **Custom headers** here; they are stored per server and are never sent to Dawarich Cloud.

:::tip
Use HTTPS. The app warns you when the URL is plain HTTP. If your server is on your local network, iOS asks for local network access the first time you connect.
:::

You can also tap **Continue without signing in** to look around first. Nothing is uploaded until you connect a server — do that later from **Settings → Server Connection → Sign in**.

## Grant permissions

After connecting, the app walks you through the permissions it needs. Getting these right is what makes tracking reliable.

1. **Location data** — choose **"While Using the App"** and leave **Precise Location** on, so your journeys come out accurate.
2. **Always-on tracking** — set location access to **"Always Allow"**. Without it, tracking stops the moment you leave the app.
3. **Don't swipe Dawarich away** — swiping the app up and off the app switcher fully closes it, and no points are recorded until you open it again. You don't need to keep Dawarich on screen; just leave it running in the background.

You can review the current state and re-request anything later under **Settings → App → Permissions**.

## Start tracking

1. Open the **Map** tab.
2. Expand the tracking card at the bottom of the screen.
3. Turn **Tracking** on.

The card shows the time of the last sync and the current upload mode, and switches to a **Synced** state once your points have reached the server.

To have tracking resume by itself, turn on **Start tracking automatically** under **Settings → Tracking → Tracking Settings** — tracking then starts whenever you launch the app.

## Uploading points

By default the app uploads points automatically while tracking, so there is nothing to do manually. The behaviour is configurable under **Settings → Upload**:

| Setting | What it does |
|---|---|
| **Upload points automatically** | Uploads while tracking. On by default. |
| **Upload when tracking stops** | Uploads all pending points when you turn tracking off. |
| **Batch size** | How many points each automatic upload sends. Default 100. |
| **Re-upload points** | Re-sends the points recorded in a date range you pick. |

You can also upload on demand: tap the sync button on the tracking card to upload pending points and refresh the selected history.

If an upload fails, an **Upload failed** banner appears on the map with a **Retry** action.

## Offline tracking

The app records your location on your device, so tracking keeps working even without an internet connection — on a plane, underground, hiking off-grid, or travelling abroad without data. Your points are stored safely on the iPhone and uploaded to your Dawarich instance automatically once you're back online. Nothing is lost to a dropped connection.

## Tracking settings

**Settings → Tracking → Tracking Settings**

### Detail level

- **Detailed** — records a more detailed path using your accuracy, distance and time settings. Higher battery use.
- **Battery saver** — lets iOS report significant movement only. Minimal battery use.

Switching modes while you are recording ends the current track and starts a new one.

### Continuous Tracking

Available in **Detailed** mode. Keeps tracking enabled with iOS-managed, motion-aware location updates: iOS pauses updates to conserve battery and resumes them when it detects movement. While it is on, iOS manages the distance filter and the blue background location indicator is always shown.

### Fine-tuning

In **Detailed** mode you can tune how often a point is recorded:

- **Accuracy** — higher accuracy uses more battery.
- **Distance Filter** — record a new location only if the device has moved at least this distance.
- **Time Filter** — record a new location only if at least this much time has passed since the last one.
- **Track Breaking** — start a new track if no location is received within this interval.
- **Show location indicator** — shows the blue iOS background location indicator while tracking.

Battery saver mode ignores these — iOS decides when to report a location.

### Visits

Choose how visits are detected:

- **While tracking** (default) — detect visits only while location tracking is on.
- **Always on** — detect visits even when tracking is off.
- **Off** — don't detect visits.

## On the map

- **Day ribbon** — horizontal day cards with per-day point density, an hourly sparkline for the selected day, and a jump-to-date modal for picking a day or a multi-day range.
- **Layers** — toggle routes, visits, points and the heatmap. **Points source** switches between **Server + device** and **Device only**.
- **Replay** — play back the selected day's movement from the timeline controls.

## Insights

The **Insights** tab has three sub-tabs:

- **Insights** — year totals, year-over-year comparison, an activity heatmap, streaks and travel patterns.
- **Stats** — per-year stats with a monthly distance chart.
- **Digests** — browse, generate and delete yearly digests.

All of it is cached on device, so it still opens when you're offline.

## Sync settings between devices

Once connected, **Settings → Settings sync** stores your tracking and upload preferences on your Dawarich server so your devices match. The **Status** row tells you whether settings are synced, pending, unsupported by your server, or failing, and **Sync now** retries and re-checks server support. A per-device switch lets one device keep its settings local.

Servers that are too old for the mobile settings API simply keep settings on the device.

Under **Settings → Preferences** you can switch the distance unit between kilometres and miles; the change applies across Stats, Insights and Digests immediately, including offline.

## Pro features

**Import from Apple Health** reads workouts that carry a route from Apple Health and imports them into Dawarich. It is part of the Pro subscription — tap **Subscribe to Pro** under **Settings → Pro features** if you don't have it yet.

## Automation

The app exposes **Start Tracking**, **Stop Tracking** and **Upload Points** actions to the Shortcuts app, so you can trigger them from time- or location-based automations. See [Tracking with Shortcuts](/docs/getting-started/ios-app/shortcuts-automation).

## Troubleshooting

**Tracking stops when the app is in the background.** Check that location access is set to **Always Allow** in **Settings → App → Permissions**, and make sure you are not swiping Dawarich out of the app switcher.

**Points aren't reaching the server.** Open **Settings → Server Connection** and tap **Test Connection**. It shows the server URL and, when the connection succeeds, the server version. If you are behind a reverse proxy, check your custom headers under **Self-hosted settings**.

**Something else is wrong.** **Settings → Debug → Debug logs** collects logs you can share with the developers. Alerts about tracking, uploads and visits can be turned on or off individually under **Settings → Notifications → Notification settings**.
