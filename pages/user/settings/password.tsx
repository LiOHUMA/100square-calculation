//  @package      pages/user/settings/password.tsx
//  @description  パスワード変更画面。
//                現在のパスワードと新しいパスワードを入力する画面。
//  @created      2025-04-25 by uma
//  @version      1.0.0
//  @lastModified 2025-04-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../../../models/User";
import AuthGuard from "../../../components/AuthGuard";
import PasswordInput from "../../../components/PasswordInput";

export default function Settings() {
    const router = useRouter();
    const [userOmit, setUserOmit] = useState<UserOmit | null>(null);
    const [bfPw, setBfPw] = useState("");
    const [afPw, setAfPw] = useState("");
    const [afCheckPw, setAfCheckPw] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

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
        setLoading(true);
        const res = await fetch("/api/settings/changePassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bfPw, afPw }),
        });
        setLoading(false);
    
        if (res.ok) {
            router.push("/user/settings/done/password");
        } else {
            const data = await res.json();
            setErr(data.message);
        }
    };
  
    const handleBackToOne = () => {
        router.push("/user/setting");
    };

    return (
        <AuthGuard onAuthSuccess={setUserOmit}>
            {userOmit ? (
                <div>
                    <h1>パスワードの変更</h1>
                    <p>パスワードの変更をします</p>
                    <form onSubmit={handleChange}>
                        <PasswordInput 
                            label="変更前パスワード"
                            placeholder="変更前パスワード"
                            value={bfPw}
                            onChange={(e) => setBfPw(e.target.value)}
                            required
                        />
                        <PasswordInput 
                            label="変更後パスワード"
                            placeholder="変更後パスワード"
                            value={afPw}
                            onChange={(e) => setAfPw(e.target.value)}
                            required
                        />
                        <PasswordInput 
                            label="変更後確認用パスワード"
                            placeholder="変更後確認用パスワード"
                            value={afCheckPw}
                            onChange={(e) => setAfCheckPw(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>{loading ? "変更中..." : "変更"}</button>
                        {err && <p>{err}</p>}
                    </form>
                    <button onClick={handleBackToOne}>前に戻る</button>
                </div>
            ) : (
                <p>認証中...</p>
            )}
        </AuthGuard>
    );
}