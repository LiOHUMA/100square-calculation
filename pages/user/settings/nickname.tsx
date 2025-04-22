import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "../../../models/User";
import AuthGuard from "../../../components/AuthGuard";

export default function Settings() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState("");

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
        if (!name) {
            alert("変更後のニックネームを入力してください");
            return;
        }

        e.preventDefault();
        const res = await fetch("/api/settings/changeNickname", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, name }),
        });
    
        if (res.ok) {
          router.push("/user/settings/done/nickname");
        } else {
          alert("ニックネームの更新に失敗しました");
        }
    };
  
    const handleBackToOne = () => {
        router.push("/user/setting");
    };

    if (!user) return <p>認証中...</p>;

    return (
        <AuthGuard>
            <div>
                <h1>ニックネームの変更</h1>
                <p>ニックネームの変更をします</p>
                <p>変更前のニックネームは「{user.name}」です</p>
                <input type="input" placeholder="ニックネーム" value={name} onChange={(e) => setName(e.target.value)} required />
                <button onClick={handleChange}>変更</button>
                <button onClick={handleBackToOne}>前に戻る</button>
            </div>
        </AuthGuard>
    );
}