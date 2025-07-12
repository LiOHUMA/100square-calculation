//  @package      pages/calc/done/setting.tsx
//  @description  百ます計算の設定完了画面。
//                百ます計算の設定をできたことを知らせる画面。
//  @created      2025-07-12 by uma
//  @version      1.0.0
//  @lastModified 2025-07-12 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../../components/AuthGuard";
import "../../../styles/globals.css";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";

export default function DoneSetting() {
    const router = useRouter();

    const handleBackToSetting = () => {
        router.push("/calc/settingSelect");
    };

    const handleBackToMenu = () => {
      router.push("/menu");
  };

    return (
        <AuthGuard>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center"
            >
                <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
                    ✅ 百ます計算の設定の変更が完了しました
                </h1>
                <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button
                    type="button"
                    color="gamesetting"
                    onClick={handleBackToSetting}
                >
                    ✏️ 百ます計算の設定へ戻る
                </Button>
                <Button
                    type = "button"
                    color = "back"
                    onClick={handleBackToMenu}
                >
                    🏠 メニューへ戻る
                </Button>
                </div>
            </motion.div>
        </AuthGuard>
    );
}