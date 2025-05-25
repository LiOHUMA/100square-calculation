//  @package      pages/admin/user.tsx
//  @description  ユーザ管理画面。
//                ユーザ作成、変更の選択画面。
//  @created      2025-05-22 by uma
//  @version      1.0.0
//  @lastModified 2025-05-22 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";

export default function UserSettings() {
    const [err, setErr] = useState("");
    const router = useRouter();

    const handleCreateUser = () => {
        router.push("/admin/settings/createUser");
    };

    const handleUpdateUser = () => {
        router.push("/admin/settings/updateUser");
    };

    const handleBackToMenu = () => {
        router.push("/menu");
    };

    useEffect(() => {
        if (router.query.session === "getUserFaild"){
          setErr("対象ユーザの取得に失敗しました。")
        }
    }, [router.query.session]);

    return (
        <AuthGuard>
            <div>
                <h1>ユーザ管理</h1>
                <button onClick={handleCreateUser}>新規作成</button>
                <button onClick={handleUpdateUser}>ユーザ情報変更</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
                {err && <p>{err}</p>}
            </div>
        </AuthGuard>
    );
}