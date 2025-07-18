//  @package      pages/ranking.tsx
//  @description  ランキング画面。
//                個人のランキングを表示する画面。
//  @created      2025-07-12 by uma
//  @version      1.0.0
//  @lastModified 2025-07-12 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../components/AuthGuard";
import RankingTable from "../components/RankingTable";
import "../styles/globals.css";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

export default function Ranking() {
  const router = useRouter();

  const handleBackToMenu = () => {
    router.push("/menu");
  };


  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 flex flex-col items-center p-8"
      >
        <h1 className="text-5xl font-extrabold text-pink-600 mb-6 text-center drop-shadow-md">🏆 ランキング</h1>
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mb-8">
          <RankingTable />
        </div>
        <div className="w-full max-w-md">
          <Button
            type="button"
            color="back"
            onClick={handleBackToMenu}
          >
            🏠 メニューへ戻る
          </Button>
        </div>
      </motion.div>
    </AuthGuard>
  );
}
