---
title: Mobile App Privacy Policy
---

# Dawarich Mobile App Privacy Policy

Applies to the Dawarich mobile app — iOS (`app.dawarich.Dawarich`) and Android (`com.zeitflow.dawarich`) — published by **ZeitFlow UG (haftungsbeschränkt)**, Kolonnenstraße 8, 10827 Berlin, Germany. Email: **hi@dawarich.app**. Full company details: [Impressum](/impressum).

:::info TL;DR
The app tracks location when you enable it, stores points locally, and uploads them **only to the Dawarich server you configure** — your own or our SaaS at dawarich.app. Crash reports go to Sentry. We don't sell data or run ads.
:::

## 1. What the App Collects

| Data | When | Where it goes |
|---|---|---|
| Precise location (coordinates, timestamp, speed, altitude, accuracy) | When tracking is enabled (foreground + background) | Local SQLite, then uploaded to the Dawarich server you configure |
| Apple Health workouts & routes (iOS) | Only if you grant HealthKit permission and trigger an import | Same as above |
| Camera image (QR code contents) | Only while you scan a connection QR code | Parsed locally, not stored |
| App settings, tracking configuration | Always | On-device |
| Crash reports, stack traces, device model, OS version | On error | Sentry |

No advertising or analytics SDKs beyond Sentry.

## 2. Where Your Data Goes

You choose the server: **self-hosted** (we never see it), **Dawarich SaaS** (governed by our main [Privacy Policy](/privacy-policy)), or **no server** (on-device only). All uploads use HTTPS and are authenticated via `Authorization: Bearer <api-key>`.

**Processors:** Apple Inc. (iOS App Store, US), Google LLC (Google Play, US), Functional Software Inc. / Sentry (crash reports, US). US transfers rely on the EU-US Data Privacy Framework and/or Standard Contractual Clauses (Art. 46 GDPR). If you use our SaaS, the additional processors in our main [Privacy Policy §3](/privacy-policy#3-recipients--processors) apply.

## 3. Legal Bases (GDPR Art. 6)

- **Location tracking and upload:** (1)(b) — contract with the server operator you chose.
- **Crash reports:** (1)(f) — legitimate interest in a stable app (can be disabled in-app).
- **HealthKit:** (1)(a) — your explicit consent; revoke anytime in iOS Settings.

## 4. Retention

- **On-device data:** until you uninstall, clear the app, or reset the local database in-app.
- **Server-side data:** governed by the policy of the server you configure.
- **Crash reports:** up to 90 days at Sentry.

## 5. Your Rights

You have the rights under Art. 15–21 GDPR (access, rectification, erasure, restriction, portability, objection) and the right to withdraw consent (Art. 7(3)) and lodge a complaint with a supervisory authority — our competent authority is the Berliner Beauftragte für Datenschutz und Informationsfreiheit ([datenschutz-berlin.de](https://www.datenschutz-berlin.de)). Email **hi@dawarich.app** to exercise any right, or uninstall the app and clear its data for on-device content. For server-side data, contact the operator of the server you use.

## 6. Permissions

- **Location (when-in-use / always):** required to record trips and visits. You can limit to "when in use" or deny entirely.
- **Notifications:** used for the Android foreground-service indicator and status notices.
- **Camera:** only when you scan a connection QR code.
- **HealthKit (iOS, optional):** only when you initiate a Health import.

All permissions can be revoked in iOS or Android system settings.

## 7. Security, Children, Changes

HTTPS everywhere; API keys stored in platform-secure storage. You must be **16 or older** to use the app. We notify of material changes via in-app notice at least 30 days before they take effect.

## Last updated

Effective **2026-04-21**.

| When          | What          |
| ------------- | ------------- |
| 2026-04-21    | Rewritten to accurately describe location tracking, HealthKit, camera, Sentry; covers iOS + Android |
| 2025-04-13    | Updated developer information |
| 2025-01-27    | Initial version |
