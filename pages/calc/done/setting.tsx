//  @package      pages/calc/done/setting.tsx
//  @description  百ます計算の設定完了画面。
//                百ます計算の設定をできたことを知らせる画面。
//  @created      2025-06-06 by uma
//  @version      1.0.0
//  @lastModified 2025-06-06 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../../components/AuthGuard";

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
            <div>
                <h1>百ます計算の設定の変更が完了しました</h1>
                <button onClick={handleBackToSetting}>百ます計算の設定へ戻る</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}