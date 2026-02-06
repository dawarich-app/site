---
sidebar_position: 16
---

# OIDC Authentication

Dawarich supports OpenID Connect (OIDC) authentication for self-hosted instances, allowing you to integrate with identity providers like Authentik, Authelia, Keycloak, and others.

## Overview

OpenID Connect (OIDC) is an identity layer built on top of OAuth 2.0. It allows users to authenticate using their existing identity provider credentials instead of creating a separate account in Dawarich.

:::info
OIDC authentication is only available for self-hosted Dawarich instances. Cloud-hosted instances use different authentication methods.
:::

## Prerequisites

Before configuring OIDC, you'll need:

1. A self-hosted Dawarich instance
2. An OIDC-compatible identity provider (Authentik, Authelia, Keycloak, Azure AD, etc.)
3. Administrator access to create an application/client in your identity provider

## Environment Variables

Configure the following environment variables in your `docker-compose.yml` file for both `dawarich_app` and `dawarich_sidekiq` services:

### Required Variables

| Variable | Description |
|----------|-------------|
| `OIDC_CLIENT_ID` | The client ID from your identity provider |
| `OIDC_CLIENT_SECRET` | The client secret from your identity provider |
| `OIDC_ISSUER` | The issuer URL of your identity provider (enables auto-discovery) |
| `OIDC_REDIRECT_URI` | The callback URL: `https://your-dawarich-domain/users/auth/openid_connect/callback` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OIDC_PROVIDER_NAME` | `Openid Connect` | Custom display name for the login button |
| `OIDC_AUTO_REGISTER` | `true` | Automatically create accounts for new OIDC users |
| `ALLOW_EMAIL_PASSWORD_REGISTRATION` | `false` | Allow traditional email/password registration and signing in alongside OIDC |

### Manual Endpoint Configuration (Alternative to Discovery)

If your identity provider doesn't support OIDC discovery, you can configure endpoints manually:

| Variable | Description |
|----------|-------------|
| `OIDC_HOST` | The hostname of your identity provider |
| `OIDC_SCHEME` | Protocol (`https` or `http`, default: `https`) |
| `OIDC_PORT` | Port number (default: `443`) |
| `OIDC_AUTHORIZATION_ENDPOINT` | Authorization endpoint path (default: `/authorize`) |
| `OIDC_TOKEN_ENDPOINT` | Token endpoint path (default: `/token`) |
| `OIDC_USERINFO_ENDPOINT` | User info endpoint path (default: `/userinfo`) |

## Configuration Example

Here's an example configuration in your `docker-compose.yml`:

```yaml
services:
  dawarich_app:
    image: freikin/dawarich:latest
    environment:
      # ... other environment variables ...
      OIDC_CLIENT_ID: your-client-id
      OIDC_CLIENT_SECRET: your-client-secret
      OIDC_ISSUER: https://auth.yourdomain.com
      OIDC_REDIRECT_URI: https://dawarich.yourdomain.com/users/auth/openid_connect/callback
      OIDC_PROVIDER_NAME: "Sign in with Authentik"
      OIDC_AUTO_REGISTER: "true"
      ALLOW_EMAIL_PASSWORD_REGISTRATION: "false"
    # ... rest of configuration ...

  dawarich_sidekiq:
    image: freikin/dawarich:latest
    environment:
      # Same OIDC environment variables
      OIDC_CLIENT_ID: your-client-id
      OIDC_CLIENT_SECRET: your-client-secret
      OIDC_ISSUER: https://auth.yourdomain.com
      OIDC_REDIRECT_URI: https://dawarich.yourdomain.com/users/auth/openid_connect/callback
      OIDC_PROVIDER_NAME: "Sign in with Authentik"
      OIDC_AUTO_REGISTER: "true"
      ALLOW_EMAIL_PASSWORD_REGISTRATION: "false"
    # ... rest of configuration ...
```

## Provider Setup Examples

### Authentik

1. Log in to your Authentik admin interface
2. Go to **Applications** → **Providers** → **Create**
3. Select **OAuth2/OpenID Provider**
4. Configure the provider:
   - **Name**: Dawarich
   - **Authorization flow**: Select an appropriate flow
   - **Client type**: Confidential
   - **Redirect URIs**: `https://dawarich.yourdomain.com/users/auth/openid_connect/callback`
5. Save and note the **Client ID** and **Client Secret**
6. Go to **Applications** → **Applications** → **Create**
7. Link the provider to the application
8. Your issuer URL is typically: `https://authentik.yourdomain.com/application/o/dawarich/`

### Keycloak

1. Log in to your Keycloak admin console
2. Select your realm (or create a new one)
3. Go to **Clients** → **Create client**
4. Configure:
   - **Client type**: OpenID Connect
   - **Client ID**: `dawarich`
5. On the next screen:
   - **Client authentication**: On
   - **Valid redirect URIs**: `https://dawarich.yourdomain.com/users/auth/openid_connect/callback`
6. Save and go to the **Credentials** tab to get the **Client Secret**
7. Your issuer URL is: `https://keycloak.yourdomain.com/realms/your-realm`

### Authelia

1. Add a client configuration to your Authelia configuration:

```yaml
identity_providers:
  oidc:
    clients:
      - id: dawarich
        description: Dawarich Location History
        secret: 'your-secret-hash'
        public: false
        authorization_policy: two_factor
        redirect_uris:
          - https://dawarich.yourdomain.com/users/auth/openid_connect/callback
        scopes:
          - openid
          - email
          - profile
```

2. Your issuer URL is typically: `https://auth.yourdomain.com`

### Azure AD / Entra ID

1. Go to **Azure Portal** → **Azure Active Directory** → **App registrations**
2. Click **New registration**
3. Configure:
   - **Name**: Dawarich
   - **Redirect URI**: `https://dawarich.yourdomain.com/users/auth/openid_connect/callback`
4. After creation, go to **Certificates & secrets** → **New client secret**
5. Note the **Application (client) ID** and the secret value
6. Your issuer URL is: `https://login.microsoftonline.com/your-tenant-id/v2.0`

## Testing the Integration

1. Restart your Dawarich containers after updating environment variables:
   ```bash
   docker compose down && docker compose up -d
   ```

2. Navigate to your Dawarich login page
3. You should see a button with your custom provider name (or "Sign in with Openid Connect")
4. Click the button to be redirected to your identity provider
5. After authentication, you'll be redirected back to Dawarich

## User Registration Behavior

### Auto-Registration Enabled (`OIDC_AUTO_REGISTER=true`)

When a user authenticates via OIDC for the first time:
- A new Dawarich account is automatically created
- The email address from the OIDC provider is used
- The user is logged in immediately

### Auto-Registration Disabled (`OIDC_AUTO_REGISTER=false`)

When a user authenticates via OIDC:
- They must have an existing Dawarich account with the same email
- No new accounts are created automatically
- Users without existing accounts will see an error

## Disabling Email/Password Registration

To use OIDC as the only authentication method:

```yaml
OIDC_AUTO_REGISTER: "true"
ALLOW_EMAIL_PASSWORD_REGISTRATION: "false"
```

This ensures all users must authenticate through your identity provider.

## Troubleshooting

### "Invalid credentials" after OIDC login

- Verify the email from OIDC matches an existing account (if auto-registration is disabled)
- Check that `OIDC_AUTO_REGISTER` is set to `true` if you want automatic account creation

### Redirect URI mismatch

- Ensure the `OIDC_REDIRECT_URI` exactly matches what's configured in your identity provider
- Check for trailing slashes
- Verify the protocol (http vs https)

### Discovery fails

- Verify the `OIDC_ISSUER` URL is accessible
- Try appending `/.well-known/openid-configuration` to the issuer URL in a browser
- If discovery doesn't work, try manual endpoint configuration

### OIDC button doesn't appear

- Check that both `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` are set
- Verify `SELF_HOSTED=true` (default for self-hosted instances)
- Check container logs for OIDC configuration messages

### SSL/Certificate errors

- Ensure your identity provider's SSL certificate is valid
- If using self-signed certificates, you may need to configure certificate trust

## Security Considerations

- Always use HTTPS for both Dawarich and your identity provider in production
- Keep your client secret secure and never commit it to version control
- Consider using two-factor authentication in your identity provider
- Regularly rotate client secrets according to your security policy
