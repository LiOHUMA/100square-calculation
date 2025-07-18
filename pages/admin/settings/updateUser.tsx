//  @package      pages/admin/settings/updateSelectUser.tsx
//  @description  ユーザ情報変更画面。
//                ユーザ情報を変更する画面。
//  @created      2025-07-18 by uma
//  @version      1.0.0
//  @lastModified 2025-07-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserChanger } from "../../../models/User"
import AuthGuard from "../../../components/AuthGuard";
import PasswordInput from "../../../components/PasswordInput";
import "../../../styles/globals.css";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";

export default function UpdateUser(){

    type UserUpdaterWithPassword = UserChanger & { password: string };

    const[userUpdaters, setUserUpdaters] = useState<UserChanger[]>([]);
    const [isFetchingUserList, setIsFetchingUserList] = useState(true);
    const [isUpdater, setIsUpdater] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const[userUpdater, setUserUpdater] = useState<UserUpdaterWithPassword>({
        id: "",
        name: "",
        grade: 0,
        role: 1,
        password: "",
    });
    const[bfUserUpdater, setBfUserUpdater] = useState<UserUpdaterWithPassword>({
        id: "",
        name: "",
        grade: 0,
        role: 1,
        password: "",
    });
    const[userUpdaterFlg, setUserUpdaterFlg] = useState<{
        nameFlg: boolean,
        gradeFlg: boolean,
        roleFlg: boolean,
        passwordFlg: boolean
    }>({
        nameFlg: false,
        gradeFlg: false,
        roleFlg: false,
        passwordFlg: false
    });
    const [checkPw, setCheckPw] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const router = useRouter();

    useEffect(() => {
        const getAllUserName = async() => {
            const res = await fetch("/api/user/getAllUserData");
    
            if(res.ok){
                const data = await res.json();
                setUserUpdaters(data.users);
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

        const targetUser = userUpdaters.find(r => r.id === selectedId);
        if(!targetUser){
            setErr("対象のユーザが見つかりませんでした");
            return;
        }

        setUserUpdater({ ...targetUser, password: "" });
        setBfUserUpdater({ ...targetUser, password: "" });
        setIsUpdater(true);
    };

    const handleBackToOne = () => {
        router.push("/admin/user");
    };

    const handleConfirm = async(e: React.FormEvent) => {
            e.preventDefault();

            const newFlg = {
                nameFlg: bfUserUpdater.name !== userUpdater.name,
                gradeFlg: bfUserUpdater.grade !== userUpdater.grade,
                roleFlg: bfUserUpdater.role !== userUpdater.role,
                passwordFlg: bfUserUpdater.password !== userUpdater.password
            };

            if(!Object.values(newFlg).some(Boolean)){
                setErr("変更点がありません")
                return;
            }

            if (userUpdaterFlg.passwordFlg && userUpdater.password !== checkPw) {
                setErr("パスワードが一致しません")
                return;
            }

            setUserUpdaterFlg(newFlg);
            setErr("");
            setIsConfirm(true);
        }
    
    const handleUpdateUser = async(e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);

            const updateData: Partial<UserUpdaterWithPassword> = {};

            if (userUpdaterFlg.nameFlg) updateData.name = userUpdater.name;
            if (userUpdaterFlg.gradeFlg) updateData.grade = userUpdater.grade;
            if (userUpdaterFlg.roleFlg) updateData.role = userUpdater.role;
            if (userUpdaterFlg.passwordFlg) updateData.password = userUpdater.password;
            
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: bfUserUpdater.id, updateData, userUpdaterFlg }),
            });
    
            if (res.ok) {
                sessionStorage.setItem("name", JSON.stringify(userUpdater.name));
                router.push("/admin/settings/done/updateUser");
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
                !isUpdater? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
                    >
                        <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">🔧 ユーザ情報変更</h1>
                        <form onSubmit={handleSelectUser} className="mx-auto w-full max-w-md space-y-4 mb-4">
                            <p className="text-gray-700">変更対象のユーザを選択してください</p>
                            <select
                                id="name"
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                required
                                className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            >
                                <option value="">ユーザを選択</option>
                                {userUpdaters.map((users) => (
                                    <option key={users.id} value={users.id}>ID：{users.id}、ニックネーム：{users.name}</option>
                                ))}
                            </select>
                            <Button
                                type="submit"
                                color="primary"
                            >
                                ✏️ ユーザ情報変更画面へ
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
                        className="min-h-screen flex flex-col items-center bg-gray-50 p-6"
                    >
                        <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">🔧 ユーザ情報変更</h1>
                        <form onSubmit={handleConfirm} className="mx-auto w-full max-w-md space-y-4 mb-4">
                            <div className="mb-2">
                                <p className="text-gray-700">ID：{selectedId}</p>
                            </div>
                            <div className="mb-2">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">ニックネーム：</label>
                                <input
                                    type="text"
                                    placeholder="ニックネーム"
                                    value={userUpdater.name}
                                    onChange={(e) => setUserUpdater({
                                        ...userUpdater,
                                        name: e.target.value
                                    })}
                                    required
                                    className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">学年：</label>
                                <input
                                    type="number"
                                    placeholder="学年"
                                    value={userUpdater.grade}
                                    onChange={(e) => setUserUpdater({
                                        ...userUpdater,
                                        grade: Number(e.target.value)
                                    })}
                                    required
                                    className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-lg font-semibold text-gray-700 mb-2">役割：</label>
                                <select
                                    value={userUpdater.role}
                                    onChange={(e) => setUserUpdater({
                                        ...userUpdater,
                                        role: Number(e.target.value)
                                    })}
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
                                    value={userUpdater.password}
                                    onChange={(e) => setUserUpdater({...userUpdater, password: e.target.value})}
                                />
                            </div>
                            <div className="mb-2">
                                <PasswordInput
                                    label="確認用パスワード："
                                    placeholder="確認用パスワード"
                                    value={checkPw}
                                    onChange={(e) => setCheckPw(e.target.value)}
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
                                onClick={() => {
                                    setCheckPw("");
                                    setIsUpdater(false);
                                }}
                            >
                                🔙 ユーザ選択に戻る
                            </Button>
                        </div>
                        {err && <ErrorMessage message={err}/>}
                    </motion.div>
                )
            ): (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6"
                >
                    <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">📝 入力内容の確認</h1>
                    <form  onSubmit={handleUpdateUser} className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 space-y-4 mb-6">
                        <p><strong>ID：{selectedId}</strong></p>
                        <p><strong>ニックネーム：{userUpdaterFlg.nameFlg? userUpdater.name : "変更なし"}</strong></p>
                        <p><strong>学年：{userUpdaterFlg.gradeFlg? userUpdater.grade : "変更なし"}</strong></p>
                        <p><strong>役割：{userUpdaterFlg.roleFlg? userUpdater.role === 0 ? "管理者" : "生徒" : "変更なし"}</strong></p>
                        <p><strong>パスワード：{userUpdaterFlg.passwordFlg? Array(userUpdater.password.length).fill("●").join("") : "変更なし"}</strong></p>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? "⏳ 更新中..." : "✏️ 更新"}
                        </Button>
                    </form>
                    <div className="w-full max-w-md">
                        <Button
                            type="button"
                            color="back"
                            onClick={() => setIsConfirm(false)}
                        >
                            🔙 変更入力に戻る
                        </Button>
                    </div>
                </motion.div>
            )}
        </AuthGuard>
    );
}
