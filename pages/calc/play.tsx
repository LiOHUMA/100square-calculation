//  @package      pages/calc/play.tsx
//  @description  百ます計算のゲーム画面。
//                百ます計算のゲームをする画面。
//  @created      2025-07-16 by uma
//  @version      1.0.0
//  @lastModified 2025-07-16 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MODE_LABELS, MODE_SYMBOL, ModeType } from "../../lib/constants/calc";
import AuthGuard from "../../components/AuthGuard";
import { motion } from "framer-motion";

export default function PlayPage() {
    const [mode, setMode] = useState<ModeType | null>(null);
    const [showCountdown, setShowCountdown] = useState(true);
    const [countdownText, setCountdownText] = useState("よーい...");
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [timerPaused, setTimerPaused] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [rowList, setRowList] = useState<number[]>([]);
    const [colList, setColList] = useState<number[]>([]);
    type DivisionAnswer = { quotient: string; remainder: string };
    type AnswerCell = string | DivisionAnswer;
    const [answers, setAnswers] = useState<AnswerCell[][]>(
        Array.from({ length: 10 }, () => Array(10).fill(""))
    );
    const [showConfirm, setShowConfirm] = useState(false);
    const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");


    // シャッフル関数
    const shuffle = <T,>(array: T[]): T[] =>
        array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);


    // カウントダウン
    useEffect(() => {
        if(!showCountdown) return;

        const steps = ["よーい...", "スタート！💪"];
        let idx = 0;

        const interval = setInterval(() => {
            if(idx === steps.length - 1){
                setCountdownText(steps[idx]);
                setTimeout(() => {
                    setShowCountdown(false);
                    setStartTime(new Date());
                }, 1000);
                clearInterval(interval);
            }else{
                setCountdownText(steps[idx]);
                idx++;
            }
        },1000);

        return () => clearInterval(interval);
    }, [showCountdown])


    // タイマー
    useEffect(() => {
        if(!startTime || timerPaused) return;
        
        const timer = setInterval(() => {
            setElapsed(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime, timerPaused]);


    // 設定取得・初期化
    useEffect(() => {
        const loadSettings = async() => {
            const queryMode = router.query.mode;
            if(typeof queryMode !== "string" || !(queryMode in MODE_LABELS)){
                router.push("/calc/select?session=modeInvalid");
                return;
            }

            setMode(queryMode as ModeType);
            const res = await fetch("/api/settings/getCalcSetting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode: queryMode })
            });

            if(res.ok){
                const data = await res.json();

                const rowVals = (Object.values(data.calcSetting.row) as { value: number }[]).map(v => v.value);
                const colVals = (Object.values(data.calcSetting.col) as { value: number }[]).map(v => v.value);

                setRowList(shuffle(rowVals));
                setColList(shuffle(colVals));

                setLoading(false);
            }else{
                router.push("/calc/select?session=modeInvalid");
            }
        };

        loadSettings();
    }, [router]);

    // 回答データを更新
    const handleInputChange = (
        row: number,
        col: number,
        value: string,
        part: "quotient" | "remainder" = "quotient"
    ) => {
        const updated = [...answers];
        if(mode === "division"){
            if(!updated[row][col] || typeof updated[row][col] !== "object"){
                updated[row][col] = { quotient: "", remainder: ""};
            }
            updated[row][col][part] = value;
        }else{
            updated[row][col] = value;
        }
        setAnswers(updated);
    };

    // 未回答のセルチェック
    const handleFinish = () => {
        const hasEmpty = answers.some((row) =>
            row.some((val, colIndex) => {
                const colVal = colList[colIndex];
                if(mode === "division" && colVal === 0) return false;
                if(mode === "division"){
                    if (typeof val === "object" && val !== null) {
                        return !val?.quotient && !val?.remainder;
                    }
                }else{
                    return val === "";
                }
            })
        );

        if(hasEmpty){
            setTimerPaused(true);
            setShowConfirm(true);
        }else{
            goToResult();
        }
    };

    // 結果処理
    const goToResult = async() => {
        const res = await fetch("/api/calc/resultRanking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: answers, mode: mode, rowList: rowList, colList: colList, elapsed: elapsed })
        });

        const data = await res.json();

        if (res.ok) {
            const resultId = data.resultId;
            router.push(`/calc/result/${resultId}`);
        }else {
            setErr(data.message);
            setLoading(false);
        }
    }


    if (loading) return <p>読み込み中...</p>;

    // 表の1セルを描画
    const renderCell = (rowIndex: number, colIndex: number) => {
        const rowVal = rowList[rowIndex];

        if(mode === "division" && rowVal === 0){
            return (
                <input
                    type="text"
                    disabled
                    value="-"
                    readOnly
                />
            );
        }

        if(mode === "division"){
            const cellVal = answers[rowIndex][colIndex];

            const quotient = typeof cellVal === "object" && cellVal !== null ? cellVal.quotient : "";
            const remainder = typeof cellVal === "object" && cellVal !== null ? cellVal.remainder : "";

            return (
                <div>
                    <input
                        type="number"
                        placeholder="答え"
                        value={ quotient }
                        onChange={ (e) => handleInputChange(rowIndex, colIndex, e.target.value, "quotient") }
                        onFocus={ () => setFocusedCell({ row: rowIndex, col: colIndex }) }
                        className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <input
                        type="number"
                        placeholder="あまり"
                        value={ remainder }
                        onChange={ (e) => handleInputChange(rowIndex, colIndex, e.target.value, "remainder") }
                        onFocus={ () => setFocusedCell({ row: rowIndex, col: colIndex }) }
                        className="w-full p-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                </div>
            );
        }

        return (
            <input
                type="number"
                value={ typeof answers[rowIndex][colIndex] === "string" ? answers[rowIndex][colIndex] : "" }
                onChange={ (e) => handleInputChange(rowIndex, colIndex, e.target.value) }
                onFocus={ () => setFocusedCell({ row: rowIndex, col: colIndex }) }
                className="w-full p-2 text-center border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-pink-400 bg-white text-lg shadow-sm"
            />
        );
    };



    return(
        <AuthGuard>
            <div>
                <h1 className="text-3xl font-bold text-center text-gray-700 mb-4">{MODE_LABELS[mode!]} の百ます計算</h1>

                {showCountdown? (
                    <motion.div
                        key={countdownText}
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                        className="text-center text-5xl font-extrabold text-pink-600"
                    >
                        {countdownText}
                    </motion.div>
                ): (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="text-xl text-gray-700 mb-4">経過時間： {elapsed}秒</div>

                        {focusedCell && (() => {
                            const cell = answers[focusedCell.row][focusedCell.col];
                            const displayText = mode === "division"
                                ? (typeof cell === "object" && cell !== null
                                    ? `${cell.quotient || ""} あまり ${cell.remainder || ""}`
                                    : ""
                                )
                            : (typeof cell === "string" ? cell : "");

                            return (
                                <div className="text-2xl font-bold text-center text-gray-700 mb-4">
                                    {colList[focusedCell.col]} {MODE_SYMBOL[mode!]} {rowList[focusedCell.row]} = { " " }
                                    {displayText}
                                </div>
                            );
                        })()}

                        <table className="min-w-full bg-yellow-50 border border-yellow-300 rounded-2xl shadow-lg table-fixed mb-8">
                            <thead>
                                <tr className="bg-yellow-200 text-gray-800 text-xl border-b border-gray-400">
                                    <th className="text-4xl text-center border-r border-gray-400">
                                        <strong>{MODE_SYMBOL[mode!]}</strong>
                                    </th>
                                    {colList.map((colVal, i) => (
                                        <th key={i} className="py-3 px-4 border-r border-gray-300">
                                            {colVal}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-400">
                                {rowList.map((rowVal, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <th className="bg-yellow-200 text-gray-800 text-xl border-r border-gray-400">
                                            {rowVal}
                                        </th>
                                        {colList.map((_, colIndex) => (
                                            <td key={colIndex} className="py-2 px-4 text-center border-r border-gray-400">
                                                {renderCell(rowIndex, colIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            onClick={handleFinish}
                            className="mt-6 px-6 py-3 bg-blue-500 text-white text-xl rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                        >
                            終了
                        </button>

                        {showConfirm && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
                                    <p className="text-lg mb-4 text-red-600">未入力のマスがあります。終了しますか？</p>
                                    <div className="flex justify-around">
                                    <button 
                                        onClick={() => {
                                            setShowConfirm(false);
                                            setTimerPaused(false);
                                            goToResult();
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                                    >
                                        はい
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowConfirm(false);
                                            setTimerPaused(false);
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400"
                                    >
                                        いいえ
                                    </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
                {err && <p>{err}</p>}
            </div>
        </AuthGuard>
    );
}
