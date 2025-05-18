//  @package      pages/api/rankings/getRankings.ts
//  @description  全ランキング取得機能。
//                表示するのに必要な全てのユーザのランキング情報を取得する。
//  @created      2025-05-18 by uma
//  @version      1.0.0
//  @lastModified 2025-05-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from "jsonwebtoken";
import { getAllUserRankings } from "../../../lib/rankingService";
import { getUserById } from "../../../lib/userService";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { id: string };

        const user = await getUserById(decoded.id);
        if (!user) return res.status(404).json({ message: "ユーザが存在しません" });

        if (user.role !== 0 ) return res.status(404).json({ message: "ユーザに権限がありません" });

        const rankings = await getAllUserRankings();
        if (!rankings) return res.status(404).json({ message: "ランキングが存在しません" });

        const sorted = rankings.sort((a, b) => {
            const nameComp = a.name.localeCompare(b.name, "ja");
            if(nameComp !== 0) return nameComp;
            return a.rank.localeCompare(b.rank, "ja", {numeric: true});
        });
    
        return res.status(200).json({ Ranking: sorted });

    } catch (error) {
        console.error("ランキング取得エラー:", error);
        return res.status(500).json({ message: "ランキング取得失敗" });
    }
}