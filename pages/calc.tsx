//  @package pages/calc.tsx
//  @description 百ます計算のページ
//  @author Your <Name>Onimaru</Name>
//  @description ユーザーが選択した演算に基づいて、10x10のグリッドを生成し、各セルに数値を表示します。
//  ユーザーは各セルに計算結果を入力することができます。
//
//  @date 2025-05-14
//  @version 1.0.0

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthGuard from "../components/AuthGuard";
import * as util from "../utils/utilityFile";

export default function CalculationPage() {
  const [topNumbers, setTopNumbers] = useState<number[]>([]);
  const [sideNumbers, setSideNumbers] = useState<number[]>([]);
  const [operation, setOperation] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { operation } = router.query;
    if (!operation) {
      router.push("/operation-select"); // 演算が選択されていない場合は選択画面に戻る
      return;
    }
    setOperation(operation as string);

    // ランダムな数字を生成
    const generateNumbers = () => {
      const createRandomNumbers = () =>
        Array.from({ length: 10 }, () => Math.floor(Math.random() * 10) + 1);
      setTopNumbers(createRandomNumbers()); // 横の列
      setSideNumbers(createRandomNumbers()); // 縦の列
    };
    generateNumbers();
  }, [router]);

  const handleShowResults = () => {
    // ユーザーの入力を収集
    const userAnswers = sideNumbers.map((sideNum, rowIndex) =>
      topNumbers.map((topNum, colIndex) => {
        const inputElement = document.querySelector(
          `input[data-row="${rowIndex}"][data-col="${colIndex}"]`
        ) as HTMLInputElement;
        return inputElement && inputElement.value.trim() !== ""
          ? Number(inputElement.value)
          : null; // 未入力の場合は null を設定
      })
    );

    // 正しい答えを計算
    const correctAnswers = sideNumbers.map((sideNum) =>
      topNumbers.map((topNum) => {
        switch (operation) {
          case "addition":
            return sideNum + topNum;
          case "subtraction":
            return sideNum - topNum;
          case "multiplication":
            return sideNum * topNum;
          case "division":
            return topNum !== 0 ? parseFloat((sideNum / topNum).toFixed(2)) : 0;
          default:
            return 0;
        }
      })
    );

    // 必要なデータをローカルストレージに保存
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    localStorage.setItem("correctAnswers", JSON.stringify(correctAnswers));
    localStorage.setItem("topNumbers", JSON.stringify(topNumbers));
    localStorage.setItem("sideNumbers", JSON.stringify(sideNumbers));
    localStorage.setItem("operation", operation || "");
  };

  return (
    <AuthGuard>
      <div>
        <h1>百ます計算 {util.getOperationSymbol(operation)}</h1>
        <table>
          <thead>
            <tr>
              <th>{util.getOperationSymbol(operation)}</th>
              {topNumbers.map((num, index) => (
                <th key={index}>{num}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sideNumbers.map((sideNum, rowIndex) => (
              <tr key={rowIndex}>
                <td>{sideNum}</td>
                {topNumbers.map((topNum, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="number"
                      placeholder="?"
                      data-row={rowIndex}
                      data-col={colIndex}
                      style={{ width: "50px", textAlign: "center" }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => {
            handleShowResults(); // データを保存
            router.push("/result"); // 結果画面に進む
          }}
          style={{ marginTop: "20px" }}
        >
          結果画面に進む
        </button>
      </div>
    </AuthGuard>
  );
}
