//  @package      pages/user/settings/done/password.tsx
//  @description  パスワード変更完了画面。
//                新しいパスワードに変更できたことを知らせる画面。
//  @created      2025-07-18 by uma
//  @version      1.0.0
//  @lastModified 2025-07-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../../../components/AuthGuard";
import Button from "../../../../components/ui/Button";
import "../../../../styles/globals.css";

export default function DonePassword() {
    const router = useRouter();

    const handleBackToSetting = () => {
        router.push("/user/setting");
    };

    const handleBackToMenu = () => {
      router.push("/menu");
  };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl font-bold mb-4">🔒 パスワードの変更が完了したよ！</h1>
                <p className="text-lg mb-6 text-center">
                    パスワードをあたらしくしたよ！<br />
                    あんしんしてつかってね 💡
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
        </AuthGuard>
    );
}