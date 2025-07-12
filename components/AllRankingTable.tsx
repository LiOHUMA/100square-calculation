//  @package      components/AllRankingTable.tsx
//  @description  全ランキングテーブル共通機能。
//                全てのユーザのランキングテーブルを作成する。
//  @created      2025-07-12 by uma
//  @version      1.0.0
//  @lastModified 2025-07-12 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useEffect, useState } from "react";
import { RankingWithModeWithName } from "../models/Ranking";
import { useRouter } from "next/router";
import { RANKING_LABELS } from "../lib/constants/ranking";
import "../styles/globals.css";

export default function AllRankingTable() {
    const [ranking, setRanking] = useState<RankingWithModeWithName[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedName, setSelectedName] = useState<string>("全体");
    const [selectedMode, setSelectedMode] = useState<string>("全体");
    const router = useRouter();

    useEffect(() => {
        const getAllRanking = async() => {
            const res = await fetch("/api/rankings/getAllRankings");

            if(res.ok){
                const data = await res.json();
                setRanking(data.Ranking);
                setLoading(false);
            } else {
                router.push("/menu?session=getRankingFaild");
            }
        };
        getAllRanking();
    },[router]);

    if (loading) return <p>取得中...</p>;

    const uniqueNames = Array.from(new Set(ranking.map(r => r.name)));

    const filteredByNameRanking = selectedName === "全体" ? ranking: ranking.filter(r => r.name === selectedName);
    const filteredByModeRanking = selectedMode === "全体" ? filteredByNameRanking: filteredByNameRanking.filter(r => r.mode === selectedMode);

    return (
        <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-xl shadow-md">
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-center">
                <label htmlFor="name-filter" className="block mb-1 font-semibold text-gray-700">👤 名前で絞り込み：</label>
                <select
                    id="name-filter"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="p-2 rounded-xl border text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                        <option value="全体">全体</option>
                        {uniqueNames.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                </select>
                <label htmlFor="mode-filter" className="block mb-1 font-semibold text-gray-700">🎮 モードで絞り込み：</label>
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
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-center">
                <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow table-fixed">
                    <thead>
                        <tr className="bg-gray-200 text-gray-800 text-lg">
                            <th className="py-2 px-4 text-center border-r border-gray-300">名前</th>
                            <th className="py-2 px-4 text-center border-r border-gray-300">モード</th>
                            <th className="py-2 px-4 text-center border-r border-gray-300">ランク</th>
                            <th className="py-2 px-4 text-center border-r border-gray-300">正解数</th>
                            <th className="py-2 px-4 text-center border-r border-gray-300">時間（秒）</th>
                            <th className="py-2 px-4 text-center border-r">日付</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredByModeRanking.map((r, i) => (
                            <tr key={`${r.name}-${r.rank}-${i}`} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="py-2 px-4 text-center border-r border-gray-150">{r.name}</td>
                                <td className="py-2 px-4 text-center border-r border-gray-150">{RANKING_LABELS[r.mode]}</td>
                                <td className="py-2 px-4 text-center border-r border-gray-150">{r.rank}</td>
                                <td className="py-2 px-4 text-center border-r border-gray-150">{r.correctAnswers}</td>
                                <td className="py-2 px-4 text-center border-r border-gray-150">{r.timeSpent}</td>
                                <td className="py-2 px-4 text-center border-r">
                                    {new Date(r.date).toLocaleString("ja-JP", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit"
                                })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
