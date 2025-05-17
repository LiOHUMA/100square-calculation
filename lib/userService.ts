//  @package      lib/userService.ts
//  @description  ユーザライブラリ。
//                ユーザの情報取得、登録する機能。
//  @created      2025-05-14 by uma
//  @version      1.0.0
//  @lastModified 2025-05-14 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, Timestamp  } from "firebase/firestore";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export const getUserById = async (id: string): Promise<User | null> => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as User;
};

// 新規ユーザーを保存
export const createUser = async (user: User) => {
  const hashedPassword = await bcrypt.hash(user.password, 10); // 🔐 パスワードをハッシュ化
  const {id, ...userRegist} = user
  await setDoc(doc(db, "users", id), {
    ...userRegist,
    password: hashedPassword,
    hashFlg: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    deleted: 0,
  });
};

// ニックネーム変更
export const changeNickname = async (id: string, trgNickname: string) => {
  const ref = doc(db, "users", id);
  await updateDoc(ref, {
    name: trgNickname,
    updatedAt: Timestamp.now(),
  });
}

// パスワード変更
export const changePassword = async (id: string, trgPassword: string) => {
  const hashedPassword = await bcrypt.hash(trgPassword, 10); // 🔐 パスワードをハッシュ化
  const ref = doc(db, "users", id);
  await updateDoc(ref, {
    password: hashedPassword,
    hashFlg: 1,
    updatedAt: Timestamp.now(),
  });
}