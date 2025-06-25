import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   const session = await getServerSession(req, res, authOptions);
//   if (!session) return res.status(401).json({ message: "Unauthorized" });

//   const client = await clientPromise;
//   const db = client.db("your_db_name");

//   const { movieId } = req.body;

//   await db.collection("favorites").insertOne({
//     userId: session.user.id,
//     movieId,
//     addedAt: new Date(),
//   });

//   return res.status(200).json({ message: "Saved" });
// }
