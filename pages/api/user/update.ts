//  @package      pages/api/user/update.ts
//  @description  ユーザ情報変更機能。
//                ユーザの情報を変更する。
//  @created      2025-05-25 by uma
//  @version      1.0.0
//  @lastModified 2025-05-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { updateUser, getUserById } from '../../../lib/userService';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try{
        const token = req.cookies.token;
        if(!token) return res.status(401).json({ message: "認識されていません" });

        const decoded = verify(token, JWT_SECRET) as {id: string};
        
        const user = await getUserById(decoded.id);
        if(!user) return res.status(404).json({ message: "ユーザが存在しません" });

        if(user.role !== 0) return res.status(403).json({ message: "ユーザに権限がありません" });

        const { id, updateData, userUpdaterFlg } = req.body;

        if (!id || !updateData || typeof updateData !== "object" || !userUpdaterFlg) {
            return res.status(400).json({ message: "不正なリクエストです" });
        }

        await updateUser( id, updateData, userUpdaterFlg );

        return res.status(200).json({ message: "ユーザ情報を更新しました" })
    } catch (error) {
        console.error("User Update Error:", error);
        return res.status(500).json({ message: "サーバーエラー"})
    }
}
