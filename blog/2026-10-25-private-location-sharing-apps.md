---
slug: private-location-sharing-apps
title: "Private Location Sharing Apps: Who Sees Where You Are (2026)"
description: "Life360, Google Maps, Apple Find My, Glympse, OwnTracks and Dawarich compared on the one question that matters: who else gets your location, and for how long."
authors: evgenii
tags: [guides]
---

Every location sharing app answers the same question — where is she right now? — and almost all of them answer it well. The question they answer very differently is the one you only ask later: who else gets that location, how long is it kept, and can you take it back?

I build [Dawarich](/), so I'm biased. I've tried to be fair anyway, including about the things other apps do better.

<!-- truncate -->

## What "private" should mean for location sharing

Before comparing apps, here's the yardstick I use:

- **You choose who sees it**, person by person, and nobody can switch it on for you.
- **Sharing can end on its own.** "Until I get home" should not quietly become "for the next three years".
- **Live position and history are separate decisions.** Showing where you are now is not the same as showing where you were last Tuesday.
- **The provider doesn't sell it.** Not as raw points, not "anonymised", not in aggregate.
- **You can leave with your data.**

## Life360

Life360 is the default family app for a reason: circles, place alerts, driving reports and, on paid plans, crash detection and emergency help. If safety features are what you need, it does more than anything else on this list.

The privacy record is the catch. In December 2021 The Markup reported that [Life360 was selling precise location data](https://themarkup.org/privacy/2021/12/06/the-popular-family-safety-app-life360-is-selling-precise-location-data-on-its-tens-of-millions-of-user) to data brokers. A month later the company said it would [stop selling precise location data](https://themarkup.org/privacy/2022/01/27/life360-says-it-will-stop-selling-precise-location-data), while continuing to sell aggregated data. In 2023 it was [sued over those sales](https://themarkup.org/privacy/2023/06/01/life360-sued-for-selling-location-data). Read the current privacy policy before you put a whole family on it.

## Google Maps location sharing

Free, already on most phones, and simple: pick a person, pick a duration, from a short window up to "until you turn this off". It works on Android and iPhone with anyone who has a Google account; people without one can get a link, which only works for a limited time.

The trade-off is the usual Google one. The sharing itself is fine; what's around it is an account that already knows a great deal about you. And if you used Google Timeline for history, you've seen how that ended: [Timeline left the web](/tools/timeline-visualizer/) and moved onto your phone.

## Apple Find My

If everyone in your family has an iPhone, Find My is hard to beat: built in, end-to-end polished, with sharing for an hour, until the end of the day, or indefinitely. Its limit is the walled garden — the moment one person carries an Android phone, it stops being a family solution.

## Glympse

Glympse does one thing: temporary location links. You pick a timer, the other person opens a link in their browser — no app needed — and the share [ends on its own when the timer runs out](https://support.glympse.com/faq/how-does-glympse-work/). For "I'm on my way" it's close to perfect. It isn't built for ongoing family sharing or for keeping a history.

## OwnTracks

OwnTracks is open source and sends your location to a server you run. Nothing passes through a company, which makes it the most private option here — for people comfortable running a server. Sharing with friends means everyone reports to the same server, and there's no polished family experience on top.

## Dawarich

Dawarich started as a [private location history](/google-timeline-alternative/) app and grew sharing out of that. There are two ways to share:

- **[Links](/location-sharing/)** that show exactly one thing: your live location, a date range, a trip or a single track. Most links can be locked with a passphrase, expire on their own, can be revoked at any time, and show how often they were opened. The person you send it to needs no account.
- **[Family](/family/)** for up to five people. Every person has their own switch, live sharing can run on a timer, history is a separate choice, and asking where someone is means sending a request they can decline.

Dawarich doesn't sell location data, Cloud is hosted in Germany, and you can [self-host the same features for free](/docs/self-hosting/introduction/) or export everything and leave. What it doesn't have: crash detection, SOS buttons or driving reports. If those are why you're looking, Life360 is the better fit.

## Side by side

| | Who it's for | Sharing ends on its own | History | Data sales | Self-hostable |
|---|---|---|---|---|---|
| Life360 | Families who want safety features | No — on until you turn it off | Yes | Aggregated data is sold | No |
| Google Maps | Anyone with a Google account | Optional | Separate (Timeline, on device) | No, but it's your Google account | No |
| Apple Find My | All-iPhone families | Optional | No | No | No |
| Glympse | Quick "on my way" shares | Always | No | — | No |
| OwnTracks | People who run their own server | Up to you | Yes, on your server | No | Yes |
| Dawarich | People who want sharing and their own history | Yes, per link or timer | Yes | No | Yes |

## The short version

If you need crash detection, use Life360 and read its privacy policy. If everyone has an iPhone, Find My is simplest. For a one-off "I'm on my way", Glympse or a Google Maps share is enough. If you want to share your location *and* keep your own location history without handing it to an ad or data business, that's what I built Dawarich for — [try it for 7 days](https://my.dawarich.app/users/sign_up?utm_source=blog&utm_medium=post-cta&utm_campaign=private-location-sharing-apps) or self-host it for free. For a longer look at the Life360 differences, see the [Life360 comparison](/docs/comparisons/vs-life360/).
