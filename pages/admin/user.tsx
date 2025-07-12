//  @package      pages/admin/user.tsx
//  @description  ユーザ管理画面。
//                ユーザ作成、変更の選択画面。
//  @created      2025-06-26 by uma
//  @version      1.0.0
//  @lastModified 2025-06-26 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
import "../../styles/globals.css";
import { motion } from "framer-motion";

export default function UserSettings() {
    const [err, setErr] = useState("");
    const router = useRouter();

    const handleCreateUser = () => {
        router.push("/admin/settings/createUser");
    };

    const handleUpdateUser = () => {
        router.push("/admin/settings/updateUser");
    };

    const handleDeleteUser = () => {
        router.push("/admin/settings/deleteUser");
    };

    const handleBackToMenu = () => {
        router.push("/menu");
    };

    useEffect(() => {
        if (router.query.session === "getUserFaild"){
          setErr("対象ユーザの取得に失敗しました。")
        }
    }, [router.query.session]);

    return (
        <AuthGuard>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
            >
                <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">🛠️ ユーザ管理</h1>
                <div className="flex flex-col gap-4 w-full max-w-md">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateUser}
                    className="bg-indigo-500 text-white py-3 px-5 rounded-2xl shadow-md hover:bg-indigo-600 transition font-semibold text-lg"
                >
                    ➕ 新規作成
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdateUser}
                    className="bg-indigo-500 text-white py-3 px-5 rounded-2xl shadow-md hover:bg-indigo-600 transition font-semibold text-lg"
                >
                    🔧 ユーザ情報変更
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteUser}
                    className="bg-red-500 text-white py-3 px-5 rounded-2xl shadow-md hover:bg-red-600 transition font-semibold text-lg"
                >
                    ❌ ユーザ削除
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToMenu}
                    className="bg-gray-400 text-white py-3 px-5 rounded-2xl shadow-md hover:bg-gray-500 transition font-semibold text-lg"
                >
                    🔙 メニューへ戻る
                </motion.button>
                </div>
                {err && <p className="mt-6 text-red-600 font-semibold">⚠️ {err}</p>}
            </motion.div>
        </AuthGuard>
    );
}