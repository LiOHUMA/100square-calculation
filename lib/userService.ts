//  @package      lib/userService.ts
//  @description  ユーザライブラリ。
//                ユーザの情報取得、登録する機能。
//  @created      2025-05-26 by uma
//  @version      1.0.0
//  @lastModified 2025-05-26 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, Timestamp, collection, getDocs  } from "firebase/firestore";
import { User, UserRegister, UserChanger, UpdateData } from "../models/User";
import bcrypt from "bcryptjs";

export const getUserById = async (id: string): Promise<User | null> => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();

  if (data.deleted === 1) return null;

  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as User;
};

// 新規ユーザーを保存
export const createUser = async (userRegister: UserRegister) => {
  const {id, password, ...userRegist} = userRegister
  const hashedPassword = await bcrypt.hash(password, 10); // 🔐 パスワードをハッシュ化
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

/**
 * 全ユーザ取得
*/
export const getAllUserData = async (): Promise<UserChanger[]> => {
  const usersCol = collection(db, "users");
  const usersSnap = await getDocs(usersCol);

  const allUsers: UserChanger[] = [];

  usersSnap.forEach((doc) => {
    const data = doc.data();
    if(data.deleted !== 1){
      allUsers.push({
        id: doc.id,
        name: data.name,
        grade: data.grade,
        role: data.role
      });
    }
  });

  return allUsers;
}

/**
 * ユーザ情報更新
 */
export const updateUser = async (
  id: string,
  updateFields: {
    name?: string;
    grade?: number;
    role?: number;
    password?: string;
  },
  updateFlg: {
    nameFlg: boolean;
    gradeFlg: boolean;
    roleFlg: boolean;
    passwordFlg: boolean;
  }
) => {
  const ref = doc(db, "users", id);
  const updateData: Partial<UpdateData> = { updatedAt: Timestamp.now() };

  if (updateFlg.nameFlg) updateData.name = updateFields.name
  if (updateFlg.gradeFlg) updateData.grade = updateFields.grade
  if (updateFlg.roleFlg) updateData.role = updateFields.role

  if (updateFlg.passwordFlg && updateFields.password && updateFields.password.trim() !== "") {
    const hashedPassword = await bcrypt.hash(updateFields.password, 10);
    updateData.password = hashedPassword;
    updateData.hashFlg = 1;
  }

  await updateDoc(ref, updateData);
};

/**
 * ユーザ削除
 */
// パスワード変更
export const deleteUser = async (id: string) => {
  const ref = doc(db, "users", id);
  await updateDoc(ref, {
    deleted: 1,
    updatedAt: Timestamp.now()
  });
}
