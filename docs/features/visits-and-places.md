---
sidebar_position: 8
title: Visits and Places
description: Track your visits to locations and build a comprehensive picture of your daily activities and travel history.
---

# Visits and Places

The "Visits and Places" feature tracks your visits to locations to build a comprehensive picture of your daily activities and travel history.

<iframe width="560" height="315" src="https://www.youtube.com/embed/MhFvaoTJUOw?si=Mk0kixD8sIEQ4S-l" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## How to Enable

The feature is enabled by default when a [reverse geocoding service](/docs/self-hosting/configuration/reverse-geocoding) is configured.

## How It Works

A background job runs every night, searching for places you visited the previous day. New visits are added as **Suggested Visits** and appear in the drawer panel on the map.

### Visit States

- **Suggested** - Automatically detected, awaiting your confirmation (orange circle, dashed border)
- **Confirmed** - Verified by you (blue circle, solid border)
- **Declined** - Rejected suggestions that won't appear again

### Managing Visits

In the drawer panel:
1. View visits for the selected time period
2. Click a visit card to center the map on that location. When the visit's place has an address, the card shows it under the visit name
3. Confirm or decline each suggested visit
4. Click visit circles on the map for detailed popups

In the visit popup, you can:
- Rename the visit. A visit you have not renamed shows the name of its place, or its address when it has no place
- Select a different place from nearby suggestions, or choose **Create a place** to add a new place at the visit and attach it
- Edit start and end times
- Delete the visit

## Places

Places are saved locations that visits can be matched to. Every place has a center and a **Visit Radius** (50 meters by default, up to 50 km). Visit detection first decides that you stayed somewhere, then matches the visit to a place:

1. A place whose Visit Radius contains the visit's center. If several do, the one with the smallest radius wins, then the nearest center.
2. Otherwise a nearby point of interest from reverse geocoding, which is reused or saved as a new place.
3. Otherwise the visit keeps just its address as a label and gets no place.

Creating a place or changing its center or radius re-checks your suggested visits nearby. Confirmed visits are never moved to another place automatically.

You can create a place from **Tools** (`C`) → **Create Place** on the [map](/docs/features/map#tools), or from a visit's place search with **Create a place**.

In earlier versions, circular **Areas** did this job. Since 1.18.0 they are Places; see [Areas](/docs/features/areas).

Places can also come from a file you import. Waypoints in a GPX file — for example the favourites exported by OsmAnd+ as `favourites.gpx` — are imported as places rather than as timeline points, and their category becomes a tag. See [Waypoints and favourites](/docs/getting-started/import-existing-data#waypoints-and-favourites) for details.

### Managing Places

- Places can be viewed and managed in the Places section. **All Places** lists everything; **Unconfirmed** lists places that were found automatically and that you have not tagged, annotated, used in a confirmed visit or set to notify on enter and leave.
- To rename a place or change its Visit Radius, click it on the map and choose **Edit**.
- To merge a duplicate, open the place on the Places page and pick the duplicate. Merging moves the duplicate's visits, tags and notes to the place you opened.
- Deleting a place keeps its visits; they just lose the attached place.
- To record when you arrive or leave, and send it to your own services, turn on **Notify on enter and leave** in the place's details. See [Geofencing](/docs/features/geofencing).
- An automatically found place is deleted on its own once no visit uses it any more, unless you renamed it, gave it a tag or note, or turned on **Notify on enter and leave**. Places you created or imported are never deleted automatically.

### Home Location

You can mark where you live by creating a tag named **Home** and assigning it to a place:

1. Create a tag named `Home` (see [Creating Tags](#creating-tags) below). The name is case-insensitive.
2. Assign that tag to the place where you live.

Dawarich uses this home location to center the map when you open it.

## Tags and Privacy Zones

Tags allow you to categorize places and create privacy zones.

### Creating Tags

1. Go to **Tags** in the navigation
2. Click **New Tag**
3. Configure:
   - **Name** - Tag label (e.g., "Home", "Work", "Friend's House")
   - **Icon** - Emoji or icon to represent the tag
   - **Color** - Color for map display
   - **Privacy Radius** (optional) - Creates a privacy zone

### Privacy Zones

Privacy zones hide the places you tag with them, such as your home, from the map and from everything you share. This is useful for:
- Protecting your home address
- Hiding sensitive locations
- Maintaining privacy when sharing data

To create a privacy zone:
1. Create or edit a tag
2. Set a **Privacy Radius** (in meters, up to 5000m)
3. Apply the tag to relevant places

Inside a privacy zone:
- Points, tracks, routes, visits, places, photos and live updates disappear from your own [map](/docs/features/map), and fog of war stays over the zone. A track that crosses a zone is cut at its edge instead of being drawn through it.
- Trip pages, route replay and posters leave the zone out as well.
- Timeline entries for visits inside the zone keep their name and time but no longer place a pin on the map.
- Shared links leave out the zone. Shared monthly stats leave out map hexagons that touch it. See [Sharing](/docs/features/sharing#privacy).

The hidden area is not centred on the place. It is up to 1.6 times your radius and shifted off the place by an amount that differs for every place, so the place can't be pinpointed from where your data stops. Everything within the radius you set stays hidden.

Privacy zones only change what is shown. Your data is still recorded inside them, and exports, statistics and the API keep your full data. API clients can ask for masked results by adding `mask_privacy_zones=true` to a request; map tiles and fog of war are always masked.

### Applying Tags to Places

1. Open a place's detail view
2. Select tags to apply
3. Tags with privacy zones automatically protect that location

## Manual Visit Creation

You can create visits manually from the map:

1. Use the [Search feature](/docs/features/search) to find a location
2. View your visit history for that place
3. Click on a time period to create a visit
4. Adjust the details and save

Or from the drawer panel:
1. Select an area on the map
2. View points in that area
3. Create a visit from the displayed points

When you create a visit at a new place without giving an address, Dawarich looks up the place's address and city in the background, as long as [reverse geocoding](/docs/self-hosting/configuration/reverse-geocoding) is enabled. The name you gave the visit is kept. Apps can also send the address themselves: `POST /api/v1/visits` accepts an optional `address` (street, house number, postcode, city and country), and visit responses include the place's formatted address. See the [API reference](/docs/api/create-visit).

## Bulk Visit Suggestion

To suggest visits for a historical time period via the console:

```ruby
start_at = DateTime.new(2025, 3, 12) # change as needed
end_at = DateTime.new(2025, 3, 16) # change as needed

user = User.find_by(email: 'YOUR@EMAIL.TLD')

BulkVisitsSuggestingJob.perform_later(
  start_at: start_at,
  end_at: end_at,
  user_ids: [user.id]
)
```

The job runs in the background via Sidekiq and typically completes within seconds to minutes depending on the time range.

## Selecting Data on the Map

Select a region on the map to explore visits within it:

1. Open **Tools** (`C`) and choose **Select data on map**
2. Draw a rectangle or polygon on the map
3. The drawer shows:
   - All visits in that area (regardless of selected time period)
   - Points recorded in the area, split by day

This is useful for reviewing your complete history at a specific location.

## Settings

Configure visit detection in Settings:

| Setting | Description |
|---------|-------------|
| Time Threshold Minutes | Minimum time at a location to be considered a visit |
| Merge Threshold Minutes | Time gap to merge nearby visits into one |
| Visits Suggestions Enabled | Toggle automatic visit detection |

## Tips

- **Review suggested visits regularly** - Confirming or declining helps improve future suggestions
- **Use tags for organization** - Categorize places by type (restaurants, shops, friends, etc.)
- **Set up privacy zones early** - Protect sensitive locations before sharing any data
- **Check historical data** - Use bulk suggestion to find visits from before you enabled the feature
