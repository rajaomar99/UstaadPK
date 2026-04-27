import crypto from 'crypto';

/**
 * Generates a random 32-byte hex string to be used as a plain-text token.
 * This token should be sent to the user via email.
 */
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Creates a SHA-256 hash of the provided token.
 * This hashed version should be stored in the database for security.
 * 
 * @param token The plain-text token to hash
 * @returns The hex-encoded SHA-256 hash
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
