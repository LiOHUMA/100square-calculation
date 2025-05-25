//  @package      lib/firebase.ts
//  @description  認証共通機能。
//                認証確認するための共通化した機能。
//  @created      2025-05-14 by uma
//  @version      1.0.0
//  @lastModified 2025-05-14 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserOmit } from "../models/User";

export default function AuthGuard({ 
  children, 
  onAuthSuccess 
}: { 
  children: React.ReactNode; 
  onAuthSuccess?: (userOmit: UserOmit) => void;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        onAuthSuccess?.(data.UserOmit);
        setLoading(false);
      } else {
        router.push("/login?session=expired");
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <p>認証中...</p>;

  return <>{children}</>;
}