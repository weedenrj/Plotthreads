import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

function getSessionSecret(): Buffer {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required')
  }
  // Expect hex-encoded 32-byte key
  const key = Buffer.from(secret, 'hex')
  if (key.length !== 32) {
    throw new Error('SESSION_SECRET must be 32 bytes (64 hex characters)')
  }
  return key
}

export interface SessionData {
  user: {
    googleId: string
    email: string
    name: string
    picture: string
  }
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export function encryptSession(data: SessionData): string {
  const key = getSessionSecret()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const json = JSON.stringify(data)
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  // Format: iv:authTag:encrypted (all base64)
  return [
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join('.')
}

export function decryptSession(cookie: string): SessionData | null {
  try {
    const key = getSessionSecret()
    const [ivB64, authTagB64, encryptedB64] = cookie.split('.')

    if (!ivB64 || !authTagB64 || !encryptedB64) {
      return null
    }

    const iv = Buffer.from(ivB64, 'base64')
    const authTag = Buffer.from(authTagB64, 'base64')
    const encrypted = Buffer.from(encryptedB64, 'base64')

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return JSON.parse(decrypted.toString('utf8'))
  } catch {
    return null
  }
}
