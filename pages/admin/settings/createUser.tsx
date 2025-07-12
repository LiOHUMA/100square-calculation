//  @package      pages/admin/settings/createUser.tsx
//  @description  新規ユーザ作成画面。
//                ユーザ作成画面。
//  @created      2025-07-03 by uma
//  @version      1.0.0
//  @lastModified 2025-07-03 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useState } from "react";
import { useRouter } from "next/router";
import PasswordInput from "../../../components/PasswordInput";
import { UserRegister } from "../../../models/User"
import AuthGuard from "../../../components/AuthGuard";
import "../../../styles/globals.css";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";

export default function CreateUser(){
    const [newUser, setNewUser] = useState<UserRegister>({
        id: "",
        name: "",
        password: "",
        grade: 0,
        role: 1
    })
    const [isConfirm, setIsConfirm] = useState(false);
    const [checkPw, setCheckPw] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const router = useRouter();

    const handleConfirm = async(e: React.FormEvent) => {
        e.preventDefault();
        if (newUser.password !== checkPw) {
            setErr("パスワードが一致しません")
            return;
        }
        setErr("");
        setIsConfirm(true);
    }    

    const handleCreateUser = async(e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/user/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });

        if (res.ok) {
            sessionStorage.setItem("name", JSON.stringify(newUser.name));
            router.push("/admin/settings/done/createUser");
        } else {
            const data = await res.json();
            setErr(data.message || "登録に失敗しました");
            setLoading(false);
            setIsConfirm(false);
        }
    }

    const handleBackToOne = () => {
        router.push("/admin/user");
    };

    return(
        <AuthGuard>
            {!isConfirm? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
                >
                    <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">👤 新規ユーザ作成</h1>
                    <form onSubmit={handleConfirm} className="w-full max-w-md">
                        <div className="mb-2">
                            <label className="block text-lg font-semibold text-gray-700 mb-2">ID：</label>
                            <input
                                type="text"
                                placeholder="ユーザID"
                                value={newUser.id}
                                onChange={(e) => setNewUser({...newUser, id: e.target.value})}
                                required
                                className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-lg font-semibold text-gray-700 mb-2">ニックネーム：</label>
                            <input
                                type="text"
                                placeholder="ニックネーム"
                                value={newUser.name}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                required
                                className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-lg font-semibold text-gray-700 mb-2">学年：</label>
                            <input
                                type="number"
                                placeholder="学年"
                                value={newUser.grade}
                                onChange={(e) => setNewUser({...newUser, grade: Number(e.target.value)})}
                                required
                                className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-lg font-semibold text-gray-700 mb-2">役割：</label>
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: Number(e.target.value)})}
                                className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            >
                                <option value={1}>生徒</option>
                                <option value={0}>管理者</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <PasswordInput
                                label="パスワード："
                                placeholder="パスワード"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <PasswordInput
                                label="確認用パスワード："
                                placeholder="確認用パスワード"
                                value={checkPw}
                                onChange={(e) => setCheckPw(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <Button
                                type = "submit"
                                color = "continue"
                            >
                                📝 確認画面へ
                            </Button>
                        </div>
                    </form>
                    <div className="w-full max-w-md">
                        <Button
                            type = "button"
                            color = "back"
                            onClick={handleBackToOne}
                        >
                            🔙 ユーザ管理に戻る
                        </Button>
                    </div>
                    {err && <ErrorMessage message={err}/>}
                </motion.div>
            ): (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
                >
                    <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">📝 入力内容の確認</h1>
                    <form  onSubmit={handleCreateUser} className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 space-y-4 mb-6">
                        <div className="text-lg text-gray-800">
                            <p className="mb-2">
                                <span className="font-semibold">
                                    🆔 ID：
                                </span>
                                {newUser.id}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">
                                    👤 ニックネーム：
                                </span>
                                {newUser.name}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">
                                    🎒 学年：
                                </span>
                                {newUser.grade}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">
                                    🔐 役割：
                                </span>
                                {newUser.role === 0 ? "管理者" : "生徒"}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">
                                    🔑 パスワード：
                                </span>
                                {Array(newUser.password.length).fill("●").join("")}
                            </p>
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            color="continue"
                        >
                            {loading ? "⏳ 登録中..." : "✏️ 登録"}
                        </Button>
                        {err && <ErrorMessage message={err}/>}
                    </form>
                    <div className="w-full max-w-md">
                        <Button
                            type="button"
                            color="back"
                            onClick={() => setIsConfirm(false)}
                        >
                            🔙 登録入力に戻る
                        </Button>
                    </div>
                </motion.div>
            )}
        </AuthGuard>
    );
}
