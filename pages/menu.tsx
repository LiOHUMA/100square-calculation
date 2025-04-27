//  @package      pages/menu.tsx
//  @description  メニュー画面。
//                各画面に遷移するための画面。
//  @created      2025-04-25 by uma
//  @version      1.0.0
//  @lastModified 2025-04-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "../models/User";
import AuthGuard from "../components/AuthGuard";

export default function Menu() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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

  const handleUserManage = () => {
    router.push("/admin/user");
  };

  const handleScoreManage = () => {
    router.push("/admin/score");
  };

  const handleCalculation = () => {
    router.push("/calc");
  };

  const handleRanking = () => {
    router.push("/ranking");
  };

  const handleSetting = () => {
    router.push("/user/setting");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (!user) return <p>認証中...</p>;

  const canView = (roles: number[]) => roles.includes(user.role);

  return (
    <AuthGuard>
      <div>
        <h1>メニュー画面</h1>
        <p>ようこそ、{user.name}さん！</p>
        {canView([0]) && <button onClick={handleUserManage}>ユーザ管理</button>}
        {canView([0]) && <button onClick={handleScoreManage}>成績管理</button>}

        <button onClick={handleCalculation}>百ます計算</button>
        <button onClick={handleRanking}>ランキング</button>

        {canView([0, 1]) && <button onClick={handleSetting}>ユーザ設定</button>}

        <button onClick={handleLogout}>ログアウト</button>
      </div>
    </AuthGuard>
  );
}