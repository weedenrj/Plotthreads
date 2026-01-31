export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {}

  return cookieHeader.split(';').reduce(
    (cookies, cookie) => {
      const [name, ...valueParts] = cookie.trim().split('=')
      if (name) {
        cookies[name] = decodeURIComponent(valueParts.join('='))
      }
      return cookies
    },
    {} as Record<string, string>
  )
}

interface CookieOptions {
  maxAge?: number
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`]

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`)
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`)
  }

  if (options.path) {
    parts.push(`Path=${options.path}`)
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`)
  }

  if (options.secure) {
    parts.push('Secure')
  }

  if (options.httpOnly) {
    parts.push('HttpOnly')
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`)
  }

  return parts.join('; ')
}

const isProduction = process.env.NODE_ENV === 'production'

export const SESSION_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
