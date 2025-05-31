//  @package      pages/api/rankings/getRankings.ts
//  @description  ランキング取得機能。
//                表示するのに必要なランキング情報を取得する。
//  @created      2025-05-31 by uma
//  @version      1.0.0
//  @lastModified 2025-05-31 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from "jsonwebtoken";
import { getRankingsById } from "../../../lib/rankingService";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { id: string };

        const rankings = await getRankingsById(decoded.id);
        if (!rankings) return res.status(404).json({ message: "ランキングが見つかりません" });
    
        return res.status(200).json({Rankings: rankings});

    } catch (error) {
        console.error("エラー:", error);
        return res.status(401).json({ message: "無効なトークンです" });
    }
}