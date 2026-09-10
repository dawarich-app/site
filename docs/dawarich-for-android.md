---
sidebar_position: 98
title: Dawarich for Android
description: Install the Dawarich Android app, connect it to Dawarich Cloud or your self-hosted instance, grant location permissions, and tune tracking and upload settings.
---

# Dawarich for Android

The Dawarich app records your location on your Android phone or tablet and uploads it to Dawarich Cloud or to your own self-hosted instance. It keeps recording in the background and works offline.

**Requirements:** an Android phone or tablet, and either a Dawarich Cloud account or a self-hosted Dawarich instance.

## Installation

Search for "Dawarich" in Google Play, or tap the badge below.

<a href="https://play.google.com/store/apps/details?id=app.dawarich.Dawarich">
  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" width="220" />
</a>

## Connect to a server

On first launch the app shows a short intro, then the sign-in screen.

### Dawarich Cloud

Tap **Sign in with Google** or **Sign up with Email**. If you already have a Cloud account, tap **Already have an account? Sign in**.

### Self-hosted instance

Tap **For self-hosters — Connect to your own Dawarich instance**, then pick one of two methods:

- **Scan QR Code** — open your Dawarich instance in a browser, go to **Account → API access**, and scan the QR code shown there. The server URL and API key are filled in and validated for you.
- **Manual Setup** — enter your **Server URL** (for example `https://your-server.example.com`) and the **API key** from the same **Account → API access** page. If your server sits behind an authenticating reverse proxy such as Pangolin or Cloudflare Access, add the required **Custom headers** here; they are stored per server and are never sent to Dawarich Cloud.

:::tip
Use HTTPS. The app warns you when the URL is plain HTTP.
:::

You can also tap **Continue without signing in** to look around first. Nothing is uploaded until you connect a server — do that later from **Settings → Server Connection → Sign in**.

## Grant permissions

After connecting, the app walks you through the permissions it needs. Getting these right is what makes tracking reliable on Android.

1. **Location data** — choose **"While using the app"** and leave **Precise Location** on, so your journeys come out accurate.
2. **Always-on tracking** — set location access to **"Allow all the time"**. Without it, tracking stops the moment you leave the app.
3. **Tracking notification** (Android 13 and newer) — Dawarich shows a quiet, ongoing notification while it tracks. That notification is how Android knows to keep recording in the background, so leave it enabled.
4. **Keep Dawarich running** — swiping Dawarich out of **Recent Apps** can stop tracking, and many phones close background apps to save battery.

You can review the current state and re-request anything later under **Settings → App → Permissions**.

:::caution Battery optimisation
For reliable recording, set battery usage to **Unrestricted** under **Settings → Apps → Dawarich → Battery**. On Samsung, Xiaomi, Huawei and OnePlus devices, also enable **Auto-start**. See [dontkillmyapp.com](https://dontkillmyapp.com) for the settings your specific phone needs.

On Android 14 and newer, you can dismiss the ongoing tracking notification without stopping tracking — it stays dismissed for the rest of that tracking session.
:::

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

The app records your location on your device, so tracking keeps working even without an internet connection — on a plane, underground, hiking off-grid, or travelling abroad without data. Your points are stored safely on the phone and uploaded to your Dawarich instance automatically once you're back online. Nothing is lost to a dropped connection.

## Tracking settings

**Settings → Tracking → Tracking Settings**

### Smart Tracking (experimental)

Smart Tracking uses motion detection to pause location updates after you have been still for a while and resume them once you move again or leave the area. Two settings control it:

- **Stationary Duration** — how long still motion must continue before tracking pauses.
- **Geofence Radius** — the radius used to resume tracking after leaving the stationary area.

An event log below the settings shows when it paused and resumed.

:::caution Experimental
Smart Tracking may not pause or resume reliably. Tracking might remain active, stop unexpectedly, or fail to record some locations. Leave it off if you need complete tracks.
:::

### Fine-tuning

- **Accuracy** — higher accuracy uses more battery.
- **Distance Filter** — record a new location only if the device has moved at least this distance.
- **Time Filter** — record a new location only if at least this much time has passed since the last one.
- **Track Breaking** — start a new track if no location is received within this interval.

## On the map

- **Day ribbon** — horizontal day cards with per-day point density, an hourly sparkline for the selected day, and a jump-to-date modal for picking a day or a multi-day range.
- **Layers** — toggle routes, points and the heatmap. **Points source** switches between **Server + device** and **Device only**.
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

## Automation

### Quick Settings tiles

Dawarich provides two Quick Settings controls:

- **Dawarich tracking** — toggles location tracking and reflects its current state.
- **Upload points** — schedules all pending points for upload.

Open Quick Settings, enter edit mode, and drag either control into the active area. The device must be unlocked before either one runs, and **Upload points** stays dimmed until a server URL and API key are saved.

### Tasker and other automation apps

Dawarich exposes three Locale/Tasker plug-in actions — **Start tracking**, **Stop tracking** and **Upload track** — which also work with compatible hosts such as MacroDroid and Automate.

They are **off by default**. Turn on **Allow other apps to trigger Dawarich** under **Settings → Android automation** first; until you do, every action returns an error and changes nothing.

:::caution
Once the opt-in is on, any installed app can invoke these actions — the caller is not limited to Tasker. That is a consequence of the Locale plug-in protocol, which requires an exported receiver that no app-specific permission can restrict.
:::

## Troubleshooting

**Tracking stops when the app is in the background.** Check that location access is set to **Allow all the time** in **Settings → App → Permissions**, set battery usage to **Unrestricted**, and don't swipe Dawarich out of Recent Apps. See [dontkillmyapp.com](https://dontkillmyapp.com) for manufacturer-specific settings.

**Points aren't reaching the server.** Open **Settings → Server Connection** and tap **Test Connection**. It shows the server URL and, when the connection succeeds, the server version. If you are behind a reverse proxy, check your custom headers under **Self-hosted settings**.

**Something else is wrong.** **Settings → Debug → Debug logs** collects logs you can share with the developers. Alerts about tracking, uploads and visits can be turned on or off individually under **Settings → Notifications → Notification settings**.
