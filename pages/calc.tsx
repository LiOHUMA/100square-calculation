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
  }, [router]);

  const getOperationSymbol = () => {
    switch (operation) {
      case "addition":
        return "+";
      case "subtraction":
        return "-";
      case "multiplication":
        return "×";
      case "division":
        return "÷";
      default:
        return "";
    }
  };

  return (
    <AuthGuard>
      <div>
        <h1>百ます計算 - {getOperationSymbol()}</h1>
        <table>
          <thead>
            <tr>
              <th>{getOperationSymbol()}</th>
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
        <button
          onClick={() => router.push("/result")}
          style={{ marginTop: "20px" }}
        >
          結果画面に進む
        </button>
      </div>
    </AuthGuard>
  );
}
