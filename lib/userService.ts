import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export const getUserById = async (userid: string): Promise<User | null> => {
  const ref = doc(db, "users", userid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as User;
};

// 新規ユーザーを保存
export const createUser = async (user: User) => {
  const hashedPassword = await bcrypt.hash(user.password, 10); // 🔐 パスワードをハッシュ化
  const ref = doc(db, "users", user.userid);
  await setDoc(ref, {
    ...user,
    password: hashedPassword,
    hashFlg: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};