---
sidebar_position: 1
title: Background jobs
description: How Dawarich runs imports, reverse geocoding and other background jobs — inside the web container by default since 1.17.0, or in a separate Sidekiq worker for larger instances.
---

# Background jobs

Imports, reverse geocoding, statistics, visit detection and scheduled tasks run as background jobs. Since **1.17.0** the default `docker-compose.yml` runs them inside the `dawarich_app` container, in the same process as the web server. There is no separate `dawarich_sidekiq` container any more.

A household instance needs about half the memory it did with two containers: around 240 MiB at idle instead of 510 MiB, measured on an instance with 100,000 points.

Redis and PostgreSQL are still required. Queued, scheduled and retried jobs live in Redis, as before.

## Default setup

The default `docker-compose.yml` sets these on `dawarich_app`:

| Variable | Value | Meaning |
|---|---|---|
| `SIDEKIQ_EMBEDDED` | `true` | Run background jobs inside the web process. |
| `WEB_CONCURRENCY` | `0` | One web process. Required for embedded jobs to share it. |
| `BACKGROUND_PROCESSING_CONCURRENCY` | `2` | Background job threads. |

The container gets 60 seconds to stop, so running jobs can finish or return to the queue when you restart or update.

Leave `RAILS_MAX_THREADS` unset: the web server uses 5 threads and the database pool is sized for them plus the job threads. If you raise either number, make sure PostgreSQL allows enough connections for both.

Imports share memory and CPU with the web server. On a small server a large import can make pages slower until it finishes.

## Upgrading from a separate worker

If your instance still runs a `dawarich_sidekiq` container:

1. **With your old `docker-compose.yml` still in place**, stop and remove the worker:

   ```bash
   docker compose stop -t 60 dawarich_sidekiq
   docker compose rm -f dawarich_sidekiq
   ```

   If the worker was started from another Compose project or file, stop it with that project's own command.

2. Replace `docker-compose.yml` with the [current one](https://github.com/Freika/dawarich/blob/master/docker/docker-compose.yml), keeping your own environment values, volumes, Redis and database settings.

3. If your `.env` sets `BACKGROUND_PROCESSING_CONCURRENCY=10` (the old default), remove it or set it to `2`.

4. Start the stack:

   ```bash
   docker compose pull
   docker compose up -d
   ```

Jobs that were waiting in Redis are picked up by `dawarich_app`. Don't delete Redis data, and don't start the old worker again next to the new setup.

## Running a separate worker

Larger instances, or instances with frequent big imports, can keep jobs in their own container so they don't compete with the web server:

1. On `dawarich_app`, remove `SIDEKIQ_EMBEDDED` (or set it to `false`). You can then raise `WEB_CONCURRENCY` if you want more web processes.
2. Add a worker service that uses the same image, environment, Redis, database and volumes as `dawarich_app`:

   ```yaml
   dawarich_sidekiq:
     image: freikin/dawarich:latest
     container_name: dawarich_sidekiq
     entrypoint: sidekiq-entrypoint.sh
     command: ['sidekiq']
     restart: unless-stopped
     stop_grace_period: 60s
     volumes:
       - dawarich_public:/var/app/public
       - dawarich_watched:/var/app/tmp/imports/watched
       - dawarich_storage:/var/app/storage
     networks:
       - dawarich
     environment:
       # the same values as dawarich_app, without SIDEKIQ_EMBEDDED
       BACKGROUND_PROCESSING_CONCURRENCY: 5
     depends_on:
       dawarich_app:
         condition: service_healthy
   ```

3. Run only one kind of worker: either embedded jobs or the separate container, not both by accident.

Settings that the background jobs read, such as SMTP, OIDC, reverse geocoding and `APPLICATION_HOSTS`, must then be set on both containers.

### Metrics with a separate worker

With embedded jobs, `/metrics` on `dawarich_app` already includes the Sidekiq metrics. With a separate worker, `dawarich_app` fetches them from `http://dawarich_sidekiq:9394/metrics`; if your worker has another hostname, set `SIDEKIQ_METRICS_URL` on `dawarich_app`. See [Prometheus monitoring](../monitoring/prometheus.md).

## Reverse geocoding threads

Reverse geocoding waits on the provider's rate limit, so extra threads on that queue don't make it faster. Dawarich limits how many threads it may hold:

- `REVERSE_GEOCODING_RPS` — requests per second your provider allows. Set it for Geoapify, LocationIQ or the public Nominatim. `photon.komoot.io` is always limited to 1.
- `REVERSE_GEOCODING_CONCURRENCY` — the number of reverse-geocoding threads across all workers. It defaults to the rate limit rounded up, or no limit when no rate is set.

Each worker always keeps at least one thread free for other jobs, so imports and statistics keep moving while geocoding runs.
