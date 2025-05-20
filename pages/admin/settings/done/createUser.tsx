//  @package      pages/admin/settings/done/createUser.tsx
//  @description  新規ユーザ作成完了画面。
//                新しいユーザを登録できたことを知らせる画面。
//  @created      2025-05-20 by uma
//  @version      1.0.0
//  @lastModified 2025-05-20 by uma

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
        if(getName) {
            setName(JSON.parse(getName));
        }
    }, []);    

    const handleCreateUser = () => {
        router.push("/admin/settings/createUser");
    };

    const handleBackToSetting = () => {
        router.push("/user/setting");
    };

    const handleBackToMenu = () => {
      router.push("/menu");
  };

    return (
        <AuthGuard>
            <div>
                <h1>新しいユーザ「{name}」の登録が完了しました</h1>
                <button onClick={handleCreateUser}>続けて登録する</button>
                <button onClick={handleBackToSetting}>ユーザ管理へ戻る</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}
