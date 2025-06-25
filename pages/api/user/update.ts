import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/middleware/auth";
interface UserUpdateData {
  name: string;
  email: string;
  avatar?: string;
  gender?: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify and decode token
    const decoded = verifyToken(req);
    if (typeof decoded !== "object" || (!decoded.userId && !decoded._id)) {
      throw new Error("Invalid token payload");
    }

    const userId = decoded.userId || decoded._id;
    const { name, gender } = req.body as UserUpdateData;

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "Invalid name" });
    }

    if (!["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    // Update user in database
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { name, gender } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const newToken = jwt.sign(
      {
        _id: userId.toString(), // dùng _id nhất quán
        name,
        gender,
        email: decoded.email,
        avatar: decoded.avatar || "/avatar_macdinh.jpg"
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );


    return res.status(200).json({
      message: "Cập nhật thành công",
      newToken
    });

  } catch (err: any) {
    console.error("Update error:", err);
    return res.status(401).json({
      message: err.message || "Unauthorized"
    });
  }
}