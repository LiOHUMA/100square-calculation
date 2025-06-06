//  @package      pages/api/settings/changeCalcSetting.ts
//  @description  百ます計算の設定更新機能。
//                百ます計算の設定情報を更新する。
//  @created      2025-06-06 by uma
//  @version      1.0.0
//  @lastModified 2025-06-06 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from "jsonwebtoken"
import { getUserById } from "../../../lib/userService";
import { saveCalcSettingData } from '../../../lib/calcSetting';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { id: string };

        const user = await getUserById(decoded.id);
        if (!user) return res.status(404).json({ message: "ユーザが存在しません" });

        if (user.role !== 0 ) return res.status(404).json({ message: "ユーザに権限がありません" });

        const { calcSetting, mode } = req.body;
        if (!calcSetting || !mode) {
            return res.status(400).json({ message: "Invalid data" });
        }

        await saveCalcSettingData(calcSetting, mode);
    
        return res.status(200).json({ message: "百ます計算の設定情報を更新しました" });

    } catch (error) {
        console.error("設定データ更新エラー:", error);
        return res.status(500).json({ message: "設定データ更新失敗" });
    }
}