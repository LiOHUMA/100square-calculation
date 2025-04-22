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
                <h1>ニックネームの変更が完了しました</h1>
                <p>「{user.name}」に変更しました</p>
                <button onClick={handleBackToSetting}>ユーザ設定へ戻る</button>
                <button onClick={handleBackToMenu}>メニューへ戻る</button>
            </div>
        </AuthGuard>
    );
}