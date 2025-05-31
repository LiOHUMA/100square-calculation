//  @package      lib/rankingService.ts
//  @description  ランキングライブラリ。
//                ランキングの情報取得、登録する機能。
//  @created      2025-05-31 by uma
//  @version      1.0.0
//  @lastModified 2025-05-31 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { db } from "./firebase";
import { doc, getDocs, setDoc, collection, getDoc  } from "firebase/firestore";
import { RankingWithMode, RankingWithModeWithName } from "../models/Ranking";
import { RANKING_SUB_COLLECTIONS } from "./constants/ranking";

/**
 * 個人ランキングデータの取得
 * @param id ユーザid
*/
export const getRankingsById  = async ( id: string ): Promise<RankingWithMode[] | null> => {
  const rankings: RankingWithMode[] = [];
  for(const mode of RANKING_SUB_COLLECTIONS){
    const ref = collection(db, "scores", id, mode);
    const snap = await getDocs(ref);

    snap.docs.map(doc => {
      const data = doc.data();
      rankings.push({
        rank: doc.id,
        correctAnswers: data.correctAnswers,
        timeSpent: data.timeSpent,
        date: data.date.toDate(),
        mode: mode
      })
    });
  }
  return rankings;
};

/**
 * 全ランキングデータの取得
*/
export const getAllUserRankings = async (): Promise<RankingWithModeWithName[]> => {
  const scoresCol = collection(db, "scores");
  const scoresSnap = await getDocs(scoresCol);

  const allRankings: RankingWithModeWithName[] = [];

  for (const userDoc of scoresSnap.docs) {
    const userId = userDoc.id;

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if(!userSnap.exists() || userSnap.data().deleted === 1){
      continue;
    }

    const nickname = userSnap.data().name || "名無し";

    for(const mode of RANKING_SUB_COLLECTIONS){
      const rankingsCol = collection(db, "scores", userId, mode);
      const rankingsSnap = await getDocs(rankingsCol);

      rankingsSnap.forEach((doc) => {
        const data = doc.data();
        allRankings.push({
          name: nickname,
          rank: doc.id,
          correctAnswers: data.correctAnswers,
          timeSpent: data.timeSpent,
          date: data.date.toDate(),
          mode: mode
        });
      });
    }
  }

  return allRankings;
};

/**
 * ランキングデータを保存・更新
 * @param ranking 登録対象
 * @param id ユーザid
*/
export const saveRanking = async (ranking: RankingWithMode, id: string) => {
  const {rank, mode , ...rankingRegist} = ranking
  const ref = doc(db, "scores", id, mode, rank);
  await setDoc(ref, {
    ...rankingRegist
  });
};
