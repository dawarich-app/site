---
title: Privacy Policy
---

import CookiePreferences from '@site/src/components/CookiePreferences';

# Dawarich Privacy Policy

:::info TL;DR
We don't sell your data, don't train AI on it, and don't share it beyond the processors listed below. Most of our processors are in the EU.
:::

This policy applies to the Dawarich SaaS at `dawarich.app`, the hosted tier, and the iOS and Android apps when connected to our SaaS. If you self-host, no data reaches us and you are the sole controller.

## 1. Controller

**ZeitFlow UG (haftungsbeschränkt)** — Kolonnenstraße 8, 10827 Berlin, Germany. Managing Director: Evgenii Burmakin. Email: **hi@dawarich.app**. Full company details: [Impressum](/impressum).

## 2. What We Process and Why

| Data | Purpose | Legal basis (GDPR Art. 6) |
|---|---|---|
| Account data (email, password hash, user ID, settings) | Operate your account | (1)(b) contract |
| Location history (coordinates, timestamps, device info) | Visualize history, compute statistics | (1)(b) contract |
| Billing data (name, email, address, tax ID, payment metadata) | Subscriptions, invoicing, tax | (1)(b) contract; (1)(c) legal obligation |
| Error logs, crash reports, performance metrics | Keep the service stable and secure | (1)(f) legitimate interest |
| Support correspondence | Respond to your requests | (1)(b) / (1)(f) |
| Poster print orders (name, shipping address, email, phone, the poster file) | Produce and ship posters you order, invoicing | (1)(b) contract; (1)(c) legal obligation |
| Files uploaded to the free tools with "Save to my Dawarich account" | Hold the file so it can be imported into the account you create next | (1)(b) pre-contractual measures at your request |

The poster file you order is a map rendering of the location data you selected in the Poster Studio. It is shared with our payment and print partners (Section 3) solely to process and produce your order.

No automated decision-making with legal effect (Art. 22). Providing this data is voluntary but necessary to use the service.

Since March 2026, reverse-geocoded place names are no longer stored for SaaS users — they are computed on demand and discarded.

## 3. Recipients / Processors

All listed processors are bound by DPAs under Art. 28 GDPR. We do not sell data or share it for advertising.

| Processor | Purpose | Location |
|---|---|---|
| Hetzner Online GmbH | Hosting, database, backups | Germany (EU) |
| Cloudflare, Inc. | Marketing-site CDN | Global; EU where possible |
| Paddle.com Market Ltd. | Billing, checkout, invoicing | United Kingdom |
| Functional Software, Inc. (Sentry) | Error and crash tracking | United States |
| Google LLC (Google Ads) | Marketing-site conversion tracking — denied by default, consent-based | United States |
| Sendinblue SAS (Brevo) — email | Transactional emails | France (EU) |
| Sendinblue SAS (Brevo) — web tracker | Marketing-site email-campaign pixel — consent-based | France (EU) |
| Apple Inc. | iOS App Store distribution | United States |
| Google LLC | Google Play distribution | United States |
| Stripe Payments Europe, Ltd. | Payment processing for poster print orders | Ireland (EU); parent Stripe, Inc. (US) |
| Gelato ASA | Poster printing and shipping (receives shipping details and the poster file) | Norway (EEA); production within the EU |
| Partnero, Inc. | Affiliate-referral attribution — receives your email and name only if you arrived via an affiliate link | United States |

Rybbit, the analytics tool named in section 6, runs on our own Hetzner infrastructure (`rybbit.dwri.xyz`) rather than a vendor's hosted service, so it adds no processor to this table — no third party receives that data.

**International transfers:** UK (Paddle) is covered by the EU adequacy decision. Norway (Gelato) is in the EEA, where the GDPR applies directly. US transfers rely on the EU-US Data Privacy Framework where the provider is certified, and on Standard Contractual Clauses (Art. 46 GDPR) otherwise.

## 4. Retention

- **Account and location data:** while your account is active; up to 12 months after cancellation unless you request earlier deletion.
- **Poster print files:** deleted within 48 hours if the order is not paid; kept up to 90 days after purchase for reprints and support, then deleted.
- **Billing data (including poster order records):** up to 10 years (§ 147 AO, § 257 HGB).
- **Error logs:** up to 30 days.
- **Support correspondence:** up to 3 years after last contact.
- **Tool uploads awaiting an account:** deleted within 24 hours if you do not complete signup. Once claimed, the file becomes an import in your account and follows the account-data rule above.

The free tools at `dawarich.app/tools/` process your files entirely in your browser by default; nothing is uploaded unless you press "Save to my Dawarich account".

## 5. Your Rights

You have the right to access (Art. 15), rectify (16), erase (17), restrict (18), port (20), object to processing based on legitimate interest (21), and withdraw consent at any time (7(3)) without affecting prior processing. To exercise any right, email **hi@dawarich.app** or delete your account in-app.

You may also lodge a complaint with a supervisory authority (Art. 77). Our competent authority is the Berliner Beauftragte für Datenschutz und Informationsfreiheit ([datenschutz-berlin.de](https://www.datenschutz-berlin.de)); you may instead complain in your country of residence or workplace.

## 6. Cookies {#cookies}

On `dawarich.app` we use:

| Category | Purpose | Consent? | Provider |
|---|---|---|---|
| Strictly necessary | Remember your banner choice | No (§ 25(2) TTDSG) | First-party |
| Site analytics | Aggregate traffic; stores a visitor ID in your browser's local storage | Not currently asked | Rybbit (self-hosted) |
| Advertising | Google Ads conversion tracking — tag present on every page, storage denied until you accept | **Yes**, for storage | Google Ads |
| Email analytics | Brevo tracking pixel | **Yes** | Brevo |
| Affiliate attribution | Credit a referring partner for a sign-up | **Yes** | Partnero |

Rybbit stores a randomly generated visitor ID in your browser's local storage so that repeat visits are counted as one visitor rather than several. It is written on the first page you open, before the banner appears, and we do not currently ask for consent before writing it. It contains no personal data, is never sent to a third party, and you can remove it by clearing site data for `dawarich.app`.

The Google Ads tag is present on every page, but it runs under Google Consent Mode with `ad_storage`, `ad_user_data`, `ad_personalization` and `analytics_storage` all set to **denied** until you accept. In that state it writes no cookies and no identifiers to your device; if you never accept, or you decline, it stays denied. The Brevo and Partnero tags are not loaded at all before consent.

Because the tag itself loads, it does send Google a cookieless request on each page view containing the page address, your IP address and browser user agent, with ad-click identifiers redacted. It sets nothing on your device and carries no identifier that would let Google recognise you on someone else's site — but it happens whether or not you accept.

If you reached us from one of our ads, the tag also copies the ad-click identifier Google placed in your landing URL (`gclid`, alongside a `_gl` parameter) onto links you follow to `my.dawarich.app`, so that the click and the sign-up can be matched. This travels in the address bar rather than in a cookie, is limited to our own two domains, and also happens whether or not you accept. It is the reason we keep the tag loaded at all: without it, that link between an ad click and a sign-up is lost.

To change your mind either way, use the control below — the **Cookie Settings** link in the footer of every page brings you back here. It clears your stored answer, switches Google Ads storage back off straight away, and reloads the page so the Brevo and Partnero tags stop running and the banner asks you again.

<CookiePreferences />

On `my.dawarich.app` we additionally use first-party session cookies strictly necessary for login.

## 7. Security

HTTPS for all transfers, encrypted database storage and backups, application data stored in the EU. Crash traces may be sent to Sentry (US) and retained for up to 30 days.

## 8. Children

You must be at least **16 years old** to use Dawarich. We do not knowingly collect data from children under 16.

## 9. Hosted Dawarich (legacy Patreon tier)

For the legacy "hosted dawarich" Patreon tier, each instance runs on a dedicated server, accessible only to the subscriber. We access it only for maintenance. Cancellation may lead to deletion after a grace period.

## 10. Changes

We will notify you of **material changes** (new purposes, new processors, changed retention, etc.) by email and/or in-app notice at least **30 days before they take effect**. Non-material edits are published here with an updated date below.

## Last updated

Effective **2026-09-02**. Contact for all privacy matters: **hi@dawarich.app**.

| When          | What          |
| ------------- | ------------- |
| 2026-09-02    | Removed Simple Analytics. Traffic statistics now come only from self-hosted Rybbit, so one processor fewer receives anything and no analytics data leaves our own infrastructure |
| 2026-09-02    | Google Ads now loads denied-by-default under Google Consent Mode; disclosed the cookieless request it still sends before consent and the ad-click identifier passed to `my.dawarich.app` in the URL, and added a one-click control to withdraw or reconsider. Corrected the description of Rybbit, which stores a visitor ID rather than being cookieless, and recorded that it is self-hosted and adds no processor. No new purposes or processors |
| 2026-08-12    | Added Partnero as a processor for affiliate-referral attribution, and the affiliate cookie to the cookie table |
| 2026-07-28    | Disclosed tool uploads held for signup ("Save to my Dawarich account") and their 24-hour deletion window |
| 2026-07-18    | Added poster print orders: order data, Stripe and Gelato processors, print-file retention (48h unpaid / 90 days paid) |
| 2026-04-21    | Added processor list, legal bases, rights, supervisory authority, transfers, cookie table; age to 16; reflected STORE_GEODATA=false; 30-day notice for material changes |
| 2025-09-12    | Added TL;DR section |
| 2025-03-12    | Updated data retention section for SaaS users |
| 2025-02-01    | Initial version |
