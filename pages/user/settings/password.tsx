//  @package      pages/user/settings/password.tsx
//  @description  ユーザーがパスワードを変更できる設定ページ。
//                現在のパスワードと新しいパスワードを入力し、Firebase Authを使って更新する。
//  @created      2025-04-25 by uma
//  @version      1.0.0
//  @lastModified 2025-04-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "../../../models/User";
import AuthGuard from "../../../components/AuthGuard";

export default function Settings() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [bfPw, setBfPw] = useState("");
    const [afPw, setAfPw] = useState("");
    const [afCheckPw, setAfCheckPw] = useState("");

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

    const handleChange = async (e: React.FormEvent) => {
        if (!bfPw) {
            alert("変更前のパスワードを入力してください");
            return;
        }

        if (!afPw) {
            alert("変更後のパスワードを入力してください");
            return;
        }

        if (!afCheckPw) {
            alert("変更後の確認用パスワードを入力してください");
            return;
        }

        if (afPw !== afCheckPw) {
            alert("変更後のパスワードと確認用パスワードが一致していません");
            return;
        }

        e.preventDefault();
        const res = await fetch("/api/settings/changePassword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, bfPw, afPw }),
        });
    
        if (res.ok) {
          router.push("/user/settings/done/password");
        } else {
          alert("パスワードの更新に失敗しました");
        }
    };
  
    const handleBackToOne = () => {
        router.push("/user/setting");
    };

    if (!user) return <p>認証中...</p>;

    return (
        <AuthGuard>
            <div>
                <h1>パスワードの変更</h1>
                <p>パスワードの変更をします</p>
                <input type="password" placeholder="変更前パスワード" value={bfPw} onChange={(e) => setBfPw(e.target.value)} required />
                <input type="input" placeholder="変更後パスワード" value={afPw} onChange={(e) => setAfPw(e.target.value)} required />
                <input type="input" placeholder="変更後確認用パスワード" value={afCheckPw} onChange={(e) => setAfCheckPw(e.target.value)} required />
                <button onClick={handleChange}>変更</button>
                <button onClick={handleBackToOne}>前に戻る</button>
            </div>
        </AuthGuard>
    );
}