//  @package      pages/user/settings/nickname.tsx
//  @description  ニックネーム変更画面。
//                変更したい新しいニックネームを入力する画面。
//  @created      2025-05-20 by uma
//  @version      1.0.0
//  @lastModified 2025-05-20 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../../../models/User";
import AuthGuard from "../../../components/AuthGuard";

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
            <div>
                <h1>ニックネームの変更</h1>
                <p>ニックネームの変更をします</p>
                <p>変更前のニックネームは「{userOmit.name}」です</p>
                <form onSubmit={handleChange}>
                  <input type="input" placeholder="ニックネーム" value={name} onChange={(e) => setName(e.target.value)} required />
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