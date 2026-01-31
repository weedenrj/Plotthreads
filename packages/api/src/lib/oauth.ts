import crypto from 'crypto'
import { z } from 'zod'
import { encrypt, decrypt } from './crypto'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

const SCOPES = ['openid', 'email', 'profile']

function getClientId(): string {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) throw new Error('GOOGLE_CLIENT_ID is required')
  return clientId
}

function getClientSecret(): string {
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientSecret) throw new Error('GOOGLE_CLIENT_SECRET is required')
  return clientSecret
}

function getRedirectUri(): string {
  const apiUrl = process.env.API_URL || 'http://localhost:3001'
  return `${apiUrl}/auth/callback`
}

export function generateState(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url')
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

const OAuthStateSchema = z.object({
  state: z.string().length(64),
  codeVerifier: z.string().min(43),
})

export type OAuthState = z.infer<typeof OAuthStateSchema>

export function encryptOAuthState(state: OAuthState): string {
  return encrypt(state)
}

export function decryptOAuthState(encrypted: string): OAuthState {
  const data = decrypt(encrypted)
  return OAuthStateSchema.parse(data)
}

export function createAuthUrl(oauthState: OAuthState): string {
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: SCOPES.join(' '),
    state: oauthState.state,
    code_challenge: generateCodeChallenge(oauthState.codeVerifier),
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  })

  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

const TokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().optional(),
  expires_in: z.number().positive(),
  token_type: z.literal('Bearer'),
  scope: z.string().min(1),
})

export type TokenResponse = z.infer<typeof TokenResponseSchema>

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: getRedirectUri(),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token exchange failed: ${response.status} ${error}`)
  }

  return TokenResponseSchema.parse(await response.json())
}

const GoogleUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  verified_email: z.literal(true),
  name: z.string().min(1),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string().url(),
})

export type GoogleUser = z.infer<typeof GoogleUserSchema>

export async function fetchGoogleUser(accessToken: string): Promise<GoogleUser> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error(`User fetch failed: ${response.status}`)
  }

  return GoogleUserSchema.parse(await response.json())
}
