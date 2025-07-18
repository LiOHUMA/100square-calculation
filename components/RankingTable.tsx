//  @package      components/RankingTable.tsx
//  @description  ランキングテーブル共通機能。
//                ランキングテーブルを作成する。
//  @created      2025-05-31 by uma
//  @version      1.0.0
//  @lastModified 2025-05-31 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useEffect, useState } from "react";
import { RankingWithMode } from "../models/Ranking";
import { useRouter } from "next/router";
import { RANKING_LABELS } from "../lib/constants/ranking";
import "../styles/globals.css";
import { motion } from "framer-motion";

export default function RankingTable({
    onRankingGetSuccess
}: {
    onRankingGetSuccess?: (ranking: RankingWithMode[]) => void;
}) {
    const [rankings, setRankings] = useState<RankingWithMode[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMode, setSelectedMode] = useState<string>("全体");
    const router = useRouter();

    useEffect(() => {
        const getRanking = async() => {
            const res = await fetch("/api/rankings/getRankings");

            if(res.ok){
                const data = await res.json();
                setRankings(data.Rankings);
                onRankingGetSuccess?.(data.Rankings);
                setLoading(false);
            } else {
                router.push("/menu?session=getRankingFaild");
            }
        };
        getRanking();
    },[router, onRankingGetSuccess]);

    if (loading) return <p className="text-center text-gray-500">🔄 ランキング取得中...</p>;

    const filteredRanking = selectedMode === "全体" ? rankings: rankings.filter(r => r.mode === selectedMode);

    return (
        <div className="w-full max-w-5xl mx-auto p-4 bg-white rounded-xl shadow-md">
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-center">
                <label htmlFor="mode-filter" className="text-lg font-semibold text-gray-700">🎮 モードで絞り込み：</label>
                <select
                    id="mode-filter"
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="p-2 rounded-xl border text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                    <option value="全体">全体</option>
                    {Object.entries(RANKING_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow table-fixed">
                <thead>
                    <tr className="bg-gray-200 text-gray-800 text-lg">
                        <th className="py-2 px-4 text-center border-r border-gray-300">モード</th>
                        <th className="py-2 px-4 text-center border-r border-gray-300">ランク</th>
                        <th className="py-2 px-4 text-center border-r border-gray-300">正解数</th>
                        <th className="py-2 px-4 text-center border-r border-gray-300">時間（秒）</th>
                        <th className="py-2 px-4 text-center border-r border-gray-300">日付</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredRanking.map((r, i) => (
                        <motion.tr
                            key={`${r.mode}-${r.rank}-${i}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                            <td className="py-2 px-4 text-center border-r">{RANKING_LABELS[r.mode]}</td>
                            <td className="py-2 px-4 text-center border-r">{r.rank}</td>
                            <td className="py-2 px-4 text-center border-r">{r.correctAnswers}</td>
                            <td className="py-2 px-4 text-center border-r">{r.timeSpent}</td>
                            <td className="py-2 px-4 text-center border-r">
                                {new Date(r.date).toLocaleString("ja-JP", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                })}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
