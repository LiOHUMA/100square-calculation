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