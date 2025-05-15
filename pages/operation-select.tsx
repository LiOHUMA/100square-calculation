// pages/operation-select.tsx
// @description 演算選択ページ
// @author Your <Name>Onimaru</Name>
// @description ユーザーが四則演算を選択するためのページです。
// @date 2025-05-14
// @version 1.0.0

import { useRouter } from "next/router";
import AuthGuard from "../components/AuthGuard";

export default function OperationSelect() {
  const router = useRouter();

  const handlecalc = (operation: string) => {
    router.push(`/calc?operation=${operation}`);
  };

  return (
    <AuthGuard>
      <div>
        <h1>四則演算を選択してください</h1>
        <button onClick={() => handlecalc("addition")}>加算 (+)</button>
        <button onClick={() => handlecalc("subtraction")}>減算 (-)</button>
        <button onClick={() => handlecalc("multiplication")}>乗算 (×)</button>
        <button onClick={() => handlecalc("division")}>除算 (÷)</button>
      </div>
    </AuthGuard>
  );
}
