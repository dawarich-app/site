---
title: "Testing a geocoding connection"
sidebar_position: 40
description: "Testing a geocoding connection in Dawarich 1.20.0."
---

# Testing a geocoding connection

This guide covers Dawarich 1.20.0.

The **Instance settings → Geocoding → Test connection** form makes one reverse lookup using the currently resolved instance provider. Administrators can enter latitude and longitude within the regional coverage of that provider (for example, a Photon index containing only US data).

- Both fields are optional as a pair. Leaving both blank uses the existing default `[51.3402, 12.3712]` (latitude, longitude).
- A supplied pair must contain finite decimal numbers: latitude from −90 to 90, longitude from −180 to 180, inclusive. Zero and negative values are valid. Scientific notation is accepted; surrounding whitespace is ignored.
- Partial pairs, nonnumeric values and out-of-range coordinates produce a translated error before any provider lookup. Browser number inputs also enforce ranges.
- Coordinates apply only to that test request. They are not persisted as instance settings.
- The saved provider, provider precedence, request limit (one result), five-second wait budget and provider failure messages remain unchanged.

`POST /admin/settings/test_geocoding` accepts optional top-level `latitude` and `longitude` parameters. HTML requests redirect with status 303 and a notice or alert; Turbo requests return a flash stream and retain the form inputs. Existing `Geocoding::ProviderTest.call` and `.call(config)` callers use the default coordinates. Callers can supply `.call(config, latitude: ..., longitude: ...)`.


The form supports keyboard submission and repeated Turbo submissions. A submit button remains usable after the result arrives.
