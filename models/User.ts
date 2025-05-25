//  @package      models/User.ts
//  @description  ユーザ。
//                ユーザの必要な情報。
//  @created      2025-05-25 by uma
//  @version      1.0.0
//  @lastModified 2025-05-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


export interface User {
  id: string;
  name: string;
  password: string;
  grade: number;
  role: number;
  hashFlg: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOmit {
  name: string;
  role: number;
}

export interface UserRegister {
  id: string;
  name: string;
  password: string;
  grade: number;
  role: number;
}

export interface UserUpdater {
  id: string;
  name: string;
  grade: number;
  role: number;
}