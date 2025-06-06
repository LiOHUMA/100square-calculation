//  @package      lib/calcSetting.ts
//  @description  百ます計算設定ライブラリ。
//                百ます計算設定情報取得、登録する機能。
//  @created      2025-06-06 by uma
//  @version      1.0.0
//  @lastModified 2025-06-06 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, Timestamp, collection, getDocs, writeBatch  } from "firebase/firestore";
import { User, UserRegister, UserChanger, UpdateData } from "../models/User";
import bcrypt from "bcryptjs";
import { ModeType } from "./constants/calc";
import { GridSetting, SettingMap, SettingValue } from "../models/CalcSetting";

/**
 * 百ます計算設定情報の取得
 * @param mode モード
*/
export const getCalcSettingDataByMode = async (mode: ModeType): Promise<GridSetting> => {
  const rowRef = doc(db, "settings", "mode", mode, "row");
  const colRef = doc(db, "settings", "mode", mode, "column");

  const rowSnap = await getDoc(rowRef);
  const colSnap = await getDoc(colRef);

  const row: SettingMap = {};
  const col: SettingMap = {};

  if (rowSnap.exists()) {
    const rowData = rowSnap.data();
    for (const key in rowData) {
      row[key] = { value: rowData[key] };
    }
  }

  if (colSnap.exists()) {
    const colData = colSnap.data();
    for (const key in colData) {
      col[key] = { value: colData[key] };
    }
  }

  return { row, col };
};

/**
 * 百ます計算設定情報の保存・更新
 * @param calcSetting 登録対象
 * @param mode モード
*/
export const saveCalcSettingData = async (calcSetting: GridSetting, mode: ModeType) => {
  const batch = writeBatch(db);

  const rowRef = doc(db, "settings", "mode", mode, "row");
  const colRef = doc(db, "settings", "mode", mode, "column");

  const rowData = Object.fromEntries(
    Object.entries(calcSetting.row).map(([k, v]) => [k, v.value])
  );
  const colData = Object.fromEntries(
    Object.entries(calcSetting.col).map(([k, v]) => [k, v.value])
  );

  batch.set(rowRef, rowData);
  batch.set(colRef, colData);

  await batch.commit();
};