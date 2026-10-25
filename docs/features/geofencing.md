---
sidebar_position: 8.5
title: Geofencing
description: Record when you enter or leave a Place and send each event to Home Assistant, Node-RED, n8n or your own service as a signed webhook.
---

# Geofencing

Dawarich can record when you enter or leave a [Place](/docs/features/visits-and-places#places) and send each event to your own services, such as Home Assistant, Node-RED or n8n.

## Turning it on for a place

1. Open the place from the **Places** page.
2. Turn on **Notify on enter and leave**.

The place's **Visit Radius** is its boundary. To make the area larger or smaller, change the Visit Radius (up to 50 km). Places that were Areas before 1.18.0 keep notifying.

## How events are detected

Dawarich checks the points your phone or tracking app sends, such as [OwnTracks, Overland or Traccar](/docs/getting-started/track-your-location), or the points API:

- You **enter** a place when a point falls inside its Visit Radius.
- You **leave** it only once you are clearly outside: farther than the Visit Radius plus the point's accuracy, and at least 50 meters beyond it. Movement right at the edge does not produce a stream of enter and leave pairs.
- Points less accurate than 500 meters are ignored.
- Only points recorded in the last 24 hours are checked, so importing older history does not create events.

## The event log

Open **Settings → Geofencing** to see every enter and leave event, with its time, place and source. Filter the list by place and by date.

## Webhooks

A webhook sends every enter and leave event to an address you choose, as a JSON `POST`.

### Adding a webhook

In **Settings → Geofencing**, choose **New webhook** and fill in:

- **Name** and **URL**.
- **Events**: enter, leave, or both.
- **Places**: the places to send events for. Leave all unchecked to get events for every place that notifies.

After you save it, Dawarich shows the webhook's signing secret once. Copy it right away: it is not shown again. **New secret** replaces it, and the old one stops working at once.

Each webhook shows when it last delivered an event. **Send test** sends a test event, and **Deliveries** lists the recent deliveries with their status, attempts and response, with a **Retry** button for failed ones. Deliveries are kept for 30 days. You can have up to 10 webhooks.

### What is sent

```http
POST /your/endpoint HTTP/1.1
Content-Type: application/json
User-Agent: Dawarich/1.18.0
X-Dawarich-Event: geofence.enter
X-Dawarich-Delivery: 4821
X-Dawarich-Signature: sha256=5f2b…
```

```json
{
  "id": 1093,
  "type": "enter",
  "place": {
    "id": 42,
    "name": "Home",
    "latitude": 52.52,
    "longitude": 13.405,
    "radius": 100
  },
  "user_id": 1,
  "source": "server_inferred",
  "occurred_at": "2026-11-02T17:41:08Z",
  "received_at": "2026-11-02T17:41:15Z",
  "location": { "latitude": 52.5201, "longitude": 13.4051, "accuracy_m": 12 },
  "device_id": null,
  "metadata": {}
}
```

`type` is `enter` or `leave`. `radius` is the place's Visit Radius in meters.

### Checking the signature

`X-Dawarich-Signature` is `sha256=` followed by the hex HMAC-SHA256 of the raw request body, made with the webhook's secret. Compute it over the body exactly as received, before parsing the JSON, and compare in constant time:

```python
import hashlib, hmac

def is_from_dawarich(raw_body: bytes, header: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, header)
```

### Delivery and retries

- A delivery that fails is tried again, up to five attempts in all, with growing waits between them.
- A webhook that fails five deliveries in a row is switched off, and you get a notification. Check the receiving URL, then switch the webhook back on in **Settings → Geofencing**.
- An event that reaches Dawarich more than 15 minutes after it happened stays in the event log but is not sent, so an automation never acts on a stale enter or leave.

### Home Assistant

Use a [webhook trigger](https://www.home-assistant.io/docs/automation/trigger/#webhook-trigger) and paste its URL (`https://…/api/webhook/<webhook id>`) into Dawarich.

- Home Assistant answers every request with `200`, even when the webhook ID is wrong. "Delivered" in Dawarich does not prove your automation ran: check the automation's trace in Home Assistant.
- Home Assistant cannot check the signature. The webhook ID in the URL is what keeps it private.
- By default, Home Assistant only accepts webhooks from its own network. From Dawarich Cloud, use a Nabu Casa webhook URL, or switch off `local_only` in the trigger's webhook settings.

## Dawarich Cloud and self-hosted

| | Dawarich Cloud | Self-hosted |
|---|---|---|
| Event log | All plans (Lite shows the last 12 months) | Yes |
| Webhooks | Pro and Family plans | Yes |
| Webhook address | `https` only | `http` or `https`, including addresses on your home network |
| Events sent per hour | 60 (later events stay in the log) | No limit |
| Test events | 5 a minute per webhook | No limit |

## API

`/api/v1/webhooks` and `/api/v1/geofence_events` give access to the same webhooks and event log as the web app. `POST /api/v1/points/transitions` accepts enter and leave events detected on a phone, for the upcoming geofencing support in the mobile app.
