//  @package      pages/calc/play.tsx
//  @description  百ます計算のゲーム画面。
//                百ます計算のゲームをする画面。
//  @created      2025-06-02 by uma
//  @version      1.0.0
//  @lastModified 2025-06-02 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import { MODE_LABELS, ModeType } from "../../lib/constants/calc";
import AuthGuard from "../../components/AuthGuard";
import { useEffect, useState } from "react";

export default function Settings(){
    const router = useRouter();
    const [mode, setMode] = useState<ModeType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryMode = router.query.mode;

        if(typeof queryMode === "string" && queryMode in MODE_LABELS) {
            setMode(queryMode as ModeType);
            setLoading(false);
        } else {
            router.push("/calc/select?session=modeInvalid");
        }
    }, [router.query.mode])

    if (loading) return <p>認証中...</p>;

    return (
        <AuthGuard>
            <div>
                <h1>{MODE_LABELS[mode!]} の百ます計算</h1>
            </div>
        </AuthGuard>
    )
}