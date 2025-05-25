//  @package      pages/api/user/create.ts
//  @description  新規ユーザ作成機能。
//                新規ユーザを作成する。
//  @created      2025-05-22 by uma
//  @version      1.0.0
//  @lastModified 2025-05-22 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUserById } from '../../../lib/userService';

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

        const newUser = req.body;
        if(!newUser) return res.status(400).json({ message: "登録したいユーザ情報を入力してください" });

        if(!newUser.id || !newUser.name || !newUser.password || newUser.grade === undefined || newUser.role === undefined){
            return res.status(400).json({ message: "全てのフィールドを入力してください" });
        }

        const existingUser = await getUserById(newUser.id);
        if (existingUser) {
            return res.status(400).json({ message: "このIDは既に使用されています" });
        }

        await createUser(newUser);

        return res.status(200).json({ message: "新規ユーザ作成しました" })
    } catch (error) {
        console.error("User Create Error:", error);
        return res.status(500).json({ message: "サーバーエラー"})
    }
}
