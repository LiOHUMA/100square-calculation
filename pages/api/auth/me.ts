//  @package      pages/api/auth/me.ts
//  @description  ログイン状況確認機能。
//                Cookieに必要なユーザ情報が登録されているか確認する。
//  @created      2025-05-14 by uma
//  @version      1.0.0
//  @lastModified 2025-05-14 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from "jsonwebtoken";
import { UserOmit } from "../../../models/User";
import { getUserById } from "../../../lib/userService";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { id: string };

        const userData = await getUserById(decoded.id);
        if (!userData) return res.status(404).json({ message: "ユーザーが見つかりません" });

        const UserOmit: UserOmit = {
            name: userData.name,
            role: userData.role,
        }
    
        return res.status(200).json({UserOmit: UserOmit});

    } catch (error) {
        console.error("エラー:", error);
        return res.status(401).json({ message: "無効なトークンです" });
    }
}