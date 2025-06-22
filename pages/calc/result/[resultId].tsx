//  @package      pages/calc/result/[resultId].tsx
//  @description  百ます計算の結果表示画面。
//                百ます計算結果の情報を表示する。
//  @created      2025-06-22 by uma
//  @version      1.0.0
//  @lastModified 2025-06-22 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Result } from "../../../models/Result";
import { getResultById } from "../../../lib/resultService";
import { MODE_LABELS } from "../../../lib/constants/calc";
import { RANKING_LABELS } from "../../../lib/constants/ranking";


export default function ResultPage() {
  const router = useRouter();
  const { resultId } = router.query;
  const [result, setResult] = useState<Result | null>(null);
  const [rankings, setRankings] = useState<any[]>([]);
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

  const handleGameSetting = () => {
    router.push("/calc/settingSelect");
  };

  const handleBackToMenu = () => {
    router.push("/menu");
  };
  
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;
  if (!result) return null;

  return (
    <div>
      <h1>{MODE_LABELS[result.mode]} の結果</h1>
      <p>正解数：{result.correctAnswers} / 100</p>
      <p>経過時間：{result.timeSpent} 秒</p>
      {result.rank && <p>{result.rank} 位にランクインしました！</p>}

      <h2>問題結果</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {result.colList.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rowList.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <th>{row}</th>
              {result.colList.map((col, colIdx) => {
                const answer = result.answers[rowIdx][colIdx];
                let userAnswerDisplay = "";
                let expected;
                let isCorrect = false;
                let expectedDisplay = "";
                const isEmpty = answer === null || answer === undefined || answer === "";

                switch (result.mode) {
                  case "addition":
                    expected = row + col;
                    userAnswerDisplay = answer;
                    isCorrect = !isEmpty && Number(answer) === expected;
                    expectedDisplay = (row + col).toString();
                    break;
                  case "subtraction":
                    expected = row - col;
                    userAnswerDisplay = answer;
                    isCorrect = !isEmpty && Number(answer) === expected;
                    expectedDisplay = (row - col).toString();
                    break;
                  case "multiplication":
                    expected = row * col;
                    userAnswerDisplay = answer;
                    isCorrect = !isEmpty && Number(answer) === expected;
                    expectedDisplay = (row * col).toString();
                    break;
                  case "division":
                    if (col === 0) {
                      userAnswerDisplay = "-";
                      isCorrect = true;
                      expectedDisplay = "-";
                    } else {
                      const quotient = Math.floor(row / col);
                      const remainder = row % col;
                      const uq = answer?.quotient;
                      const ur = answer?.remainder;
                      userAnswerDisplay = `${uq} あまり ${ur}`;
                      const isEmptyDiv = uq === null || uq === undefined || uq === "" || ur === null || ur === undefined || ur === "";
                      isCorrect = !isEmptyDiv && uq == quotient && ur == remainder;
                      expectedDisplay = `${Math.floor(row / col)} あまり ${row % col}`;
                    }
                    break;
                }

                return (
                  <td
                    key={colIdx}
                    style={{ backgroundColor: isCorrect ? "#d4f5d4" : "#f9d1d1" }}
                  >
                    <div>
                      <div>自分の答え: <strong>{userAnswerDisplay ?? "未入力"}</strong></div>
                      <div>正解: <em>{expectedDisplay}</em></div>
                      <div style={{ fontWeight: "bold", color: isCorrect ? "green" : "red" }}>
                        {isCorrect ? "○" : "×"}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>現在のランキング</h2>
      <ol>
        <table>
          <thead>
            <tr>
              <th>ランク</th>
              <th>正解数</th>
              <th>時間（秒）</th>
              <th>日付</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((r) => (
              <tr key={`${r.mode}-${r.rank}`}>
                <td>{r.rank}</td>
                <td>{r.correctAnswers}</td>
                <td>{r.timeSpent}</td>
                <td>{new Date(r.date).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ol>
      <button onClick={() => handleModeSelect(result.mode)}>もう一度挑戦する</button>
      <button onClick={handleGameSetting}>モード選択へ戻る</button>
      <button onClick={handleBackToMenu}>メニューへ戻る</button>
    </div>
  );
}