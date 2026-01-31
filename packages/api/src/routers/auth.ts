import { router, publicProcedure } from '../trpc'
import {
  generateState,
  generateCodeVerifier,
  createAuthUrl,
  encryptOAuthState,
} from '../lib/oauth'
import { serializeCookie, SESSION_COOKIE_OPTIONS } from '../lib/cookies'

const SESSION_COOKIE = 'session'

export const authRouter = router({
  getAuthUrl: publicProcedure.query(() => {
    const encodedState = encryptOAuthState({
      state: generateState(),
      codeVerifier: generateCodeVerifier(),
    })

    return { url: createAuthUrl(encodedState) }
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
