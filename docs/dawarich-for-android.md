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
- **Layers** — toggle routes, visits, points, the heatmap, hexagons and photos. **Points source** switches between **Server + device** and **Device only**.
  - **Hexagons** highlights the cells your selected tracks pass through, over a subtle grid. It follows the selected dates and points source and works independently of route lines.
  - **Photos** shows the photos of the selected dates at the places they were taken: photos from the Immich or PhotoPrism instance connected to your Dawarich server, and photos in your phone's library. Phone photos and their locations are read on the device and never uploaded by this layer, and the same picture from both sources appears once. Phone photos are shown on Android 13 and newer. The layer is off by default and free to use.
- **Replay** — play back the selected day's movement from the timeline controls.

## Adding visits

You can add a visit by hand, for example for a place you were at while tracking was off. You need to be connected to a Dawarich server.

1. Tap **Add visit** above the replay controls, or touch and hold the map where the visit was.
2. A **New visit** pin appears in the middle of the map. Move the map until the pin sits on the place, then tap **Next**.
3. Check the **Place name**. It is filled in from the address when one is found; if not, enter a name.
4. Set the arrival and departure times. For today they default to the last 60 minutes.
5. Tap **Save visit**.

The visit is saved as confirmed, with your name and the place address kept separately (the address is stored on servers that support it). If you already have a visit within 150 m at the same time, the app warns you with **You already have a visit here**: tap **Show it** to see the existing visit, or **Add anyway**.

Without a connection, new visits are kept on the phone as faded pins marked **Waiting to upload**, and are sent when the app opens or comes back to the foreground. You can delete a waiting visit from its pin. A visit the server keeps rejecting is marked **Couldn't upload**.

## Family

If you are in a [family](/docs/features/family), tap the **Family** button on the map to open the family panel. From there you can:

- See who is in your family and who is sharing, and show every sharing member on the map
- Turn your own live location on or off and choose how long to share
- Share your location history and pick the history window, including whether movements from before you started sharing may be shown
- Request a member's location, and accept or decline requests sent to you

Families are created, and members invited, in Dawarich on the web. If the family's plan ends, the panel says so and, for the owner, offers to renew.

## Insights

The **Insights** tab has three sub-tabs:

- **Insights** — year totals, year-over-year comparison, an activity heatmap, streaks and travel patterns.
- **Stats** — per-year stats with a monthly distance chart.
- **Digests** — browse, generate and delete yearly digests.

All of it is cached on device, so it still opens when you're offline.

## Importing photo locations

**Settings → Pro features → Import photo locations** turns the locations stored in your photos into points on your map. Only the time each photo was taken and its GPS coordinates are used. Your photos never leave the phone.

1. Allow Dawarich to read your photo library when asked.
2. Tap **Scan photo library**. With limited photo access, tap **Choose photos** to pick the photos to scan instead.
3. The app shows how many photo locations it found. Tap **Import … locations** to save them.

The locations are saved on the phone and uploaded like any other points, following your upload settings. Duplicates are skipped. Some photo services leave out GPS when they share files. If a photo shows a location in your gallery but isn't found, download its original and choose that file.

On Android 13 and newer, **Automatically import new photo locations** keeps importing from photos taken after you turn it on. New photos are picked up when you open Dawarich, and in the background when the system allows. Automatic import needs full photo library access.

Photo location import needs an active or trial Dawarich Cloud plan, or Pro on a self-hosted server, and a server version that supports the import. Showing phone photos on the map with the Photos layer is free.

## Home Screen widgets

Dawarich has two Home Screen widgets. **Settings → Pro features → Dawarich widgets** shows a preview of both and how to add them.

- **Daily** (free) — today's distance, the number of recorded points, when it was last updated, and whether tracking is on.
- **Insights** (Pro) — adds today's route, your streak and the last seven days of activity. It needs an active or trial Cloud plan or self-hosted Pro.

To add one, touch and hold an empty area on your Home Screen, choose **Widgets**, then add **Dawarich Daily** or **Dawarich Insights**.

## Wear OS

The Dawarich app for Wear OS shows whether tracking is on, with **Start** and **Stop** controls. Tracking controls are free.

With an active or trial Cloud plan or self-hosted Pro, the watch also shows today's distance, the number of recorded points, your streak and the last seven days. Watch complications show the tracking status and today's distance or points, and open the app when tapped. Tracking only starts or stops when you use the controls in the app, never from a complication.

The watch gets its data from your phone. If statistics are missing or out of date, open Dawarich on the phone.

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
