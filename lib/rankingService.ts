//  @package      lib/rankingService.ts
//  @description  ランキングライブラリ。
//                ランキングの情報取得、登録する機能。
//  @created      2025-05-18 by uma
//  @version      1.0.0
//  @lastModified 2025-05-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { db } from "./firebase";
import { doc, getDocs, setDoc, collection  } from "firebase/firestore";
import { Ranking, RankingOmit } from "../models/Ranking";

/**
 * 個人ランキングデータの取得
 * @param id scoresコレクションのドキュメントID
*/
export const getRankingsById  = async ( id: string ): Promise<RankingOmit[] | null> => {
  const ref = collection(db, "scores", id, "rankings");
  const snap = await getDocs(ref);

  return snap.docs.map(doc => {
    const data = doc.data();
    return {
      rank: doc.id,
      ...data,
      date: data.date.toDate(),
    } as RankingOmit;
  });
};

/**
 * 全ランキングデータの取得
*/
export const getAllUserRankings = async (): Promise<Ranking[]> => {
  const scoresCol = collection(db, "scores");
  const scoresSnap = await getDocs(scoresCol);

  const allRankings: Ranking[] = [];

  for (const userDoc of scoresSnap.docs) {
    const userId = userDoc.id;
    const rankingsCol = collection(db, "scores", userId, "rankings");
    const rankingsSnap = await getDocs(rankingsCol);

    rankingsSnap.forEach((doc) => {
      const data = doc.data();
      allRankings.push({
        id: userId,
        rank: doc.id,
        correctAnswers: data.correctAnswers,
        timeSpent: data.timeSpent,
        date: data.date.toDate(),
      });
    });
  }

  return allRankings;
};

/**
 * ランキングデータを保存・更新
 * @param ranking 登録対象
*/
export const saveRanking = async (ranking: Ranking) => {
  const {id, rank, ...rankingRegist} = ranking
  const ref = doc(db, "scores", id, "rankings", rank);
  await setDoc(ref, {
    ...rankingRegist
  });
};
