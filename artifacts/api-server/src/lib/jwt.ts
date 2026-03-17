import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kalapi-restaurant-secret-2024";

export interface JWTPayload {
  userId: number;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
