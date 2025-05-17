//  @package      pages/menu.tsx
//  @description  メニュー画面。
//                各画面に遷移するための画面。
//  @created      2025-05-14 by uma
//  @version      1.0.0
//  @lastModified 2025-05-14 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../models/User";
import AuthGuard from "../components/AuthGuard";

export default function Menu() {
  const [userOmit, setUserOmit] = useState<UserOmit | null>(null);
  const router = useRouter();

  const handleUserManage = () => {
    router.push("/admin/user");
  };

  const handleScoreManage = () => {
    router.push("/admin/score");
  };

  const handleCalculation = () => {
    router.push("/operation-select");
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

  return (
    <AuthGuard onAuthSuccess={setUserOmit}>
      {userOmit ? (
      <div>
        <h1>メニュー画面</h1>
        <p>ようこそ、{userOmit.name}さん！</p>
        <button style={{display: [0].includes(userOmit.role) ? "inline-block" : "none"}} onClick={handleUserManage}>ユーザ管理</button>
        <button style={{display: [0].includes(userOmit.role) ? "inline-block" : "none"}} onClick={handleScoreManage}>成績管理</button>

        <button onClick={handleCalculation}>百ます計算</button>
        <button onClick={handleRanking}>ランキング</button>

        <button style={{display: [0, 1].includes(userOmit.role) ? "inline-block" : "none"}} onClick={handleSetting}>ユーザ設定</button>

        <button onClick={handleLogout}>ログアウト</button>
      </div>
      ) : (
        <p>認証中...</p>
      )}
    </AuthGuard>
  );
}
