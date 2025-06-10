---
sidebar_position: 15
---

# Monitoring with Prometheus

Dawarich can export certain metrics in a format that can be used by Prometheus.

## Configuration

To enable metrics export, you need to set a few environment variables. The value will be different depending on the container. Make sure you set the correct variable values for appropriate containers.

### dawarich_app

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PROMETHEUS_EXPORTER_ENABLED` | `false` | Enable the Prometheus metrics exporter |
| `PROMETHEUS_EXPORTER_HOST` | `0.0.0.0` | Host address to bind the metrics exporter to |
| `PROMETHEUS_EXPORTER_PORT` | `9394` | Port number to bind the metrics exporter to |

### dawarich_sidekiq

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PROMETHEUS_EXPORTER_ENABLED` | `false` | Enable the Prometheus metrics exporter |
| `PROMETHEUS_EXPORTER_HOST` | `dawarich_app` | Name of the `dawarich_app` container |
| `PROMETHEUS_EXPORTER_PORT` | `9394` | Port number to bind the metrics exporter to |

### Update to `docker-compose.yml`

Also, the default `docker-compose.yml` file uses `command: ['bin/rails', 'server', '-p', '3000', '-b', '::']`. If you want to monitor Dawarich with prometheus, make sure to change it to `command: bin/dev`.

## Metrics

Some of the metrics that can be exported are:

The application metrics are:

| Type | Name | Description |
| ---  | ---  | ----------- |
| Counter | `http_requests_total` | Total HTTP requests from web app |
| Summary | `http_request_duration_seconds` | Time spent in HTTP reqs in seconds |
| Summary | `http_request_redis_duration_seconds` | Time spent in HTTP reqs in Redis, in seconds |
| Summary | `http_request_sql_duration_seconds` | Time spent in HTTP reqs in SQL in seconds |
| Summary | `http_request_queue_duration_seconds` | Time spent queueing the request in load balancer in seconds |
| Summary | `http_request_memcache_duration_seconds` | Time spent in HTTP reqs in Memcache in seconds |

The sidekiq metrics are:

| Type  | Name                                        | Description                           |
| ---   | ---                                         | ---                                   |
| Gauge | `active_record_connection_pool_connections` | Total connections in pool             |
| Gauge | `active_record_connection_pool_busy`        | Connections in use in pool            |
| Gauge | `active_record_connection_pool_dead`        | Dead connections in pool              |
| Gauge | `active_record_connection_pool_idle`        | Idle connections in pool              |
| Gauge | `active_record_connection_pool_waiting`     | Connection requests waiting           |
| Gauge | `active_record_connection_pool_size`        | Maximum allowed connection pool size  |

The complete list of metrics can be found in the [prometheus_exporter](https://github.com/discourse/prometheus_exporter) library readme, which is being used by Dawarich.
