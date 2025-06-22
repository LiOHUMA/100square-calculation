//  @package      models/Result.ts
//  @description  結果情報モデル
//                結果情報の必要な情報。
//  @created      2025-06-22 by uma
//  @version      1.0.0
//  @lastModified 2025-06-22 by uma

import { Timestamp } from "firebase/firestore";
import { ModeType } from "../lib/constants/calc";

// 変更履歴
// ver 1.0.0 - 新規作成


export interface Result {
  id: string;
  userId: string,
  correctAnswers: number;
  timeSpent: number;
  mode: ModeType;
  rowList: number[];
  colList: number[];
  answers: any[][];
  rank: number;
  createdAt: Date;
}

export interface ResultRegister {
  userId: string,
  correctAnswers: number;
  timeSpent: number;
  mode: ModeType;
  rowList: number[];
  colList: number[];
  answers: any[][];
  rank: number;
}
