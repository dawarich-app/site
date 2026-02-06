---
sidebar_position: 12
---

# Family Location Sharing

The Family feature allows you to share your real-time location with trusted family members and friends. This enables you to see each other's locations on the map while maintaining full control over your privacy.

:::info
The Family feature is currently only available for self-hosted instances of Dawarich.
:::

## Overview

With Family Location Sharing, you can:

- Create a family group and invite members
- Share your real-time location with family members
- View family members' locations on the map
- Control when and how long your location is shared
- Leave or dissolve family groups at any time

## Creating a Family

To create a new family group:

1. Navigate to **Family** from the main navigation menu
2. Click **Create Family**
3. Enter a name for your family group (up to 50 characters)
4. Click **Create**

You will automatically become the owner of the family group.

## Inviting Members

As a family owner, you can invite others to join your family:

1. Go to the **Family** page
2. In the **Pending Invitations** section, find the invitation form
3. Enter the email address of the person you want to invite
4. Click **Send Invitation**

The system will generate a unique invitation link that you can share with the person. Invitations expire after a set period, and you can cancel pending invitations at any time.

:::tip
Share the invitation link directly with the person you're inviting. They will need to click the link to accept the invitation.
:::

## Accepting an Invitation

When you receive a family invitation:

1. Click on the invitation link
2. If you have an account, log in
3. Review the family details
4. Click **Accept** to join the family

You can only be a member of one family at a time.

## Managing Family Members

The family details page shows all current members with their:

- Email address
- Role (Owner or Member)
- Join date
- Current location sharing status

### Member Limits

For cloud-hosted instances, families can have a maximum of 5 members (including pending invitations). Self-hosted instances have no member limit.

## Location Sharing Settings

Each family member controls their own location sharing. You can enable or disable sharing and choose a duration:

### Duration Options

- **Always (Permanent)** - Share your location indefinitely until you disable it
- **1 hour** - Automatically stop sharing after 1 hour
- **6 hours** - Automatically stop sharing after 6 hours
- **12 hours** - Automatically stop sharing after 12 hours
- **24 hours** - Automatically stop sharing after 24 hours

### Enabling Location Sharing

1. Go to the **Family** page
2. Find your name in the members list
3. Toggle the **Location sharing** switch to enable
4. Select your preferred duration from the dropdown

Your location will be visible to other family members until you disable sharing or the duration expires.

### Disabling Location Sharing

Toggle the location sharing switch off at any time to immediately stop sharing your location with family members.

## Viewing Family Members on the Map

When family members have location sharing enabled:

1. Go to the **Map** page
2. Enable the **Family** layer from the map layers menu
3. Family members' current locations will appear as markers on the map

The markers update in real-time via WebSocket connections, so you can see movement as it happens.

### Location Status Indicators

On the family page, you can see each member's sharing status:

- **Green pulsing dot** - Location sharing is active
- **Gray dot** - Location sharing is disabled

For members sharing with a time limit, you'll also see when their sharing will expire.

## Leaving a Family

If you're a member (not the owner), you can leave a family at any time:

1. Go to the **Family** page
2. Click **Leave Family**
3. Confirm your decision

Your location will immediately stop being shared with family members.

## Deleting a Family

As the family owner, you can delete the family group:

1. Ensure all members have left the family (except yourself)
2. Click **Delete** on the family page
3. Confirm the deletion

:::warning
You cannot delete a family that still has other members. Remove all members first before deleting the family.
:::

## Privacy Considerations

Family location sharing is designed with privacy in mind:

- **You control your sharing** - Only you can enable sharing of your location
- **Duration limits** - Use time-limited sharing for temporary situations
- **Real-time only** - Family members only see your current location, not your historical location data
- **Instant disable** - Stop sharing immediately at any time
- **No persistence** - When sharing is disabled, your location data is no longer visible to family members

## Troubleshooting

### Invitation link expired
Invitations have an expiration period. Ask the family owner to send a new invitation.

### Can't join family
You can only be a member of one family at a time. Leave your current family before joining a new one.

### Family member locations not showing
- Ensure the family member has location sharing enabled
- Check that you have the Family layer enabled on the map
- Verify that the member's sharing hasn't expired

### Real-time updates not working
Family locations use WebSocket connections for real-time updates. If locations aren't updating:
- Check your browser's WebSocket support
- Verify your network allows WebSocket connections
- Try refreshing the page
