---
sidebar_position: 1
---

# Intro

Let's discover **Dawarich in less than 5 minutes**.

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

## Setup your Dawarich instance

1. Copy contents of the [docker-compose.yml](https://github.com/Freika/dawarich/blob/master/docker/docker-compose.yml) file to a file named `docker-compose.yml` on your server.
2. Move to the directory where you saved the `docker-compose.yml` file: `cd /path/to/your/docker-compose.yml`
3. Run the following command to start your Dawarich instance:

```bash
docker compose up -d
```

4. You're all set! Visit your Dawarich instance at `http://localhost:3000` or `http://<your-server-ip>:3000`. The default credentials are `demo@dawarich.app` and `password`

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

:::warning

Although the `docker` directory contains `docker-compose.production.yml` file, it's not yet recommended to use. Use the `docker-compose.yml` file instead, with the `development` environment.

:::
