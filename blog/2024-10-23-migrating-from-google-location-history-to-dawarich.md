---
slug: migrating-from-google-location-history-to-dawarich
title: Migrating from Google Location History to Dawarich
authors:
  name: Evgenii Burmakin
  title: Author of Dawarich
  url: https://github.com/Freika
  image_url: https://github.com/Freika.png
tags: [guides]
---

## What's going on?

As you probably already know, Google [discontinuing](https://blog.google/products/maps/updates-to-location-history-and-new-controls-coming-soon-to-maps/) the web version of its Location History / Timeline service by December 1st, 2024. Here are some dry facts:

- Starting December 1st, 2024, the web version of Timeline will no longer be working
- Timeline data will now be stored on the user's device instead
- Users’ **last 90 days** of location data will be transferred to the first device they sign in with after December 1, but any data older than this will be **deleted unless saved**
- Users can manually **backup Timeline data** to Google’s servers for device restoration, but it will not be the default

The transition offered by Google is far from perfect: some users already have reported they have lost years and years of their location history data.

The least you can do is to export your data from Google. You can do it either using Google's [Takeout](https://takeout.google.com/) feature or by navigating to Timeline -> Backup in your Google Maps application. Either way, in the end, you will receive an archive with your location history, hopefully, for the whole time you have been tracking it.

## What's next?

That's where Dawarich comes in very handy. Although Google lacks consistency when it comes to the export file format, Dawarich already supports all three (3) kinds of files that you can get from Google.

### Google Takeout

If you requested your data using Google Takeout, you might end up with two different types of files: Semantic Location History, and Records.

Semantic Location History is a bunch of files, split into yearly directories, and named after a year and a month, for example: `Semantic Location History/2022/2022_APRIL.json`. There will be a file for each month of location history data. This kind of file is the detailed one, and aside from coordinates and timestamps it usually might also contain addresses, suggested by Google, means of transportation, and so on.

To import Google Semantic Location History files, you just need to navigate to the Imports page of Dawarich, select "Semantic Location History" as a Source, select your files (you can select multiple files at once), and hit "Create import". Dawarich will upload the files, save their contents in the database, and then start creating points in the background. After a few seconds (or minutes, if you have lots of files) the data will be imported and you will receive a notification in Dawarich UI.

`Records.json` is the second type of file you might receive with your Google Takeout Archive. It usually only contains coordinates of geopoints and timestamps of where you've been there, but it also holds a lot more geodata than Semantic Location History files. Because of this, these kinds of files tend to be a lot heavier and should not be imported via the web interface. Instead, you'll have to complete a series of steps.

1. Upload your `Records.json` to your server, where you host Dawarich
2. Copy the file to the `tmp` folder of Dawarich:
```
docker cp Records.json dawarich_app:/var/app/tmp/imports/Records.json
```
3. `ssh` into Dawarich container: `docker exec -it dawarich_app sh
4. Run the importing command:
```
bundle exec rake import:big_file['tmp/imports/Records.json','user@example.com']
```

The process will take some time, depending on the size of your file, so let it work. Once the file is processed, all points from it will be queued for background import, which will also take some time. You can monitor the stats of the importing process on the Sidekiq page of your Dawarich instance: `https://your.host/sidekiq`.

### Location history on your device

If you can't retrieve your location history via Google Takeout, you'll probably be able to do that directly on your mobile device. The instructions on how to do that are available on [Google Answers](https://support.google.com/maps/community-guide/276228911/changes-underway-for-google-maps-timeline).

When you receive the file with your exported data, you can import it using the Imports page of Dawarich. The process is similar to Semantic Location History kind of files, the only thing you have to do differently is select "Google Phone Takeout" as the source of data before uploading it.

## In the end

There, you have it! If you still haven't exported your location history data, do it ASAP, before it's completely gone, and import it to your instance of Dawarich.
