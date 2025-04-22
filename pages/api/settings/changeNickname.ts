import type { NextApiRequest, NextApiResponse } from "next";
import { getUserById, changeNickname } from "../../../lib/userService"
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { user, name } = req.body;

  if (!user.id || !name) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const userData = await getUserById(user.id);

    if (!userData) {
      return res.status(401).json({ message: "ユーザーが存在しません" });
    }

    let isMatch: boolean = false;
    isMatch = (user.name == userData.name);
    
    if (!isMatch) {
      return res.status(401).json({ message: "ニックネームが既に変更されています" });
    }

    await changeNickname(user, name);
    
    const newUserData = await getUserById(user.id);

    const newToken = jwt.sign({ user: newUserData }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    
    res.setHeader("Set-Cookie", serialize("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    }));

    return res.status(200).json({ message: "ニックネームを変更しました" });

  } catch (error) {
    console.error("Nickname change error:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
