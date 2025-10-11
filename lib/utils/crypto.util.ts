import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16
const TAG_LENGTH = 16
const SALT_LENGTH = 64

export function generateSalt(): string {
  return crypto.randomBytes(SALT_LENGTH).toString("hex")
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const hashedPassword = hashPassword(password, salt)
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashedPassword))
}

export function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, "hex"), iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  const tag = cipher.getAuthTag()

  return iv.toString("hex") + ":" + encrypted + ":" + tag.toString("hex")
}

export function decrypt(encryptedData: string, key: string): string {
  const parts = encryptedData.split(":")
  const iv = Buffer.from(parts[0], "hex")
  const encrypted = parts[1]
  const tag = Buffer.from(parts[2], "hex")

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, "hex"), iv)
  decipher.setAuthTag(tag)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

export function generateRandomToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

export function generateApiKey(): string {
  return `act_${generateRandomToken(32)}`
}
