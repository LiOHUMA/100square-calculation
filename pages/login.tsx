//  @package      pages/login.tsx
//  @description  ログイン画面。
//                ユーザIDとパスワードを入力し、ログインする画面。
//  @created      2025-05-14 by uma
//  @version      1.0.0
//  @lastModified 2025-05-14 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    setLoading(false);

    if (res.ok) {
      router.push("/menu"); // メニュー画面へ遷移
    } else {
      const data = await res.json();
      setErr(data.message || "ログインに失敗しました");
    }
  };

  useEffect(() => {
    if (router.query.session === "expired") {
      setErr("セッションが切れました。もう一度ログインしてください。");
    }
  }, [router.query.session]);

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleLogin}>
        <label>ユーザーID</label>
        <input type="text" placeholder="ユーザーID" value={id} onChange={(e) => setId(e.target.value)} required />
        <PasswordInput 
          label="パスワード"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? "ログイン中..." : "ログイン"}</button>
        {err && <p>{err}</p>}
      </form>
    </div>
  );
}