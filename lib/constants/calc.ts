//  @package      lib/constants/calc.ts
//  @description  百ます計算用定数ライブラリ。
//                百ます計算情報の定数を管理。
//  @created      2025-05-31 by uma
//  @version      1.0.0
//  @lastModified 2025-05-31 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


export const MODE_COLLECTIONS = [
  "addition",
  "subtraction",
  "multiplication",
  "division"
] as const;

export type ModeType = typeof MODE_COLLECTIONS[number];

export const MODE_LABELS: Record<ModeType, string> = {
  addition: "足し算",
  subtraction: "引き算",
  multiplication: "かけ算",
  division: "わり算",
};

export const MODE_SYMBOL: Record<ModeType, string> = {
  addition: "+",
  subtraction: "-",
  multiplication: "×",
  division: "÷",
};
