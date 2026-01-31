# Google OAuth Implementation Plan

## Overview

Google OAuth 2.0 authentication using encrypted httpOnly cookies. No third-party OAuth libraries—just Node.js `crypto` and `fetch`.

## Architecture

### Flow

1. **User clicks login** → Frontend calls `trpc.auth.getAuthUrl.query()`
2. **tRPC returns Google OAuth URL** with state + PKCE challenge stored in temp cookie
3. **User redirects to Google** → consents
4. **Google redirects to backend** → `http://localhost:3001/auth/callback?code=xxx&state=yyy`
5. **Backend callback handler**:
   - Validates state against temp cookie
   - Exchanges code for tokens via `fetch` to Google
   - Fetches user info from Google
   - Encrypts tokens + user into session cookie
   - Redirects to frontend (`http://localhost:5173`)
6. **Future requests**: Cookie sent automatically, tRPC context decrypts and loads user

### Why Backend Callback?

- Auth code never touches JavaScript
- Cookie set server-side before redirect
- Cleaner than frontend mutation approach

## Session Strategy

**Encrypted httpOnly cookie** containing:

```typescript
interface SessionData {
  user: {
    googleId: string
    email: string
    name: string
    picture: string
  }
  accessToken: string
  refreshToken: string
  expiresAt: number // Unix timestamp
}
```

Encrypted with AES-256-GCM using `SESSION_SECRET` env var.

## Required Scopes

```typescript
const SCOPES = [
  'openid',
  'email',
  'profile',
]
```

## Endpoints

| Endpoint | Type | Purpose |
|----------|------|---------|
| `trpc.auth.getAuthUrl` | Query | Returns Google OAuth URL |
| `trpc.auth.me` | Query | Returns current user from session |
| `trpc.auth.logout` | Mutation | Clears session cookie |
| `/auth/callback` | Raw GET | OAuth callback, sets cookie, redirects |

## Implementation Details

### Crypto (No Dependencies)

```typescript
// State parameter
crypto.randomBytes(32).toString('hex')

// PKCE code_verifier
crypto.randomBytes(32).toString('base64url')

// PKCE code_challenge
crypto.createHash('sha256').update(verifier).digest('base64url')

// Cookie encryption
crypto.createCipheriv('aes-256-gcm', key, iv)
crypto.createDecipheriv('aes-256-gcm', key, iv)
```

### Google Endpoints

```typescript
// Authorization URL
'https://accounts.google.com/o/oauth2/v2/auth'

// Token exchange
'https://oauth2.googleapis.com/token'

// User info
'https://www.googleapis.com/oauth2/v2/userinfo'
```

### Server Retrofit

The tRPC standalone server is retrofitted to intercept `/auth/callback` before tRPC:

```typescript
// packages/api/src/index.ts
const { server } = createHTTPServer({ router, createContext })

const originalListeners = server.listeners('request')
server.removeAllListeners('request')

server.on('request', async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`)

  if (url.pathname === '/auth/callback') {
    await handleOAuthCallback(req, res)
    return
  }

  // Pass to tRPC
  for (const listener of originalListeners) {
    listener(req, res)
  }
})
```

### Cookie Settings

```typescript
// Development
{
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}

// Production (cross-origin)
{
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: 30 * 24 * 60 * 60,
}
```

## Environment Variables

```
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
SESSION_SECRET=xxx              # 32+ random bytes, hex encoded
FRONTEND_URL=http://localhost:5173
```

Generate SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## File Structure

```
packages/api/src/
├── index.ts              # Server with callback route intercept
├── trpc.ts               # Context with session parsing
├── routers/
│   └── auth.ts           # getAuthUrl, me, logout
└── lib/
    ├── oauth.ts          # Google OAuth helpers
    ├── session.ts        # Cookie encrypt/decrypt
    └── cookies.ts        # Parse/serialize cookies

src/
├── hooks/
│   └── useAuth.ts        # Auth context + hook
└── components/
    └── features/
        └── LoginButton.tsx
```

## Frontend Integration

### Auth Hook

```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const trpc = useTRPC()
  const { data: user, isLoading } = useQuery(trpc.auth.me.queryOptions())
  const logout = useMutation(trpc.auth.logout.mutationOptions())

  const login = async () => {
    const { url } = await trpc.auth.getAuthUrl.query()
    window.location.href = url
  }

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout: logout.mutate,
  }
}
```

## Google Cloud Console Setup

1. Create OAuth 2.0 credentials (Web application)
2. Add authorized redirect URIs:
   - `http://localhost:3001/auth/callback` (dev)
   - `https://api.plotthreads.app/auth/callback` (prod)
3. Configure OAuth consent screen
4. Add test users (until verified)

## Security Considerations

- **PKCE**: Prevents authorization code interception
- **State parameter**: Prevents CSRF on OAuth flow
- **httpOnly cookie**: JavaScript can't access tokens
- **AES-256-GCM**: Authenticated encryption prevents tampering
- **30-day expiry**: Balance between UX and security
