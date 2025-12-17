// lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";

const alg = "HS256";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "please-change-me-to-long-secret"
);

function parseExpiry(str: string) {
  if (!str) return 7 * 24 * 60 * 60;
  const num = parseInt(str.slice(0, -1));
  const unit = str.slice(-1);
  if (unit === "d") return num * 24 * 60 * 60;
  if (unit === "h") return num * 60 * 60;
  if (unit === "m") return num * 60;
  return parseInt(str) || 7 * 24 * 60 * 60;
}

export async function signJwt(payload: Record<string, any>, expiresIn = "7d") {
  const exp = Math.floor(Date.now() / 1000) + parseExpiry(expiresIn);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as Record<string, any>;
  } catch (err) {
    return null;
  }
}
