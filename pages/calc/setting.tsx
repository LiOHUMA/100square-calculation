//  @package      pages/calc/setting.tsx
//  @description  百ます計算のゲーム設定画面。
//                百ます計算のゲーム設定をする画面。
//  @created      2025-07-18 by uma
//  @version      1.0.0
//  @lastModified 2025-07-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import { MODE_LABELS, ModeType } from "../../lib/constants/calc";
import AuthGuard from "../../components/AuthGuard";
import { useEffect, useState } from "react";
import { GridSetting, SettingMap } from "../../models/CalcSetting";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Button from "../../components/ui/Button";

export default function Settings(){
    const router = useRouter();
    const [mode, setMode] = useState<ModeType | null>(null);
    const defaultSetting = (): SettingMap => {
        const map: SettingMap = {};
        for(let i = 1; i <= 10; i++) {
            map[i.toString()] = { value:0 }
        }
        return map;
    }
    const [calcSetting, setCalcSetting] = useState<GridSetting>({
        row: defaultSetting(),
        col: defaultSetting()
    });
    const [isConfirm, setIsConfirm] = useState(false);
    const [updater, setUpdater] = useState(false);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        const loadSettings = async () => {
            const queryMode = router.query.mode;

            if(typeof queryMode !== "string" || !(queryMode in MODE_LABELS)) {
                router.push("/calc/settingSelect?session=modeInvalid");
            }

            setMode(queryMode as ModeType);

            const res = await fetch("/api/settings/getCalcSetting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode: queryMode }),
            });
    
            if (res.ok) {
                const data = await res.json();
                setCalcSetting(data.calcSetting);
                setLoading(false);
            } else {
                router.push("/calc/settingSelect?session=modeInvalid");
            }
        };

        loadSettings();
    }, [router, router.query.mode]);

    const handleBackToOne = () => {
        router.push("/calc/settingSelect");
    };

    const handleChange = (
        type: "row" | "col",
        key: string,
        value: number
    ) => {
        setCalcSetting((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [key]: { value },
            },
        }));
    };

    const handleSave = async () => {
        setUpdater(true);
        const res = await fetch("/api/settings/changeCalcSetting", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ calcSetting: calcSetting, mode: mode }),
        });

        if (res.ok) {
            router.push("/calc/done/setting");
        } else {
            const data = await res.json();
            setErr(data.message || "変更に失敗しました");
            setUpdater(false);
        }
    };

    if (loading) return <p>認証中...</p>;
    if (!calcSetting) return <p>取得中...</p>;

    return (
        <AuthGuard>
            {isConfirm? (
                <div>
                    <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">変更内容の確認</h1>
                    
                    <div className="mb-4">
                        <h2  className="font-semibold text-lg mb-1">横の設定：</h2>
                        <ul className="grid grid-cols-5 gap-2">
                            {Object.entries(calcSetting.col).map(([k, v]) => (
                                <li key={k} className="bg-gray-100 p-2 rounded text-center">{k}: {v.value}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="mb-4">
                        <h2 className="font-semibold text-lg mb-1">縦の設定：</h2>
                        <ul className="grid grid-cols-5 gap-2">
                            {Object.entries(calcSetting.row).map(([k, v]) => (
                                <li key={k} className="bg-gray-100 p-2 rounded text-center">{k}: {v.value}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <Button
                            type="button"
                            color="gamesetting"
                            onClick={handleSave}
                            disabled={updater}
                        >
                            {updater ? "更新中..." : "更新"}
                        </Button>
                        <Button
                            type="button"
                            color="back"
                            onClick={() => { setIsConfirm(false); setErr(""); }}
                        >
                            入力画面に戻る
                        </Button>
                    </div>
                    {err && <ErrorMessage message={err} />}
                </div>
            ) : (
                <div>
                    <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">{MODE_LABELS[mode!]} の百ます計算設定</h1>
                    <div className="mb-4">
                        <h2 className="font-semibold text-lg mb-1">横の設定：</h2>
                        <div className="grid grid-cols-5 gap-2">
                            {Object.entries(calcSetting.col).map(([k, v]) => (
                                <input 
                                    type="number"
                                    key={k}
                                    value={v.value}
                                    onChange={(e) =>
                                        handleChange("col", k, parseInt(e.target.value))
                                    }
                                    className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 text-center"
                                    required
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <h2 className="font-semibold text-lg mb-1">縦の設定：</h2>
                        <div className="grid grid-cols-5 gap-2">
                            {Object.entries(calcSetting.row).map(([k, v]) => (
                                <input 
                                    type="number"
                                    key={k}
                                    value={v.value}
                                    onChange={(e) =>
                                        handleChange("row", k, parseInt(e.target.value))
                                    }
                                    className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 text-center"
                                    required
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <Button
                            type="button"
                            color="gamesetting"
                            onClick={() => { setIsConfirm(true); }}
                        >
                            設定内容を確認する
                        </Button>
                        <Button
                            type="button"
                            color="back"
                            onClick={handleBackToOne}
                        >
                            モード選択へ戻る
                        </Button>
                    </div>
                </div>
            )}
        </AuthGuard>
    )
}