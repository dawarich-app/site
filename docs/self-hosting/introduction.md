---
sidebar_position: 1
title: Self-Hosting Introduction
description: Get started self-hosting Dawarich with Docker and Docker Compose, with manual setup instructions and a ready-to-copy prompt for an AI agent.
---

# Self-Hosting Introduction

Get your own Dawarich instance up and running in minutes.

### What you'll need

- A server running on AMD64 or ARM64 architecture. 2GB of RAM and more is recommended.
- [Docker](https://docs.docker.com/get-docker/) version 20.10 or above:
  - Docker is a platform for developing, shipping, and running applications. It uses containerization technology to create and deploy applications.
- [Docker Compose](https://docs.docker.com/compose/install/) version 1.29 or above:
  - Docker Compose is a tool for defining and running multi-container Docker applications.

:::tip

If you don't have a server or server provider yet, we prefer to use Hetzner and DigitalOcean.

You can use our [Hetzner](https://hetzner.cloud/?ref=DQC5djwEU64f) and [DigitalOcean](https://m.do.co/c/5dcbfa133a56) referral links. It will helps us to keep the project alive.

:::

## Install with an AI agent

Copy the prompt below into your AI coding agent. Run the agent on your server or give it SSH access through your usual SSH configuration. Tell it which server to use and whether you want to access Dawarich locally, over your private network, or through a public domain.

```text title="Dawarich installation prompt"
Install a self-hosted Dawarich instance on my server using Docker Compose.

Read the current official documentation before making changes:
- https://dawarich.app/docs/self-hosting/introduction
- https://dawarich.app/docs/self-hosting/environment-variables
- https://dawarich.app/docs/self-hosting/configuration/reverse-proxy

1. Establish the target server, installation directory, and intended access
   URL from the context I provide. Ask for any missing details. Check the OS,
   CPU architecture, available memory and disk space, Docker, Docker Compose,
   and port availability. Install missing prerequisites using the official
   Docker instructions for that OS.

2. Check for an existing Dawarich installation before creating or changing
   files. Preserve existing configuration, secrets, and volumes. If this is
   an upgrade, follow the official update and backup guides first. Never
   delete volumes or run `docker compose down -v` to fix an installation.

3. For a new installation, download the current official Compose file to
   the installation directory:
   https://raw.githubusercontent.com/Freika/dawarich/master/docker/docker-compose.yml
   Use this file as the starting point and follow its architecture-specific
   instructions when choosing the database image.

4. Configure production mode and self-hosting. Generate a strong database
   password and SECRET_KEY_BASE, keeping shared values consistent across
   the database, web app, and worker. Store secrets in a restricted local
   .env file, ensure Compose passes them to the relevant services, and do
   not print them in the chat.

5. Set APPLICATION_HOSTS to the intended hostnames or IP addresses without
   protocols or ports. Match APPLICATION_PROTOCOL to the access URL.
   Configure port bindings for the intended access method. For a public
   domain, configure HTTPS using the reverse-proxy guide. Keep PostgreSQL
   and Redis on the internal Docker network.

6. Validate with `docker compose config --quiet`, then run
   `docker compose pull` and `docker compose up -d` from the installation
   directory. Allow time for first-start initialization.

7. Check `docker compose ps` and relevant logs. Verify that the database,
   Redis, web app, and worker are healthy and that the sign-in page responds
   at the intended URL. Diagnose and fix any startup errors before declaring
   success. State explicitly if a check could not be completed.

8. Report the installation directory, access URL, service status, and the
   commands to stop, start, update, and back up this instance. Include the
   admin sign-in URL, login email, and password in the final report so I can
   access the instance immediately. For a new installation, replace the
   default account credentials with a strong password before making the
   instance publicly accessible, and report the credentials actually set.
   Verify that the account has administrator access. For an existing
   installation, preserve its credentials; if the password is unknown,
   explain how to reset it instead of inventing one.
```

Prefer to install it yourself? Follow the steps below.

## Setup your Dawarich instance

1. Copy contents of the [docker-compose.yml](https://github.com/Freika/dawarich/blob/master/docker/docker-compose.yml) file to a file named `docker-compose.yml` on your server.
2. Move to the directory where you saved the `docker-compose.yml` file: `cd /path/to/your/docker-compose.yml`
3. Run the following command to start your Dawarich instance:

```bash
docker compose up -d
```

4. You're all set! Visit your Dawarich instance at `http://localhost:3000` or `http://<your-server-ip>:3000`. The default credentials are `demo@dawarich.app` and `safepassword`

<iframe width="560" height="315" src="https://www.youtube.com/embed/j6xNtSNzrwQ?si=9VFoYMdFl2jSTGWr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Update your Dawarich instance

1. Move to the directory where you saved the `docker-compose.yml` file: `cd /path/to/your/docker-compose.yml`
2. Run the following commands to update your Dawarich instance:

```bash
docker compose down # Stop the running instance
docker compose pull # Pull the latest image
docker compose up -d # Start the updated instance
```

3. All done!

:::info

After starting the application, you should have at least 4 running containers:

- `dawarich_db` - PostgreSQL database
- `dawarich_redis` - Redis database
- `dawarich_sidekiq` - Sidekiq worker (for background jobs)
- `dawarich_app` - Dawarich web application

Make sure all of them are running.

:::

:::info

If  you're running Dawarich on an ARM64 server check out the [Moving to PostGIS](./maintenance/moving-to-postgis.md) guide to find suitable database images.
:::

:::warning

Although the `docker` directory contains `docker-compose.production.yml` file, it's not yet recommended to use. Use the `docker-compose.yml` file instead, with the `production` environment.

:::
