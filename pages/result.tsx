// @description 結果表示ページ
// @author Your <Name>Onimaru</Name>
// @description ユーザーが計算結果を確認するためのページです。
// @date 2025-05-14
// @version 1.0.0

import { useEffect, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import router from "next/router";

export default function ResultPage() {
  const [userAnswers, setUserAnswers] = useState<number[][]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[][]>([]);
  const [topNumbers, setTopNumbers] = useState<number[]>([]);
  const [sideNumbers, setSideNumbers] = useState<number[]>([]);
  // const [operation, setOperation] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const totalCount = 100;

  useEffect(() => {
    // ローカルストレージからデータを取得
    const userAnswers = JSON.parse(localStorage.getItem("userAnswers") || "[]");
    const correctAnswers = JSON.parse(
      localStorage.getItem("correctAnswers") || "[]"
    );
    const topNumbers = JSON.parse(localStorage.getItem("topNumbers") || "[]");
    const sideNumbers = JSON.parse(localStorage.getItem("sideNumbers") || "[]");
    // const operation = localStorage.getItem("operation") || "";
    const elapsedTime = localStorage.getItem("elapsedTime");

    setUserAnswers(userAnswers);
    setCorrectAnswers(correctAnswers);
    setTopNumbers(topNumbers);
    setSideNumbers(sideNumbers);
    // setOperation(operation);
    setElapsedTime(elapsedTime ? Number(elapsedTime) : null);
  }, []);

  // 正答数を計算（分母は常に100）
  let correctCount = 0;
  userAnswers.forEach((row, rowIndex) => {
    row.forEach((ans, colIndex) => {
      if (ans === correctAnswers[rowIndex][colIndex]) {
        correctCount++;
      }
    });
  });

  return (
    <AuthGuard>
      <div>
        <h1>計算結果</h1>
        <div style={{ marginBottom: "16px" }}>
          <span>
            正答数: {correctCount} / {totalCount}
          </span>
          <br />
          <span>
            計算時間: {elapsedTime !== null ? `${elapsedTime} 秒` : "未計測"}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
              {topNumbers.map((num, index) => (
                <th key={index}>{num}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sideNumbers.map((sideNum, rowIndex) => (
              <tr key={rowIndex}>
                <td>{sideNum}</td>
                {topNumbers.map((_, colIndex) => (
                  <td key={colIndex} style={{ textAlign: "center" }}>
                    <div>
                      <span>答え {correctAnswers[rowIndex][colIndex]}</span>
                      <br />
                      <span>
                        回答:{" "}
                        {userAnswers[rowIndex][colIndex] !== null
                          ? userAnswers[rowIndex][colIndex]
                          : "未入力"}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          style={{ marginTop: "20px" }}
          onClick={() => router.push("/menu")}
        >
          メニューに戻る
        </button>
      </div>
    </AuthGuard>
  );
}
