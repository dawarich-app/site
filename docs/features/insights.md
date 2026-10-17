---
sidebar_position: 11
title: Insights
description: Analyze your location history with visualizations, statistics, and movement pattern dashboards.
---

# Insights

The Insights page provides a comprehensive dashboard for analyzing your location history data. It offers visualizations, statistics, and patterns to help you understand your movement habits and travel behaviors over time.

## Accessing Insights

Navigate to the Insights page from the main navigation menu, or open `/insights` directly. Insights is also where your statistics live: the old Stats page and its yearly views (`/stats` and `/stats/:year`) now redirect here. Pick a year from the period bar at the top, or choose **All Time** to see your whole history.

Use **Update stats** in the page header to recalculate the selected year, or every year when **All Time** is selected. Monthly statistics pages and public month sharing are described on the [Stats](/docs/features/stats) page.

## Overview Stats

At the top of the Insights page, you'll find key metrics for the selected period:

- **Total Distance** - The total distance traveled
- **Countries Visited** - Number of unique countries
- **Cities Visited** - Number of unique cities
- **Days Traveling** - Number of active days with recorded movement

## All Time: Years

With **All Time** selected, the page shows a summary of your tracking and one card per year. Each card has:

- A map of that year's routes (shown on the six most recent years)
- The year's distance and when its statistics were last updated
- A strip of the twelve months, showing how the distance was spread across the year
- The number of countries and cities, which opens the full list when clicked
- A link to the map for that year

Click the countries or cities count in the summary at the top to see the full list for your whole history.

## A Single Year

Selecting a year shows **Distance by month**: one card per month with its distance, linking to that month's statistics page.

### Year Calendar

Below the months, a calendar shows every day of the year. On Pro plans and self-hosted instances, the calendar has three views:

- **Countries + distance** - each day is coloured by the country you were in, and its shade shows how far you travelled
- **Countries** - only the country colours
- **Distance** - only how far you travelled each day

Hover over a day to see its date, country and distance. Countries are counted per UTC day and distances per day in your time zone, so a day near midnight can show one day's country next to another day's distance.

On Dawarich Cloud Lite, the calendar shows distance only.

### Where You Spent the Year

On Pro plans and self-hosted instances, a country timeline shows the stretches of the year you spent in each country, with the number of days for each.

:::tip
Countries come from reverse geocoding. If your points have not been reverse geocoded yet, the calendar and the country timeline have no countries to show. See [Reverse Geocoding](/docs/self-hosting/configuration/reverse-geocoding).
:::

### Distance Race

When you also have data for the previous year, a chart compares your cumulative distance this year with the same days of the previous year, and shows whether you are ahead or behind. Hover over the chart to compare any day. On Dawarich Cloud Lite, the race is shown as a preview that is available on Pro.

## Activity Streak

Below the year calendar, Insights tracks consecutive days of recorded movement:

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
