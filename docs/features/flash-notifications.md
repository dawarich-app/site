---
title: "Flash notifications"
sidebar_position: 40
description: "Flash notifications in Dawarich 1.20.0."
---

# Flash notifications

This guide covers Dawarich 1.20.0.

The shared flash container offers **Close all notifications** when at least two
messages are present. It clears the current messages together, including a mix of
server-rendered, Turbo-appended and JavaScript-generated flashes. A single message
keeps its individual close button. Errors remain visible until dismissed;
`notice` and `success` still expire after five seconds.

Notifications share a compact neutral panel, with semantic status icons and
subtle row separators instead of full-color alert backgrounds. Text stays
left-aligned, long filenames wrap, and each close button has a 44px touch target
on the right. The panel follows the existing light and dark theme tokens.

The list scrolls within a 32rem height limit, or the available viewport height on
smaller screens. The bulk button stays in an opaque toolbar at the top, above the
messages, so it remains reachable when a large import produces many errors. The
empty container stays available for later messages on the same page.
