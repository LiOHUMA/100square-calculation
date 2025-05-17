//  @package      pages/api/settings/changeNickname.ts
//  @description  ニックネームの変更機能。
//                入力した新しいニックネームに変更をする。
//  @created      2025-05-14 by uma
//  @version      1.0.0
//  @lastModified 2025-05-14 by uma

// 変更履歴
// ver 1.0.0 - 新規作成
// ver 1.0.1 - パスワード変更機能作成に伴い一部見直し


import type { NextApiRequest, NextApiResponse } from "next";
import { changeNickname } from "../../../lib/userService";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "認証されていません" });

    const decoded = verify(token, JWT_SECRET) as { id: string };

    await changeNickname(decoded.id, name);
    
    return res.status(200).json({ message: "ニックネームを変更しました" });

  } catch (error) {
    console.error("Nickname change error:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
