//  @package      models/User.ts
//  @description  ユーザ。
//                ユーザの必要な情報。
//  @created      2025-05-20 by uma
//  @version      1.0.0
//  @lastModified 2025-05-20 by uma

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