# Google OAuth Implementation Plan (Phase 2)

> Saved for later. Complete Phase 1 (Hono + Postgres) first.

## Overview

Add Google OAuth 2.0 authentication via BFF pattern. Tokens stored server-side, frontend gets httpOnly session cookie.

## Required Scopes

```typescript
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/contacts.readonly'
];
```

**Note:** Contacts scope requires Google verification for production.

## Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/auth/login` | GET | Redirect to Google consent screen |
| `/auth/callback` | GET | Handle OAuth callback, set session cookie |
| `/auth/logout` | POST | Clear session cookie |
| `/auth/me` | GET | Return current user (from session) |
| `/contacts` | GET | Proxy to Google People API |

## Session Strategy

**Encrypted httpOnly cookie** containing:
- `accessToken` - Google access token
- `refreshToken` - Google refresh token
- `user` - { id, email, name, picture }
- `expiresAt` - Token expiry timestamp

Encrypted with AES-256-GCM using `SESSION_SECRET` env var.

## Dependencies

```json
{
  "@hono/oauth-providers": "^0.7"
}
```

## Cookie Settings (Cross-Origin)

```typescript
{
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  domain: '.up.railway.app',
}
```

## Frontend Integration

### API Client (`src/lib/api.ts`)

```typescript
export const api = {
  login: () => window.location.href = `${API_URL}/auth/login`,
  logout: () => fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }),
  me: () => fetch(`${API_URL}/auth/me`, { credentials: 'include' }).then(r => r.json()),
  contacts: () => fetch(`${API_URL}/contacts`, { credentials: 'include' }).then(r => r.json()),
};
```

### Auth Hook (`src/hooks/useAuth.ts`)

React context providing:
- `user` - Current user or null
- `isLoading` - Initial auth check in progress
- `login()` - Redirect to OAuth
- `logout()` - Clear session
- `isAuthenticated` - Boolean

## Environment Variables

```
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
SESSION_SECRET=xxx (32+ random bytes)
```

## Google Cloud Console Setup

1. Create OAuth 2.0 credentials (Web application)
2. Add authorized redirect URI: `https://api.plotthreads.app/auth/callback`
3. Enable People API
4. Configure OAuth consent screen
5. Add test users (until verified)

## Files to Create

- `packages/api/src/routes/auth.ts`
- `packages/api/src/routes/contacts.ts`
- `packages/api/src/middleware/session.ts`
- `packages/api/src/lib/crypto.ts`
- `src/lib/api.ts`
- `src/hooks/useAuth.ts`
