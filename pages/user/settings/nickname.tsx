//  @package      pages/user/settings/nickname.tsx
//  @description  ニックネーム変更画面。
//                変更したい新しいニックネームを入力する画面。
//  @created      2025-07-18 by uma
//  @version      1.0.0
//  @lastModified 2025-07-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../../../models/User";
import AuthGuard from "../../../components/AuthGuard";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import Button from "../../../components/ui/Button";
import "../../../styles/globals.css";

export default function ChangeNickname() {
    const router = useRouter();
    const [userOmit, setUserOmit] = useState<UserOmit | null>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleChange = async (e: React.FormEvent) => {
        if (!name) {
          alert("変更後のニックネームを入力してください");
          return;
        }

        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/settings/changeNickname", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
    
        if (res.ok) {
          router.push("/user/settings/done/nickname");
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
                <h1 className="text-3xl font-bold mb-6">✏️ ニックネームのへんこう！</h1>
                <p className="mb-4 text-center text-lg">
                  いまのニックネームは<br />
                  「 <span className="text-blue-600 font-bold text-2xl">{userOmit.name}</span> 」 だよ
                </p>
                <form onSubmit={handleChange} className="w-full max-w-sm flex flex-col gap-4 mb-4">
                  <input
                    type="input"
                    placeholder="新しいニックネームを入力してね"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 text-center"
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