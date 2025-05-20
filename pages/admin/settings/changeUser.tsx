//  @package      pages/admin/settings/createUser.tsx
//  @description  新規ユーザ作成画面。
//                ユーザ作成画面。
//  @created      2025-05-20 by uma
//  @version      1.0.0
//  @lastModified 2025-05-20 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useState } from "react";
import { useRouter } from "next/router";
import PasswordInput from "../../../components/PasswordInput";
import { UserRegister } from "../../../models/User"
import AuthGuard from "../../../components/AuthGuard";

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
        }
    }

    const handleBackToOne = () => {
        router.push("/admin/user");
    };

    return(
        <AuthGuard>
            {!isConfirm? (
                <div>
                    <h1>新規ユーザ作成</h1>
                    <form onSubmit={handleConfirm}>
                        <label>ID：</label>
                        <input type="text" placeholder="ユーザID" value={newUser.id} onChange={(e) => setNewUser({...newUser, id: e.target.value})} required></input>
                        <label>ニックネーム：</label>
                        <input type="text" placeholder="ニックネーム" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} required></input>
                        <label>学年：</label>
                        <input type="number" placeholder="学年" value={newUser.grade} onChange={(e) => setNewUser({...newUser, grade: Number(e.target.value)})} required></input>
                        <label>役割：</label>
                        <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: Number(e.target.value)})}>
                            <option value={1}>生徒</option>
                            <option value={0}>管理者</option>
                        </select>
                        <PasswordInput
                            label="パスワード："
                            placeholder="パスワード"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            required
                        />
                        <PasswordInput
                            label="確認用パスワード："
                            placeholder="確認用パスワード"
                            value={checkPw}
                            onChange={(e) => setCheckPw(e.target.value)}
                            required
                        />
                        <button type="submit">確認画面へ</button>
                        {err && <p>{err}</p>}
                    </form>
                    <button onClick={handleBackToOne}>前に戻る</button>
                </div>
            ): (
                <div>
                    <h1>入力内容の確認</h1>
                    <form  onSubmit={handleCreateUser}>
                        <p>ID：{newUser.id}</p>
                        <p>ニックネーム：{newUser.name}</p>
                        <p>学年：{newUser.grade}</p>
                        <p>役割：{newUser.role === 0 ? "管理者" : "生徒"}</p>
                        <p>パスワード：{Array(newUser.password.length).fill("*").join("")}</p>
                        <button type="submit" disabled={loading}>{loading ? "登録中..." : "登録"}</button>
                    </form>
                    <button onClick={() => setIsConfirm(false)}>前に戻る</button>
                </div>
            )}
        </AuthGuard>
    );
}
