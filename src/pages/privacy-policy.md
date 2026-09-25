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
| Optional product analytics (signup, usage milestones, subscription events and numeric ad campaign ID) | Measure and improve Dawarich Cloud | (1)(a) consent; no events sent to PostHog without opt-in |
| Poster print orders (name, shipping address, email, phone, the poster file) | Produce and ship posters you order, invoicing | (1)(b) contract; (1)(c) legal obligation |
| Files uploaded to the free tools with "Save to my Dawarich account" | Hold the file so it can be imported into the account you create next | (1)(b) pre-contractual measures at your request |

The poster file you order is a map rendering of the location data you selected in the Poster Studio. It is shared with our payment and print partners (Section 3) solely to process and produce your order.

No automated decision-making with legal effect (Art. 22). Providing this data is voluntary but necessary to use the service.

Since March 2026, reverse-geocoded place names are no longer stored for SaaS users — they are computed on demand and discarded.

## 3. Recipients / Processors

We require an Art. 28 DPA for each active processor. Before enabling the optional PostHog integration, we must verify its DPA and international-transfer terms. We do not sell location history or use it for advertising.

| Processor | Purpose | Location |
|---|---|---|
| Hetzner Online GmbH | Hosting, database, backups | Germany (EU) |
| Cloudflare, Inc. | Marketing-site CDN | Global; EU where possible |
| Paddle.com Market Ltd. | Billing, checkout, invoicing | United Kingdom |
| Functional Software, Inc. (Sentry) | Error and crash tracking | United States |
| Google LLC (Google Ads) | Marketing-site conversion tracking after consent | United States |
| PostHog, Inc. | Optional Cloud product analytics; EU project, activation pending DPA review | EU project; provider based in the US |
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
- **Optional product analytics:** delete the pseudonymous PostHog record after withdrawal; verify and publish the project retention period before enabling production capture.
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
| Site analytics | Aggregate traffic; stores a visitor ID in your browser's local storage | **Yes** | Rybbit (self-hosted) |
| Advertising | Google Ads conversion tracking and cross-domain attribution | **Yes** | Google Ads |
| Campaign handoff | Keeps landing UTM parameters in browser storage for up to 30 days to carry them to signup | **Yes** | First-party |
| Email analytics | Brevo tracking pixel | **Yes** | Brevo |
| Affiliate attribution | Credit a referring partner for a sign-up | **Yes** | Partnero |

Rybbit stores a randomly generated visitor ID in your browser's local storage so that repeat visits are counted as one visitor rather than several. This pseudonymous ID may be personal data. Rybbit is loaded only after you accept, and withdrawal clears its local storage ID. Landing UTM parameters are also saved only after acceptance; withdrawal clears them. A first-party consent cookie on `.dawarich.app` lets the Cloud signup page know you accepted campaign handoff. Cloud asks separately for product analytics consent before attaching a campaign to your account or sending events to PostHog.

The Google Ads, Rybbit, Brevo and Partnero tags are not loaded before you accept. Without consent, our links to the Cloud app do not pass campaign, affiliate or ad-click identifiers. After consent, the Google tag can associate an ad click with a signup across our domains; its storage and data-sharing consent settings are granted. Rejecting means we cannot make that association.

To change your mind either way, use the control below — the **Cookie Settings** link in the footer of every page brings you back here. It clears your stored answer and optional storage, then reloads the page so the tags stop running and the banner asks you again.

<CookiePreferences />

On `my.dawarich.app` we additionally use first-party session cookies strictly necessary for login. Optional Cloud product analytics requires a separate affirmative choice. After that choice, self-hosted Rybbit may store a browser visitor ID and Cloud may send a pseudonymous account ID with allowlisted signup, usage milestone and billing events to the EU PostHog project. Google Ads and Partnero on Cloud require both this Cloud choice and the marketing-site consent. Declining either choice keeps those marketing scripts off. Withdrawing Cloud product analytics consent clears the account's campaign fields and queues deletion of its PostHog identity and events.

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
