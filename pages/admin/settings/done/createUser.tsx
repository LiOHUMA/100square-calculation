//  @package      pages/admin/settings/done/createUser.tsx
//  @description  新規ユーザ作成完了画面。
//                新しいユーザを登録できたことを知らせる画面。
//  @created      2025-07-12 by uma
//  @version      1.0.0
//  @lastModified 2025-07-12 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../../../components/AuthGuard";
import { useEffect, useState } from "react";
import "../../../../styles/globals.css";
import { motion } from "framer-motion";
import Button from "../../../../components/ui/Button";

export default function DoneCreateUser() {
    const router = useRouter();
    const [name, setName] = useState("");

    useEffect(() => {
        const getName = sessionStorage.getItem("name");
        sessionStorage.removeItem("name");
        if(getName) {
            setName(JSON.parse(getName));
        }
    }, []);    

    const handleCreateUser = () => {
        router.push("/admin/settings/createUser");
    };

    const handleBackToSetting = () => {
        router.push("/admin/user");
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
                <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
                    ✅ 新しいユーザ「{name}」の登録が完了しました！
                </h1>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <Button
                        type="button"
                        color="continue"
                        onClick={handleCreateUser}
                    >
                        ✏️ 続けて登録する
                    </Button>
                    <Button
                        type="button"
                        color="primary"
                        onClick={handleBackToSetting}
                    >
                        🔧 ユーザ管理へ戻る
                    </Button>
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
