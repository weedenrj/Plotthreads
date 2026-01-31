import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

function getSessionSecret(): Buffer {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required')
  }
  const key = Buffer.from(secret, 'hex')
  if (key.length !== 32) {
    throw new Error('SESSION_SECRET must be 32 bytes (64 hex characters)')
  }
  return key
}

export function encrypt(data: unknown): string {
  const key = getSessionSecret()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const json = JSON.stringify(data)
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join('.')
}

export function decrypt(encrypted: string): unknown {
  const key = getSessionSecret()
  const [ivB64, authTagB64, encryptedB64] = encrypted.split('.')

  if (!ivB64 || !authTagB64 || !encryptedB64) {
    throw new Error('Malformed encrypted data')
  }

  const iv = Buffer.from(ivB64, 'base64url')
  const authTag = Buffer.from(authTagB64, 'base64url')
  const encryptedData = Buffer.from(encryptedB64, 'base64url')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()])
  return JSON.parse(decrypted.toString('utf8'))
}
