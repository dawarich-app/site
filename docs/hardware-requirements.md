---
sidebar_position: 3
---

# Hardware requirements

Dawarich is a web application that can be hosted on an AMD64 or ARM64 server under Ubuntu or Synology OS. Here are the hardware requirements for hosting Dawarich:

- 1GB RAM
- 1 CPU core
- At least 1GB disk space

You can limit the resources available to Dawarich by setting the `resources` parameter in the `docker-compose.yml` file. Here is an example of how to set the resources:

```yaml
    deploy:
      resources:
        limits:
          cpus: '0.50'    # Limit CPU usage to 50% of one core
          memory: '4G'    # Limit memory usage to 4GB
```

From time to time, new releases include resource-intensive data migrations. Make sure you provide enough resources to handle these migrations.
