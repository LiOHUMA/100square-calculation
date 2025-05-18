//  @package      pages/ranking.tsx
//  @description  ランキング画面。
//                個人のランキングを表示する画面。
//  @created      2025-05-18 by uma
//  @version      1.0.0
//  @lastModified 2025-05-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../components/AuthGuard";
import RankingTable from "../components/RankingTable";

export default function Ranking() {
  const router = useRouter();

  const handleBackToMenu = () => {
    router.push("/menu");
  };


  return (
    <AuthGuard>
      <div>
        <h1>ランキング</h1>
        <RankingTable></RankingTable>
        <button onClick={handleBackToMenu}>メニューへ戻る</button>
      </div>
    </AuthGuard>
  );
}
