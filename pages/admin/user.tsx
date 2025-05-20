//  @package      pages/admin/user.tsx
//  @description  ユーザ管理画面。
//                ユーザ作成、変更の選択画面。
//  @created      2025-05-20 by uma
//  @version      1.0.0
//  @lastModified 2025-05-20 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";

export default function UserSettings() {
    const router = useRouter();

    const handleCreateUser = () => {
        router.push("/admin/settings/createUser");
    };

    const handleChangeUser = () => {
        router.push("/admin/settings/changeUser");
    };

    const handleBackToMenu = () => {
        router.push("/menu");
    };

    return (
        <AuthGuard>
            <div>
                <h1>ユーザ管理</h1>
                <button onClick={handleCreateUser}>新規作成</button>
                <button onClick={handleChangeUser}>ユーザ情報変更</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}