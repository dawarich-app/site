---
slug: dawarich-proper-timeline
title: "Dawarich — Proper Timeline and Birthday!"
description: "Dawarich turns two and finally gets a proper Timeline in Map V2. Plus Traccar support, Polarsteps imports, monthly email digests, and a unified codebase for the mobile apps."
authors: evgenii
tags: [release]
---

Guess what, in the last post I totally forgot it's Dawarich's second birthday!

Ah yes: Dawarich is your favorite FOSS selfhostable alternative to [Google Timeline](/docs/comparisons/vs-google-timeline). Now with an actual proper timeline!

Github: [https://github.com/Freika/dawarich](https://github.com/Freika/dawarich)

Website: [https://dawarich.app/](https://dawarich.app/)

Funny cat: [https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?w=1920&ssl=1](https://i0.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?w=1920&ssl=1)

Yeah, Dawarich started mid-March 2024, so happy birthday to us!

<!-- truncate -->

Anyway, you clicked the link for the good stuff, right? I have it for ya!

We finally have a proper Timeline in the [Map V2](/interactive-map)! Just look at it, what a beauty. It took surprisingly long time for me to figure out how it should look and feel, although all the data is there in database literally for years now. I'm very happy with how it turned out, and with some more tweaking, I hope the Timeline feature will be the most useful of all Dawarich offers. And it offers a lot by now, yeah.

![The new Timeline in Map V2 — gorgeous](/img/blog/dawarich-proper-timeline/timeline.webp)

You can also tweak and edit transportation modes for tracks in Timeline and recalculate them in the map settings.

What else? We are now supporting Traccar as a new 3rd party client to consume data from, and you can now [import files from Polarsteps](/docs/comparisons/vs-polarsteps). If you have SMTP configured, starting April, you'll receive monthly email with a short nice-looking ASCII-styled digest for the previous month and also for the previous year in the beginning of the next year. A proper guide on how to configure SMTP will be soon added to our docs, I know there is a struggle in this regard, but it works, I promise.

Some of the smaller changes:

- 2FA is a thing now
- Minimum password length increased from 6 to 12 symbols
- S3 storage can now be configured in self-hosted mode
- Some of the already supported file formats could have fail during import, lots of fixes in that area
- And literally a TON of other fixes.

Users can now also tweak their GPS-noise settings: for now only on the web, but since our mobile apps are consuming data from the backend now (previously they were only able to render data that was tracked on your device), it's all good.

Speaking of, both our mobile apps for Android and iOS are now sharing the same codebase, which will enable us to ship more features and do it faster for both platforms. You can already find Insights tab in there, and we expect to significantly improve the UI/UX, stability and introduce more features this summer. And we added a toggle to disable the blue location arrow on iOS. Not sure how it will affect tracking precision though, do let us know.

One more important thing: Map V1 will be sunsetted this summer. Sometime in August. The V2 is better in so many regards, and all the new features are being written for it, but if you'd expect you're going to miss something from the Map V1, just let me know and I'll figure something out. Vector maps are the future!

As always, the links one more time:

Github: [https://github.com/Freika/dawarich](https://github.com/Freika/dawarich)

Website: [https://dawarich.app/](https://dawarich.app/)

iOS app: [https://apps.apple.com/us/app/dawarich/id6739544999](https://apps.apple.com/us/app/dawarich/id6739544999)

Android app: [https://play.google.com/store/apps/details?id=com.zeitflow.dawarich](https://play.google.com/store/apps/details?id=com.zeitflow.dawarich)

Donate: [https://ko-fi.com/freika](https://ko-fi.com/freika) / [https://www.patreon.com/freika](https://www.patreon.com/freika) / [https://github.com/sponsors/Freika](https://github.com/sponsors/Freika)

Cheers!

---

*This post was originally published on [r/selfhosted](https://www.reddit.com/r/selfhosted/comments/1t4emiu/dawarich_proper_timeline_and_birthday/).*

*Dawarich is free, open-source and self-hostable. If you'd rather not run your own server, [Dawarich Cloud](https://my.dawarich.app/users/sign_in?utm_source=blog&utm_medium=post-cta&utm_campaign=dawarich-proper-timeline) does the hosting for you.*
