---
title: Mobile App Privacy Policy
---

# Dawarich Mobile App Privacy Policy

This policy applies to the Dawarich mobile app for iOS (`app.dawarich.Dawarich`) and Android (`com.zeitflow.dawarich`), published by ZeitFlow UG (haftungsbeschränkt), Kolonnenstraße 8, 10827 Berlin, Germany ("we", "us"). It explains what the app collects, where that data goes, and your rights.

:::info TL;DR
The app collects precise location data when you enable tracking, stores it locally on your device, and uploads it **only to the Dawarich server you configure** — your own self-hosted instance or our SaaS at dawarich.app. Crash reports go to Sentry. We never sell your data or use it for advertising.
:::

## 1. Controller

**ZeitFlow UG (haftungsbeschränkt)**
Kolonnenstraße 8, 10827 Berlin, Germany
Email: hi@dawarich.app

For full company details see the [Impressum](/impressum).

## 2. What the App Collects

| Data | When | Where it goes |
|---|---|---|
| Precise location (GPS coordinates, timestamp, speed, altitude, accuracy) | When you enable location tracking; works in foreground and background | Local SQLite database on your device, then uploaded to the Dawarich server you configure |
| Apple Health workouts and routes (iOS only) | Only if you explicitly grant HealthKit permission and trigger an import | Local processing and upload to your configured Dawarich server |
| Camera image (QR code contents) | Only while you actively scan a QR code to import server settings | Parsed locally, not stored or transmitted |
| App settings, tracking configuration | Always | Stored locally on your device |
| Crash reports, error stack traces, device model, OS version | Automatically when the app crashes or hits an error | Sentry (see Section 4) |

The app does **not** contain advertising SDKs, analytics SDKs, or third-party trackers beyond Sentry.

## 3. Where Your Location Data Goes

The app is designed to work with **any** Dawarich server. You decide which one:

- **Self-hosted:** data is uploaded only to your own server. We (ZeitFlow UG) never see it.
- **Dawarich SaaS (dawarich.app):** data is uploaded to our servers and is governed by our main [Privacy Policy](/privacy-policy). In that case we act as controller for the data stored server-side.
- **No server configured:** the app holds data locally on your device only.

All uploads use HTTPS and are authenticated with an API key bound to your account on the configured server. The API key is passed via the `Authorization` header.

## 4. Processors We Use

| Processor | Purpose | Location |
|---|---|---|
| Apple Inc. | iOS App Store distribution | United States |
| Google LLC | Google Play distribution | United States |
| Functional Software, Inc. (Sentry) | Crash and error reporting for the app | United States |

If you use the Dawarich SaaS, the additional processors listed in our [main Privacy Policy §4](/privacy-policy#4-recipients--processors) apply to server-side data.

## 5. Legal Bases (GDPR Art. 6)

- **Location tracking and upload:** Art. 6(1)(b) — performance of the contract you entered with the operator of the Dawarich server you chose.
- **Crash reports:** Art. 6(1)(f) — our legitimate interest in a stable, debuggable app. You can disable crash reporting in the app settings.
- **HealthKit access:** Art. 6(1)(a) — your explicit consent, which you can revoke at any time in iOS Settings.

## 6. International Transfers

Crash reports to Sentry, and app distribution via Apple and Google, involve transfers to the United States. These rely on the EU-US Data Privacy Framework where the provider is certified, and on Standard Contractual Clauses (Art. 46(2)(c) GDPR) with supplementary measures.

## 7. Retention

- **On-device data:** retained until you delete the app, clear its data, or reset the local database from within the app.
- **Server-side data:** governed by the policy of the server you configure (our main Privacy Policy if you use the SaaS).
- **Crash reports:** retained by Sentry for a maximum of 90 days.

## 8. Your Rights

Under the GDPR you have the right to access, rectify, erase, restrict, port, and object to processing of your personal data, and to withdraw any consent you gave. You may also lodge a complaint with your local supervisory authority. Our competent authority is:

> Berliner Beauftragte für Datenschutz und Informationsfreiheit
> Alt-Moabit 59–61, 10555 Berlin, Germany
> [https://www.datenschutz-berlin.de](https://www.datenschutz-berlin.de)

To exercise your rights, email **hi@dawarich.app**. For on-device data, you can also simply uninstall the app or use in-app settings to clear the local database. For server-side data, contact the operator of the Dawarich server you use.

## 9. Children

You must be at least **16 years old** to use the app and to consent to the processing described here. In some jurisdictions, a parent or legal guardian may consent on your behalf. We do not knowingly collect data from children under 16.

## 10. Permissions the App Requests

- **Location (always / when in use):** required to record trips and visits. You can grant "when in use" only, or deny entirely — tracking will be limited accordingly.
- **Notifications:** used to show the foreground-service indicator on Android and status notifications.
- **Camera:** used only when scanning a QR code to import server connection settings.
- **HealthKit (iOS only):** optional; requested only when you initiate a Health import.

All permissions can be revoked at any time in iOS or Android system settings.

## 11. Security

The app uses HTTPS for all network communication. API keys are stored in the platform's secure storage. We do not transmit your location data to anyone other than the Dawarich server you configure, and Sentry for crash reports.

## 12. Changes

We will notify you of material changes via an in-app notice at least 30 days before they take effect. Non-material changes are published on this page with an updated date below.

## 13. Contact

For privacy questions about the app: **hi@dawarich.app**.

## Last updated

This privacy policy is effective as of **2026-04-21**.

| When          | What          |
| ------------- | ------------- |
| 2026-04-21    | Rewritten to accurately describe location tracking, HealthKit, camera, Sentry, and both iOS + Android platforms |
| 2025-04-13    | Updated application developer information |
| 2025-01-27    | Initial version |
