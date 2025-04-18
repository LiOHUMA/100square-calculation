import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid, password }),
    });

    if (res.ok) {
      router.push("/menu"); // メニュー画面へ遷移
    } else {
      alert("ログインに失敗しました");
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleLogin}>
        <input type="input" placeholder="ユーザーID" value={userid} onChange={(e) => setUserid(e.target.value)} required />
        <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}