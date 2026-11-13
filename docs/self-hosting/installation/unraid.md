---
sidebar_position: 3
title: unRAID
description: A guide on how to install Dawarich on unRAID using Docker Compose or the Community Applications (CA) plugin.
---

# How to install Dawarich on unRAID

:::warning
*Dawarich is a rapidly evolving project, and some changes may break compatibility with older versions.*

**Do not use autoupdate** and **do not update** any Dawarich container **without** [backing up your data](/docs/self-hosting/maintenance/backup-and-restore) first and checking for breaking changes in the [updating guides](/docs/self-hosting/updating)!
:::

:::info
Since [Freika is not maintaining the unRAID CA templates](https://github.com/Freika/dawarich/issues/1382), all unRAID-related issues with these templates should be raised in the appropriate [GitHub repository](https://github.com/pa7rickstar/unraid_templates) or [unRAID forum thread](https://forums.unraid.net/topic/193769-support-pa7rickstar-docker-templates/).
:::

This guide is written for:

- unRAID OS 7.3.4
- Dawarich 1.22.0

## Option 1 (recommended): Docker Compose

Unraid's XML-based container templates predate Docker Compose. Native Docker Compose management is planned for [unRAID OS 8](https://unraid.net/blog/unraid-8-qa), but is not built into unRAID 7. The [Compose Manager Plus](https://ca.unraid.net/apps/compose-manager-plus-0wft8je0ra0zhy) plugin provides Docker Compose and a convenient web interface for managing stacks.

1. Install the `Compose Manager Plus` plugin from unRAID Community Applications.
2. Click `ADD NEW STACK` and enter the following:
   - Stack Name: `Dawarich`
   - Description: `Your favorite self-hostable alternative to Google Timeline (Google Location History)`
   - Compose Source: `Project folder (default — plugin creates a folder for you in the compose root)`
   - External ENV File Path: Leave empty (default)
   - Discovery mode: `Explicit -f flags`
   - Override File Management: `Automatic — plugin manages compose.override.yaml. Labels tab shows the form editor.`
3. In the `COMPOSE` tab, select `compose.yaml` from the drop-down menu and paste in the official [docker-compose.yml](https://github.com/Freika/dawarich/blob/master/docker/docker-compose.yml) example. Click `APPLY`.
4. In the `COMPOSE` tab, select `compose.override.yaml` from the drop-down menu and paste in the following:

   ```yaml
   services:
     dawarich_redis:
       volumes:
         - /mnt/cache/appdata/dawarich/shared:/data
       labels:
         net.unraid.docker.managed: 'composeman'
         net.unraid.docker.icon: 'https://raw.githubusercontent.com/Pa7rickStar/unraid_templates/refs/heads/main/images/redis-icon.png'
         net.unraid.docker.webui: ''
         net.unraid.docker.shell: 'sh'

     dawarich_db:
       volumes:
         - /mnt/cache/appdata/dawarich/db_data:/var/lib/postgresql/data
         - /mnt/cache/appdata/dawarich/shared:/var/shared
       labels:
         net.unraid.docker.managed: 'composeman'
         net.unraid.docker.icon: 'https://raw.githubusercontent.com/Pa7rickStar/unraid_templates/refs/heads/main/images/postgis-icon.png'
         net.unraid.docker.webui: ''
         net.unraid.docker.shell: 'sh'

     dawarich_app:
       volumes:
         - /mnt/cache/appdata/dawarich/wwwroot:/var/app/public
         - /mnt/cache/appdata/dawarich/imports:/var/app/tmp/imports/watched
         - /mnt/cache/appdata/dawarich/storage:/var/app/storage
         - /mnt/cache/appdata/dawarich/db_data:/dawarich_db_data
       labels:
         net.unraid.docker.managed: 'composeman'
         net.unraid.docker.icon: 'https://raw.githubusercontent.com/Pa7rickStar/unraid_templates/refs/heads/main/images/dawarich-icon.png'
         net.unraid.docker.webui: 'http://[IP][Port:3000]'
         net.unraid.docker.shell: 'sh'
   ```

   The override replaces the official named volumes with bind mounts under `/mnt/cache/appdata/dawarich/`. Adjust these paths if your appdata is stored elsewhere. Do not use empty bind-mount directories for an existing installation without migrating its data first.

5. In the `ENV` tab, click `CREATE .ENV TEMPLATE` and paste in the official [.env.example](https://github.com/Freika/dawarich/blob/master/docker/.env.example) example.
   - Change values as needed, following the [Configuration docs](/docs/category/configuration) and [Environment Variables and Settings](/docs/self-hosting/environment-variables.md).

    :::info
    The `.env` file supplies values for `${VARIABLE}` references in the Compose files. Variables that are only declared in `.env` are not automatically passed into the containers. For example, to pass `OIDC_CLIENT_ID` from `.env` into `dawarich_app`, add this to `compose.override.yaml`:

      ```yaml
      services:
        dawarich_app:
          environment:
            OIDC_CLIENT_ID: ${OIDC_CLIENT_ID}
      ```

    Alternatively, to pass all variables from `.env` into `dawarich_app`, add this to the same service in `compose.override.yaml`:

      ```yaml
      services:
        dawarich_app:
          env_file:
            - .env
      ```

    This will also load example values such as `OIDC_CLIENT_ID=client_id_example` into the container. Remove or comment out unused example settings before using `env_file`. Values explicitly set under `environment:` in the official Compose file take precedence over `env_file` values.
    :::

   - Minimal changes:
     - Set a strong password for `POSTGRES_PASSWORD` and use the same value for `DATABASE_PASSWORD`.
     - Select an available `DAWARICH_APP_PORT`. If using a port other than `3000`, update `net.unraid.docker.webui` in `compose.override.yaml` as well.
     - Add the IP address of your unRAID host and/or the hostname of your [reverse proxy](/docs/self-hosting/configuration/reverse-proxy.md) to `APPLICATION_HOSTS` (without `http://` or `https://`). Keep `localhost,::1,127.0.0.1` for the internal health check.
     - Generate and set `SECRET_KEY_BASE` (for example, with `openssl rand -hex 64`). Keep this value in a secure backup.
     - Set `SELF_HOSTED=true`.
6. In the `SETTINGS` tab, add:
   - Icon URL / Path: `https://raw.githubusercontent.com/Pa7rickStar/unraid_templates/refs/heads/main/images/dawarich-icon.png`
   - WebUI URL: `http://[IP][Port:3000]` (adjust the port to match `DAWARICH_APP_PORT`, or use your reverse proxy URL).
7. Click `APPLY` and `OKAY`.
8. Right-click the newly added Dawarich stack and select `Compose Up`.
9. Follow Step 4 in [Setup your Dawarich instance](/docs/self-hosting/introduction.md#setup-your-dawarich-instance) guide.

## Option 2: unRAID Templates

:::note
This guide focuses on the production installation of Dawarich with 3 containers:

- `dawarich_db` - PostgreSQL database
- `dawarich_redis` - Redis database
- `dawarich_app` - Dawarich web application including the Sidekiq worker (for background jobs)

For setting up Dawarich and Sidekiq in separate containers, use the templates provided by [grtgbln](https://forums.unraid.net/profile/81372-grtgbln/), aka [nwithan8 on GitHub](https://github.com/nwithan8): [`dawarich_app`](https://github.com/nwithan8/unraid_templates/discussions/273) and [`dawarich_sidekiq`](https://github.com/nwithan8/unraid_templates/discussions/310).
:::

:::info
Some containers depend on others running first. Therefore, this guide follows this order: `dawarich_db` >> `dawarich_redis` >> `dawarich_app`.
:::

### 1. Setup user-defined bridge network

:::warning
This guide assumes you will create a user-defined bridge network called `dawarich` and select it under `Network Type` for each container. The templates are configured to use this network. Using the default `bridge` network instead requires additional port mappings and IP/host configuration, which is not covered here.
:::

The [docker-compose file](https://github.com/Freika/dawarich/blob/master/docker/docker-compose.yml) automatically creates a user-defined bridge network for Dawarich containers, so they can communicate using container names. When using the unRAID CA templates, create this network manually.

By default, unRAID can remove user-created networks when Docker is restarted. Go to `Settings` → `Docker`, stop Docker, enable `Advanced View` and set `Preserve user defined networks` to `Yes`. Apply the setting and start Docker again.

To create a user-defined bridge network called `dawarich`, open the terminal on your unRAID server and run:

```zsh
docker network create --driver bridge dawarich
```

You can verify that the network was created successfully by running:

```zsh
docker network inspect dawarich --format '{{.Name}}: {{.Driver}}'
```

:::note
Check out this [video on YouTube](https://www.youtube.com/watch?v=bKFMS5C4CG0) if you want to learn how different network drivers work in Docker.
:::

### 2. Install `dawarich_db` container

Install the [`dawarich_db`](https://ca.unraid.net/apps/dawarich-db-1epr4l2161txw2) CA template from `Pa7rickStar's Repository`.

:::info
The `--restart=always` flag in the `Extra Parameters` field makes sure the container is restarted automatically if it stops. This **will** cause the container to start after you boot the host [even if autostart is set to off](https://forums.unraid.net/topic/57181/docker-faq/page/2/#findComment-600177).
:::

- `Network Type`: Select `Custom: dawarich`.
- When using the [user-defined bridge network](#1-setup-user-defined-bridge-network) you can `REMOVE` the `Database port` if you do not need external database access.
- Set a strong `Database Password`.

  :::note
  To change the database password on an existing installation, run this from the unRAID host terminal:

  ```bash
  docker exec -it dawarich_db psql -U postgres -d postgres -c "ALTER ROLE postgres WITH PASSWORD 'NEW_STRONG_PASSWORD';"
  ```

  Replace `NEW_STRONG_PASSWORD` with your new password and keep the single quotes. Keep the database container's `POSTGRES_PASSWORD` and the app container's `DATABASE_PASSWORD` settings in sync with the new password. For an existing database, changing `POSTGRES_PASSWORD` in the container template alone does not change the database role's password.
  :::

- Start the container and check the logs for errors.

### 3. Install `dawarich_redis` container

Install the [`dawarich_redis`](https://ca.unraid.net/apps/dawarich-redis-09scc1p1rtuvfd) CA template from `Pa7rickStar's Repository`.

:::info
The `--restart=always` flag in the `Extra Parameters` field makes sure the container is restarted automatically if it stops. This **will** cause the container to start after you boot the host [even if autostart is set to off](https://forums.unraid.net/topic/57181/docker-faq/page/2/#findComment-600177).
:::

- `Network Type`: Select `Custom: dawarich`.
- When using the [user-defined bridge network](#1-setup-user-defined-bridge-network) you can `REMOVE` the `Redis port` if you do not need external database access.
- Start the container and check the logs for any errors.

  :::note
  You might see this warning:

  ```text
  # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
  ```

  The `sysctl vm.overcommit_memory=1` command referenced there must be run on the unRAID host (not in the container). At this point, the author of this guide cannot confidently advise on this, so please check the [unRAID forum](https://forums.unraid.net/) for help.
  :::

### 4. Install `dawarich_app` container

Install the `dawarich_app` CA template from `Pa7rickStar's Repository`.

:::info
The `--restart=unless-stopped` flag in the `Extra Parameters` field restarts the container unless it was explicitly stopped. This *might* cause the container to start after you boot the host [even if autostart is set to off](https://forums.unRAID.net/topic/57181-docker-faq/page/2/#findComment-600177).
:::

- `Network Type`: Select `Custom: dawarich`.
- `Web UI Port`: Change the port mapping if there are conflicts; otherwise, leave it at the default value of `3000`. This port is used to access the Dawarich web interface.
- `Database Path`: Leave the default value unless you changed `Data directory` in the [`dawarich_db`](#2-install-dawarich_db-container) container.
- `Redis URL`: Leave the default value when using the [user-defined bridge network](#1-setup-user-defined-bridge-network). It uses the container port `6379` in [`dawarich_redis`](#3-install-dawarich_redis-container).
- `Database Username`, `Database Password` and `Database Name`: Set these to the same values used for [`dawarich_db`](#2-install-dawarich_db-container).
- `Database Host` and `Database Port`: Leave the defaults when using the [user-defined bridge network](#1-setup-user-defined-bridge-network).
- `Application Hosts`: Add the unRAID host IP address and/or reverse proxy hostname, without a protocol. Keep the loopback hosts for the health check.
- `Secret Key Base`: Generate (for example, with `openssl rand -hex 64`) and save a strong secret; it is required in production.
- For any other settings, refer to the [official documentation for environment variables and settings](/docs/self-hosting/environment-variables/).
- Start the container and check the logs for errors.
- Follow Step 4 in [Setup your Dawarich instance](/docs/self-hosting/introduction.md#setup-your-dawarich-instance) guide.

### Health checks

According to the [unRAID documentation](https://docs.unraid.net/unraid-os/using-unraid-to/run-docker-containers/overview/#health-checks), colored health indicators next to each container's icon are shown in the unRAID web interface when health checks are configured. Depending on the selected theme, the container's health might be indicated by text in the `uptime` column instead.

You can check the health status of the containers from the unRAID host terminal:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}'
```

This should show something like this:

```bash
root@tower# docker ps --format 'table {{.Names}}\t{{.Status}}'
NAMES              STATUS
dawarich_app       Up About a minute (healthy)
dawarich_db        Up About a minute (healthy)
dawarich_redis     Up About a minute (healthy)
```

If not, check the health status of each container individually:

```bash
docker inspect --format '{{json .State.Health}}' dawarich_db | jq
docker inspect --format '{{json .State.Health}}' dawarich_redis | jq
docker inspect --format '{{json .State.Health}}' dawarich_app | jq
```

:::note
There is a difference between `liveness` and `readiness` probes. Simply put:

- `liveness` = "is the process up?"
- `readiness` = "can it do useful work?"

The `dawarich_app` health check makes an HTTP request to `/api/v1/health` and verifies that the response reports `"status": "ok"`. The database and Redis health checks verify that their services respond. These checks provide more information than a simple process check, but they do not guarantee that every background job or application feature is working. Check the `dawarich_app` logs if you suspect a problem.
:::

## Setup Reverse Geocoding

If you want to [set up your own reverse geocoding service](/docs/self-hosting/configuration/reverse-geocoding.md#setting-up-your-own-reverse-geocoding-service), install the [`photon`](https://ca.unraid.net/apps/photon-0uhc5oy1q2avp2) CA template from `Pa7rickStar's Repository` and change the [environment variables](https://github.com/rtuszik/photon-docker?tab=readme-ov-file#configuration-options) to your liking:

- Set `Network Type` to `Custom: dawarich` when using the [user-defined bridge network](#1-setup-user-defined-bridge-network) or `Custom: dawarich_dawarich` when using the default Docker Compose setup. Otherwise, leave it as `bridge`.
- When using the [user-defined bridge network](#1-setup-user-defined-bridge-network) or Docker Compose, you can `REMOVE` the `WebUI Port` and delete the URL from the `WebUI` field. This makes `http://[IP]:[PORT]/api?q=Berlin` inaccessible from your browser, but it will still work for Dawarich.
- To reduce the load on the official Photon servers please consider using one of the [community mirrors](https://github.com/rtuszik/photon-docker?tab=readme-ov-file#community-mirrors) as `BASE_URL`.
- The default value for `REGION` is `planet`, which might be more than you need.

  :::warning
  Large file sizes! This might take more than 200GB, depending on the selected region. See the [available regions](https://github.com/rtuszik/photon-docker#available-regions).
  :::

- Check the logs after the container starts. Photon should download the index files for the `REGION` you set.
- After the index files have been downloaded and Photon is ready, you can check whether it works by opening the following URL in a web browser (if the port is published):

  ```text
  http://[IP]:[PORT]/api?q=Berlin
  ```

To configure Photon in Dawarich you can either use the webinterface (`Settings` → `Instance` → `Photon`) or set env variables in your `dawarich_app` container:

- Set the `Photon API Host` to `photon:2322` when using the [user-defined bridge network](#1-setup-user-defined-bridge-network) or Docker Compose. Otherwise, use `IP:Port` (the IP of the unRAID host and the `WebUI Port` of the `photon` container).
- Restart `dawarich_app` after changing environment variables, or use `Compose Up` to recreate the app container.

*2025-10-07 by [Pa7rickStar](https://github.com/Pa7rickStar) with contributions from [nwithan8](https://github.com/nwithan8).*

*2026-11-10 updated by [Pa7rickStar](https://github.com/Pa7rickStar).*
