//  @package      pages/api/user/getAllUserData.ts
//  @description  全ユーザ取得機能。
//                表示するのに必要な全てのユーザの情報を取得する。
//  @created      2025-05-24 by uma
//  @version      1.0.0
//  @lastModified 2025-05-24 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from "jsonwebtoken";
import { getAllUserData, getUserById } from "../../../lib/userService";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { id: string };

        const user = await getUserById(decoded.id);
        if (!user) return res.status(404).json({ message: "ユーザが存在しません" });

        if (user.role !== 0 ) return res.status(403).json({ message: "ユーザに権限がありません" });

        const users = await getAllUserData();
        if (!users) return res.status(404).json({ message: "ユーザが存在しません" });
    
        return res.status(200).json({ users: users });

    } catch (error) {
        console.error("ユーザ情報取得エラー:", error);
        return res.status(500).json({ message: "ユーザ情報取得失敗" });
    }
}