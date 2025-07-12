//  @package      pages/admin/settings/deleteUser.tsx
//  @description  ユーザ削除画面。
//                ユーザ情報を削除する画面。
//  @created      2025-07-12 by uma
//  @version      1.0.0
//  @lastModified 2025-07-12 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserChanger } from "../../../models/User"
import AuthGuard from "../../../components/AuthGuard";
import "../../../styles/globals.css";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";

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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
                >
                    <h1 className="text-4xl font-bold text-center text-red-600 mb-6">🗑️ ユーザ削除</h1>
                    <form onSubmit={handleSelectUser} className="mx-auto w-full max-w-md space-y-4 mb-4">
                        <p className="text-gray-700">削除対象のユーザを選択してください</p>
                        <select
                            id="name"
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                            required
                            className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        >
                            <option value="">ユーザを選択</option>
                            {users.map((users) => (
                                <option key={users.id} value={users.id}>ID：{users.id}、ニックネーム：{users.name}</option>
                            ))}
                        </select>
                        <Button
                            type="submit"
                            color="danger"
                        >
                            📝 削除確認へ進む
                        </Button>
                    </form>
                    <div className="w-full max-w-md">
                        <Button
                            type="button"
                            color="back"
                            onClick={handleBackToOne}
                        >
                            🔙 ユーザ管理に戻る
                        </Button>
                    </div>
                    {err && <ErrorMessage message={err}/>}
                </motion.div>
            ): (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6"
                >
                    <h1 className="text-4xl font-bold text-center text-red-600 mb-6">⚠️ 削除確認</h1>
                    <p className="text-center text-gray-700">以下のユーザを本当に削除しますか？</p>
                    <form  onSubmit={handleDeleteUser} className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 space-y-4 mb-6">
                        <p><strong>ID：{selectedId}</strong></p>
                        <p><strong>ニックネーム：{userDeleter.name}</strong></p>
                        <p><strong>学年：{userDeleter.grade}</strong></p>
                        <p><strong>役割：{userDeleter.role === 0 ? "管理者" : "生徒" }</strong></p>
                        <Button
                            type="submit"
                            color="danger"
                            disabled={loading}
                        >
                            {loading ? "削除中..." : `🗑️ ${userDeleter.name} を削除する`}
                        </Button>
                    </form>
                    <div className="w-full max-w-md">
                        <Button
                            type="button"
                            color="back"
                            onClick={() => setIsConfirm(false)}
                        >
                            🔙 ユーザ選択に戻る
                        </Button>
                    </div>
                    {err && <ErrorMessage message={err}/>}
                </motion.div>
            )}
        </AuthGuard>
    );
}
