//  @package      lib/firebase.ts
//  @description  認証共通機能。
//                認証確認するための共通化した機能。
//  @created      2025-04-27 by uma
//  @version      1.0.0
//  @lastModified 2025-04-27 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        setLoading(false);
      } else {
        router.push("/login");
      }
    };
    checkAuth();
  }, []);

  if (loading) return <p>認証中...</p>;

  return <>{children}</>;
}