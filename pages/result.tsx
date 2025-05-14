// @description 結果表示ページ
// @author Your <Name>Onimaru</Name>
// @description ユーザーが計算結果を確認するためのページです。
// @date 2025-04-22
// @version 1.0.0

import { useRouter } from "next/router";
import AuthGuard from "../components/AuthGuard";

export default function ResultPage() {
  const router = useRouter();
  const { results, elapsedTime } = router.query;

  return (
    <AuthGuard>
      <div>
        <h1>計算結果</h1>
        {results ? (
          <table>
            <tbody>
              {JSON.parse(results as string).map(
                (row: number[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((result: number, colIndex: number) => (
                      <td
                        key={colIndex}
                        style={{ padding: "10px", textAlign: "center" }}
                      >
                        {result}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <p>結果がありません。</p>
        )}
        {elapsedTime && <p>計算時間: {elapsedTime} 秒</p>}
        <button
          onClick={() => router.push("/menu")}
          style={{ marginTop: "20px" }}
        >
          メニューに戻る
        </button>
      </div>
    </AuthGuard>
  );
}
