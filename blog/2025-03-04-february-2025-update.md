---
slug: february-2025-update
title: "February 2025 Update: Custom Map Tiles and the iOS App"
description: "Dawarich in February 2025: custom raster map tiles, the move to PostgreSQL 17 with PostGIS, speed handling fixes, and the release of the official Dawarich iOS app."
authors: evgenii
tags: [montly-update]
---

Hi there! It's Evgenii again with a monthly dose of Dawarich updates :)

Repo URL: [https://github.com/Freika/dawarich](https://github.com/Freika/dawarich) :)

Work pace have slowed down in February because I started my new job and I feel lucky when I have enough free time to work on Dawarich. And still, I have some good stuff to share with you!

<!-- truncate -->

Dawarich is slowly, but steadily moving from PostgreSQL 14 to PostgreSQL 17 with PostGIS extension. It's not always a smooth ride, partially due to the self-hosted nature of the application, partially due to my own mistakes, but we'll manage. Meanwhile, you can find these two posts in the Dawarich docs useful:

- [Moving to PostGIS](/docs/self-hosting/maintenance/moving-to-postgis)
- [Updating PostgreSQL](/docs/self-hosting/maintenance/update-postgresql)

One real problem with this initiative is that I wasn't able to find a good replacement for PostgreSQL + Postgis docker image to run on RaspberryPi with ARM32v6 and ARM32v7 architecture. In short, this problem might prevent RaspberryPi users from updating Dawarich to new versions. If you're aware of one, or if you are ready to build it and maintain it if necessary, please let me know. I hope to continue supporting Dawarich for RaspberryPis.

Starting version 0.26.0, Dawarich will be using PostgreSQL 17 + PostGIS, so guides linked above will be useful when you decide to update. Please do so, and don't forget to make a backup. Just in case.

---

Also, a friend of mine suggested creating a "Breaking changes" page with instructions to update for Dawarich users who're not following the release notes, where I usually post such instructions. It's a great idea, because I can't really expect every single user to read release notes, so this page will be created in the docs very soon.

**Now, to actual February updates!**

Dawarich now supports custom raster map tiles! 🎉 A feature requested a long time ago. You can go to your user settings, then Maps, and configure desired map layer. For those who wants to use commercial tiles provider, there is also a simple analytics for tile usage for the last 7 days. And you can also grab it with [Prometheus](https://github.com/Freika/dawarich/releases/tag/0.24.1) and render a nice graph in Grafana.

![Custom raster map tiles in Dawarich — this map rocks!](/img/blog/february-2025-update/custom-map-tiles.webp)

There was an inconsistency in how Dawarich handles the movement speed, which is now resolved. All endpoints that are accepting your location data, are expecting speed to be in meters per second, except for `POST /api/v1/owntracks/points`. Since OwnTracks is [sending](https://owntracks.org/booklet/tech/json/) its data in km/h, data, received to this endpoint, is expected to be sent in km/h, and then is converted to m/s. In the web interface, you'll see speed in km/h or mi/h, based on your settings.

Last, but not least, we now have an official [iOS app](https://apps.apple.com/de/app/dawarich/id6739544999?l=en-GB)! I teamed up with a friend of mine to work on it, and here we are! It's still the early days, and there is a lot to improve and implement, but you already can track your data, upload it to your Dawarich instance, see the stats, and set some [tracking](/location-tracking) settings. I'm super excited about what is to come. In the nearest future, we want to improve tracking experience and provide at least a bit more convenient UX, and after that is done, more awesome features will be implemented :)

![Dawarich iOS app map view](/img/blog/february-2025-update/ios-app-map.webp)

![Dawarich iOS app onboarding](/img/blog/february-2025-update/ios-app-onboarding.webp)

Also, a member of our community is working on an Android app, which is already supporting location tracking, viewing and deleting points and viewing the user timeline. It's not yet released, but I can't wait it to be available for our users, let's hope it will happen soon!

---

We're currently working on more exciting stuff for Dawarich, so stay tuned!

---

*This post was originally published on [r/selfhosted](https://www.reddit.com/r/selfhosted/comments/1j38pww/dawarich_february_2025_update/).*

*Dawarich is free, open-source and self-hostable. If you'd rather not run your own server, [Dawarich Cloud](https://my.dawarich.app/users/sign_in?utm_source=blog&utm_medium=post-cta&utm_campaign=february-2025-update) does the hosting for you.*
