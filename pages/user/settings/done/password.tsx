//  @package      pages/user/settings/password.tsx
//  @description  パスワード変更完了画面。
//                新しいパスワードに変更できたことを知らせる画面。
//  @created      2025-05-20 by uma
//  @version      1.0.0
//  @lastModified 2025-05-20 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../../../components/AuthGuard";

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
            <div>
                <h1>パスワードの変更が完了しました</h1>
                <button onClick={handleBackToSetting}>ユーザ設定へ戻る</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}