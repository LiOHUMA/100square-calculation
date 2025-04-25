//  @package pages/calc.tsx
//  @description 百ます計算のページ
//  @author Your <Name>Onimaru</Name>
//  @description ユーザーが選択した演算に基づいて、10x10のグリッドを生成し、各セルに数値を表示します。
//  ユーザーは各セルに計算結果を入力することができます。
//
//  @date 2025-04-22
//  @version 1.0.0

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthGuard from "../components/AuthGuard";

export default function CalculationPage() {
  const [topNumbers, setTopNumbers] = useState<number[]>([]);
  const [sideNumbers, setSideNumbers] = useState<number[]>([]);
  const [operation, setOperation] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null); // 開始時間を記録
  const router = useRouter();

  useEffect(() => {
    const { operation } = router.query;
    if (!operation) {
      router.push("/operation-select"); // 演算が選択されていない場合は選択画面に戻る
      return;
    }
    setOperation(operation as string);

    const generateNumbers = () => {
      const numbers = Array.from(
        { length: 10 },
        () => Math.floor(Math.random() * 10) + 1
      );
      setTopNumbers(numbers);
      setSideNumbers(numbers);
    };
    generateNumbers();

    // 計算開始時間を記録
    setStartTime(Date.now());
  }, [router]);

  const handleShowResults = () => {
    const calculatedResults = sideNumbers.map((sideNum) =>
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

    // 経過時間を計算
    const elapsedTime = startTime ? (Date.now() - startTime) / 1000 : null;

    // 結果画面に遷移
    router.push({
      pathname: "/result",
      query: {
        results: JSON.stringify(calculatedResults),
        elapsedTime: elapsedTime?.toString(),
      },
    });
  };

  return (
    <AuthGuard>
      <div>
        <h1>百ます計算 {operation}</h1>
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
                {topNumbers.map((topNum, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="number"
                      placeholder="?"
                      style={{ width: "50px", textAlign: "center" }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleShowResults} style={{ marginTop: "20px" }}>
          結果画面に進む
        </button>
      </div>
    </AuthGuard>
  );
}
