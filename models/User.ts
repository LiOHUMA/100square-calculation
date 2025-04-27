//  @package      models/User.ts
//  @description  ユーザ。
//                ユーザの必要な情報。
//  @created      2025-04-27 by uma
//  @version      1.0.0
//  @lastModified 2025-04-27 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


export interface User {
    id: string;
    userid: string;
    name: string;
    password: string;
    grade: number;
    role: number;
    hashFlg: number;
    createdAt: Date;
    updatedAt: Date;
  }