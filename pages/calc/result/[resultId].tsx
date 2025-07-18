//  @package      pages/calc/result/[resultId].tsx
//  @description  百ます計算の結果表示画面。
//                百ます計算結果の情報を表示する。
//  @created      2025-07-12 by uma
//  @version      1.0.0
//  @lastModified 2025-07-12 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Result } from "../../../models/Result";
import { MODE_LABELS, MODE_SYMBOL } from "../../../lib/constants/calc";
import { RankingWithMode } from "../../../models/Ranking";
import AuthGuard from "../../../components/AuthGuard";
import { motion } from "framer-motion";
import "../../../styles/globals.css";
import Button from "../../../components/ui/Button";


export default function ResultPage() {
  const router = useRouter();
  const { resultId } = router.query;
  const [result, setResult] = useState<Result | null>(null);
  const [rankings, setRankings] = useState<RankingWithMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if(!resultId || typeof resultId !== "string") return;

    const loadResult = async() => {
      try{
        const res = await fetch(`/api/results/${resultId}`);
        
        const data = await res.json();

        if (res.ok) {
          setResult(data.result);  
          setRankings(data.rankings);        
        }else{
          setError(data.message || "取得に失敗しました。");
        }
      }catch(err){
        console.error("結果取得エラー：", err);
        setError("結果の取得中にエラーが発生しました。");
      }finally{
        setLoading(false);
      }
    };

    loadResult();
  }, [resultId]);

  const handleModeSelect = (mode: string) => {
    router.push(`/calc/play?mode=${mode}`);
  };

  const handleCalculation = () => {
    router.push("/calc/select");
  };

  const handleBackToMenu = () => {
    router.push("/menu");
  };
  
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;
  if (!result) return null;

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center"
      >

      <h1 className="text-3xl font-bold text-center text-red-600 mb-4">
        🎉 {MODE_LABELS[result.mode]} の結果発表 🎉
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-sm items-center mb-8">
        <p>
          <strong>正解数：{result.correctAnswers} / 100</strong>
        </p>
        <p>
          <strong>経過時間：{result.timeSpent} 秒</strong>
        </p>
        {result.rank !== 0 && 
          <p>
            <strong>🏅 {result.rank} 位にランクインしました！ 🏅</strong>
          </p>
        }
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        📝 回答結果
      </h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow table-fixed mb-8">
        <thead>
          <tr className="bg-blue-100 text-gray-800 text-lg border-b border-gray-400">
            <th className="text-4xl font-bold text-center text-gray-700 border-r border-gray-400">
              <strong>{MODE_SYMBOL[result.mode]}</strong>
            </th>
            {result.colList.map((col, idx) => (
              <th key={idx} className="py-2 px-4 text-center border-r border-gray-400">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400">
          {result.rowList.map((row, rowIdx) => (
            <motion.tr
              key={rowIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIdx * 0.05 }}
            >
              <th className="bg-blue-100 text-gray-800 text-lg border-r border-gray-400">{row}</th>
              {result.colList.map((col, colIdx) => {
                const answer = result.answers[rowIdx][colIdx];
                let userAnswerDisplay = "";
                let expected;
                let isCorrect = false;
                let expectedDisplay = "";
                const isEmpty = answer === null || answer === undefined || answer === "";

                switch (result.mode) {
                  case "addition":
                    expected = col + row;
                    userAnswerDisplay = answer;
                    isCorrect = !isEmpty && Number(answer) === expected;
                    expectedDisplay = (row + col).toString();
                    break;
                  case "subtraction":
                    expected = col - row;
                    userAnswerDisplay = answer;
                    isCorrect = !isEmpty && Number(answer) === expected;
                    expectedDisplay = (row - col).toString();
                    break;
                  case "multiplication":
                    expected = col * row;
                    userAnswerDisplay = answer;
                    isCorrect = !isEmpty && Number(answer) === expected;
                    expectedDisplay = (row * col).toString();
                    break;
                  case "division":
                    if (row === 0) {
                      userAnswerDisplay = "-";
                      isCorrect = true;
                      expectedDisplay = "-";
                    } else {
                      const quotient = Math.floor(col / row);
                      const remainder = col % row;
                      const uq = answer?.quotient ?? "未入力";
                      const ur = answer?.remainder ?? "未入力";
                      userAnswerDisplay = `${uq} あまり ${ur}`;
                      const isEmptyDiv = uq === null || uq === undefined || uq === "" || ur === null || ur === undefined || ur === "";
                      isCorrect = !isEmptyDiv && uq == quotient && ur == remainder;
                      expectedDisplay = `${Math.floor(col / row)} あまり ${col % row}`;
                    }
                    break;
                }

                return (
                  <td
                    key={colIdx}
                    className="py-2 px-4 text-center border-r border-gray-400"
                    style={{ backgroundColor: isCorrect ? "#d4f5d4" : "#f9d1d1" }}
                  >
                    <div>
                      <div><p>自分の答え:</p> <strong>{userAnswerDisplay ?? "未入力"}</strong></div>
                      <div><p>正解:</p> <em>{expectedDisplay}</em></div>
                      <div style={{ fontWeight: "bold", color: isCorrect ? "green" : "red" }}>
                        {isCorrect ? "⭕ よくできました！" : "❌ がんばろう！"}
                      </div>
                    </div>
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        現在のランキング 🏅
      </h2>
      <ol>
        <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow table-fixed mb-8">
          <thead>
            <tr className="bg-gray-200 text-gray-800 text-lg">
              <th className="py-2 px-4 text-center border-r border-gray-300">ランク</th>
              <th className="py-2 px-4 text-center border-r border-gray-300">正解数</th>
              <th className="py-2 px-4 text-center border-r border-gray-300">時間（秒）</th>
              <th className="py-2 px-4 text-center border-r border-gray-300">日付</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rankings.map((r) => (
              <motion.tr
                key={`${r.mode}-${r.rank}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <td className="py-2 px-4 text-center border-r">{r.rank === "1" ? "🥇" : r.rank === "2" ? "🥈" : r.rank === "3" ? "🥉" : r.rank}</td>
                <td className="py-2 px-4 text-center border-r">{r.correctAnswers}</td>
                <td className="py-2 px-4 text-center border-r">{r.timeSpent}</td>
                <td className="py-2 px-4 text-center border-r">
                  {new Date(r.date).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </ol>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button
          type="button"
          color="game"
          onClick={() => handleModeSelect(result.mode)}
        >
          🔁 もう一度チャレンジ！
        </Button>
        <Button
          type="button"
          color="primary"
          onClick={handleCalculation}
        >
          🎮 モード選択にもどる
        </Button>
        <Button
          type="button"
          color="back"
          onClick={handleBackToMenu}
        >
          🏠 メニューにもどる
        </Button>
      </div>
    </motion.div>
    </AuthGuard>
  );
}