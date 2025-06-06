//  @package      models/CalcSetting.ts
//  @description  百ます計算設定情報。
//                百ます計算設定情報の必要な情報。
//  @created      2025-06-04 by uma
//  @version      1.0.0
//  @lastModified 2025-06-04 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


export interface SettingValue {
  value: number;
}

export type SettingMap = Record<string, SettingValue>;

export interface GridSetting {
  row: SettingMap;
  col: SettingMap;
}
