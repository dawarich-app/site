---
title: "Digest email delivery"
sidebar_position: 40
description: "Digest email delivery in Dawarich 1.20.0."
---

# Digest email delivery

This guide covers Dawarich 1.20.0.

Monthly and yearly digest email jobs require `DawarichSettings.email_configured?`,
which checks that `SMTP_SERVER` is present. An unset, empty or whitespace-only
value skips mail enqueueing and leaves the digest, including `sent_at`, unchanged.
The legacy `Users::Digests::EmailSendingJob` inherits the yearly behavior.

Digest calculation and in-app availability are independent of this email guard.
With SMTP configured, existing user email preferences, missing/empty digest
checks and the `sent_at` duplicate guard still apply. `sent_at` records mail
enqueueing; it does not guarantee successful SMTP delivery.

Configuring SMTP later does not add an automatic catch-up mailing of skipped
digests. This change does not remove previously queued or dead mail delivery jobs.
