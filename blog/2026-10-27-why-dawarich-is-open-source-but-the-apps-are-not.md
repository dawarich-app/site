---
slug: why-dawarich-is-open-source-but-the-apps-are-not
title: "Why Dawarich Is Open Source, but the Mobile Apps Are Not"
description: "Dawarich is AGPL and always will be. The official iOS and Android apps are closed source. Here's why, and how to get a fully open-source setup if that's what you want."
authors: evgenii
---

Hello there, good people, Evgenii from Dawarich here! This question comes up every couple of weeks — on Reddit, in GitHub issues, in our Discord — so I figured it deserves a proper answer in one place instead of scattered comments.

The question is: Dawarich itself is open source, so why aren't the official mobile apps? Short answer: the paid features in the apps are how we hope to one day work on Dawarich full-time. Longer answer below.

<!-- truncate -->

## What's open and what's not

Let's get the facts straight first.

- **Dawarich** — the server, the thing you self-host, the map, the stats, the imports, all of it — is open source under AGPL-3.0. Code is on [GitHub](https://github.com/Freika/dawarich). That's not changing.
- **The official Dawarich apps for iOS and Android** are closed source.

That's it. The core of the project, the part that stores and shows your location history, is and will stay open.

## Why the apps are closed

The apps have a few paid features:

- **Apple Health import** (iOS) — pull your location history from Apple Health into Dawarich.
- **Photo location import** (iOS and Android) — read GPS data from the photos in your library, manually or automatically for new photos. The photos themselves never leave your phone, only the locations do.
- **The Insights widget** — your route, streak, and seven-day trend right on your home screen. The Daily summary widget stays free.

I want to be very clear about one thing: all of these are optional. None of them stand between you and your data. Tracking, the map, stats, imports, export — none of that is behind a paywall. Every paid feature is a shortcut for something you can already do by hand: export your Apple Health data and upload the GPX files to Dawarich, turn your photos into a GPX track with exiftool or import them from Immich or PhotoPrism, open the stats page instead of glancing at a widget. Pro just does it for you, so you save time and effort, and you support the development while you're at it.

All of them run on your phone. The app does the work, and only then sends regular location points to your Dawarich instance. So if we open-sourced the apps, removing the paywall would be a five-minute job for anyone with a code editor, and the paid features would stop being something anyone pays for.

## Why it matters to us

Here's the honest part. Both Konstantin and I have full-time jobs. Dawarich happens in the evenings, on weekends, and in whatever time is left between those. I mostly work on Dawarich itself, Konstantin works on the mobile apps, and we're both always behind on bug reports, feature requests, and every new iOS or Android release that breaks background location in a new and creative way.

What we hope for is that one day Dawarich can pay for itself well enough that we can work on it full-time. That's not happening while we spend our days on someone else's product. The paid features in the apps, together with Dawarich Cloud, are how we're trying to get there.

And I think that outcome is good for everyone. Full-time means faster bug fixes, quicker reactions when a phone OS update breaks tracking, more features, and more time for the community. And a lot of that time would go into the open-source server, which every self-hoster gets for free, whether they ever touch our apps or not.

We did look at other options. One was splitting things into an open shell with closed binary modules for the paid parts. We decided against it: it's a pain to maintain, it would still keep the apps out of F-Droid, and honestly it would be open source in name more than in spirit. The other was one of those licenses that let you read the code but not really use it. I don't like them. If something is closed, I'd rather just say it's closed than dress it up as open.

## The fully open-source path

Here's the part I want to make very clear, because it often gets lost: **you don't need our apps to use Dawarich.** Never did.

Dawarich has been accepting data from third-party trackers since day one, and many of them are open source:

- [OwnTracks](https://owntracks.org/) (iOS and Android)
- [GPSLogger](https://gpslogger.app/) (Android)
- [Traccar Client](https://www.traccar.org/client/) (iOS and Android)
- [PhoneTrack](https://f-droid.org/packages/net.eneiluj.nextcloud.phonetrack/) (Android, on F-Droid)
- The community-built [Dawarich Android app](https://github.com/sunstep/dawarich-android) by sunstep, GPL-3.0
- [Overland](https://overland.p3k.app/) (iOS)

Self-hosted Dawarich plus one of these gives you an end-to-end setup where every byte of your location data goes through code you can read, audit, and modify. That's not a degraded fallback, it's a complete setup. A lot of people in our community have been running exactly that for years.

Setup guides for all of them are in the docs: [Track your location](/docs/getting-started/track-your-location).

## So which one should you use?

Up to you, really. Two options, two kinds of people:

- If you want everything open, from the phone to the server, go with self-hosted Dawarich and an open-source tracker. You get the full Dawarich experience, for free.
- If you want the official apps, the extra features, and someone to blame when tracking breaks after an iOS update, use the official apps. Paid features are part of the deal, and that's what keeps them alive. If you're on Dawarich Cloud, the Pro features in the apps are included in your subscription.

You choose what works for you, and we choose how to fund the project. Both are fair.

---

If you have questions or think I'm missing something, come talk to us in [Discord](https://discord.gg/pHsBjpt5J8) or on the [forum](https://discourse.dawarich.app/). And if you're one of the people who bought Pro in the app — thank you, you're getting us a little closer to working on Dawarich full-time.
