import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không xác thực' });
    }

    const token = authHeader.split(' ')[1];
    let userId: string;
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Thiếu mật khẩu' });
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } });

    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
}
