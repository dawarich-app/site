---
sidebar_position: 9
---

# Telemetry

_Last updated: 2024-12-05_

Dawarich now can collect usage metrics and send them to InfluxDB. Before this release, the only metrics that could be somehow tracked by developers (only @Freika, as of now) were the number of stars on GitHub and the overall number of docker images being pulled, across all versions of Dawarich, non-splittable by version. New in-app telemetry will allow us to track more granular metrics, allowing me to make decisions based on facts, not just guesses.

I'm aware about the privacy concerns, so I want to be very transparent about what data is being sent and how it's used.

Data being sent:

- Number of DAU (Daily Active Users)
- App version
- Instance ID

Basically this set of metrics allows me to see how many people are using Dawarich and what versions they are using. No other data is being sent, nor it gives me any knowledge about individual users or their data or activity.

The telemetry is enabled by default, but it **can be disabled** by setting `DISABLE_TELEMETRY` env var to `true`. The dataset might change in the future, but any changes will be documented in the changelog and in every release, as well as on this page.
