import { router, publicProcedure } from '../trpc'
import {
  generateState,
  generateCodeVerifier,
  createAuthUrl,
  encryptOAuthState,
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

    const stateCookie = serializeCookie(
      OAUTH_STATE_COOKIE,
      encryptOAuthState(oauthState),
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 10,
      }
    )

    ctx.res.setHeader('Set-Cookie', stateCookie)

    return { url: createAuthUrl(oauthState) }
  }),

  me: publicProcedure.query(({ ctx }) => {
    return ctx.user
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const clearCookie = serializeCookie(SESSION_COOKIE, '', {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: 0,
    })

    ctx.res.setHeader('Set-Cookie', clearCookie)

    return { success: true }
  }),
})
