//  @package      pages/api/settings/getCalcSetting.ts
//  @description  百ます計算の設定取得機能。
//                現在設定されている百ます計算の設定情報を取得する。
//  @created      2025-06-06 by uma
//  @version      1.0.1
//  @lastModified 2025-09-29 by uma

// 変更履歴
// ver 1.0.0 - 新規作成
// ver 1.0.1 - アクセス可能なユーザ権限の見直し（ゲームから遷移することで使用していたため）


import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from "jsonwebtoken";
import { getUserById } from "../../../lib/userService";
import { getCalcSettingDataByMode } from '../../../lib/calcSetting';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { id: string };

        const user = await getUserById(decoded.id);
        if (!user) return res.status(404).json({ message: "ユーザが存在しません" });

        const { mode } = req.body;
        if (!mode) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const calcSetting = await getCalcSettingDataByMode(mode);
        if (!calcSetting) return res.status(404).json({ message: "設定データが存在しません" });
    
        return res.status(200).json({ calcSetting: calcSetting });

    } catch (error) {
        console.error("設定データ取得エラー:", error);
        return res.status(500).json({ message: "設定データ取得失敗" });
    }
}