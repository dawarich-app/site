---
sidebar_position: 3
title: Hardware Requirements
description: Minimum hardware requirements for self-hosting Dawarich, including RAM, CPU, and disk space recommendations.
---

# Hardware requirements

Dawarich is a web application that can be hosted on an AMD64 or ARM64 server under Ubuntu or Synology OS. Here are the hardware requirements for hosting Dawarich:

- 2GB RAM
- 1 CPU core
- At least 10GB disk space

Since 1.17.0 the web app and background jobs share one container. On an instance with 100,000 points it uses about 240 MiB at idle and around 400 MiB under load, and large JSON imports no longer need memory in proportion to the file size. The 2 GB recommendation leaves room for PostgreSQL, Redis and big imports.

The default `docker-compose.yml` limits `dawarich_app` to one CPU core and 4 GB of memory. Change the limits with `APP_CPU_LIMIT` and `APP_MEMORY_LIMIT` in your `.env` file, or set the `resources` parameter in `docker-compose.yml` directly:

```yaml
    deploy:
      resources:
        limits:
          cpus: '1.00'    # Limit CPU usage to one core
          memory: '4G'    # Limit memory usage to 4GB
```

From time to time, new releases include resource-intensive data migrations. Make sure you provide enough resources to handle these migrations.
