// server/src/lib/jwt.ts
import jwt from "jsonwebtoken";
import { requireEnv } from "./env";

const SECRET = requireEnv("JWT_SECRET");

const ISSUER = process.env.JWT_ISSUER ?? "task-manager-api";
const AUDIENCE = process.env.JWT_AUDIENCE ?? "task-manager-client";

export type JwtPayload = { id: string };

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1h",
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

export function verifyToken(token: string): JwtPayload {
  const verified = jwt.verify(token, SECRET, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });

  if (typeof verified !== "object" || verified === null || !("id" in verified)) {
    throw new Error("Invalid token payload");
  }

  return verified as JwtPayload;
}
