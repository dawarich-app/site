import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/dawarich-api",
    },
    {
      type: "category",
      label: "Areas",
      items: [
        {
          type: "doc",
          id: "api/creates-an-area",
          label: "Creates an area",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieves-all-areas",
          label: "Retrieves all areas",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-a-specific-area",
          label: "Retrieves a specific area",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/updates-an-area",
          label: "Updates an area",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/deletes-an-area",
          label: "Deletes an area",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Countries",
      items: [
        {
          type: "doc",
          id: "api/retrieves-country-borders-geo-json-data",
          label: "Retrieves country borders GeoJSON data",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-visited-cities-by-date-range",
          label: "Get visited cities by date range",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Digests",
      items: [
        {
          type: "doc",
          id: "api/lists-all-yearly-digests",
          label: "Lists all yearly digests",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/generates-a-yearly-digest",
          label: "Generates a yearly digest",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieves-a-yearly-digest",
          label: "Retrieves a yearly digest",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/deletes-a-yearly-digest",
          label: "Deletes a yearly digest",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Families",
      items: [
        {
          type: "doc",
          id: "api/retrieves-family-members-locations",
          label: "Retrieves family members' locations",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Health",
      items: [
        {
          type: "doc",
          id: "api/retrieves-application-status",
          label: "Retrieves application status",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Insights",
      items: [
        {
          type: "doc",
          id: "api/retrieves-insights-overview-for-a-year",
          label: "Retrieves insights overview for a year",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-detailed-insights-with-comparisons-and-travel-patterns",
          label: "Retrieves detailed insights with comparisons and travel patterns",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Locations",
      items: [
        {
          type: "doc",
          id: "api/searches-for-location-history-near-coordinates",
          label: "Searches for location history near coordinates",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-location-suggestions-from-text-search",
          label: "Get location suggestions from text search",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Maps",
      items: [
        {
          type: "doc",
          id: "api/retrieves-hexagon-grid-data-for-the-map",
          label: "Retrieves hexagon grid data for the map",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-geographic-bounds-for-hexagon-data",
          label: "Retrieves geographic bounds for hexagon data",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Batches",
      items: [
        {
          type: "doc",
          id: "api/creates-a-batch-of-points",
          label: "Creates a batch of points",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Points",
      items: [
        {
          type: "doc",
          id: "api/creates-a-point",
          label: "Creates a point",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/returns-list-of-tracked-years-and-months",
          label: "Returns list of tracked years and months",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-all-points",
          label: "Retrieves all points",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/creates-a-batch-of-points",
          label: "Creates a batch of points",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/updates-a-point",
          label: "Updates a point",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/deletes-a-point",
          label: "Deletes a point",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/bulk-deletes-points",
          label: "Bulk deletes points",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Photos",
      items: [
        {
          type: "doc",
          id: "api/lists-photos",
          label: "Lists photos",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-a-photo-thumbnail",
          label: "Retrieves a photo thumbnail",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Places",
      items: [
        {
          type: "doc",
          id: "api/retrieves-all-places-for-the-authenticated-user",
          label: "Retrieves all places for the authenticated user",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/creates-a-place",
          label: "Creates a place",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/searches-for-nearby-places-using-photon-geocoding-api",
          label: "Searches for nearby places using Photon geocoding API",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-a-specific-place",
          label: "Retrieves a specific place",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/updates-a-place",
          label: "Updates a place",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/deletes-a-place",
          label: "Deletes a place",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Settings",
      items: [
        {
          type: "doc",
          id: "api/updates-user-settings",
          label: "Updates user settings",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/retrieves-user-settings",
          label: "Retrieves user settings",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-transportation-mode-recalculation-status",
          label: "Retrieves transportation mode recalculation status",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Stats",
      items: [
        {
          type: "doc",
          id: "api/retrieves-all-stats",
          label: "Retrieves all stats",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Subscriptions",
      items: [
        {
          type: "doc",
          id: "api/processes-a-subscription-callback",
          label: "Processes a subscription callback",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Tags",
      items: [
        {
          type: "doc",
          id: "api/retrieves-privacy-zone-tags",
          label: "Retrieves privacy zone tags",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Timeline",
      items: [
        {
          type: "doc",
          id: "api/retrieves-timeline-data-for-a-date-range",
          label: "Retrieves timeline data for a date range",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Tracks",
      items: [
        {
          type: "doc",
          id: "api/retrieves-points-for-a-track",
          label: "Retrieves points for a track",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-tracks-as-geo-json",
          label: "Retrieves tracks as GeoJSON",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieves-a-single-track-as-geo-json",
          label: "Retrieves a single track as GeoJSON",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      items: [
        {
          type: "doc",
          id: "api/returns-the-current-user",
          label: "Returns the current user",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Visits",
      items: [
        {
          type: "doc",
          id: "api/list-visits",
          label: "List visits",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-visit",
          label: "Create visit",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/update-visit",
          label: "Update visit",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-visit",
          label: "Delete visit",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/get-possible-places-for-visit",
          label: "Get possible places for visit",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/merge-visits",
          label: "Merge visits",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/bulk-update-visits",
          label: "Bulk update visits",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
