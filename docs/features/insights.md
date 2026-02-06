---
sidebar_position: 11
---

# Insights

The Insights page provides a comprehensive dashboard for analyzing your location history data. It offers visualizations, statistics, and patterns to help you understand your movement habits and travel behaviors over time.

## Accessing Insights

Navigate to the Insights page from the main navigation menu. You can select different years to view historical data, or choose "All Time" to see aggregated statistics across your entire location history.

## Overview Stats

At the top of the Insights page, you'll find key metrics for the selected period:

- **Total Distance** - The total distance traveled
- **Countries Visited** - Number of unique countries
- **Cities Visited** - Number of unique cities
- **Days Traveling** - Number of active days with recorded movement

## Activity Heatmap

The Activity Heatmap displays a GitHub-style contribution graph showing your daily activity throughout the year. Each cell represents a day, with color intensity indicating the level of activity:

- **Lighter colors** indicate less movement
- **Darker colors** indicate more movement
- **Gray cells** indicate no recorded activity

Hover over any cell to see the exact date and distance traveled that day. The heatmap also shows the number of active days for the selected year.

## Activity Streak

The Activity Streak section tracks consecutive days of recorded movement:

- **Current Streak** - Shows how many consecutive days you've been active (only shown for the current year)
- **Longest Streak** - Your best consecutive active days record, including the date range when it occurred

This feature helps you stay motivated to track your location consistently.

## Year Comparison

When viewing a specific year, the Insights page compares your statistics with the previous year:

- Distance change (percentage increase/decrease)
- Countries visited change
- Cities visited change
- Active days change

This helps you understand trends in your travel and movement patterns over time.

## Activity Breakdown

The Activity Breakdown shows how you spend your time across different transportation modes:

- **Driving** - Time spent in a car
- **Walking** - Time spent walking
- **Cycling** - Time spent on a bicycle
- **Running** - Time spent running
- **Train** - Time spent on trains
- **Bus** - Time spent on buses
- **Flying** - Time spent flying
- **Boat** - Time spent on boats
- **Stationary** - Time spent not moving

Each mode displays a progress bar showing its percentage of total tracked time, along with the actual duration.

:::tip
Activity breakdown requires tracks with transportation mode detection enabled. See the [Transportation Modes](/docs/features/transportation-modes) documentation for more information.
:::

## Monthly Digest

The Monthly Digest provides detailed statistics for a specific month, including:

- **Total Distance** - Distance traveled that month
- **Active Days** - Number of days with recorded movement
- **Countries** - Countries visited
- **Cities** - Cities visited

### Weekly Pattern

A bar chart showing which days of the week you're most active, helping you identify your movement habits.

### Top Locations

The places where you spent the most time during the month, showing:
- Location name
- Total time spent

### First Visits

Highlights new countries and cities you visited for the first time during that month, marked with special badges.

### Month-over-Month Comparison

When available, shows how your current month compares to the previous month:
- Distance change percentage
- Countries visited change

Use the navigation arrows or dropdown to switch between months.

## Travel Patterns

The Travel Patterns section analyzes when you typically travel:

### Time of Day Distribution

Shows your activity distribution across different times of day:
- Morning
- Afternoon
- Evening
- Night

### Day of Week Distribution

Displays which days of the week you're most active, helping identify weekly patterns.

### Seasonality

When viewing annual data, shows how your activity varies across seasons (Spring, Summer, Fall, Winter).

## Movement & Wellness

This section provides health-related insights based on your movement data:

### Active Time

Shows total time spent on active transportation modes:
- Walking
- Running
- Cycling
- Driving

### Sedentary vs Active

Compares time spent in sedentary activities (stationary, in transport) versus active movement, including an activity ratio to help you understand your overall movement wellness.

## Location Clusters

The Location Clusters section identifies geographic areas where you spend the most time. This helps visualize your "home bases" and frequently visited regions.

## Top Visited Locations

For the selected year, shows your top 5 most visited places based on:
- Number of visits
- Total time spent

This requires the [Visits and Places](/docs/features/visits-and-places) feature to be enabled with reverse geocoding configured.
