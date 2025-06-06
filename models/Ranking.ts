//  @package      models/Ranking.ts
//  @description  ランキング。
//                ランキングの必要な情報。
//  @created      2025-05-18 by uma
//  @version      1.0.0
//  @lastModified 2025-05-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { RankingType } from "../lib/constants/ranking";

export interface Ranking {
  id: string;
  correctAnswers: number;
  timeSpent: number;
  date: Date;
}

export interface RankingWithMode {
  rank: string;
  correctAnswers: number;
  timeSpent: number;
  date: Date;
  mode: RankingType;
}

export interface RankingWithModeWithName {
  name: string;
  rank: string;
  correctAnswers: number;
  timeSpent: number;
  date: Date;
  mode: RankingType;
}