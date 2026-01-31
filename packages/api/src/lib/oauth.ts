import crypto from 'crypto'

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

export interface OAuthState {
  state: string
  codeVerifier: string
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

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}

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
    throw new Error(`Token exchange failed: ${error}`)
  }

  return response.json()
}

export interface GoogleUser {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

export async function fetchGoogleUser(accessToken: string): Promise<GoogleUser> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }

  return response.json()
}
