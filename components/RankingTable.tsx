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

    if (loading) return <p>取得中...</p>;

    const filteredRanking = selectedMode === "全体" ? rankings: rankings.filter(r => r.mode === selectedMode);

    return (
        <div>
            <label htmlFor="mode-filter">モードで絞り込み：</label>
            <select
                id="mode-filter"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                >
                    <option value="全体">全体</option>
                    {Object.entries(RANKING_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
            </select>
            <table>
                <thead>
                    <tr>
                        <th>モード</th>
                        <th>ランク</th>
                        <th>正解数</th>
                        <th>時間（秒）</th>
                        <th>日付</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRanking.map((r) => (
                        <tr key={`${r.mode}-${r.rank}`}>
                            <td>{RANKING_LABELS[r.mode]}</td>
                            <td>{r.rank}</td>
                            <td>{r.correctAnswers}</td>
                            <td>{r.timeSpent}</td>
                            <td>{new Date(r.date).toLocaleString("ja-JP", {
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
    )
}
