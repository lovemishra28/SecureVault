import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const TAG_LENGTH = 16
const SALT_LENGTH = 64
const KEY_LENGTH = 32
const ITERATIONS = 100000

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key || key.length < 16) {
    throw new Error('ENCRYPTION_KEY must be at least 16 characters')
  }
  // Ensure exactly 32 bytes for AES-256
  const keyBuffer = Buffer.alloc(32)
  Buffer.from(key, 'utf-8').copy(keyBuffer)
  return keyBuffer
}

export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = getKey()
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    // Combine IV + Tag + Encrypted data
    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

export function decrypt(encryptedText: string): string {
  try {
    const parts = encryptedText.split(':')
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format')
    }
    
    const iv = Buffer.from(parts[0], 'hex')
    const tag = Buffer.from(parts[1], 'hex')
    const encrypted = parts[2]
    const key = getKey()
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

export function encryptObject(obj: Record<string, unknown>): string {
  return encrypt(JSON.stringify(obj))
}

export function decryptObject<T = Record<string, unknown>>(encryptedText: string): T {
  return JSON.parse(decrypt(encryptedText)) as T
}

// Hash password for user authentication (one-way)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hashedPassword)
}
