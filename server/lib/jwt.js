import jwt from "jsonwebtoken";
const { sign, verify } = jwt;

function getAccessSecret() {
  if (
    !process.env.JWT_SESSION_SECRET ||
    process.env.JWT_SESSION_SECRET.length === 0
  ) {
    throw new Error(
      "JWT_SESSION_SECRET belum diatur dalam file .env. Harap tambahkan JWT_SESSION_SECRET=your_secret_key pada file .env"
    );
  }

  return process.env.JWT_SESSION_SECRET;
}

function getRefreshSecret() {
  if (
    !process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_REFRESH_SECRET.length === 0
  ) {
    throw new Error(
      "JWT_REFRESH_SECRET belum diatur dalam file .env. Harap tambahkan JWT_REFRESH_SECRET=your_secret_key pada file .env"
    );
  }

  return process.env.JWT_REFRESH_SECRET;
}

/**
 * @param {string} id
 * @returns {string}
 */
export function generateAccessToken(id) {
  return sign({ id }, getAccessSecret(), {
    expiresIn: "1m",
  });
}

/**
 * @param {string} token
 * @returns {string|import("jsonwebtoken").JwtPayload|null}
 */
export function verifyAccessToken(token) {
  try {
    return verify(token, getAccessSecret());
  } catch (e) {
    return null;
  }
}

/**
 * @param {string} id
 * @returns {string}
 */
export function generateRefreshToken(id) {
  return sign({ id }, getRefreshSecret(), {
    expiresIn: "7d",
  });
}

/**
 * @param {string} token
 * @returns {string|import("jsonwebtoken").JwtPayload|null}
 */
export function verifyRefreshToken(token) {
  try {
    return verify(token, getRefreshSecret());
  } catch (e) {
    return null;
  }
}
