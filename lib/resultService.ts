//  @package      lib/resultService.ts
//  @description  結果ライブラリ。
//                結果の情報取得、登録する機能。
//  @created      2025-06-22 by uma
//  @version      1.0.0
//  @lastModified 2025-06-22 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, Timestamp, collection, getDocs, addDoc  } from "firebase/firestore";
import { User, UserRegister, UserChanger, UpdateData } from "../models/User";
import bcrypt from "bcryptjs";
import { Result, ResultRegister } from "../models/Result";

/**
 * 個人結果データの取得
 * @param id ドキュメントid
*/
export const getResultById = async (id: string)=> {
  const ref = doc(db, "results", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();

  const restoredAnswers = Array.from({ length: 10 }, () => Array(10).fill(""));
  data.flattenedAnswers.forEach((ans: {
    row: number;
    col: number;
    value?: string;
    quotient?: string;
    remainder?: string;
  }) => {
    if ('value' in ans) {
      restoredAnswers[ans.row][ans.col] = ans.value;
    } else {
      restoredAnswers[ans.row][ans.col] = {
        quotient: ans.quotient,
        remainder: ans.remainder
      };
    }
  });

  return {
    id: snap.id,
    ...data,
    answers: restoredAnswers,
    createdAt: data.createdAt.toDate()
  } as Result;
};

/**
 * 個人結果データの登録
 * @param resultRegister 登録用結果
*/
export const createResult = async (resultRegister: ResultRegister) => {

  const { answers, ...registFields } = resultRegister;

  const flattenedAnswers = answers.flatMap((row, rowIndex) =>
  row.map((cell, colIndex) => {
    if (typeof cell === "object") {
      return {
        row: rowIndex,
        col: colIndex,
        quotient: cell.quotient,
        remainder: cell.remainder,
      };
    }
    return {
      row: rowIndex,
      col: colIndex,
      value: cell,
    };
  })
);

  const docRef = await addDoc(collection(db, "results"), {
    ...registFields,
    flattenedAnswers: flattenedAnswers,
    createdAt: Timestamp.now()
  });

  return docRef;
};
