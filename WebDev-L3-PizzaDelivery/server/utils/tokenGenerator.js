const crypto = require("crypto");

/**
 * Generate a random 32-byte hexadecimal token
 */
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Compute SHA-256 hash of a string
 */
const hashToken = (token) => {
  if (!token) return null;
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
  generateRandomToken,
  hashToken,
};
