---
slug: january-2025-monthly-update
title: "January 2025 Monthly Update"
description: "Dawarich in January 2025: speed-colored routes, canvas rendering for huge maps, 20x faster Google Takeout imports, Geoapify support, and a feature in a German print magazine."
authors: evgenii
tags: [montly-update]
---

Hello there!

First month of 2025 is behind us and I'm happy to share changes happened in [Dawarich](https://github.com/Freika/dawarich), your favorite self-hosted location history visualizer, during January.

<!-- truncate -->

First, the big important thing is that the maintainers of Photon, our reverse geocoding provider of choice, reached out to us, Dawarich users, and [kindly asked](https://github.com/Freika/dawarich/issues/614) us to self-host our own Photon instances, as Dawarich became too popular for a free Photon instance to handle and created a significant load. Fortunately, I already have an [instruction](/docs/self-hosting/configuration/reverse-geocoding#setting-up-your-own-reverse-geocoding-service) on how to spin up your own Photon instance on your server (warning, it takes ~120gb for the whole planet), and for those who don't want to bother with self-hosting a reverse geocoding instance, there is a [tier](https://www.patreon.com/freika) on Patreon that offers access to a private photon instance hosted by yours truly.

Second and related, Dawarich now supports [Geoapify](/docs/self-hosting/configuration/reverse-geocoding#how-to-enable-reverse-geocoding) as a reverse geocoding provider. It's also aimed to reduce the load on public Photon instance.

Moving on!

Some breaking changes were introduced this month, please make sure you have read the [release notes](https://github.com/Freika/dawarich/releases/tag/0.22.0) before updating.

The fancy routes were introduced in mid-January! Love this feature. Just have a look at the screenshot, it colors your route based on speed in each segment. Enablable in the [map](/interactive-map) settings (top left corner of the map).

![Routes colored by speed on the Dawarich map — look at how awesome they are](/img/blog/january-2025-monthly-update/speed-colored-routes.webp)

One big improvement I'm especially proud of is switching points and polylines mode rendering on the map to canvas. This single change made working with map with dozens of thousands of points so much smoother than before, I still can't believe it. My personal record was having 117k worth of points on the map and it *wasn't lagging*! Oh, my. The other thing is that this number of points is still loading pretty slow, but I'm aiming to fix it in February.

As many of you requested, you can now drag-n-drop point on the map if your client app glitched and recorded it 100 meters away from your actual route. Just enable the Points layer on the map and drag-n-drop your point. Neat.

Among other things, I had a chance to work on the importing process. My own Records.json file, provided by Google Takeout, weights ~178mb, consists of ~670k points and previously [importing it into Dawarich](/import-export) took ~2 hours. After an update this month it takes ~5 minutes, which I find pretty impressive. Importing process update for all other file formats supported by Dawarich (which are GPX, GeoJSON, two more file formats from Google and Owntracks' .rec) are on their way, hopefully, in February.

There is also a change in development process, asked by members of community. Previously, the docker image `freikin/dawarich:latest` was created on each and every release, and now prereleases will be built as `freikin/dawarich:rc` from the `dev` branch (where rc stands for release candidate), and after a day or a few the `dev` branch will be merged to `master` and a stable release will be built in `freikin/dawarich:latest`. This change will allow those who are willing to stay on the bleeding edge to test the most recent changes, and the rest of you, well, will get more stable version of Dawarich just a bit later than them.

Oh, and Dawarich was [featured](https://www.heise.de/ratgeber/Raspi-Privaten-Standortverlauf-mit-Dawarich-lokal-aufzeichnen-10235624.html) in a real German magazine, can you believe that?

Even in its printed version! I instantly ordered this issue on Amazon.

![The German c't magazine issue featuring Dawarich](/img/blog/january-2025-monthly-update/heise-magazine.webp)

And they even had a podcast issue on it on [Youtube](https://www.youtube.com/watch?v=0f7Qi_aybhQ). I'm positively flattered.

---

Did I miss something? Hopefully not.

I'm starting a new job next Monday, which means there will probably be less Dawarich updates than in previous 3 months, but bear with me — the best stuff is coming! Still got plenty ideas and fixes to implement.

Thanks for your interest!

---

*This post was originally published on [r/selfhosted](https://www.reddit.com/r/selfhosted/comments/1ieio48/dawarich_january_2025_monthly_update/).*

*Dawarich is free, open-source and self-hostable. If you'd rather not run your own server, [Dawarich Cloud](https://my.dawarich.app/users/sign_in?utm_source=blog&utm_medium=post-cta&utm_campaign=january-2025-monthly-update) does the hosting for you.*
