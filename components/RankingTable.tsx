//  @package      components/RankingTable.tsx
//  @description  ランキングテーブル共通機能。
//                ランキングテーブルを作成する。
//  @created      2025-05-18 by uma
//  @version      1.0.0
//  @lastModified 2025-05-18 by uma

// 変更履歴
// ver 1.0.0 - 新規作成


import React, { useEffect, useState } from "react";
import { RankingOmit } from "../models/Ranking";
import { useRouter } from "next/router";

export default function RankingTable({
    onRankingGetSuccess
}: {
    onRankingGetSuccess?: (rankingOmit: RankingOmit[]) => void;
}) {
    const [rankingOmit, setRankingOmit] = useState<RankingOmit[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getRanking = async() => {
            const res = await fetch("/api/rankings/getRankings");

            if(res.ok){
                const data = await res.json();
                setRankingOmit(data.RankingOmit);
                onRankingGetSuccess?.(data.RankingOmit);
                setLoading(false);
            } else {
                router.push("/menu?session=getRankingFaild");
            }
        };
        getRanking();
    },[router, onRankingGetSuccess]);

    if (loading) return <p>取得中...</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>ランク</th>
                    <th>正解数</th>
                    <th>時間（秒）</th>
                    <th>日付</th>
                </tr>
            </thead>
            <tbody>
                {rankingOmit.map((r) => (
                    <tr key={r.rank}>
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
    )
}
