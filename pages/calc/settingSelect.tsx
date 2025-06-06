//  @package      pages/calc/settingSelect.tsx
//  @description  百ます計算のゲーム設定、モード選択画面。
//                百ます計算のゲーム設定をしたいモードを選択する画面。
//  @created      2025-06-03 by uma
//  @version      1.0.0
//  @lastModified 2025-06-03 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
import { MODE_COLLECTIONS, MODE_LABELS, MODE_SYMBOL, ModeType } from "../../lib/constants/calc";
import { useEffect, useState } from "react";

export default function SelcectSettings() {
    const router = useRouter();
    const [err, setErr] = useState("");

    const handleModeSelect = (mode: ModeType) => {
        router.push(`/calc/setting?mode=${mode}`);
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
                <h1>百ます計算の設定</h1>
                <p>設定変更したいモードを選択してください</p>
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