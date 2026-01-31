import { router, publicProcedure } from '../trpc'
import {
  generateState,
  generateCodeVerifier,
  createAuthUrl,
  type OAuthState,
} from '../lib/oauth'
import { serializeCookie, SESSION_COOKIE_OPTIONS } from '../lib/cookies'

const OAUTH_STATE_COOKIE = 'oauth_state'
const SESSION_COOKIE = 'session'

export const authRouter = router({
  getAuthUrl: publicProcedure.query(({ ctx }) => {
    const oauthState: OAuthState = {
      state: generateState(),
      codeVerifier: generateCodeVerifier(),
    }

    // Store state in temporary cookie (short-lived, for callback validation)
    const stateCookie = serializeCookie(
      OAUTH_STATE_COOKIE,
      Buffer.from(JSON.stringify(oauthState)).toString('base64'),
      {
        httpOnly: true,
        secure: SESSION_COOKIE_OPTIONS.secure,
        sameSite: SESSION_COOKIE_OPTIONS.sameSite,
        path: '/',
        maxAge: 60 * 10, // 10 minutes
      }
    )

    ctx.res.setHeader('Set-Cookie', stateCookie)

    return { url: createAuthUrl(oauthState) }
  }),

  me: publicProcedure.query(({ ctx }) => {
    return ctx.user
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    // Clear session cookie
    const clearCookie = serializeCookie(SESSION_COOKIE, '', {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: 0,
    })

    ctx.res.setHeader('Set-Cookie', clearCookie)

    return { success: true }
  }),
})
