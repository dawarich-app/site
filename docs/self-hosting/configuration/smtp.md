---
sidebar_position: 9
title: Configuring SMTP
description: Configure outgoing email (password reset, digests, family invitations) for your self-hosted Dawarich instance, including Office 365 and other providers that need login authentication or longer timeouts.
---

# Configuring SMTP

Dawarich sends outgoing email for password resets, year-end digests, and family invitations. Configure your SMTP server with the environment variables below. Set them on **both** `dawarich_app` and `dawarich_sidekiq` — the Sidekiq container is what actually delivers the messages.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `DOMAIN` | _(required)_ | Public hostname used to build links in emails. No protocol, no trailing slash. Example: `dawarich.example.com`. |
| `SMTP_SERVER` | _(required)_ | SMTP server hostname. Example: `smtp.office365.com`, `smtp.gmail.com`, `mail.privateemail.com`. |
| `SMTP_PORT` | _(required)_ | SMTP port. Typically `587` for STARTTLS, `465` for SMTPS, `25` for unauthenticated relays. |
| `SMTP_DOMAIN` | _(optional)_ | HELO/EHLO domain used at SMTP handshake. For transactional relays (Brevo, Mailgun, SendGrid, Postmark, Resend), set this to your **verified sender domain** — typically the part after `@` in `SMTP_FROM`. The relay cross-checks HELO/EHLO against the verified domain for DKIM/SPF alignment, and a mismatch hurts deliverability. Permissive relays (local Postfix, internal MTAs) often ignore this. |
| `SMTP_USERNAME` | _(optional)_ | SMTP username. Leave unset for unauthenticated relays. |
| `SMTP_PASSWORD` | _(optional)_ | SMTP password. Leave unset for unauthenticated relays. |
| `SMTP_FROM` | _(required)_ | "From" address on outgoing email. Example: `dawarich@example.com`. |
| `SMTP_AUTHENTICATION` | `plain` | Auth mechanism. The common values are `plain`, `login` (Office 365 / Microsoft 365 requires this), and `cram_md5`. `digest_md5`, `gssapi`, `ntlm`, and `xoauth2` are also accepted by the underlying Net::SMTP driver but are rarely useful for self-hosted Dawarich — choose one of the first three unless you know you need an enterprise mechanism. |
| `SMTP_STARTTLS` | `true` | Opportunistic TLS upgrade on port 587. Leave `true` for any internet-facing relay (Brevo, Gmail, Office 365, etc.) so credentials and message bodies are encrypted in transit. Set to `false` only for plain SMTP on port 25 to a trusted local relay (LAN Postfix, internal MTA). On port 465 (SMTPS / implicit TLS) this setting has no effect — the connection is TLS from byte one. |
| `SMTP_OPEN_TIMEOUT` | `5` | Seconds to wait for the TCP connection. Bump to `25` for slow providers (Office 365, Gmail). |
| `SMTP_READ_TIMEOUT` | `5` | Seconds to wait for a response after a command is sent. Bump to `25` for slow providers. |

## Email link protocol

The protocol used in links inside outgoing emails (password reset, family invite, digest) is **hardcoded to `https://`** since Dawarich 1.7.6. This is deliberate: nearly all self-hosted instances sit behind a reverse proxy with a real TLS certificate, and the previous setup tied the email protocol to `APPLICATION_PROTOCOL`, which broke reverse-proxy deployments that legitimately need `APPLICATION_PROTOCOL=http`.

If you genuinely serve Dawarich over plain HTTP (LAN-only, Tailscale-only, or another private network without TLS) and want emails to link with `http://`, mount a one-line initializer:

```ruby
# config/initializers/mailer_protocol.rb
Rails.application.config.action_mailer.default_url_options[:protocol] = 'http'
```

This is the only supported way to override the email link protocol.

## Common providers

### Office 365 / Microsoft 365

```yaml
DOMAIN: "dawarich.example.com"
SMTP_SERVER: "smtp.office365.com"
SMTP_PORT: "587"
SMTP_USERNAME: "dawarich@example.com"
SMTP_PASSWORD: "<app-password>"
SMTP_FROM: "dawarich@example.com"
SMTP_AUTHENTICATION: "login"
SMTP_STARTTLS: "true"
SMTP_OPEN_TIMEOUT: "25"
SMTP_READ_TIMEOUT: "25"
```

Office 365 rejects `plain` authentication and frequently times out within 5 seconds. Use `login` and longer timeouts.

### Gmail (with app password)

```yaml
DOMAIN: "dawarich.example.com"
SMTP_SERVER: "smtp.gmail.com"
SMTP_PORT: "587"
SMTP_USERNAME: "you@gmail.com"
SMTP_PASSWORD: "<16-char-app-password>"
SMTP_FROM: "you@gmail.com"
SMTP_AUTHENTICATION: "plain"
SMTP_STARTTLS: "true"
```

Generate an app-specific password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) — your normal Google password will not work.

### Local Postfix / unauthenticated relay

```yaml
DOMAIN: "dawarich.example.com"
SMTP_SERVER: "192.168.1.10"
SMTP_PORT: "25"
SMTP_FROM: "dawarich@example.com"
SMTP_STARTTLS: "false"
```

Leave `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_AUTHENTICATION` unset.

## Testing the configuration

After updating your compose file, recreate both services:

```bash
docker compose up -d --force-recreate dawarich_app dawarich_sidekiq
```

Then trigger a password-reset email from the login page (or use the Rails console) and watch the Sidekiq logs:

```bash
docker compose logs -f dawarich_sidekiq | grep -i mail
```

A successful delivery logs `Sent mail to ... (NNNms)`. A failure logs the SMTP error verbatim — most commonly:

| Symptom | Likely cause |
|---|---|
| `Net::ReadTimeout` | Bump `SMTP_OPEN_TIMEOUT` and `SMTP_READ_TIMEOUT` to `25`. |
| `535 5.7.3 Authentication unsuccessful` | Wrong `SMTP_AUTHENTICATION` (try `login`) or wrong credentials. |
| `Missing host to link to!` | `DOMAIN` is unset on `dawarich_app`. |
| Email delivers but link is `http://...:3000/...` | You're on Dawarich `< 1.7.6`. Upgrade — the email link protocol is now hardcoded to `https://` (see "Email link protocol" above). |
| Sidekiq job succeeds but no email arrives | Wrong server in `SMTP_SERVER`, or the relay is silently dropping mail. Check the relay's logs, not Dawarich's. |

## What changed in 1.7.6

Prior to this release, `SMTP_AUTHENTICATION`, `SMTP_OPEN_TIMEOUT`, and `SMTP_READ_TIMEOUT` were hardcoded in `config/environments/production.rb` and required mounting a custom Rails initializer to override. They are now first-class environment variables.

The email link protocol was also previously coupled to `APPLICATION_PROTOCOL`, which caused reverse-proxy deployments (where `APPLICATION_PROTOCOL=http` is required to avoid SSL redirect loops) to send password-reset emails with `http://` links to the public HTTPS site. The two are now decoupled: `APPLICATION_PROTOCOL` only controls `config.force_ssl`, and the email link protocol is hardcoded to `https://`. Plain-HTTP self-hosters can override with a one-line initializer (see "Email link protocol" above).
