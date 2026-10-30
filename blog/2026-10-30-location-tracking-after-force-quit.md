---
slug: location-tracking-after-force-quit
title: "Does Location Tracking Keep Working After You Force Quit the App?"
description: "Dawarich not tracking after you closed the app? What force quit does on iPhone, what swiping away and force stop do on Android, and which modes recover."
authors: evgenii
tags: [guides]
---

"I swiped Dawarich away and now it doesn't track. My day has a hole in it. Bug?"

Not a bug. On iPhone, whether the Dawarich app keeps tracking after you close it depends on the tracking mode. On Android it keeps working, unless your phone's manufacturer decided otherwise.

<!-- truncate -->

## Does closing apps save battery?

No. A suspended app costs almost nothing, and starting it from scratch costs more than resuming it. Dawarich's battery use goes to the GPS, not to the app sitting in the app switcher. So the swipe saves nothing and costs you part of your track.

## Dawarich on iPhone: what happens after you force quit

Swiping an app up in the app switcher is a force quit, and iOS takes it literally. Apple's location guide says that after the app is terminated, "a user must explicitly relaunch your app before the delivery of location updates resumes". The exceptions are region monitoring and the significant-change service. Each Dawarich mode uses a different Core Location service, so each behaves differently:

- **Detailed** (the default) uses standard location updates. After a force quit it stops until you open Dawarich again, then carries on in the same track. Whatever happened in between is gone.
- **Continuous Tracking** (an option in Detailed) uses Apple's `liveUpdates` API with a background activity session, the blue pill in the status bar. If iOS kills the app to free memory, iOS relaunches it and Dawarich rejoins the session at launch. After a force quit or a reboot, you have to open the app.
- **Battery saver** uses the significant-change service: cell towers and Wi-Fi, a new point roughly every 500 metres. This one comes back after a force quit. An Apple engineer confirmed in March 2026 that it "will relaunch the app despite a force quit". It needs "Always" location access and Background App Refresh turned on.

One caveat: a developer on Apple's forums reported that on iOS 26 this relaunch didn't happen during a 30 km drive. I haven't confirmed it. If you see it, tell me your iOS version.

If you want to stop tracking on iPhone, use the stop button or the "Stop tracking" action in Shortcuts. Don't use the app switcher.

## Dawarich on Android: swiping away vs force stop

Dawarich on Android runs as a foreground service. That's the persistent "tracking" notification. Swiping the app out of Recents closes the screen, not the service, so tracking continues. Dawarich also restarts tracking after a reboot or an app update if it was on. Since Android 14 you can dismiss the notification, and that doesn't stop tracking either.

These are the things that do stop it:

1. **Force stop** in Settings → Apps → Dawarich. Nothing runs until you open the app again. Android 15 also cancels the geofences Smart Tracking relies on.
2. **Stop in the active apps list** in quick settings (Android 13+). It kills the whole app, notification included.
3. **Your phone's manufacturer.** Some Xiaomi, Huawei, OnePlus and Samsung builds treat a swipe as a force stop or kill background apps on their own schedule.

For the third one, set battery usage to "Unrestricted" (Settings → Apps → Dawarich → Battery) and enable Auto-start where your phone has it. [Don't kill my app](https://dontkillmyapp.com) has the steps for each manufacturer.

## Cheat sheet

| What happened | iPhone: Detailed / Continuous | iPhone: Battery saver | Android |
|---|---|---|---|
| You swiped it away | Stops until reopened | Relaunches after ~500 m | Keeps tracking |
| System killed it for memory | Detailed stops, Continuous relaunches | Relaunches | Service is recreated |
| Force stop | No such thing | No such thing | Stops until reopened |

## Dawarich not tracking? Check these first

- **You force quit it.** Open Dawarich and tracking resumes.
- **iPhone, Battery saver:** location access is "Always", and Background App Refresh is on for Dawarich and globally.
- **Android:** the tracking notification is there (or you dismissed it yourself), and battery usage is "Unrestricted".
- **Android, still stopping:** the manufacturer's background killer. See the list above.

Every tracking app on your phone lives by the same rules, OwnTracks included: here's [how Dawarich compares to OwnTracks](/docs/comparisons/vs-owntracks). If a gap has already split your trip into two files, [the GPX merger](/tools/gpx-merger) joins them. There's more about what the app records on the [location tracking page](/location-tracking). [Dawarich Cloud](https://my.dawarich.app/users/sign_up?utm_source=blog&utm_medium=bottom-cta&utm_campaign=location-tracking-after-force-quit) comes with a 7-day free trial if you'd rather not host a server.

Cheers!
