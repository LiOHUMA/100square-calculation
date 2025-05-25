//  @package      pages/admin/settings/done/updateUser.tsx
//  @description  ユーザ情報変更完了画面。
//                ユーザの情報を変更できたことを知らせる画面。
//  @created      2025-05-25 by uma
//  @version      1.0.0
//  @lastModified 2025-05-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../../../components/AuthGuard";
import { useEffect, useState } from "react";

export default function DoneCreateUser() {
    const router = useRouter();
    const [name, setName] = useState("");

    useEffect(() => {
        const getName = sessionStorage.getItem("name");
        sessionStorage.removeItem("name");
        if(getName) {
            setName(JSON.parse(getName));
        }
    }, []);    

    const handleUpdateUser = () => {
        router.push("/admin/settings/updateUser");
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
                <h1>ユーザ「{name}」の情報変更が完了しました</h1>
                <button onClick={handleUpdateUser}>続けて変更する</button>
                <button onClick={handleBackToSetting}>ユーザ管理へ戻る</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}
