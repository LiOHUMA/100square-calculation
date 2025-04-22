import { useEffect, useState } from "react";
import { User } from "../../../models/User";
import AuthGuard from "../../../components/AuthGuard";

export default function Settings() {
    const [user, setUser] = useState<User | null>(null);

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

    if (!user) return <p>認証中...</p>;

    return (
        <AuthGuard>
            <div>
                <h1>準備中</h1>
            </div>
        </AuthGuard>
    );
}