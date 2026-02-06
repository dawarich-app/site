---
sidebar_position: 13
---

# Transportation Modes

Dawarich can automatically detect and classify your transportation modes based on speed and movement patterns. This feature helps you understand how you travel and provides detailed breakdowns of your activity.

## Overview

Transportation mode detection analyzes your tracks to identify how you were traveling:

- **Stationary** - Not moving
- **Walking** - Moving at walking pace
- **Running** - Moving faster than walking but slower than cycling
- **Cycling** - Moving at typical cycling speeds
- **Driving** - Moving at typical car speeds
- **Motorcycle** - High-speed driving with higher acceleration patterns
- **Bus** - Urban transit with regular stops
- **Train** - High-speed, smooth acceleration travel
- **Boat** - Water-based travel
- **Flying** - Air travel at aircraft speeds

## How It Works

Transportation mode detection uses a combination of factors:

### Speed Analysis

Each mode has characteristic speed ranges (in km/h):

| Mode | Speed Range |
|------|-------------|
| Stationary | 0-1 km/h |
| Walking | 1-7 km/h |
| Running | 7-20 km/h |
| Cycling | 7-45 km/h |
| Driving | 15-220 km/h |
| Bus | 10-100 km/h |
| Train | 30-350 km/h |
| Boat | 1-80 km/h |
| Flying | 150-950 km/h |

### Acceleration Patterns

When speeds overlap between modes (e.g., cycling vs. running), the system analyzes acceleration patterns:

- **Walking** has smooth, low acceleration
- **Running** has more variable acceleration
- **Cycling** is smoother than running
- **Driving** shows stop-and-go patterns
- **Trains** have remarkably consistent speed with minimal acceleration changes

### Source Data

If your tracking app records activity data (like OwnTracks or Google Timeline), Dawarich will use that information when available, falling back to movement analysis when source data isn't present.

## Configuring Speed Thresholds

You can customize the speed thresholds to better match your travel patterns. Go to **Settings** to configure:

### Basic Thresholds

| Setting | Default | Description |
|---------|---------|-------------|
| Walking Max Speed | 7 km/h | Maximum speed considered walking |
| Cycling Max Speed | 45 km/h | Maximum speed considered cycling |
| Driving Max Speed | 220 km/h | Maximum speed considered driving |
| Flying Min Speed | 150 km/h | Minimum speed to be considered flying |

### Expert Mode

Enable expert mode to access additional advanced settings:

| Setting | Default | Description |
|---------|---------|-------------|
| Stationary Max Speed | 1 km/h | Maximum speed considered stationary |
| Running vs Cycling Accel | 0.25 m/s² | Acceleration threshold to distinguish running from cycling |
| Cycling vs Driving Accel | 0.4 m/s² | Acceleration threshold to distinguish cycling from driving |
| Train Min Speed | 80 km/h | Minimum speed to consider train travel |
| Min Segment Duration | 60 seconds | Minimum duration for a segment to be classified |
| Time Gap Threshold | 180 seconds | Gap between points to start a new segment |
| Min Flight Distance | 100 km | Minimum distance to be considered a flight |

## Viewing Transportation Modes

### On Tracks

When viewing individual tracks, you can see the detected transportation mode for each segment. Tracks may contain multiple segments with different modes (e.g., walking to a train station, train travel, then cycling to your destination).

### In Statistics

The [Insights](/docs/features/insights) page shows an Activity Breakdown that displays:
- Percentage of time spent in each transportation mode
- Total duration for each mode
- Visual progress bars comparing modes

### In GeoJSON Exports

When exporting tracks as GeoJSON, the transportation mode information is included in the track properties.

## Recalculation

When you change transportation threshold settings, you can trigger a recalculation of existing tracks:

1. Go to **Settings**
2. Modify your transportation thresholds
3. Save your settings
4. A background job will recalculate transportation modes for your tracks

:::info
Recalculation runs in the background and may take some time depending on how many tracks you have.
:::

## Tips for Accurate Detection

### Improve Detection Accuracy

- **Track consistently** - Regular GPS points help the algorithm analyze movement patterns
- **Adjust thresholds** - If you're an unusually fast walker or slow cyclist, adjust the thresholds to match
- **Use source data** - Apps that record activity type (like Google Timeline) provide more accurate data

### Common Misclassifications

- **Cycling vs Running**: Both modes overlap in the 7-20 km/h range. The system uses acceleration patterns to distinguish them, but casual cycling may be classified as running.
- **Driving vs Train**: High-speed highway driving may be classified as train travel. Adjust the train_min_speed threshold if needed.
- **Bus vs Driving**: Bus detection is challenging without explicit stop pattern data. Most bus trips are classified as driving.

## Movement & Wellness

The Insights page uses transportation mode data to provide wellness insights:

- **Active Time** - Total time spent walking, running, and cycling
- **Sedentary vs Active** - Compares time in transport vs. active movement
- **Activity Ratio** - Shows the balance between active and sedentary time

This helps you understand your movement patterns and can motivate more active transportation choices.

## Technical Details

### Segment Detection

Tracks are split into segments based on:
- Time gaps between points (default: 3 minutes)
- Significant speed changes
- Source activity data changes

Each segment is classified independently, allowing a single track to contain multiple transportation modes.

### Confidence Levels

Each classification includes a confidence level:
- **High** - Clear, unambiguous classification (very slow or very fast speeds)
- **Medium** - Reasonable confidence based on speed and acceleration
- **Low** - Ambiguous cases where multiple modes could apply

### Minimum Requirements

For accurate classification, tracks should have:
- At least 2 GPS points
- Duration of at least 30 seconds
- Regular point intervals for acceleration calculation
