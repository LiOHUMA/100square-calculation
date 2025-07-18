//  @package      pages/login.tsx
//  @description  ログイン画面。
//                ユーザIDとパスワードを入力し、ログインする画面。
//  @created      2025-06-26 by uma
//  @version      1.0.0
//  @lastModified 2025-06-26 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PasswordInput from "../components/PasswordInput";
import "../styles/globals.css";
import { motion } from "framer-motion";

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

    if (res.ok) {
      router.push("/menu"); // メニュー画面へ遷移
    } else {
      const data = await res.json();
      setErr(data.message || "ログインに失敗しました");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.session === "expired") {
      setErr("セッションが切れました。もう一度ログインしてください。");
    }
  }, [router.query.session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">👤 ログイン</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-lg font-semibold text-gray-700 mb-2">ユーザーID</label>
            <input
              type="text"
              placeholder="ユーザーID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="mb-5">
            <PasswordInput 
              label="パスワード"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {err && <p className="text-red-500 text-base font-semibold mb-4">⚠️ {err}</p>}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 text-lg rounded-full transition-shadow shadow-md disabled:opacity-50"
          >
            {loading ? <span className="animate-spin mr-2">🔄ログイン中...</span> : "🚪 ログイン"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}