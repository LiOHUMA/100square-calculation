//  @package      pages/menu.tsx
//  @description  メニュー画面。
//                各画面に遷移するための画面。
//  @created      2025-06-26 by uma
//  @version      1.0.0
//  @lastModified 2025-06-26 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../models/User";
import AuthGuard from "../components/AuthGuard";
import "../styles/globals.css";
import { motion } from "framer-motion";

export default function Menu() {
  const [userOmit, setUserOmit] = useState<UserOmit | null>(null);
  const [err, setErr] = useState("");
  const router = useRouter();

  const handleUserManage = () => {
    router.push("/admin/user");
  };

  const handleScoreManage = () => {
    router.push("/admin/allRanking");
  };

  const handleCalculation = () => {
    router.push("/calc/select");
  };

  const handleRanking = () => {
    router.push("/ranking");
  };

  const handleSetting = () => {
    router.push("/user/setting");
  };

  const handleGameSetting = () => {
    router.push("/calc/settingSelect");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  useEffect(() => {
    if (router.query.session === "getRankingFaild"){
      setErr("ランキングの取得に失敗しました。")
    }
  }, [router.query.session]);

  return (
    <AuthGuard onAuthSuccess={setUserOmit}>
      {userOmit ? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-green-700 flex items-center gap-2"><span>🏠</span> メニュー画面</h1>
        <p className="text-xl mb-6">
          ようこそ、<span className="font-semibold">{userOmit.name}</span>さん！
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md w-full justify-center">

          {[0].includes(userOmit.role) && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUserManage}
                className="bg-blue-600 text-white py-3 px-5 rounded-xl shadow hover:bg-blue-700 transition"
              >
                ユーザ管理
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScoreManage}
                className="bg-blue-600 text-white py-3 px-5 rounded-xl shadow hover:bg-blue-700 transition"
              >
                成績管理
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCalculation}
            className="bg-green-600 text-white py-3 px-5 rounded-xl shadow hover:bg-green-700 transition"
          >
            百ます計算
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRanking}
            className="bg-green-600 text-white py-3 px-5 rounded-xl shadow hover:bg-green-700 transition"
          >
            ランキング
          </motion.button>


          {[0, 1].includes(userOmit.role) && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSetting}
                className={`bg-yellow-500 text-white py-3 px-5 rounded-xl shadow hover:bg-yellow-600 transition ${
                  [0].includes(userOmit.role) ? 'w-full' : 'col-span-2'
                }`}
              >
                ユーザ設定
              </motion.button>
          
          

              {[0].includes(userOmit.role) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGameSetting}
                  className="bg-yellow-500 text-white py-3 px-5 rounded-xl shadow hover:bg-yellow-600 transition"
                >
                  百ます計算設定
                </motion.button>
              )}
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="col-span-2 bg-red-500 text-white py-3 px-5 rounded-xl shadow hover:bg-red-600 transition w-full"
          >
            ログアウト
          </motion.button>
        </div>

        {err && <p className="mt-6 text-red-600 font-semibold flex items-center justify-center">⚠️ {err}</p>}
      </motion.div>
      ) : (
        <p className="text-center mt-20 text-gray-500">🔄認証中...</p>
      )}
    </AuthGuard>
  );
}
