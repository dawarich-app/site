---
slug: state-of-dawarich-august-2025
title: "State of Dawarich — August 2025"
description: "Dawarich Cloud launches, manual visit creation, smarter imports, full account export/import, Prometheus metrics, and a look at what's coming: Tracks, family features, and the Android app."
authors: evgenii
tags: [montly-update]
---

Hello, dearest people!

3 months passed since the last public update on Dawarich, so I figured, I should share the news with you once again.

In case you missed it, Dawarich is your favorite FOSS alternative to [Google Timeline](/docs/comparisons/vs-google-timeline):

- Github: [https://github.com/Freika/dawarich](https://github.com/Freika/dawarich)
- Website: [https://dawarich.app/](https://dawarich.app/)

So, TL;DR first, then some details.

<!-- truncate -->

## What's new

- We launched Dawarich Cloud! A bit more on that below.
- Users can now create and delete visits manually, using a tool on the [map](/interactive-map) (plus icon in top right corner of the map). Appropriate API endpoint was added.
- Imports page was updated, now you don't need to select source of import explicitly. Just upload a file, hit "Create import" and Dawarich will automagically figure out how work with it. List of supported [import formats](/import-export) is available in the new import page.
- X-Dawarich-Response and X-Dawarich-Version headers are now returned for all API responses. It's just more convenient that way.
- Live mode of the map used to cause huge memory leaks, no more.
- Prometheus metrics, considering it's properly configured, are now available at `/metrics`, hidden behind basic auth with `METRICS_USERNAME` and `METRICS_PASSWORD` environment variables.
- User can now export an archive with their data in the account settings and import it back on a different Dawarich instance. Might be useful. Don't forget about a proper database backup though.
- User can now disable visits suggestion in User Settings -> Background Jobs
- All distance values are now stored in the database in meters. Conversion to user's preferred unit is done in browser.
- Links in emails will be based on the `DOMAIN` environment variable instead of `SMTP_DOMAIN`.
- The `RAILS_CACHE_DB`, `RAILS_JOB_QUEUE_DB` and `RAILS_WS_DB` environment variables can be used to set the Redis database number for caching, background jobs and websocket connections respectively. Default values are now 0, 1 and 2 respectively.
- LocationIQ can now be used as a geocoding service. Set `LOCATIONIQ_API_KEY` to configure it.
- LOTS of bugfixes and performance improvements. The app performance itself should also be significantly improved in the browser.
- Some bugs were for sure introduced.

---

## What's coming

Unlike usually, today I want to share some plans for the future.

- Soon you'll be able to configure your iOS app by scanning a QR code from Dawarich. It's just more convenient than copy-pasting instance url and API key.
- I vibe-coded an Android app and it doesn't really feel terrible. Posted it to Google Play store, under review, then will go to closed beta test. Leave your gmail email here if you want to participate: [https://tally.so/r/w2Wqa9](https://tally.so/r/w2Wqa9)
- New entity, Tracks, are under development. Release of Tracks is going to significantly improve the Map page performance, more details are available on [Patreon](https://www.patreon.com/posts/tracks-are-133737009)
- In the future months, I want to start working on family features to allow users build a group, where you can share your current and past location with each other. Think: Life360, but self-hosted, light version.
- Also, I have some improvements for [Trips](/trips) in mind, such as public trip sharing, and some more intricate, but let's see how it goes.

## Tech fidgeties

I heard people complaining about Dawarich using 4 (FOUR) containers to run and it's way too much. Let's count: 1 for PostgreSQL (DB), 1 for Redis (websockets, cache and background jobs queues), 1 for the web app itself (dawarich_app) and 1 for Sidekiq (background jobs processing).

A few months ago, developers of Rails released an update, that included something they called a Solid Trifecta: Solid Queue (for background jobs), Solid Cache (for cache) and Solid Cable (for websockets). And it supposed to work in a single container, so switch to Solid Trifecta would allow Dawarich to run only two containers, DB and Web app with all the internals. Great, thought I.

And switched Dawarich to it. It worked nicely on my machine, haha. Until it didn't for oh so many other people. Long story short, I switched back to original setup and made my peace with 4 containers. If you, the reader, is about to update your Dawarich instance, use [Updating Guides](/docs/self-hosting/updating) to suffer less.

## Dawarich Cloud

Important disclaimer: Self-hosted Dawarich is and will remain open source, free of charge and fully functional, no features will be hidden behind any kind of paywall.

Mid-July my iOS partner and I, after suffering through German bureaucracy for 4 months and 10 days in attempts to establish a company, launched Dawarich Cloud. (if you're interested to know a bit more about what took so long, you can give a read to my [thread](https://x.com/freymakesstuff/status/1947274661068251231))

It's the same Dawarich, but you don't have to self-host anything. Register, subscribe, configure your mobile app and you're ready to go. We even have 7 days of mostly unlimited trial (no credit card required) now. And to our surprise, we even have a handful of paying active users! What a concept. So, now if you have a friend, who is just as passionate about their memory being put and kept on a map, you can recommend us them. Thank you.

If a miracle will ever happen, and we become somehow profitable, it'll mean we'll be able to spend more time working on Dawarich, polishing existing features and introducing new ones. That's probably the ultimate goal, but I don't really want to go ahead of myself.

So, that's how past 3 months went! As always, you can share your feedback in our [Discord channel](https://discord.gg/pHsBjpt5J8), send us an email to [hi@dawarich.app](mailto:hi@dawarich.app) (I read everything), support us on [Patreon](https://www.patreon.com/freika) or [Ko-Fi](https://ko-fi.com/freika) and, of course, check out the [source code](https://github.com/Freika/dawarich) and self-host Dawarich at home :)

Cheers!

---

*This post was originally published on [r/selfhosted](https://www.reddit.com/r/selfhosted/comments/1n0imj4/state_of_dawarich_august_2025/).*

*Dawarich is free, open-source and self-hostable. If you'd rather not run your own server, [Dawarich Cloud](https://my.dawarich.app/users/sign_in?utm_source=blog&utm_medium=post-cta&utm_campaign=state-of-dawarich-august-2025) does the hosting for you.*
