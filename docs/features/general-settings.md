---
sidebar_position: 17
title: General Settings
description: Choose how dates and times are shown, and turn off Family or Achievements if you don't use them.
---

# General Settings

**Settings → General** holds your language, timezone and email preferences. This page covers two groups of settings that need more explanation.

## Date and time

Under **Date and time**, choose:

- **Date format**: Automatic, which follows your language, or `DD.MM.YYYY`, `DD/MM/YYYY`, `MM/DD/YYYY` or `YYYY-MM-DD`.
- **Time format**: a 12-hour or a 24-hour clock. English uses the 24-hour clock unless you choose the 12-hour clock.
- **First day of the week**: Monday or Sunday.

The choice applies across the app, in emails and on the map.

## Turning off features

Under **Features**, turn off the parts of Dawarich you don't use. A feature you turn off disappears from the interface, and its background processing stops.

- **Family**: turning it off stops sharing your location with your [family](/docs/features/family) and stops family-only trip links. You stay a member of the family. When you turn it back on, location sharing starts off, so you choose again whether to share.
- **Achievements**: turning it off stops calculating your explored regions and badges, and disables your public achievement links.

## For app and API developers

The mobile app reads and changes these settings through `/api/v1/settings`. `/api/v1/users/me` reports whether Family and Achievements are on under `features`. With Family off, the family API endpoints answer `403` with `feature_disabled`.
