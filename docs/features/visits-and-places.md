---
sidebar_position: 8
---

# Visits and places

The "Visits and places" feature is a a way to track your visits to places to build a comprehensive picture of your day, and, ultimately, your life.

<iframe width="560" height="315" src="https://www.youtube.com/embed/MhFvaoTJUOw?si=Mk0kixD8sIEQ4S-l" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## How to enable the feature

The feature is enabled by default, if a reverse geocoding service is configured.

## How it works

Starting release 0.25.0, a background job will run every night, searching for places you have visited the previous day. When new visits are found, they will be added to the database as Suggested visits, and you will be able to see them in the drawer panel on the right side of the map.

In the drawer panel, you will be able to see the list of visits for the **selected time period**, and you will be able to confirm or decline each visit. Clicking on a visit card will move center of the map to the visit location. Suggested visits are indicated on the map with an orange circle in a dashed border. After confirmation, the visit will be colored in blue and will have an increased radius on the map.

You can click on the visit circle on the map to open a popup with the visit details. There you'll be able to rename the visit and select another place from the list of suggested places nearby the visit location.

## How to suggest new visits

Currently, user can just wait for the background job to find new visits. In future, there will be a way to suggest new visits manually. Although, if you don't mind tinkering with the [console](/docs/FAQ/#how-to-enter-dawarich-console), you can run the following command:

```ruby
start_at = DateTime.new(2025, 03, 12) # change as you need
end_at = DateTime.new(2025, 03, 16) # change as you need

user = User.find_by(email: 'YOUR@EMAIL.TLD')

BulkVisitsSuggestingJob.perform_later(start_at: start_at, end_at: end_at, user_ids: [user.id])
```

This will perform a background job to suggest you visits. Should be finished in a few seconds to a few minutes depending on how big your provided timeframe is. After the job is finished, you will be able to see the new visits in the drawer panel.

## Area selection

Starting release 0.25.0, you can select an area on the map to define the area where the visits are searched for. After selecting the area, you will be able to see the list of visits for the selected area in the drawer panel. It will also show the list of points recorded in the selected area, split by day. Important: when you select an area, points and visits are being shown with no consideration for the time period selected in the time selector above the map. They will be shown for the whole time they are available in the database. It's useful when you want to see when you have visited specific area on the map.
