---
slug: happy-birthday-dawarich
title: "Happy Birthday, Dawarich: One Year of Building a Google Timeline Alternative"
description: "Dawarich turns one: 5k GitHub stars, 150 supporters, an iOS app, and big plans — a cloud version, multi-device support, and location sharing for families."
authors: evgenii
tags: [montly-update]
---

So, mid-March this year [Dawarich](https://github.com/Freika/dawarich/), your favorite alternative to [Google Timeline](/docs/comparisons/vs-google-timeline), turned 1 year old. Yeah I know, I'm late to my own party. But still, I have to write this post. The progress I made during this year is pretty impressive, at least to myself: from nothing, Dawarich is now a known and loved piece of software, that is being run on dozens and dozens of home labs, and so many people are tracking their geodata, I can't even imagine. I literally can't, since, you know, there is no way to know how many of you are using it. But almost 5k stars on Github and nearly 150 supporters across [Patreon](https://www.patreon.com/freika), [Ko-fi](https://ko-fi.com/freika) and [GitHub](https://github.com/sponsors/Freika) says something, and I want to say thank you to you, my good people, and those who support or ever supported us on the mentioned platforms.

Thank you.

<!-- truncate -->

What started as an endpoint to accept geodata from Owntracks on my iPhone, now supports at least 5 different [tracking clients](/location-tracking) across iOS and Android, can import existing data in multiple formats, most prominent of which are Google Timeline (3 of them haha), GeoJSON and GPX. And Immich. And Photoprism. Okay, and Owntracks, but that's all. Stay tuned, there will be more. And, we even have our own [iOS app](https://apps.apple.com/de/app/dawarich/id6739544999?ign-itscg=30200&ign-itsct=apps_box_badge&mttnsubad=6739544999) now! Try it, it's awesome, and we're actively working on it.

The core feature remained the same — tracking and visualizing your geodata, and it was supported by [Trips](/trips), [Stats](/statistics), Visits, and Places (still imperfect though), some map customizations (custom raster tiles, photos layer, fog of war), and so on and so forth. Okay, there is not much to iterate over after listing these, but in the future...

And since we're talking future now, I want to share some plans with you. First and biggest one — we're launching SaaS version of Dawarich! Yay! Will come in handy for those of us who aren't really into tinkering with Docker, reverse proxies and other geek stuff. Hopefully, we'll launch in early June, so if you're interested, you can leave your email on the [Dawarich website](https://dawarich.app/) (big green "Early access" button) or in this form: [https://tally.so/r/wbvBLg](https://tally.so/r/wbvBLg).

Mind you, self-hosted Dawarich **is and will remain free of charge**.

Of course, converting the app into a SaaSable one requires some work, but it's mostly done, and since we have a whole monitoring tool set on our hands, some pretty rare bugs and slow spots will become a lot more visible and thus fixed a lot faster. The codebase is the same, so self-hosted users will also benefit from these fixes and improvements.

Second, there is a known issue that appears when a user imports their Google geodata, and due to it being tracked from more than one device at the same time, the routes are being rendered as a chaotic, intangible web of lines. To address this, support for multiple devices will be implemented. This is quite a big one, so I hope to work on it till the end of this summer, maybe even earlier.

It comes hand in hand with the third thing I want to announce: location sharing. The community has asked for it for some time now, and it will also be implemented. Users will be able to share their location with other users on the same Dawarich instance (or even make it public, I have no decision on that yet). It'll be useful if you want to share your position with your family or friends, for example. Hopefully, my wife will also use it.

I also want to work on a feature that will allow users to seamlessly transfer their existing data from their self-hosted instances to the SaaS Dawarich (and, of course, to other self-hosted instance), but there are lots of unclear points still, so I'm not sure yet when it will be a thing. But I'm thinking about it.

In the end, I want to share traditional highlights of some changes introduced since the last time we've seen each other.

**Added**

- Dawarich now can send you transactional emails (for example, to restore a password), if you configure SMTP env variables.
- User can now customize route colors in the map settings (cog in top left corner of the map).
- Creating an import now has a proper progress bar.
- The Map page now have buttons to navigate to next and previous day.

**Changed**

- Visits now can be seen and managed on the map, in the expandable drawer on the right side, where you can view, mass confirm, mass decline, and mass delete them. The way they are being suggested is also improved.
- Dawarich now supports S3-like storage for import and export files. They are no longer being stored in the database.
- Dawarich now uses PostgreSQL 17 with PostGIS 3.5 by default (was PostgreSQL 14)
- Reverse geocoding data can now be requested on demand instead of being stored in the database. It might save you some disk space.

Thank you for being interested in this project. It wouldn't become what it is now without you all.

---

*This post was originally published on [r/selfhosted](https://www.reddit.com/r/selfhosted/comments/1kq76uq/happy_birthday_dawarich/).*

*Dawarich is free, open-source and self-hostable. If you'd rather not run your own server, [Dawarich Cloud](https://my.dawarich.app/users/sign_in?utm_source=blog&utm_medium=post-cta&utm_campaign=happy-birthday-dawarich) does the hosting for you.*
