//  @package      pages/login.tsx
//  @description  ログイン画面。
//                ユーザIDとパスワードを入力し、ログインする画面。
//  @created      2025-04-25 by uma
//  @version      1.0.0
//  @lastModified 2025-04-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import { useRouter } from "next/router";
import PasswordInput from "../components/PasswordInput";

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
        <label>ユーザーID</label>
        <input type="input" placeholder="ユーザーID" value={userid} onChange={(e) => setUserid(e.target.value)} required />
        <PasswordInput 
          label="パスワード"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}