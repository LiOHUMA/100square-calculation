//  @package      pages/user/setting.tsx
//  @description  ニックネーム、パスワードの変更選択画面。
//                変更したいニックネーム、パスワードを選択する画面。
//  @created      2025-07-18 by uma
//  @version      1.0.0
//  @lastModified 2025-07-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";

export default function Settings() {
    const router = useRouter();

    const handleChangeNickname = () => {
        router.push("/user/settings/nickname");
    };
  
    const handleChangePassword = () => {
        router.push("/user/settings/password");
    };
  
    const handleBackToMenu = () => {
        router.push("/menu");
    };

    return (
        <AuthGuard>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-white p-6 flex flex-col items-center"
            >
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">👤 ユーザ設定</h1>
                <p className="text-gray-600 mb-6 text-center text-sm">ニックネーム、パスワードの変更ができます</p>
                <div className="flex flex-col gap-4 w-full max-w-md">
                    <Button
                        type="button"
                        color="gamesetting"
                        onClick={handleChangeNickname}
                    >
                        ✏️ ニックネームの変更
                    </Button>
                    <Button
                        type="button"
                        color="gamesetting"
                        onClick={handleChangePassword}
                    >
                        🔐 パスワードの変更
                    </Button>
                    <Button
                        type="button"
                        color="back"
                        onClick={handleBackToMenu}
                    >
                        メニューへ戻る
                    </Button>
                </div>
            </motion.div>
        </AuthGuard>
    );
}