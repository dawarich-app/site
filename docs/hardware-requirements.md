---
sidebar_position: 3
---

# Hardware requirements

Dawarich is a web application that can be hosted on an AMD64 or ARM64 server under Ubuntu or Synology OS. Here are the hardware requirements for hosting Dawarich:

- 1GB RAM
- 1 CPU core
- 1GB disk space

Currently, Dawarich writes an extensive amount of logs. This is the case specifically during the import process or reverse geocoding. To avoid running out of disk space, it is recommended to have at least 10GB of disk space available. For big imports, it is recommended to have at least 100GB of disk space available.

You can get your space back by restarting `dawarich_app` and `dawarich_sidekiq` containers, it will remove old logs.
