//  @package      pages/admin/settings/done/deleteUser.tsx
//  @description  ユーザ削除完了画面。
//                ユーザを削除できたことを知らせる画面。
//  @created      2025-05-26 by uma
//  @version      1.0.0
//  @lastModified 2025-05-26 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../../../components/AuthGuard";
import { useEffect, useState } from "react";

export default function DoneDeleteUser() {
    const router = useRouter();
    const [name, setName] = useState("");

    useEffect(() => {
        const getName = sessionStorage.getItem("name");
        sessionStorage.removeItem("name");
        if(getName) {
            setName(JSON.parse(getName));
        }
    }, []);    

    const handledeleteUser = () => {
        router.push("/admin/settings/deleteUser");
    };

    const handleBackToSetting = () => {
        router.push("/admin/user");
    };

    const handleBackToMenu = () => {
      router.push("/menu");
    };

    return (
        <AuthGuard>
            <div>
                <h1>ユーザ「{name}」の削除が完了しました</h1>
                <button onClick={handledeleteUser}>続けてユーザ削除する</button>
                <button onClick={handleBackToSetting}>ユーザ管理へ戻る</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}
