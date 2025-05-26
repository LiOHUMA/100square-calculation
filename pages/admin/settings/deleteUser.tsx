//  @package      pages/admin/settings/deleteUser.tsx
//  @description  ユーザ削除画面。
//                ユーザ情報を削除する画面。
//  @created      2025-05-26 by uma
//  @version      1.0.0
//  @lastModified 2025-05-26 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserChanger } from "../../../models/User"
import AuthGuard from "../../../components/AuthGuard";

export default function DeleteUser(){
    const[users, setUsers] = useState<UserChanger[]>([]);
    const [isFetchingUserList, setIsFetchingUserList] = useState(true);
    const [isConfirm, setIsConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const[userDeleter, setUserDeleter] = useState<UserChanger>({
        id: "",
        name: "",
        grade: 0,
        role: 1
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const router = useRouter();

    useEffect(() => {
        const getAllUserName = async() => {
            const res = await fetch("/api/user/getAllUserData");
    
            if(res.ok){
                const data = await res.json();
                setUsers(data.users);
                setIsFetchingUserList(false);
            } else {
                router.push("/admin/user?session=getUserFaild");
            }
        };
        getAllUserName();
    },[router]);

    const handleSelectUser = async(e: React.FormEvent) => {
        e.preventDefault();
        setErr("");

        const targetUser = users.find(r => r.id === selectedId);
        if(!targetUser){
            setErr("対象のユーザが見つかりませんでした");
            return;
        }

        setUserDeleter(targetUser);
        setIsConfirm(true);
    };

    const handleBackToOne = () => {
        router.push("/admin/user");
    };

    const handleBackToMenu = () => {
        router.push("/menu");
    };

    const handleDeleteUser = async(e: React.FormEvent) => {
            e.preventDefault();

            const isConfirmed = window.confirm(`本当に「${userDeleter.name}」を削除しますか？`);
            if (!isConfirmed) return;

            setLoading(true);
            
            const res = await fetch("/api/user/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userDeleter.id }),
            });
    
            if (res.ok) {
                sessionStorage.setItem("name", JSON.stringify(userDeleter.name));
                router.push("/admin/settings/done/deleteUser");
            } else {
                const data = await res.json();
                setErr(data.message || "変更に失敗しました");
                setLoading(false);
                setIsConfirm(false);
            }
        }

    if (isFetchingUserList) return <p>取得中...</p>;  

    return(
        <AuthGuard>
            {!isConfirm? (
                <div>
                    <h1>ユーザ削除</h1>
                    <form onSubmit={handleSelectUser}>
                        <p>削除対象のユーザを選択してください</p>
                        <select
                            id="name"
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                            required
                            >
                                <option value="">ユーザを選択</option>
                                {users.map((users) => (
                                    <option key={users.id} value={users.id}>ID：{users.id}、ニックネーム：{users.name}</option>
                                ))}
                        </select>
                        <button type="submit">ユーザ削除確認画面へ</button>
                        {err && <p>{err}</p>}
                    </form>
                    <button onClick={handleBackToOne}>前に戻る</button>
                    <button onClick={handleBackToMenu}>メニューへ戻る</button>
                    </div>
            ): (
                <div>
                    <h1>削除対象の確認</h1>
                    <form  onSubmit={handleDeleteUser}>
                        <p>ID：{selectedId}</p>
                        <p>ニックネーム：{userDeleter.name}</p>
                        <p>学年：{userDeleter.grade}</p>
                        <p>役割：{userDeleter.role === 0 ? "管理者" : "生徒" }</p>
                        <button type="submit" disabled={loading}>{loading ? "削除中..." : "削除"}</button>
                        {err && <p>{err}</p>}
                    </form>
                    <button onClick={() => setIsConfirm(false)}>前に戻る</button>
                </div>
            )}
        </AuthGuard>
    );
}
