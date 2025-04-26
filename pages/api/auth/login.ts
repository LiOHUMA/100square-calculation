// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserById } from "../../../lib/userService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userid, password } = req.body;

  if (!userid || !password) {
    return res
      .status(400)
      .json({ message: "useridとpasswordを送ってください" });
  }

  try {
    const userData = await getUserById(userid);

    if (!userData) {
      return res.status(401).json({ message: "ユーザーが存在しません" });
    }

    let isMatch: boolean = false;
    if (userData.hashFlg == 0) {
      isMatch = userData.password == password;
    } else {
      isMatch = await bcrypt.compare(password, userData.password); // 🔐 ハッシュと照合
    }

    if (!isMatch) {
      return res.status(401).json({ message: "パスワードが間違っています" });
    }

    const token = jwt.sign({ user: userData }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60,
      })
    );

    // 🔓 認証成功
    // セッションやJWTなどは省略（後で追加可）
    return res
      .status(200)
      .json({ message: "ログイン成功", user: { userid, name: userData.name } });
  } catch (error) {
    console.error("ログインエラー:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
