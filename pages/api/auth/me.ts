// /pages/api/auth/me.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from "../../../models/User";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { user: User };
        const user = decoded.user;
    
        if (!user) return res.status(404).json({ message: "ユーザーが見つかりません" });
    
        return res.status(200).json({
            user: user
        });
    } catch (error) {
        console.error("エラー:", error);
        return res.status(401).json({ message: "無効なトークンです" });
    }
}