//  @package      pages/user/settings/nickname.tsx
//  @description  ニックネーム変更完了画面。
//                新しいニックネームに変更できたことを知らせる画面。
//  @created      2025-05-14 by uma
//  @version      1.0.0
//  @lastModified 2025-05-14 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../../../../models/User";
import AuthGuard from "../../../../components/AuthGuard";

export default function Settings() {
    const router = useRouter();
    const [userOmit, setUserOmit] = useState<UserOmit | null>(null);

    const handleBackToSetting = () => {
        router.push("/user/setting");
    };

    const handleBackToMenu = () => {
      router.push("/menu");
  };

    if (!userOmit) return <p>認証中...</p>;

    return (
        <AuthGuard onAuthSuccess={setUserOmit}>
            <div>
                <h1>ニックネームの変更が完了しました</h1>
                <p>「{userOmit.name}」に変更しました</p>
                <button onClick={handleBackToSetting}>ユーザ設定へ戻る</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}