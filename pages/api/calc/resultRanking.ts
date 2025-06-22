//  @package      pages/api/calc/resultRanking.ts
//  @description  百ます計算結果表示機能。
//                百ます計算結果の情報を更新・表示する。
//  @created      2025-06-22 by uma
//  @version      1.0.0
//  @lastModified 2025-06-22 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from "jsonwebtoken"
import { getUserById } from "../../../lib/userService";
import { ModeType } from '../../../lib/constants/calc';
import { getRankingsByIdAndMode, saveRanking } from '../../../lib/rankingService';
import { MODE_TO_RANKING_MAP } from '../../../lib/constants/ranking';
import { createResult } from '../../../lib/resultService';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "認証されていません" });
    
        const decoded = verify(token, JWT_SECRET) as { id: string };

        const user = await getUserById(decoded.id);
        if (!user) return res.status(404).json({ message: "ユーザが存在しません" });

        const { answers, mode, rowList, colList, elapsed } = req.body;
        if (!answers || !mode || !rowList || !colList || !elapsed) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const result: boolean[][] = [];
        let correctCount = 0;

        for(let i = 0; i < rowList.length; i++){
            const row: boolean[] = [];
            
            for(let j = 0; j < colList.length; j++){
                const userAnswer = answers[i][j];
                let expected: number;

                switch(mode){
                    case "addition":
                        expected = rowList[i] + colList[j];
                        break;

                    case "subtraction":
                        expected = rowList[i] - colList[j];
                        break;

                    case "multiplication":
                        expected = rowList[i] * colList[j];
                        break;

                    case "division":
                        if(colList[j] === 0){
                            row.push(true);
                            continue;
                        }

                        const expectedQuotient = Math.floor(rowList[i] / colList[j])
                        const expectedRemainder = rowList[i] % colList[j];

                        const userQuotient = Array.isArray(userAnswer)? userAnswer[0]: null;
                        const userRemainder = Array.isArray(userAnswer)? userAnswer[1]: null;

                        const isCorrectDivision = userQuotient === expectedQuotient && userRemainder === expectedRemainder;

                        row.push(isCorrectDivision);
                        if(isCorrectDivision) correctCount++;
                        continue;

                    default:
                        expected = 0;
                }

                let isCorrect = false;

                if(
                    userAnswer === null ||
                    userAnswer === undefined ||
                    userAnswer === "" ||
                    (typeof userAnswer === "string" && userAnswer.trim() === "")
                ){
                    isCorrect = false;
                }else{
                    isCorrect = Number(userAnswer) === expected;
                }

                row.push(isCorrect);
                if(isCorrect) correctCount++;
            }
            result.push(row);
        }

        const newResult = {
            correctAnswers: correctCount,
            timeSpent: elapsed,
            date: new Date(),
            mode: MODE_TO_RANKING_MAP[mode as ModeType]
        }

        const prevRankings = await getRankingsByIdAndMode(decoded.id, mode) || [];

        const updatedRankings = [...prevRankings, newResult]
            .sort((a, b) => {
                if(b.correctAnswers !== a.correctAnswers){
                    return b.correctAnswers - a.correctAnswers;
                }
                return a.timeSpent - b.timeSpent;
            })
            .slice(0,3);
        
        for(let i = 0; i < updatedRankings.length; i++){
            await saveRanking({ ...updatedRankings[i], rank: `${i + 1}`}, decoded.id);
        }

        const resultDocRef = await createResult({
              userId: decoded.id,
              correctAnswers: correctCount,
              timeSpent: elapsed,
              mode: mode,
              rowList: rowList,
              colList: colList,
              answers: answers,
              rank: updatedRankings.findIndex(r =>
                r.correctAnswers === correctCount && r.timeSpent === elapsed
              ) + 1
        });
        
        return res.status(200).json({
            message: "百ます計算の結果を保存しました",
            resultId: resultDocRef.id
        });

    } catch (error) {
        console.error("結果保存処理中にエラー:", error);
        return res.status(500).json({ message: "結果保存中にエラーが発生しました" });
    }
}