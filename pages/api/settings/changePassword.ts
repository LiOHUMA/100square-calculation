//  @package      pages/api/settings/changePassword.ts
//  @description  パスワードの変更機能。
//                入力した新しいパスワードに変更をする。
//  @created      2025-04-27 by uma
//  @version      1.0.0
//  @lastModified 2025-04-27 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import type { NextApiRequest, NextApiResponse } from "next";
import { getUserById, changePassword } from "../../../lib/userService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { user, bfPw ,afPw } = req.body;

  if (!user || !bfPw || !afPw) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const userData = await getUserById(user.id);

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
      return res.status(401).json({ message: "パスワードが間違っています" });
    }

    await changePassword(user, afPw);
    
    const newUserData = await getUserById(user.id);

    const newToken = jwt.sign({ user: newUserData }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    
    res.setHeader("Set-Cookie", serialize("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    }));

    return res.status(200).json({ message: "パスワードを変更しました" });

  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
