// middleware/auth.ts
import jwt from "jsonwebtoken";
import type { NextApiRequest } from "next";

export function verifyToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) throw new Error("Token not provided");

  return jwt.verify(token, process.env.JWT_SECRET!);
}

