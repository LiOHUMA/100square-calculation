//  @package      pages/user/settings/password.tsx
//  @description  パスワード変更画面。
//                現在のパスワードと新しいパスワードを入力する画面。
//  @created      2025-07-18 by uma
//  @version      1.0.0
//  @lastModified 2025-07-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../../../models/User";
import AuthGuard from "../../../components/AuthGuard";
import PasswordInput from "../../../components/PasswordInput";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import "../../../styles/globals.css";

export default function ChangePassword() {
    const router = useRouter();
    const [userOmit, setUserOmit] = useState<UserOmit | null>(null);
    const [bfPw, setBfPw] = useState("");
    const [afPw, setAfPw] = useState("");
    const [afCheckPw, setAfCheckPw] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleChange = async (e: React.FormEvent) => {
        if (!bfPw) {
            alert("まえのパスワードをいれてね！");
            return;
        }

        if (!afPw) {
            alert("あたらしいパスワードをいれてね！");
            return;
        }

        if (!afCheckPw) {
            alert("あたらしいパスワード（かくにん）をいれてね！");
            return;
        }

        if (afPw !== afCheckPw) {
            alert("あたらしいパスワードとかくにんのパスワードがちがうよ！");
            return;
        }

        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/settings/changePassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bfPw, afPw }),
        });
    
        if (res.ok) {
            router.push("/user/settings/done/password");
        } else {
            const data = await res.json();
            setErr(data.message);
            setLoading(false);
        }
    };
  
    const handleBackToOne = () => {
        router.push("/user/setting");
    };

    return (
        <AuthGuard onAuthSuccess={setUserOmit}>
            {userOmit ? (
                <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-6">
                    <h1 className="text-3xl font-bold mb-6">🔐 パスワードのへんこう</h1>
                    <p className="mb-6 text-center text-lg">パスワードをあんぜんにかえよう！</p>
                    <form onSubmit={handleChange} className="w-full max-w-sm flex flex-col gap-4 mb-6">
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
                        <Button
                            type="submit"
                            color="gamesetting"
                            disabled={loading}
                        >
                            {loading ? "変更中..." : "変更"}
                        </Button>
                    </form>
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <Button
                            type="button"
                            color="back"
                            onClick={handleBackToOne}
                        >
                            🔙 前に戻る
                        </Button>
                    </div>
                    {err && <ErrorMessage message={err} />}
                </div>
            ) : (
                <p>認証中...</p>
            )}
        </AuthGuard>
    );
}