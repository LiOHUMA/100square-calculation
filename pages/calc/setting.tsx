//  @package      pages/calc/setting.tsx
//  @description  百ます計算のゲーム設定、モード選択画面。
//                百ます計算のゲーム設定をしたいニックネームモードを選択する画面。
//  @created      2025-05-31 by uma
//  @version      1.0.0
//  @lastModified 2025-05-31 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";

export default function Settings() {
    const router = useRouter();

    
  
    const handleBackToMenu = () => {
        router.push("/menu");
    };

    return (
        <AuthGuard>
            <div>
                <h1>百ます計算の設定</h1>
                <p>設定変更したいモードを選択してください</p>
                
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}