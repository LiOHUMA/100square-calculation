//  @package      pages/admin/settings/updateSelectUser.tsx
//  @description  ユーザ情報変更 対象ユーザ選択画面。
//                ユーザ情報を変更する対象のユーザを選択する画面。
//  @created      2025-05-25 by uma
//  @version      1.0.0
//  @lastModified 2025-05-25 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserUpdater } from "../../../models/User"
import AuthGuard from "../../../components/AuthGuard";
import PasswordInput from "../../../components/PasswordInput";

export default function UpdateUser(){

    type UserUpdaterWithPassword = UserUpdater & { password: string };

    const[userUpdaters, setUserUpdaters] = useState<UserUpdater[]>([]);
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
    },[]);

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

    const handleBackToMenu = () => {
        router.push("/menu");
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

            try{

                const updateData: any = {};

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
            } catch (error) {
                setErr("変更に失敗しました");
                setLoading(false);
                setIsConfirm(false);
            }
        }

    if (isFetchingUserList) return <p>取得中...</p>;  

    return(
        <AuthGuard>
            {!isConfirm? (
                !isUpdater? (
                    <div>
                        <h1>ユーザ情報変更</h1>
                        <form onSubmit={handleSelectUser}>
                            <p>変更対象のユーザを選択してください</p>
                            <select
                                id="name"
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                required
                                >
                                    <option value="">ユーザを選択</option>
                                    {userUpdaters.map((users) => (
                                        <option key={users.id} value={users.id}>ID：{users.id}、ニックネーム：{users.name}</option>
                                    ))}
                            </select>
                            <button type="submit">ユーザ情報変更画面へ</button>
                            {err && <p>{err}</p>}
                        </form>
                        <button onClick={handleBackToOne}>前に戻る</button>
                        <button onClick={handleBackToMenu}>メニューへ戻る</button>
                    </div>
                ): (
                    <div>
                        <h1>ユーザ情報変更</h1>
                        <form onSubmit={handleConfirm}>
                            <p>ID：{selectedId}</p>
                            <label>ニックネーム：</label>
                            <input type="text" placeholder="ニックネーム" value={userUpdater.name} onChange={(e) => setUserUpdater({...userUpdater, name: e.target.value})} required></input>
                            <label>学年：</label>
                            <input type="number" placeholder="学年" value={userUpdater.grade} onChange={(e) => setUserUpdater({...userUpdater, grade: Number(e.target.value)})} required></input>
                            <label>役割：</label>
                            <select value={userUpdater.role} onChange={(e) => setUserUpdater({...userUpdater, role: Number(e.target.value)})}>
                                <option value={1}>生徒</option>
                                <option value={0}>管理者</option>
                            </select>
                            <PasswordInput
                                label="パスワード："
                                placeholder="パスワード"
                                value={userUpdater.password}
                                onChange={(e) => setUserUpdater({...userUpdater, password: e.target.value})}
                            />
                            <PasswordInput
                                label="確認用パスワード："
                                placeholder="確認用パスワード"
                                value={checkPw}
                                onChange={(e) => setCheckPw(e.target.value)}
                            />
                            <button type="submit">確認画面へ</button>
                            {err && <p>{err}</p>}
                        </form>
                        <button onClick={() => {
                            setCheckPw("");
                            setIsUpdater(false);
                            }}
                        >
                            前に戻る
                        </button>
                        <button onClick={handleBackToMenu}>メニューへ戻る</button>
                    </div>
                )
            ): (
                <div>
                    <h1>入力内容の確認</h1>
                    <form  onSubmit={handleUpdateUser}>
                        <p>ID：{selectedId}</p>
                        <p>ニックネーム：{userUpdaterFlg.nameFlg? userUpdater.name : "変更なし"}</p>
                        <p>学年：{userUpdaterFlg.gradeFlg? userUpdater.grade : "変更なし"}</p>
                        <p>役割：{userUpdaterFlg.roleFlg? userUpdater.role === 0 ? "管理者" : "生徒" : "変更なし"}</p>
                        <p>パスワード：{userUpdaterFlg.passwordFlg? Array(userUpdater.password.length).fill("●").join("") : "変更なし"}</p>
                        <button type="submit" disabled={loading}>{loading ? "更新中..." : "更新"}</button>
                        {err && <p>{err}</p>}
                    </form>
                    <button onClick={() => setIsConfirm(false)}>前に戻る</button>
                </div>
            )}
        </AuthGuard>
    );
}
