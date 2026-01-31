import { encrypt, decrypt } from './crypto'

export interface SessionData {
  user: {
    googleId: string
    email: string
    name: string
    picture: string
  }
  accessToken: string
  refreshToken: string
  expiresAt: number // Google access token expiry, not session expiry
}

export function encryptSession(data: SessionData): string {
  return encrypt(data)
}

// Throws on tampered/malformed data - crypto errors bubble up
export function decryptSessionOrThrow(cookie: string): SessionData {
  if (!cookie) {
    throw new Error('Missing session cookie')
  }
  return decrypt(cookie) as SessionData
}

// For context creation - null means "no cookie", crypto errors still throw
export function decryptSession(cookie: string): SessionData | null {
  if (!cookie) return null
  return decryptSessionOrThrow(cookie)
}

// Check if Google access token needs refresh (for API calls to Google)
export function isAccessTokenExpired(session: SessionData): boolean {
  return session.expiresAt < Date.now()
}
