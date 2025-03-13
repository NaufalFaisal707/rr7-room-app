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

export function generateAccessToken(id: string) {
  return sign({ id }, getAccessSecret(), {
    expiresIn: "1m",
  });
}

export function verifyAccessToken(token: string) {
  try {
    return verify(token, getAccessSecret());
  } catch (e) {
    return null;
  }
}

export function generateRefreshToken(id: string) {
  return sign({ id }, getRefreshSecret(), {
    expiresIn: "7d",
  });
}

export function verifyRefreshToken(token: string) {
  try {
    return verify(token, getRefreshSecret());
  } catch (e) {
    return null;
  }
}
