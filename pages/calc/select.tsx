//  @package      pages/calc/select.tsx
//  @description  百ます計算選択画面。
//                モード選択するための画面。
//  @created      2025-07-16 by uma
//  @version      1.0.0
//  @lastModified 2025-07-16 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
import { MODE_COLLECTIONS, MODE_LABELS, MODE_SYMBOL } from "../../lib/constants/calc";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../../styles/globals.css";
import Button from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";


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
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center"
            >
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">モード選択画面</h1>
                {MODE_COLLECTIONS.map((mode, index) => (
                    <motion.button
                        key={mode}
                        onClick={() => handleModeSelect(mode)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="w-full max-w-md px-6 py-4 mb-4 text-xl font-bold text-white bg-green-500 rounded-xl shadow hover:bg-green-600 transition"
                    >
                        {`${MODE_LABELS[mode]}(${MODE_SYMBOL[mode]})`}
                    </motion.button>
                ))}
                <div className="w-full max-w-md">
                    <Button
                        type="button"
                        color="back"
                        onClick={handleBackToMenu}
                    >
                            🏠 メニューへ戻る
                    </Button>
                </div>
                {err && <ErrorMessage message={err}/>}
            </motion.div>
        </AuthGuard>
    );
}
