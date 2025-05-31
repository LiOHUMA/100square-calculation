//  @package      lib/constants/ranking.ts
//  @description  ランキング用定数ライブラリ。
//                ランキング情報の定数を管理。
//  @created      2025-05-31 by uma
//  @version      1.0.0
//  @lastModified 2025-05-31 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


export const RANKING_SUB_COLLECTIONS = [
  "rankings_addition",
  "rankings_subtraction",
  "rankings_multiplication",
  "rankings_division"
] as const;

export type RankingType = typeof RANKING_SUB_COLLECTIONS[number];

export const RANKING_LABELS: Record<RankingType, string> = {
  rankings_addition: "足し算",
  rankings_subtraction: "引き算",
  rankings_multiplication: "かけ算",
  rankings_division: "わり算",
};