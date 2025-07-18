//  @package      pages/user/settings/done/nickname.tsx
//  @description  ニックネーム変更完了画面。
//                新しいニックネームに変更できたことを知らせる画面。
//  @created      2025-05-20 by uma
//  @version      1.0.0
//  @lastModified 2025-05-20 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../../../../models/User";
import AuthGuard from "../../../../components/AuthGuard";
import Button from "../../../../components/ui/Button";
import "../../../../styles/globals.css";

export default function DoneNickname() {
    const router = useRouter();
    const [userOmit, setUserOmit] = useState<UserOmit | null>(null);

    const handleBackToSetting = () => {
        router.push("/user/setting");
    };

    const handleBackToMenu = () => {
      router.push("/menu");
  };

    return (
        <AuthGuard onAuthSuccess={setUserOmit}>
            {userOmit ? (
                <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6">
                    <h1 className="text-2xl font-bold mb-4">✨ ニックネーム変更できたよ！ ✨</h1>
                    <p className="text-lg mb-6 text-center">
                        あたらしいニックネームは…<br />
                        「 <span className="text-blue-600 font-bold text-2xl mt-2 inline-block">{userOmit.name}</span> 」<br />
                        にへんこうしたよ！ 🎈
                    </p>
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <Button
                            type="button"
                            color="gamesetting"
                            onClick={handleBackToSetting}
                        >
                            ⚙️ ユーザ設定へもどる
                        </Button>
                        <Button
                            type="button"
                            color="back"
                            onClick={handleBackToMenu}
                        >
                            🏠 メニューへもどる
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="min-h-screen flex items-center justify-center text-gray-700">認証中...</p>
            )}
        </AuthGuard>
    );
}