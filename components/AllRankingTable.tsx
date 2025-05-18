//  @package      components/AllRankingTable.tsx
//  @description  全ランキングテーブル共通機能。
//                全てのユーザのランキングテーブルを作成する。
//  @created      2025-05-18 by uma
//  @version      1.0.0
//  @lastModified 2025-05-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useEffect, useState } from "react";
import { RankingWithName } from "../models/Ranking";
import { useRouter } from "next/router";
import { set } from "mongoose";

export default function AllRankingTable({
    onAllRankingGetSuccess
}: {
    onAllRankingGetSuccess?: (ranking: RankingWithName[]) => void;
}) {
    const [ranking, setRanking] = useState<RankingWithName[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedName, setSelectedName] = useState<string>("全体");
    const router = useRouter();

    useEffect(() => {
        const getAllRanking = async() => {
            const res = await fetch("/api/rankings/getAllRankings");

            if(res.ok){
                const data = await res.json();
                setRanking(data.Ranking);
                onAllRankingGetSuccess?.(data.Ranking);
                setLoading(false);
            } else {
                router.push("/menu?session=getRankingFaild");
            }
        };
        getAllRanking();
    },[]);

    if (loading) return <p>取得中...</p>;

    const uniqueNames = Array.from(new Set(ranking.map(r => r.name)));

    const filteredRanking = selectedName === "全体" ? ranking: ranking.filter(r => r.name === selectedName);

    return (
        <div>
            <label htmlFor="name-filter">名前で絞り込み：</label>
            <select
                id="name-filter"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                >
                    <option value="全体">全体</option>
                    {uniqueNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            <table>
                <thead>
                    <tr>
                        <th>名前</th>
                        <th>ランク</th>
                        <th>正解数</th>
                        <th>時間（秒）</th>
                        <th>日付</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRanking.map((r, i) => (
                        <tr key={`${r.name}-${r.rank}-${i}`}>
                            <td>{r.name}</td>
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
