---
sidebar_position: 15
title: Monitoring with Prometheus
description: Export Dawarich metrics to Prometheus for monitoring your self-hosted instance.
---

# Monitoring with Prometheus

Dawarich exports application and Sidekiq metrics in the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/). Since **1.7.7**, the metrics backend is [Yabeda](https://github.com/yabeda-rb/yabeda) (replacing `discourse/prometheus_exporter`). Metrics are now served in-process by each application — no separate exporter container or sidecar is required.

If you're upgrading from a version before 1.7.7, see the [1.7.7 entry in the Updating guides](../updating.md#177) for the metric-name rename table and the env-var changes you need to apply.

## Configuration

### Enable the exporter

Set the same flag on both the `dawarich_app` and `dawarich_sidekiq` services in your `docker-compose.yml`:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PROMETHEUS_EXPORTER_ENABLED` | `false` | Master on/off switch. Must be `true` on both services. |
| `METRICS_USERNAME` | _(unset)_ | HTTP basic auth username Prometheus uses to scrape `/metrics`. Required. |
| `METRICS_PASSWORD` | _(unset)_ | HTTP basic auth password. Required. |
| `PROMETHEUS_EXPORTER_PORT` | `9394` | Port on `dawarich_sidekiq` that serves the in-process Sidekiq metrics endpoint. |
| `SIDEKIQ_METRICS_URL` | `http://dawarich_sidekiq:9394/metrics` | Internal URL the web container uses to fetch Sidekiq metrics. Override on Dokku/Kubernetes or any deployment where the worker hostname differs from the compose default. |

Behaviour notes:

- **Single scrape target.** Prometheus scrapes `dawarich_app:3000/metrics`. The web service fetches Sidekiq metrics over the internal network and concatenates them into the same response.
- **Graceful Sidekiq fallback.** If Sidekiq is unreachable during a scrape, the web container returns its own metrics only and logs a warning. Prometheus sees a momentary gap in `sidekiq_*` series instead of a failed scrape.
- **Basic auth is required.** Requests without valid `METRICS_USERNAME` / `METRICS_PASSWORD` credentials return 401.
- **No more `PROMETHEUS_EXPORTER_HOST` / `PROMETHEUS_EXPORTER_HOST_SIDEKIQ`.** These environment variables were removed in 1.7.7 — metrics are no longer hosted by a separate process, so there is nothing to bind to.

### Prometheus scrape config

```yaml
scrape_configs:
  - job_name: dawarich
    metrics_path: /metrics
    basic_auth:
      username: prometheus     # value of METRICS_USERNAME
      password: prometheus     # value of METRICS_PASSWORD
    static_configs:
      - targets: ['dawarich_app:3000']
```

If you're scraping from outside the Docker network, replace `dawarich_app:3000` with the host and port you exposed for the `dawarich_app` service.

## Metrics

### HTTP / Rails

| Type | Name | Description |
| ---  | ---  | ----------- |
| Counter | `rails_requests_total` | Total HTTP requests handled by the web app. |
| Histogram | `rails_request_duration` | End-to-end request duration in seconds. |

### Sidekiq

| Type | Name | Description |
| ---  | ---  | ----------- |
| Counter | `sidekiq_jobs_executed_total` | Jobs executed (per worker class / queue). |
| Counter | `sidekiq_jobs_failed_total` | Jobs that raised an exception. |
| Histogram | `sidekiq_job_runtime_seconds` | Per-job runtime in seconds. |
| Gauge | `sidekiq_queue_latency` | Oldest enqueued job's wait time per queue, in seconds. |
| Gauge | `sidekiq_jobs_waiting_count` | Jobs sitting in each queue (backlog). |
| Gauge | `sidekiq_active_processes` | Sidekiq processes currently up. |

### Puma

| Type | Name | Description |
| ---  | ---  | ----------- |
| Gauge | `puma_workers` | Active Puma worker processes. |
| Gauge | `puma_backlog` | Requests waiting on the listen socket. |
| Gauge | `puma_pool_capacity` | Remaining thread-pool capacity. |

### ActiveRecord

| Type | Name | Description |
| ---  | ---  | ----------- |
| Gauge | `activerecord_connection_pool_size` | Maximum allowed pool size. |

### Dawarich-specific

`dawarich_archive_*` metric names are unchanged from the pre-Yabeda era — existing dashboards and alerts built on them continue to work.

Additional examples:

```text
# HELP ruby_dawarich_map_tiles_usage
# TYPE ruby_dawarich_map_tiles_usage counter
ruby_dawarich_map_tiles_usage 99
```

The `ruby_dawarich_map_tiles_usage` counter tracks total map tiles loaded across users. You can find a chart of this in the user map settings.

### Process / GC metrics

Process and GC metrics that `prometheus_exporter` used to emit by default (`ruby_rss`, `ruby_heap_live_slots`, etc.) are **not** emitted by default under Yabeda. If you need them, register a custom Yabeda group in your fork or wait for them to be added upstream.

## Migrating from `prometheus_exporter` (pre-1.7.7)

If you have dashboards or alerts that reference the old metric names, update them per this table:

| Category | Before (`prometheus_exporter`) | After (Yabeda) |
|---|---|---|
| HTTP requests total | `ruby_http_requests_total` | `rails_requests_total` |
| HTTP request duration | `ruby_http_request_duration_seconds` | `rails_request_duration` |
| Sidekiq jobs total | `ruby_sidekiq_jobs_total` | `sidekiq_jobs_executed_total` |
| Sidekiq failed jobs | `ruby_sidekiq_failed_jobs_total` | `sidekiq_jobs_failed_total` |
| Sidekiq job duration | `ruby_sidekiq_job_duration_seconds` | `sidekiq_job_runtime_seconds` |
| Sidekiq queue latency | `ruby_sidekiq_queue_latency_seconds` | `sidekiq_queue_latency` |
| Sidekiq queue backlog | `ruby_sidekiq_queue_backlog_total` | `sidekiq_jobs_waiting_count` |
| Sidekiq process count | `ruby_sidekiq_process_count` | `sidekiq_active_processes` |
| Puma workers | `ruby_puma_workers` | `puma_workers` |
| Puma backlog | `ruby_puma_request_backlog` | `puma_backlog` |
| Puma thread-pool capacity | `ruby_puma_thread_pool_capacity` | `puma_pool_capacity` |
| ActiveRecord pool size | `active_record_connection_pool_connections` | `activerecord_connection_pool_size` |
| Process / GC | various `ruby_*` series | not emitted by default; register a custom Yabeda group |

For deployment-side changes (env-var renames, removed sidecar), see the [1.7.7 Updating guide entry](../updating.md#177).
