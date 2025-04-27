//  @package      pages/api/auth/logout.ts
//  @description  ログアウト機能。
//                ログアウトボタン押下後、Cookieの削除をする。
//  @created      2025-04-27 by uma
//  @version      1.0.0
//  @lastModified 2025-04-27 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    try {
        res.setHeader("Set-Cookie", serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 0,
        }));

        res.status(200).json({ message: "ログアウトしました" });
    } catch (error) {
        console.error("ログインエラー:", error);
        return res.status(500).json({ message: "サーバーエラー" });
    }
}