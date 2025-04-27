//  @package      pages/user/setting.tsx
//  @description  ニックネーム、パスワードの変更選択画面。
//                変更したいニックネーム、パスワードを選択する画面。
//  @created      2025-04-25 by uma
//  @version      1.0.0
//  @lastModified 2025-04-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";

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
            <div>
                <h1>ユーザ設定</h1>
                <p>ニックネーム、パスワードの変更ができます</p>
                <button onClick={handleChangeNickname}>ニックネームの変更</button>
                <button onClick={handleChangePassword}>パスワードの変更</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}