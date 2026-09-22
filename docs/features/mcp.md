---
sidebar_position: 16
title: AI Assistants (MCP)
description: Connect an AI assistant to your Dawarich location history through the Model Context Protocol — read-only timeline, latest location and visit search.
---

# AI Assistants (MCP)

Dawarich has an experimental, read-only [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server. Connect an MCP-capable AI assistant to it and ask questions about your own location history in plain language:

- *What did I do last weekend?*
- *When was I last in Leipzig, and how often have I been there?*
- *Where am I right now, according to my tracker?*

The assistant can only read. It cannot create, change or delete anything in your account.

:::caution Experimental
The MCP server is new and may change between releases. Tool names, arguments and response fields are not yet a stable contract.
:::

## Availability

- **Self-hosted:** available to every user, no plan required.
- **Dawarich Cloud:** available on the **Pro** and **Family** plans. Lite accounts get a `403 pro_plan_required` response.

## Privacy

:::warning Your location history leaves Dawarich
Everything the assistant reads — visit names, place names and coordinates, times and routes — is sent to the MCP client and, through it, to whichever language model provider that client uses. Dawarich cannot control what that provider stores or how long it keeps it. Only connect clients whose data handling you accept for your location history.
:::

## Available tools

| Tool | What it returns |
|---|---|
| `get_timeline` | Visits and journeys for a time range of up to **7 local calendar days**, with a per-day summary (distance, places visited, time moving and stationary). Ranges with more than **250 entries** are rejected; ask for a shorter range. |
| `get_latest_location` | Your newest recorded location point, skipping points flagged as anomalies. |
| `search_visits` | Visits whose visit name, place name, city, country or area name contains a search text (at least 2 characters). Returns the total number of matches and up to 50 visits, newest first. Declined visits are not included. |

All durations are reported in minutes. Distances use your account's distance unit unless the assistant asks for kilometers or miles.

## Setting it up

### 1. Copy your API key

Open **Account** from the user menu and copy the key from the **API access** section.

:::caution The key is not MCP-only yet
The API key gives access to the whole Dawarich API, including endpoints that change data. The MCP tools themselves are read-only, but anyone who has the key can use it elsewhere. Only put it into MCP clients you fully trust. If a client or its configuration is ever exposed, click **Generate new API key** in the same section; the old key stops working immediately, so update your other apps too.
:::

### 2. Add Dawarich to your MCP client

The server uses the **Streamable HTTP** transport at:

```text
https://YOUR_DAWARICH_HOST/api/v1/mcp
```

The key must be sent as a bearer token in the `Authorization` header. Passing it as an `api_key` URL parameter is rejected, so it never ends up in server or proxy logs.

The exact format depends on your client. A client that supports HTTP servers with custom headers usually takes a configuration like this:

```json
{
  "mcpServers": {
    "dawarich": {
      "type": "http",
      "url": "https://YOUR_DAWARICH_HOST/api/v1/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_DAWARICH_API_KEY"
      }
    }
  }
}
```

Use HTTPS whenever the client reaches Dawarich over a network. Do not commit the configuration to source control or share it.

### 3. Check the connection

With your key in the `DAWARICH_API_KEY` environment variable, this request should return server information:

```bash
curl --request POST \
  --url https://YOUR_DAWARICH_HOST/api/v1/mcp \
  --header "Authorization: Bearer $DAWARICH_API_KEY" \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-11-25",
      "capabilities": {},
      "clientInfo": { "name": "curl", "version": "1.0" }
    }
  }'
```

A working setup answers with `serverInfo.name` set to `dawarich` and lists `tools` among its capabilities.

| Response | Meaning |
|---|---|
| `401` | The key is missing, wrong, or was sent as a URL parameter instead of a header |
| `403 pro_plan_required` | The account is on the Lite plan (Dawarich Cloud) |
| `402 payment_required` | The account has not finished checkout yet |

## Self-hosting notes

- The endpoint is stateless. It works with several Puma processes and several application instances, and needs no sticky sessions.
- Requests are checked against `APPLICATION_HOSTS` like every other Dawarich request, so the hostname your client uses must already be listed there.
- Your instance's normal API rate limits apply.
- There is no MCP OAuth sign-in; clients authenticate with the API key.
