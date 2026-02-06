---
sidebar_position: 8
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
2. Click a visit card to center the map on that location
3. Confirm or decline each suggested visit
4. Click visit circles on the map for detailed popups

In the visit popup, you can:
- Rename the visit
- Select a different place from nearby suggestions
- Edit start and end times
- Delete the visit

## Places

Places are saved locations that can be associated with visits. When you confirm a visit, the location is saved as a place.

### Managing Places

- Places can be viewed and managed in the Places section
- Each place shows:
  - Name
  - Coordinates
  - Visit count
  - Associated tags

### Home Location

Dawarich can automatically detect your home location based on where you spend the most time overnight. This helps with:
- Filtering out home visits from statistics
- Calculating time away from home
- Trip detection

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

Privacy zones hide or obscure location data within a specified radius. This is useful for:
- Protecting your home address
- Hiding sensitive locations
- Maintaining privacy when sharing data

To create a privacy zone:
1. Create or edit a tag
2. Set a **Privacy Radius** (in meters, up to 5000m)
3. Apply the tag to relevant places

When a privacy zone is active:
- Points within the radius are hidden from exports
- Shared statistics exclude the zone
- The exact location isn't revealed in public views

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

## Area Selection

Select an area on the map to explore visits within a specific region:

1. Enable the area selection tool
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
