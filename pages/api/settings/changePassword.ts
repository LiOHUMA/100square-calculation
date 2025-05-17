//  @package      pages/api/settings/changePassword.ts
//  @description  パスワードの変更機能。
//                入力した新しいパスワードに変更をする。
//  @created      2025-05-17 by uma
//  @version      1.0.0
//  @lastModified 2025-05-17 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import type { NextApiRequest, NextApiResponse } from "next";
import { getUserById, changePassword } from "../../../lib/userService";
import bcrypt from "bcryptjs";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { bfPw ,afPw } = req.body;

  if (!bfPw || !afPw) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "認証されていません" });

    const decoded = verify(token, JWT_SECRET) as { id: string };

    const userData = await getUserById(decoded.id);

    if (!userData) {
      return res.status(401).json({ message: "ユーザーが存在しません" });
    }

    let isMatch: boolean = false;
    if (userData.hashFlg == 0) {
      isMatch = userData.password == bfPw;
    } else {
      isMatch = await bcrypt.compare(bfPw, userData.password); // 🔐 ハッシュと照合
    }

    if (!isMatch) {
      return res.status(401).json({ message: "パスワードが更新されています" });
    }

    await changePassword(userData.id, afPw);
    
    return res.status(200).json({ message: "パスワードを変更しました" });

  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
