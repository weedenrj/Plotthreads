import { createHTTPServer } from '@trpc/server/adapters/standalone'
import type { IncomingMessage, ServerResponse } from 'http'
import cors from 'cors'
import { appRouter } from './router'
import { createContext } from './trpc'
import { sql } from './db'
import { migrate } from './migrate'
import { parseCookies, serializeCookie, SESSION_COOKIE_OPTIONS } from './lib/cookies'
import { encryptSession } from './lib/session'
import { exchangeCodeForTokens, fetchGoogleUser, type OAuthState } from './lib/oauth'

const port = parseInt(process.env.PORT || '3001')
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

async function handleOAuthCallback(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const url = new URL(req.url!, `http://${req.headers.host}`)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  // Handle OAuth errors from Google
  if (error) {
    res.writeHead(302, { Location: `${frontendUrl}?error=${error}` })
    res.end()
    return
  }

  if (!code || !state) {
    res.writeHead(302, { Location: `${frontendUrl}?error=missing_params` })
    res.end()
    return
  }

  // Parse OAuth state from cookie
  const cookies = parseCookies(req.headers.cookie)
  const stateCookie = cookies.oauth_state
  if (!stateCookie) {
    res.writeHead(302, { Location: `${frontendUrl}?error=missing_state` })
    res.end()
    return
  }

  let oauthState: OAuthState
  try {
    oauthState = JSON.parse(Buffer.from(stateCookie, 'base64').toString())
  } catch {
    res.writeHead(302, { Location: `${frontendUrl}?error=invalid_state` })
    res.end()
    return
  }

  // Validate state parameter
  if (oauthState.state !== state) {
    res.writeHead(302, { Location: `${frontendUrl}?error=state_mismatch` })
    res.end()
    return
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, oauthState.codeVerifier)

    // Fetch user info
    const googleUser = await fetchGoogleUser(tokens.access_token)

    // Create session
    const session = encryptSession({
      user: {
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || '',
      expiresAt: Date.now() + tokens.expires_in * 1000,
    })

    // Set session cookie and clear OAuth state cookie
    const sessionCookie = serializeCookie('session', session, SESSION_COOKIE_OPTIONS)
    const clearStateCookie = serializeCookie('oauth_state', '', {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: 0,
    })

    res.writeHead(302, {
      Location: frontendUrl,
      'Set-Cookie': [sessionCookie, clearStateCookie],
    })
    res.end()
  } catch (err) {
    console.error('OAuth callback error:', err)
    res.writeHead(302, { Location: `${frontendUrl}?error=auth_failed` })
    res.end()
  }
}

async function start() {
  await migrate(sql)

  const server = createHTTPServer({
    router: appRouter,
    createContext,
    middleware: cors({
      origin: frontendUrl,
      credentials: true,
    }),
  })

  // Intercept requests before tRPC handles them
  const originalListeners = server.listeners('request').slice()
  server.removeAllListeners('request')

  server.on('request', async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url!, `http://${req.headers.host}`)

    // Handle OAuth callback outside of tRPC
    if (url.pathname === '/auth/callback') {
      await handleOAuthCallback(req, res)
      return
    }

    // Pass everything else to tRPC
    for (const listener of originalListeners) {
      ;(listener as (req: IncomingMessage, res: ServerResponse) => void)(req, res)
    }
  })

  server.listen(port)
  console.log(`tRPC server running on port ${port}`)
}

start()
