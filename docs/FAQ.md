---
sidebar_position: 99
title: FAQ
description: Frequently asked questions about Dawarich, including setup, configuration, and troubleshooting.
---

# FAQ


## Does location tracking work without an internet connection?

<details>
  <summary>Show me!</summary>

  Yes. The official Dawarich [iOS](/docs/dawarich-for-ios) and [Android](/docs/dawarich-for-android) apps record your location on the device itself, so tracking keeps running even when your phone has no signal — on a plane, underground, hiking off-grid, or travelling abroad without data.

  Your points are stored safely on the device and are uploaded to your Dawarich instance automatically as soon as you're back online. Nothing is lost to a dropped connection.
</details>

## How to enter Dawarich console?
<details>
  <summary>Show me!</summary>

  Dawarich built using [Ruby on Rails](https://rubyonrails.org/), so you can use the Rails console to interact with the application. To enter the console, run the following on your server:

  ```bash
  docker exec -it dawarich_app /bin/sh
  bin/rails console
  ```
</details>

## How to create a new user?

<details>
  <summary>Show me!</summary>

  Sign in as an admin and go to the Settings ->Users page. Click on the "Add new user" button and fill in the form.
</details>

## How to update a user's email?

<details>
  <summary>Show me!</summary>

  To update a user's email, you can use the Rails console. First, enter the console as described in the ["How to enter Dawarich console?"](#how-to-enter-dawarich-console). Then, run the following command:

  ```ruby
  User.find_by(email: 'user@example.com').update(email: 'new_email@example.com')
  ```
</details>

## How to make a user an admin?

<details>
  <summary>Show me!</summary>

  To make a user an admin, you can use the Rails console. First, enter the console as described in the ["How to enter Dawarich console?"](#how-to-enter-dawarich-console). Then, run the following command:

  ```ruby
  User.find_by(email: 'user@example.com').update(admin: true)
  ```
</details>

## My distance is off, how can I fix it?

<details>
  <summary>Show me!</summary>

  If you find that the distance in your stats is off, it might indicate a problem either in your data or in the importing process.

  In either case, what you want to look for are the points with coordinates `0,0`. These are the points that Dawarich couldn't process correctly. You can find them by running the following command in the Rails console:

  ```ruby
  # Getting all points with coordinates 0,0
  points = Point.where(latitude: 0, longitude: 0)

  # showing amount of such points
  points.size
  ```

  If there are any points with coordinates `0,0`, you can safely delete them by running:

  ```ruby
  points.destroy_all
  ```

  If you find points such as this, it would be great if you could open an issue on the [GitHub repository](https://github.com/Freika/dawarich/issues) with your import file structure (you can alter your real coordinates, of course) so we can investigate the issue further.
</details>

## How to update user's password?

<details>
  <summary>Show me!</summary>

  To update a user's password, you can use the Rails console. First, enter the console as described in the ["How to enter Dawarich console?"](#how-to-enter-dawarich-console). Then, run the following command:

  ```ruby
  User.find_by(email: 'user@example.com').update(password: 'new_password', password_confirmation: 'new_password')
  ```
</details>

## How to speed up the import process?

<details>
  <summary>Show me!</summary>

  Since 1.17.0 background jobs, including imports, run inside `dawarich_app` with 2 threads. To import faster, raise `BACKGROUND_PROCESSING_CONCURRENCY` on `dawarich_app` for the duration of the import, then set it back:

  ```yaml
  services:
    dawarich_app:
      environment:
        // highlight-next-line
        BACKGROUND_PROCESSING_CONCURRENCY: 5
  ```

  More threads use more memory and database connections; keep `RAILS_MAX_THREADS` unset or raise it with them. For frequent large imports, run jobs in a [separate worker](/docs/self-hosting/configuration/background-jobs#running-a-separate-worker) so they don't slow down the web interface.

</details>

## Why my attempt to import Records.json fails?

<details>
  <summary>Show me!</summary>

  The `Records.json` file from Google Takeout is usually a big one, and importing it might take a while. Since 1.17.0 Dawarich reads it in a stream, so memory no longer grows with the file size: a 300 MB file needs about 60 MiB on top of the idle process.

  If the import still ends with `Killed`, the container ran out of memory. Raise the memory limit of `dawarich_app` (or of `dawarich_sidekiq` if you run a separate worker) in `docker-compose.yml`:

  ```yaml
  services:
    dawarich_app:
      ...
      deploy:
        resources:
          limits:
            // highlight-next-line
            memory: 5G
  ```

  You can also split `Records.json` into smaller parts and import them one by one. Here you can find a [script](https://github.com/Freika/dawarich/issues/142#issuecomment-2268865499) that can help you with splitting the file.

</details>

## Why I have so many failed jobs in Sidekiq?

<details>
  <summary>Show me!</summary>

  If your import process finished successfully, you have nothing to worry about. Failed jobs in Sidekiq are usually the a failed attempt of Reverse Geocoding, so you can safely ignore them. This happens when API limit is reached.
</details>

## Why I have some points "without data" on the Insights page?

<details>
  <summary>Show me!</summary>

  Some points are being recorded in places, that Photon have no info in its database. For example, it can be a river, a lake, or a forest. These points are not being processed by the reverse geocoding service, so Photon returns an empty (but still valid) response for them. Dawarich counts these points as "without data". It's perfectly normal to have some points without data, and you can safely ignore them. Usually, it's about 1-1,5% of your total points. The count is shown in the tracking summary when you select **All Time** on the Insights page.
</details>
