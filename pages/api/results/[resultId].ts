//  @package      pages/api/results/[resultId].ts
//  @description  百ます計算結果表示機能。
//                百ます計算結果の情報を取得する。
//  @created      2025-06-22 by uma
//  @version      1.0.0
//  @lastModified 2025-06-22 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from "jsonwebtoken"
import { getUserById } from "../../../lib/userService";
import { saveCalcSettingData } from '../../../lib/calcSetting';
import { MODE_COLLECTIONS, ModeType } from '../../../lib/constants/calc';
import { getRankingsByIdAndMode, saveRanking } from '../../../lib/rankingService';
import { MODE_TO_RANKING_MAP } from '../../../lib/constants/ranking';
import { createResult, getResultById } from '../../../lib/resultService';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { id: string };

        const user = await getUserById(decoded.id);
        if (!user) return res.status(404).json({ message: "ユーザが存在しません" });

        const { resultId } = req.query;
        if (!resultId || typeof resultId !== "string") {
            return res.status(400).json({ message: "Invalid data" });
        }

        const result = await getResultById(resultId);

        if(!result){
            return res.status(404).json({ message: "結果が見つかりませんでした" });
        }

        const rankings = await getRankingsByIdAndMode(decoded.id, result.mode as ModeType);
        
        return res.status(200).json({
            message: "百ます計算の結果を取得しました",
            result: result,
            rankings: rankings
        });

    } catch (error) {
        console.error("結果取得処理中にエラー:", error);
        return res.status(500).json({ message: "結果取得中にエラーが発生しました" });
    }
}