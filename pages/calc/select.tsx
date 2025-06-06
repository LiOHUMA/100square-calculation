//  @package      pages/calc/select.tsx
//  @description  百ます計算選択画面。
//                モード選択するための画面。
//  @created      2025-05-31 by uma
//  @version      1.0.0
//  @lastModified 2025-05-31 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
import { MODE_COLLECTIONS, MODE_LABELS, MODE_SYMBOL } from "../../lib/constants/calc";
import { useEffect, useState } from "react";


export default function ModeSelect() {
    const router = useRouter();
    const [err, setErr] = useState("");

    const handleModeSelect = (mode: string) => {
        router.push(`/calc/play?mode=${mode}`);
    };

    const handleBackToMenu = () => {
        router.push("/menu");
    };

    useEffect(() => {
        if (router.query.session === "modeInvalid"){
            setErr("不正なモードです。")
        }
    }, [router.query.session]);

    return (
        <AuthGuard>
            <div>
            <h1>モード選択画面</h1>
            {MODE_COLLECTIONS.map((mode) => (
                <button key={mode} onClick={() => handleModeSelect(mode)}>
                    {`${MODE_LABELS[mode]}(${MODE_SYMBOL[mode]})`}
                </button>
            ))}
            {err && <p>{err}</p>}
            <button onClick={handleBackToMenu}>メニューへ戻る</button>
        </div>
        </AuthGuard>
    );
}
