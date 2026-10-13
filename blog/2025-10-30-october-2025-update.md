---
slug: october-2025-update
title: "October 2025 Update: The Search and The Family"
description: "Dawarich gets map search ('when was I at this place?') and the Family feature — self-hosted location sharing with your loved ones. Plus faster imports, monthly stat pages, and a new forum."
authors: evgenii
tags: [montly-update]
---

Hello, my dearest people!

This is, once again, an update on Dawarich, your favorite FOSS alternative to [Google Timeline](/docs/comparisons/vs-google-timeline):

- Github: [https://github.com/Freika/dawarich](https://github.com/Freika/dawarich)
- Website: [https://dawarich.app/](https://dawarich.app/)

Make yourself a nice hot cup of tea and let's begin with the recent changes. Since the last update I posted was in the end of August, in this post I'll cover all the changes since then.

<!-- truncate -->

Two big features were released: The Search and The Family.

The Search adds a Search button on the [map](/interactive-map), that opens the search bar, where you can type a place or an address, select from suggested places, and then list of visits around this place will be shown to you, sorted by years.

Here's an early demo video of the feature: [https://youtu.be/OE95Ce1QK4g](https://youtu.be/OE95Ce1QK4g)

With this feature, Dawarich becomes capable of answering not only the "where I've been on X date" question, but also "when I've been at Y place". I love this feature and it opens whole new dimension for the data representation, and I hope to play with it more in the future and expand capabilities of the feature.

Important: obviously, the feature only works if your Dawarich instance have [reverse geocoding](/docs/self-hosting/configuration/reverse-geocoding) configured. Can't search by location with no locations source.

Second, most recent big feature: The Family. Yes you got it right, you now can create a family! And invite your loved ones there to see where they are! No more Live360-data-selling shenanigans. The only thing is to get that wife-approval seal. I trust you on this.

So how it works: you create a family, invite people there using their emails, copy the invitation links and share it with them (up to 5 family members in total). They register at your Dawarich instance and you'll have to help them with configuring your tracking application of choice. On the web, each family member can configure for how long they want to share their location with family: 1/6/12/24 hours or without time constraints. Family members don't see routes of each other, only last known location. This makes it a bit tricky for mobile app that are sending GPS points in batches instead of one by one, like OwnTracks does, but that's what we have. In Dawarich for iOS we'll of course introduce some settings to make it configurable and to support the Family feature in general. Not yet, but we will.

I'm not entirely satisfied with the feature UX, so I'll keep working on it, but it feels like a good start.

![Family members' last known locations on the Dawarich map](/img/blog/october-2025-update/family-on-the-map.webp)

The Family feature is for now only available to self-hosters and will be introduced to Dawarich Cloud later as separate paid plan. Speaking of, the usual reminder: Dawarich is and will remain free open source self hostable software. The Cloud solution is aimed to people who don't want to bother with technicalities and just want to use the product. Codebase is the same for both.

Okay, what's next? Some other changes worth mentioning:

- The Map page now takes more screen space which feels and looks good
- [Imports](/import-export) for GPX, GeoJSON and Google files became even faster
- Importing whole user account data works also faster and takes less memory (although still inappropriate amounts, I'll be working on fixing that)
- Onboarding modal window now features a link to the App Store and a QR code to configure the Dawarich iOS app.
- Dawarich now have the new month stat page, featuring insights on how user's month went: distance traveled, active days, countries visited and more. And yeah, you can share an expireable (privacy you know) link to your monthly stat page (picture: [https://mastodon.social/@dawarich/115189944456466219](https://mastodon.social/@dawarich/115189944456466219) )
- The [Stats](/statistics) page now loads a lot faster, thanks to introduced caching
- In Dawarich iOS app, you can simply scan the QR code from onboarding modal or from the Account page to configure your app with server URL and API key. We're researching possibility to use "normal" sign in with entering email and password as well.
- I've launched the Dawarich [forum](https://discourse.dawarich.app/)! It'll be a home for community guides and discussions around Dawarich, as well as our new [subreddit](https://www.reddit.com/r/dawarich/). And we have [Discord](https://discord.gg/pHsBjpt5J8) where the community is already very active and helpful (thank you guys by the way, you know who you are. Thanks)
- Oh and we crossed 7k stars on Github! It's like we're a celebrity!

Huh, and I thought it will be a long post. I guess I was wrong!

We have some plans for the future, here some of them:

- I still not given up on the Tracks, which will allow us significantly improve performance of the map on bigger timeframes
- As mentioned, we want to allow users to sign in in our iOS app using their email and password
- I was playing with map matching and it looks very promising, although kind of unexplored territory. If you haven't heard of it, it's something that will allow us to snap our routes to actual roads on the map
- The official Android app development is currently paused: I just don't have enough time to work on both backend/frontend and the Android app. We have a community version though, and it looks promising, although not yet publicly available. We're still exploring our options with the official one, though, so stay tuned.
- We're starting a newsletter! On the main page ([https://dawarich.app/](https://dawarich.app/)) you can leave your email to subscribe. I still haven't decided on the schedule, but I'll be sharing there some ideas, tech stuff and problems we encountered. Kinda free format, occasionally, in your inbox. Join us, it'll be fun.

So... I think I didn't forget to mention anything. And if I did, I'll just update the post.

Thank you all and see you in the next one!

P.S.: Oh, and if you're using Dawarich, can you pretty please drop a line on how it helps you? I'd love to get some feedback to post on the main page as testimonials. Here's the form, thank you! [https://tally.so/r/wMkv68](https://tally.so/r/wMkv68)

---

*This post was originally published on [r/selfhosted](https://www.reddit.com/r/selfhosted/comments/1ok1mwj/dawarich_october_2025/).*

*Dawarich is free, open-source and self-hostable. If you'd rather not run your own server, [Dawarich Cloud](https://my.dawarich.app/users/sign_in?utm_source=blog&utm_medium=post-cta&utm_campaign=october-2025-update) does the hosting for you.*
