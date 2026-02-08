---
sidebar_position: 14
---

# Place Search

The Search feature allows you to find places on the map and view your visit history for those locations. You can search for any location and see when you've visited it, then optionally create visit records from the search results.

:::info
The Search feature is available on Map V2 (MapLibre) and requires reverse geocoding to be enabled for full functionality.
:::

## Accessing Search

To access the search feature:

1. Navigate to the **Map** page (ensure you're using Map V2)
2. Click the **Settings** button (gear icon) in the map controls
3. Select the **Search** tab

You'll see a search input field where you can enter place names.

## Searching for Places

### Basic Search

1. Type at least 3 characters of a place name in the search input
2. Wait for autocomplete suggestions to appear
3. Results show matching places from the reverse geocoding service

The search uses debouncing to avoid excessive API calls while you type.

### Search Results

Search results display:
- Place name
- Address or location details
- Option to view your visit history for that location

## Viewing Visit History

After selecting a place from search suggestions:

1. Click on the search result
2. Dawarich will fetch your visit history for that location
3. Visits are grouped by year with expandable sections

### Year Groups

Visit history is organized by year:
- Click on a year to expand and see individual visits
- Each year shows the number of visits recorded
- Years are sorted with the most recent first

### Visit Details

For each visit, you can see:
- Date and time of the visit
- Duration (if available)
- Click to view on the map

## Creating Visits from Search

When you find visits in your search results that aren't yet recorded as formal visits, you can create them:

1. Expand a year group
2. Click on a visit item
3. A **Create Visit** modal appears with pre-filled data:
   - **Name** - The place name from your search
   - **Start Time** - When you arrived
   - **End Time** - When you left
4. Adjust the details if needed
5. Click **Create** to save the visit

This is useful for:
- Creating visits from historical data
- Adding visits that weren't automatically detected
- Confirming suggested visits

## Navigating to Visits

After selecting a visit from the search results:
- The map will center on the visit location
- You can see the exact coordinates where the visit was recorded
- Nearby points and routes from that time period are displayed

## Requirements

### Reverse Geocoding

For search to work, you must have reverse geocoding enabled. See the [Reverse Geocoding](/docs/self-hosting/configuration/reverse-geocoding) tutorial for setup instructions.

Without reverse geocoding:
- Search autocomplete won't return results
- Place name lookups will fail
- You can still manually search by coordinates

### Map V2

The search feature is currently only available in Map V2 (MapLibre GL JS). If you're using the classic Map V1 (Leaflet), you'll need to switch to Map V2 to access search functionality.

## Tips

### Effective Searching

- **Use specific names** - "Central Park New York" works better than just "Park"
- **Include city names** - Helps disambiguate common place names
- **Try alternative names** - Some places have multiple names or spellings

### Search Limitations

- Minimum 3 characters required to trigger search
- Results depend on your reverse geocoding provider's data
- Historical place names may not be in the database
- Very recent places may not be indexed yet

### Creating Accurate Visits

When creating visits from search results:
- Verify the start and end times match your actual visit
- Check that the location coordinates are correct
- Add notes if the place name needs clarification

## Keyboard Navigation

The search feature supports keyboard navigation:
- **Tab** - Move between elements
- **Enter** - Select highlighted result
- **Escape** - Clear search/close results
- **Arrow keys** - Navigate through results

## Troubleshooting

### No search results appear

- Verify reverse geocoding is properly configured
- Check that you've typed at least 3 characters
- Try a different search term

### "No visits found" message

This is normal for places you haven't visited. Your GPS data doesn't include any points near that location.

### Results appear but can't create visits

- Ensure the Visits and Places feature is enabled
- Check that you have points recorded in your database
- Verify the time range includes your recorded data

### Search is slow

- The reverse geocoding service may be rate-limited
- Self-hosting your own geocoding service can improve speed
- Patreon supporters have access to faster geocoding APIs
