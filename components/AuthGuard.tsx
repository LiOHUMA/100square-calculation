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
import "../styles/globals.css";
import { motion } from "framer-motion";

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
  }, [router, onAuthSuccess]);

  if (loading) {
    return(
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
        <motion.div
          className="w-16 h-16 border-4 border-pink-300 border-t-transparent rounded-full animate-spin mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.p
          className="text-lg font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          🔐 認証中です...
        </motion.p>
      </div>
    );
  }

  return <>{children}</>;
}