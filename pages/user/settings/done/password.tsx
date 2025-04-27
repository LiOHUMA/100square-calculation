//  @package      pages/user/settings/password.tsx
//  @description  パスワード変更完了画面。
//                新しいパスワードに変更できたことを知らせる画面。
//  @created      2025-04-27 by uma
//  @version      1.0.0
//  @lastModified 2025-04-27 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "../../../../models/User";
import AuthGuard from "../../../../components/AuthGuard";

export default function Settings() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          }
        };
        fetchUser();
    }, []);

    const handleBackToSetting = () => {
        router.push("/user/setting");
    };

    const handleBackToMenu = () => {
      router.push("/menu");
  };

    if (!user) return <p>認証中...</p>;

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