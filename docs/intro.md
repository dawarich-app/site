---
sidebar_position: 1
---

# Intro

Let's discover **Dawarich in less than 5 minutes**.

### What you'll need

- A server to host your website. 1GB RAM is recommended.
- [Docker](https://docs.docker.com/get-docker/) version 20.10 or above:
  - Docker is a platform for developing, shipping, and running applications. It uses containerization technology to create and deploy applications.
- [Docker Compose](https://docs.docker.com/compose/install/) version 1.29 or above:
  - Docker Compose is a tool for defining and running multi-container Docker applications.

:::tip

If you don't have a server or server provider yet, we prefer to use Hetzner and DigitalOcean.

You can use our [Hetzner](https://hetzner.cloud/?ref=DQC5djwEU64f) and [DigitalOcean](https://m.do.co/c/5dcbfa133a56) referral links. It will helps us to keep the project alive.

:::

## Setup your Dawarich instance

1. Copy contents of the [docker-compose.yml](https://github.com/Freika/dawarich/blob/master/docker-compose.yml) file to a file named `docker-compose.yml` on your server.
2. Move to the directory where you saved the `docker-compose.yml` file: `cd /path/to/your/docker-compose.yml`
3. Run the following command to start your Dawarich instance:

```bash
docker compose up -d
```

4. You're all set! Visit your Dawarich instance at `http://localhost:3000` or `http://<your-server-ip>:3000`. The default credentials are `demo@dawarich.app` and `password`

## Update your Dawarich instance

1. Move to the directory where you saved the `docker-compose.yml` file: `cd /path/to/your/docker-compose.yml`
2. Run the following commands to update your Dawarich instance:

```bash
docker compose down # Stop the running instance
docker compose pull # Pull the latest image
docker compose up -d # Start the updated instance
```

3. All done!
